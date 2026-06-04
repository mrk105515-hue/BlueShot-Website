// ==========================================================================
// DXZ SHOP SYSTEM (AMAZON-STYLE CART & CHECKOUT)
// Persistent state with localStorage
// ==========================================================================

// Global Cart State
let cart = [];
let activeSize = "M"; // Default selected size for the featured shirt
let currentFeaturedId = "redago-tshirt"; // Active selected featured product

// Products Catalog (Matches UI markup)
const PRODUCTS_CATALOG = {
  "redago-tshirt": {
    id: "redago-tshirt",
    name: "REDAGO T-Shirt",
    price: 899,
    image: "assets/merch-redago.png",
    badge: "Season 3 Limited Drop",
    badgeClass: "redago-badge",
    images: [
      "assets/merch-redago.png",
      "assets/redago-2.png",
      "assets/redago-3.png"
    ],
    description: "Unleash the ultimate cosmic force. The official REDAGO custom graphic t-shirt features BSG's powerful Season 3 aura. Made with heavyweight 100% combed cotton for maximum durability and comfort."
  },
  "cursegod-tshirt": {
    id: "cursegod-tshirt",
    name: "CURSE GOD T-Shirt",
    price: 799,
    image: "assets/merch-cursegod.png",
    badge: "Dark Magic Drop",
    badgeClass: "cursegod-badge",
    images: [
      "assets/merch-cursegod.png",
      "assets/cursegod-2.png",
      "assets/cursegod-3.png",
      "assets/cursegod-4.png",
      "assets/cursegod-5.png",
      "assets/cursegod-6.png"
    ],
    description: "Embrace the dark power of Curse God Zalta. The official CURSE GOD custom graphic t-shirt features Zalta's dark bull beast aura. Made with heavyweight 100% combed cotton for premium comfort and long-lasting print quality."
  },
  "berry-tshirt": {
    id: "berry-tshirt",
    name: "BERRY T-Shirt",
    price: 699,
    image: "assets/merch-berry.png",
    badge: "Golden Heavyweight Drop",
    badgeClass: "berry-badge",
    images: [
      "assets/merch-berry.png",
      "assets/berry-2.png",
      "assets/berry-3.png",
      "assets/berry-4.png",
      "assets/berry-5.png"
    ],
    description: "Harness the golden heavyweight force. The official BERRY custom graphic t-shirt features the legendary Golden Giant heavyweight energy. Made with premium 100% combed cotton, built to withstand any battle."
  }
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  try {
    loadCartFromStorage();
    initCartDrawer();
    initCollectionGrid();
    initCheckoutWizard();
    initBannerCarousel();
    updateCartUI();
  } catch (e) {
    console.error("Error initializing shop script:", e);
  }
});

// ==========================================================================
// STATE MANAGEMENT & LOCALSTORAGE
// ==========================================================================
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("dxz_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      console.error("Failed to parse saved cart:", e);
      cart = [];
    }
  }
}

function saveCartToStorage() {
  localStorage.setItem("dxz_cart", JSON.stringify(cart));
}

// ==========================================================================
// UI UPDATE ACTIONS
// ==========================================================================
function updateCartUI() {
  const navBadge = document.getElementById("cart-count-badge");
  const drawerCount = document.getElementById("cart-drawer-count");
  const itemsContainer = document.getElementById("cart-items-list");
  const subtotalDisplay = document.getElementById("cart-subtotal");
  const checkoutFooter = document.getElementById("cart-drawer-footer");

  // Calculate stats
  let totalItems = 0;
  let subtotal = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    subtotal += item.price * item.quantity;
  });

  // Update Badges
  if (navBadge) {
    navBadge.textContent = totalItems;
    if (totalItems > 0) {
      navBadge.classList.add("has-items");
    } else {
      navBadge.classList.remove("has-items");
    }
  }

  if (drawerCount) {
    drawerCount.textContent = totalItems + (totalItems === 1 ? " item" : " items");
  }

  // Update Subtotal
  if (subtotalDisplay) {
    subtotalDisplay.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  }

  // Render Items List
  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-cart-shopping"></i>
        <p>Your pre-order list is empty.</p>
        <button class="btn btn-secondary btn-close-drawer" style="padding: 0.6rem 1.5rem; font-size: 0.8rem;">Start Exploring</button>
      </div>
    `;
    if (checkoutFooter) {
      checkoutFooter.style.display = "none";
    }

    // Attach close behavior to button inside empty state
    const closeBtnEmpty = itemsContainer.querySelector(".btn-close-drawer");
    if (closeBtnEmpty) {
      closeBtnEmpty.addEventListener("click", (e) => {
        e.preventDefault();
        toggleCartDrawer(false);
      });
    }
    return;
  }

  // Show checkout footer if there are items
  if (checkoutFooter) {
    checkoutFooter.style.display = "block";
  }

  itemsContainer.innerHTML = "";
  cart.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    
    // Check for custom classes (for colored mock hoodie/case images)
    const customImgClass = item.customClass ? `class="cart-item-img ${item.customClass}"` : `class="cart-item-img"`;

    itemEl.innerHTML = `
      <div class="cart-item-img-wrap">
        <img src="${item.image}" alt="${item.name}" ${customImgClass}>
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-meta">Size: ${item.size}</div>
        <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${item.id}', '${item.size}', -1)">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', '${item.size}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeCartItem('${item.id}', '${item.size}')" title="Remove Item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    itemsContainer.appendChild(itemEl);
  });
}

