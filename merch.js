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
    price: 999,
    mrp: 1499,
    image: "assets/redago-new-1.png",
    badge: "Season 3 Limited Drop",
    badgeClass: "redago-badge",
    images: [
      "assets/redago-new-1.png",
      "assets/redago-new-2.png",
      "assets/redago-new-3.png",
      "assets/redago-new-4.png"
    ],
    description: "Unleash the ultimate cosmic force. The official REDAGO custom graphic t-shirt features BSG's powerful Season 3 aura. Made with heavyweight 100% combed cotton for maximum durability and comfort."
  },
  "cursegod-tshirt": {
    id: "cursegod-tshirt",
    name: "CURSE GOD T-Shirt",
    price: 799,
    mrp: 1299,
    image: "assets/cursegod-angle-1.png",
    badge: "Dark Magic Pink & Metal Edition",
    badgeClass: "cursegod-badge",
    images: [
      "assets/cursegod-angle-1.png",
      "assets/cursegod-angle-2.png",
      "assets/cursegod-angle-3.png",
      "assets/cursegod-angle-4.png",
      "assets/cursegod-angle-5.png"
    ],
    description: "Embrace the dark power of Curse God Zalta. The official CURSE GOD custom graphic t-shirt features Zalta's dark bull beast aura and signature CG monogram and pink metal metal lettering. Made with heavyweight 100% combed cotton for premium comfort and long-lasting print quality."
  },
  "berry-tshirt": {
    id: "berry-tshirt",
    name: "BERRY T-Shirt",
    price: 599,
    mrp: 999,
    image: "assets/berry-angle-1.png",
    badge: "Golden Heavyweight Drop",
    badgeClass: "berry-badge",
    images: [
      "assets/berry-angle-1.png",
      "assets/berry-angle-2.png",
      "assets/berry-angle-3.png",
      "assets/berry-angle-4.png",
      "assets/berry-angle-5.png"
    ],
    description: "Harness the golden heavyweight force. The official BERRY custom graphic t-shirt features the legendary Golden Giant heavyweight energy. Made with premium 100% combed cotton, built to withstand any battle."
  },
  "berry-lite-tshirt": {
    id: "berry-lite-tshirt",
    name: "BERRY Lite T-Shirt",
    price: 200,
    mrp: 399,
    image: "assets/berry-angle-2.png",
    badge: "D Series Basic Drop",
    badgeClass: "berry-badge",
    images: [
      "assets/berry-angle-2.png",
      "assets/berry-angle-3.png",
      "assets/berry-angle-4.png",
      "assets/berry-angle-5.png"
    ],
    description: "Keep it simple and stylish. The BERRY Lite T-Shirt offers the iconic design in a lightweight, everyday fabric. Perfect for casual wear at an unbeatable value."
  },
  "suma-berry-bundle": {
    id: "suma-berry-bundle",
    name: "SUMA & BERRY Duo Bundle",
    price: 1499,
    mrp: 2499,
    image: "assets/bundle-duo-new.png",
    badge: "Faction Power Duo Pack",
    badgeClass: "bundle-badge",
    images: [
      "assets/bundle-duo-new.png"
    ],
    description: "Double the faction power. Get both the custom SUMA and BERRY T-Shirts in one exclusive faction bundle pack. Show your support for the East Emperor's line and command the battlefield."
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
    initRareMarks();
    initProductPoll();
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
  const productCards = document.querySelectorAll(".product-card[data-id]");
  const shopButtons = document.querySelectorAll(".shop-now-btn[data-id]");

  const setupRedirect = (el) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = el.getAttribute("data-id");
      window.location.href = "product.html?id=" + productId;
    });
  };

  productCards.forEach(setupRedirect);
  shopButtons.forEach(setupRedirect);
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
        "key": "rzp_live_T113tFIoQSy60O", // REPLACE WITH YOUR LIVE KEY ID FROM RAZORPAY DASHBOARD
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
  const ytBg = document.getElementById("shop-yt-bg");
  const poster = document.getElementById("shop-bg-poster");

  if (!track || dots.length === 0) return;

  let imageTimer = null;
  let fallbackTimer = null;
  let isManualOverride = false;
  let ytPlayer = null;

  // Helper: Programmatic scroll that avoids scroll snapping conflicts
  function scrollToSlide(slideIndex) {
    const width = track.clientWidth;
    track.style.scrollSnapType = "none";
    track.scrollTo({
      left: slideIndex * width,
      behavior: "smooth"
    });
    // Restore snap behaviour after smooth animation finishes (600ms)
    setTimeout(() => {
      track.style.scrollSnapType = "x mandatory";
    }, 600);
  }

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
      clearTimeout(fallbackTimer);
      
      const slideIndex = parseInt(dot.getAttribute("data-slide"));
      scrollToSlide(slideIndex);

      // Handle YouTube video play/pause based on slide selection
      if (ytPlayer && typeof ytPlayer.playVideo === "function") {
        if (slideIndex === 0) {
          ytPlayer.seekTo(0);
          ytPlayer.playVideo();
        } else {
          ytPlayer.pauseVideo();
        }
      }
    });
  });

  // Handle user manual swiping/scrolling via mouse/touch/wheel
  const userScrollTrigger = () => {
    isManualOverride = true;
    clearTimeout(imageTimer);
    clearTimeout(fallbackTimer);
  };
  track.addEventListener("touchstart", userScrollTrigger, { passive: true });
  track.addEventListener("mousedown", userScrollTrigger);
  track.addEventListener("wheel", userScrollTrigger, { passive: true });

  function startImageTimer() {
    clearTimeout(imageTimer);
    imageTimer = setTimeout(() => {
      if (isManualOverride) return;

      // Scroll back to Slide 1 (Video)
      scrollToSlide(0);

      // Replay YouTube video
      if (ytPlayer && typeof ytPlayer.playVideo === "function") {
        ytPlayer.seekTo(0);
        ytPlayer.playVideo();
      }
    }, 8000); // Display image slide for 8 seconds
  }

  // Initialize YouTube Player Banner
  function initYTPlayer() {
    const isHTTP = location.protocol === "http:" || location.protocol === "https:";
    if (!isHTTP) {
      // Running locally from disk — keep fallback image and set fallback advance
      if (poster) poster.style.opacity = "0.28";
      startAutoplayFallback(12000); // Wait 12 seconds locally then slide
      return;
    }

    // Create container element for iframe embedding
    const playerContainer = document.createElement("div");
    playerContainer.id = "shop-yt-player";
    playerContainer.className = "shop-yt-iframe";
    ytBg.insertBefore(playerContainer, ytBg.firstChild);

    const loadPlayer = () => {
      ytPlayer = new YT.Player("shop-yt-player", {
        videoId: "phKgmmnrFNk",
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: "phKgmmnrFNk",
          controls: 0,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          modestbranding: 1,
          enablejsapi: 1
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            event.target.playVideo();
            clearTimeout(fallbackTimer);
            if (poster) {
              poster.style.transition = "opacity 2s ease";
              poster.style.opacity = "0";
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState.ENDED is 0
            if (event.data === 0) {
              if (!isManualOverride) {
                scrollToSlide(1);
                startImageTimer();
              }
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevOnReady) prevOnReady();
        loadPlayer();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }
  }

  function startAutoplayFallback(ms) {
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(() => {
      if (!isManualOverride) {
        scrollToSlide(1);
        startImageTimer();
      }
    }, ms);
  }

  // Setup fallback advancement timer (e.g. advance to slide 2 if API fails or blocks)
  startAutoplayFallback(10000);

  // Initialize YT Player
  initYTPlayer();
}

// ==========================================================================
// RARE MARKS COLLECTIBLE DIALOG LOGIC
// ==========================================================================
function initRareMarks() {
  const trigger = document.getElementById("mark-dominance-trigger");
  const modal = document.getElementById("mark-modal");
  const closeBtn = document.getElementById("mark-modal-close");
  const backdrop = document.getElementById("mark-modal-backdrop");
  const couponCode = document.getElementById("reward-coupon-trigger");

  if (!modal) return;

  const toggleModal = (open) => {
    if (open) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (trigger) {
    trigger.addEventListener("click", () => toggleModal(true));
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => toggleModal(false));
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => toggleModal(false));
  }

  // Escape closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      toggleModal(false);
    }
  });

  // Copy coupon code on click (with local fallback)
  if (couponCode) {
    couponCode.addEventListener("click", () => {
      const textToCopy = couponCode.textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showNotification("Coupon code copied to clipboard!");
        }).catch(err => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling page
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification("Coupon code copied to clipboard!");
    } catch (err) {
      showNotification("Could not copy code. Please copy manually.", true);
    }
    document.body.removeChild(textArea);
  }
}

// ==========================================================================
// PRODUCT PREFERENCE POLL DIALOG LOGIC
// ==========================================================================
function initProductPoll() {
  const votingGrid = document.getElementById("poll-voting-grid");
  const actionsBar = document.getElementById("poll-actions-bar");
  const submitBtn = document.getElementById("poll-submit-btn");
  const resultsView = document.getElementById("poll-results-view");
  const resetContainer = document.getElementById("poll-reset-container");
  const resetBtn = document.getElementById("poll-reset-btn");
  const loginBlocker = document.getElementById("poll-login-blocker");

  if (!votingGrid || !submitBtn || !resultsView) return;

  // Initial Poll Base Data (stored locally in localStorage if modified, otherwise starts clean with 0)
  let pollData = {};
  // Clean up old cached mock data
  if (localStorage.getItem("dxz_poll_data")) {
    localStorage.removeItem("dxz_poll_data");
  }
  const savedPollData = localStorage.getItem("dxz_poll_data_v2");
  if (savedPollData) {
    try {
      pollData = JSON.parse(savedPollData);
    } catch (e) {
      pollData = getBasePollData();
    }
  } else {
    pollData = getBasePollData();
  }

  function getBasePollData() {
    return {
      "keychains": 0,
      "mugs": 0,
      "hoodies": 0,
      "lowers": 0,
      "boxers": 0,
      "gym_outfit": 0,
      "female_clothing": 0,
      "dxz_figures": 0
    };
  }

  const POLL_LABELS = {
    "keychains": { label: "Keychains", icon: "fa-solid fa-key" },
    "mugs": { label: "Mugs", icon: "fa-solid fa-mug-hot" },
    "hoodies": { label: "Hoodies", icon: "fa-solid fa-shirt" },
    "lowers": { label: "Lowers", icon: "fa-solid fa-socks" },
    "boxers": { label: "Boxers", icon: "fa-solid fa-square" },
    "gym_outfit": { label: "Gym Outfit", icon: "fa-solid fa-dumbbell" },
    "female_clothing": { label: "Female Clothing", icon: "fa-solid fa-person-dress" },
    "dxz_figures": { label: "3D Figures of DXZ", icon: "fa-solid fa-cube" }
  };

  let selectedOption = null;
  let currentUser = null;

  // Get User Specific Vote Key
  function getVoteKey(user) {
    if (!user) return null;
    const identifier = user.uid || user.email || user.username || "guest";
    return `dxz_poll_vote_v2_${identifier}`;
  }

  // Handle Card Selections
  const cards = votingGrid.querySelectorAll(".poll-option-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (!currentUser) return; // Prevent selection if not logged in
      cards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedOption = card.getAttribute("data-option");
      
      submitBtn.disabled = false;
      submitBtn.classList.add("ready");
    });
  });

  // Handle Vote Submission
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!selectedOption || !currentUser) return;

    const voteKey = getVoteKey(currentUser);
    if (!voteKey) return;

    // Save vote state for this user
    localStorage.setItem(voteKey, selectedOption);

    // Increment vote count and save
    pollData[selectedOption] += 1;
    localStorage.setItem("dxz_poll_data_v2", JSON.stringify(pollData));

    showNotification("Thank you for your vote!");
    renderResults(selectedOption);
  });

  // Handle Changing/Resetting Vote
  if (resetBtn) {
    resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!currentUser) return;

      const voteKey = getVoteKey(currentUser);
      if (!voteKey) return;

      const previousVote = localStorage.getItem(voteKey);
      if (previousVote && pollData[previousVote] > 0) {
        pollData[previousVote] -= 1;
        localStorage.setItem("dxz_poll_data_v2", JSON.stringify(pollData));
      }
      localStorage.removeItem(voteKey);

      // Reset selection state
      selectedOption = null;
      cards.forEach(c => c.classList.remove("selected"));
      submitBtn.disabled = true;
      submitBtn.classList.remove("ready");

      // Transition views back
      resultsView.classList.remove("active");
      resetContainer.style.display = "none";
      
      votingGrid.style.display = "grid";
      votingGrid.style.opacity = "0";
      actionsBar.style.display = "flex";
      actionsBar.style.opacity = "0";
      setTimeout(() => {
        votingGrid.style.opacity = "1";
        actionsBar.style.opacity = "1";
      }, 50);
    });
  }

  // Render Poll Results
  function renderResults(votedOption) {
    // Hide Voting Options
    votingGrid.style.display = "none";
    actionsBar.style.display = "none";
    if (loginBlocker) loginBlocker.style.display = "none";

    // Calculate total votes
    let totalVotes = 0;
    Object.keys(pollData).forEach(key => {
      totalVotes += pollData[key];
    });

    // Generate results html
    resultsView.innerHTML = "";
    
    // Sort options by vote percentage/count descending
    const sortedOptions = Object.keys(pollData).sort((a, b) => pollData[b] - pollData[a]);

    sortedOptions.forEach(key => {
      const votes = pollData[key];
      const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      const isVoted = key === votedOption;
      const optionInfo = POLL_LABELS[key];

      const row = document.createElement("div");
      row.className = `poll-result-row ${isVoted ? 'voted-row' : ''}`;
      row.innerHTML = `
        <div class="poll-result-header">
          <span class="poll-result-label">
            <i class="${optionInfo.icon}"></i> ${optionInfo.label}
          </span>
          <span class="poll-result-percentage">${percent}% <span style="font-size: 0.75rem; font-weight: 500; color: var(--text-muted);">(${votes.toLocaleString()} votes)</span></span>
        </div>
        <div class="poll-result-bar-track">
          <div class="poll-result-bar-fill" data-percent="${percent}"></div>
        </div>
      `;
      resultsView.appendChild(row);
    });

    // Show Results View and Reset Option
    resultsView.classList.add("active");
    if (resetContainer) {
      resetContainer.style.display = "flex";
    }

    // Animate the bars
    setTimeout(() => {
      const bars = resultsView.querySelectorAll(".poll-result-bar-fill");
      bars.forEach(bar => {
        const percent = bar.getAttribute("data-percent");
        bar.style.width = percent + "%";
      });
    }, 100);
  }

  // Update Poll interface based on user authentication
  function updatePollAuthUI(user) {
    currentUser = user;

    if (user) {
      if (loginBlocker) loginBlocker.style.display = "none";
      cards.forEach(c => c.style.pointerEvents = "auto");

      // Check if this specific user has voted
      const voteKey = getVoteKey(user);
      const userVote = localStorage.getItem(voteKey);

      if (userVote) {
        renderResults(userVote);
      } else {
        // Restore voting interface if they haven't voted
        resultsView.classList.remove("active");
        if (resetContainer) resetContainer.style.display = "none";
        votingGrid.style.display = "grid";
        actionsBar.style.display = "flex";
      }
    } else {
      // User is not logged in - show blocker overlay
      if (loginBlocker) loginBlocker.style.display = "flex";
      cards.forEach(c => c.style.pointerEvents = "none");
      submitBtn.disabled = true;
      submitBtn.classList.remove("ready");
      
      // Hide results when logged out
      resultsView.classList.remove("active");
      if (resetContainer) resetContainer.style.display = "none";
      votingGrid.style.display = "grid";
      actionsBar.style.display = "flex";
    }
  }

  // 1. Listen to Live Firebase Auth changes
  if (typeof firebase !== "undefined") {
    try {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
      }
      firebase.auth().onAuthStateChanged((user) => {
        updatePollAuthUI(user);
      });
    } catch (e) {
      console.warn("Firebase Auth listener initialization failed:", e);
    }
  }

  // 2. Listen to Local Demo Auth state changes
  window.addEventListener("dxz_user_changed", () => {
    const savedUser = localStorage.getItem("dxz_demo_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    updatePollAuthUI(user);
  });

  // Initial check on load
  const savedUser = localStorage.getItem("dxz_demo_user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  updatePollAuthUI(user);
}