// ==========================================================================
// CART OPERATIONS (ACCESSIBLE IN GLOBAL SCOPE FOR ONCLICK HANDLERS)
// ==========================================================================
window.addToCart = function(id, size = "N/A") {
  const product = PRODUCTS_CATALOG[id];
  if (!product) return;

  // Search if product already in cart with same size
  const existingItemIndex = cart.findIndex(item => item.id === id && item.size === size);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      id: id,
      name: product.name,
      price: product.price,
      image: product.image,
      customClass: product.customClass || "",
      size: size,
      quantity: 1
    });
  }

  saveCartToStorage();
  updateCartUI();
  showNotification(`Added ${product.name} (${size}) to pre-order list!`);
  
  // Auto slide open the cart drawer so user sees it added
  setTimeout(() => {
    toggleCartDrawer(true);
  }, 400);
};

window.changeQty = function(id, size, change) {
  const itemIndex = cart.findIndex(item => item.id === id && item.size === size);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += change;

  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCartToStorage();
  updateCartUI();
};

window.removeCartItem = function(id, size) {
  const itemIndex = cart.findIndex(item => item.id === id && item.size === size);
  if (itemIndex === -1) return;

  const itemName = cart[itemIndex].name;
  cart.splice(itemIndex, 1);

  saveCartToStorage();
  updateCartUI();
  showNotification(`Removed ${itemName} from pre-order list.`, true);
};

// ==========================================================================
// DRAWER TOGGLE LOGIC
// ==========================================================================
function toggleCartDrawer(open) {
  const drawer = document.getElementById("cart-drawer");
  if (!drawer) return;

  if (open) {
    drawer.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    drawer.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function initCartDrawer() {
  const toggleBtn = document.getElementById("cart-toggle-btn");
  const closeBtn = document.getElementById("cart-close-btn");
  const backdrop = document.getElementById("cart-drawer-backdrop");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => toggleCartDrawer(true));
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => toggleCartDrawer(false));
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => toggleCartDrawer(false));
  }

  // Escape key closes drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleCartDrawer(false);
    }
  });
}

// ==========================================================================
// INTERACTIVE DOM COMPONENT HOOKS
// ==========================================================================

// 1. Thumbnail Image Switcher (Featured Product)
window.switchMainImage = function(thumbEl) {
  const mainImg = document.getElementById("main-product-img");
  const thumbnails = document.querySelectorAll(".thumb-img");
  
  if (!mainImg || !thumbEl) return;

  // Toggle active border class
  thumbnails.forEach(t => t.classList.remove("active"));
  thumbEl.classList.add("active");

  // Smooth fade image swap
  mainImg.style.opacity = "0.2";
  setTimeout(() => {
    mainImg.src = thumbEl.src;
    mainImg.style.opacity = "1";
  }, 150);
};

// 4. Grid product selection hook - Redirects to dynamic product.html details page
function initCollectionGrid() {
  const gridCards = document.querySelectorAll(".products-grid .product-card");
  
  gridCards.forEach(card => {
    const productId = card.getAttribute("data-id");
    
    // Clicking anywhere on the card redirects to product detail page
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      window.location.href = "product.html?id=" + productId;
    });

    const addBtn = card.querySelector(".card-btn-add");
    const quickAdd = card.querySelector(".quick-add-btn");

    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "product.html?id=" + productId;
      });
    }
    if (quickAdd) {
      quickAdd.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "product.html?id=" + productId;
      });
    }
  });
}

// ==========================================================================
// CHECKOUT WIZARD PROCESS (SHIPPING -> PAYMENT -> SUCCESS)
// ==========================================================================
function initCheckoutWizard() {
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutModal = document.getElementById("checkout-modal");
  const closeBtn = document.getElementById("checkout-modal-close");
  const backdrop = document.getElementById("checkout-modal-backdrop");

  const shippingForm = document.getElementById("shipping-form");

  const successBtn = document.getElementById("success-continue-btn");
  const paymentBack = document.getElementById("payment-back-btn");

  if (!checkoutModal) return;

  // Step state tracker
  let currentStep = 1;

  const showStep = (stepNum) => {
    currentStep = stepNum;
    
    // Toggle active panel
    document.querySelectorAll(".checkout-step-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    const targetPanel = document.getElementById(`checkout-step-${stepNum}`);
    if (targetPanel) targetPanel.classList.add("active");

    // Update left sidebar progress indicator layout
    for (let i = 1; i <= 3; i++) {
      const stepIndicator = document.getElementById(`step-indicator-${i}`);
      if (!stepIndicator) continue;
      
      stepIndicator.className = "step";
      if (i === stepNum) {
        stepIndicator.classList.add("active");
      } else if (i < stepNum) {
        stepIndicator.classList.add("completed");
      }
    }
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      showNotification("Your pre-order list is empty!", true);
      return;
    }

    // Populate pricing
    let subtotal = 0;
    cart.forEach(item => subtotal += item.price * item.quantity);
    const summaryTotal = document.getElementById("checkout-summary-total");
    if (summaryTotal) summaryTotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

    // Close the cart drawer first
    toggleCartDrawer(false);

    // Show checkout modal
    checkoutModal.classList.add("active");
    document.body.style.overflow = "hidden";
    showStep(1); // Start on shipping
  };

  const closeCheckout = () => {
    checkoutModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);
  if (closeBtn) closeBtn.addEventListener("click", closeCheckout);
  if (backdrop) backdrop.addEventListener("click", closeCheckout);

  // Form submit handles: Pre-order Waitlist directly skips payment and triggers success screen
  if (shippingForm) {
    shippingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameVal = document.getElementById("ship-name").value;
      const emailVal = document.getElementById("ship-email").value;
      document.getElementById("success-name-text").textContent = nameVal;
      document.getElementById("success-email-text").textContent = emailVal;

      // Populate waitlist price & ref ID details
      let subtotal = 0;
      cart.forEach(item => subtotal += item.price * item.quantity);
      document.getElementById("success-total-text").textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      
      const randomRef = "PRE-" + Math.floor(100000 + Math.random() * 900000);
      document.getElementById("success-order-id").textContent = randomRef;

      // Reset cart state
      shippingForm.reset();
      cart = [];
      saveCartToStorage();
      updateCartUI();

      showStep(3); // Go straight to waitlist confirmation screen
    });
  }

  if (paymentBack) {
    paymentBack.addEventListener("click", (e) => {
      e.preventDefault();
      showStep(1); // Back to shipping
    });
  }

  // Razorpay is the sole payment method — prices are natively in INR
  const razorpayBtn = document.querySelector(".razorpay-gateway");
  if (razorpayBtn) {
    razorpayBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Validation: Ensure shipping info was filled out in Step 1
      const shipName = document.getElementById("ship-name").value.trim();
      const shipEmail = document.getElementById("ship-email").value.trim();
      const shipAddress = document.getElementById("ship-address").value.trim();
      
      if (!shipName || !shipEmail || !shipAddress) {
        showNotification("Please complete your shipping address first!", true);
        showStep(1);
        return;
      }

      // Calculate dynamically for whatever is in the cart (prices are in INR)
      let subtotal = 0;
      let itemsList = [];
      
      cart.forEach(item => {
        subtotal += item.price * item.quantity;
        itemsList.push(`${item.quantity}x ${item.name} (${item.size})`);
      });

      const amountPaise = Math.round(subtotal * 100);

      // Get address details
      const city = document.getElementById("ship-city").value;
      const zip = document.getElementById("ship-zip").value;
      const country = document.getElementById("ship-country").value;

      // Configure Razorpay checkout options
      const options = {
        "key": "rzp_test_St8tveZSpmHUkX", // REPLACE WITH YOUR LIVE KEY ID FROM RAZORPAY DASHBOARD
        "amount": amountPaise,
        "currency": "INR",
        "name": "The BlueShot Merch Store",
        "description": itemsList.join(", "),
        "image": "https://blueshotwiki.netlify.app/assets/char-bsg.png",
        "handler": function (response) {
          // Payment successful!
          showNotification(`Payment Successful! ID: ${response.razorpay_payment_id}`);

          // Populate success screen receipt
          document.getElementById("success-total-text").textContent = `₹${subtotal.toLocaleString('en-IN')}`;
          document.getElementById("success-order-id").textContent = response.razorpay_payment_id;
          document.getElementById("success-name-text").textContent = shipName;
          document.getElementById("success-email-text").textContent = shipEmail;
          
          // Clear cart state completely
          shippingForm.reset();
          cart = [];
          saveCartToStorage();
          updateCartUI();

          // Advance to Step 3 (Receipt)
          showStep(3);
        },
        "prefill": {
          "name": shipName,
          "email": shipEmail
        },
        "notes": {
          "items_purchased": itemsList.join("; "),
          "shipping_address": `${shipAddress}, ${city}, Zip: ${zip}, Country: ${country}`
        },
        "theme": {
          "color": "#FF124F" // DXZ Crimson neon brand color
        }
      };

      if (typeof Razorpay !== "undefined") {
        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        showNotification("Razorpay payment window failed to load. Please try again.", true);
      }
    });
  }

  if (successBtn) {
    successBtn.addEventListener("click", () => {
      closeCheckout();
    });
  }
}

// ==========================================================================
// FLOATING FLOATING ALERT SYSTEM (TOAST NOTIFICATIONS)
// ==========================================================================
function showNotification(message, isError = false) {
  const alertsContainer = document.getElementById("alert-container");
  if (!alertsContainer) return;

  const alertCard = document.createElement("div");
  alertCard.className = `alert-card ${isError ? 'error' : ''}`;
  alertCard.innerHTML = `
    <i class="${isError ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check'}"></i>
    <span>${message}</span>
  `;
  
  alertsContainer.appendChild(alertCard);
  
  // Transition In
  setTimeout(() => {
    alertCard.classList.add("active");
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    alertCard.classList.remove("active");
    setTimeout(() => {
      alertCard.remove();
    }, 500);
  }, 3500);
}

// ==========================================================================
// BANNER INTERACTIVE CAROUSEL SYSTEM
// ==========================================================================
function initBannerCarousel() {
  const track = document.getElementById("carousel-track");
  const dots = document.querySelectorAll(".indicator-dot");
  const video = document.getElementById("banner-video");

  if (!track || dots.length === 0) return;

  let imageTimer = null;
  let isManualOverride = false;

  // Update dots indicator active state based on current scroll position
  function updateActiveDot() {
    const width = track.clientWidth;
    const activeIndex = Math.round(track.scrollLeft / width);
    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  track.addEventListener("scroll", updateActiveDot);

  // Navigate to slide on indicator click
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      isManualOverride = true; // User interacted manually, cancel auto flow
      clearTimeout(imageTimer);
      
      const slideIndex = parseInt(dot.getAttribute("data-slide"));
      const width = track.clientWidth;
      track.scrollTo({
        left: slideIndex * width,
        behavior: "smooth"
      });

      // Handle video play/pause status based on manual slide selection
      if (video) {
        if (slideIndex === 0) {
          video.currentTime = 0;
          video.play().catch(err => console.log("Video auto play blocked:", err));
        } else {
          video.pause();
        }
      }
    });
  });

  // Handle user manual swiping/scrolling via mouse/touch
  const userScrollTrigger = () => {
    isManualOverride = true;
    clearTimeout(imageTimer);
  };
  track.addEventListener("touchstart", userScrollTrigger, { passive: true });
  track.addEventListener("mousedown", userScrollTrigger);

  // Flow logic: Wait for video to end, then slide to concept art (Slide 2)
  if (video) {
    video.addEventListener("ended", () => {
      if (isManualOverride) return;
      
      // Scroll to Slide 2 (Anime concept art)
      const width = track.clientWidth;
      track.scrollTo({
        left: width,
        behavior: "smooth"
      });

      // Start the image slide duration timer (8 seconds)
      clearTimeout(imageTimer);
      imageTimer = setTimeout(() => {
        if (isManualOverride) return;

        // Scroll back to Slide 1 (Video)
        track.scrollTo({
          left: 0,
          behavior: "smooth"
        });

        // Replay video
        video.currentTime = 0;
        video.play().catch(err => console.log("Video play blocked:", err));
      }, 8000); // Display image slide for 8 seconds
    });
  }
}
