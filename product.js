// ==========================================================================
// DXZ PRODUCT DETAIL SYSTEM (DYNAMIC CONTENT & CART DRAWER)
// Persistent state with localStorage
// ==========================================================================

// Global Cart State
let cart = [];
let activeSize = "M"; // Default selected size
let currentProductId = "redago-tshirt";

// Products Catalog (Consistent with merch.js)
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
    initProductDetail();
    initCartDrawer();
    initCheckoutWizard();
    updateCartUI();
  } catch (e) {
    console.error("Error initializing product page:", e);
  }
});

// ==========================================================================
// DYNAMIC PRODUCT LOADING
// ==========================================================================
function initProductDetail() {
  const container = document.getElementById("product-detail-container");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  
  if (!id || !PRODUCTS_CATALOG[id]) {
    // Render error state if product ID is invalid or missing
    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 0; background: var(--bg-card); border: var(--border-glass); border-radius: 16px;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem; color: var(--color-redago); margin-bottom: 1.5rem;"></i>
        <h2 style="font-size: 2rem; font-family: var(--font-display); margin-bottom: 1rem;">Product Not Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">The product you are looking for does not exist or has been removed.</p>
        <a href="merch.html" class="btn btn-danger" style="padding: 0.8rem 2rem;">Back to Shop Catalog</a>
      </div>
    `;
    return;
  }

  const product = PRODUCTS_CATALOG[id];
  currentProductId = id;
  activeSize = "M"; // Default to Medium

  // Update Page Meta
  document.title = `${product.name} | Danger X Zone Merch`;

  // Render product details
  container.innerHTML = `
    <div class="featured-product-grid product-detail-grid">
      <!-- Gallery Column -->
      <div class="product-gallery">
        <div class="gallery-main">
          <div class="gallery-glow" id="product-glow"></div>
          <img id="main-product-img" src="${product.image}" alt="${product.name}" class="gallery-main-img">
        </div>
        <div class="gallery-thumbnails">
          ${product.images.map((img, idx) => `
            <img class="thumb-img ${idx === 0 ? 'active' : ''}" src="${img}" alt="${product.name} View ${idx + 1}" onclick="switchMainImage(this)">
          `).join("")}
        </div>
      </div>
      
      <!-- Info Column -->
      <div class="product-details">
        <span class="product-badge ${product.badgeClass}">
          <i class="fa-solid fa-fire"></i> ${product.badge}
        </span>
        <h1 class="product-title">${product.name}</h1>
        
        <div class="product-pricing">
          <span class="price-value">₹${product.price}</span>
          ${product.mrp ? `<span class="price-mrp">₹${product.mrp}</span>` : ''}
          <span class="price-tag">Exclusive Pre-order drop</span>
        </div>
        
        <p class="product-description">
          ${product.description}
        </p>
        
        <div class="product-options">
          <div class="option-group">
            <label class="option-label">Select Size</label>
            <div class="size-chips" id="product-size-selector">
              <button class="size-chip" data-size="S">S</button>
              <button class="size-chip active" data-size="M">M</button>
              <button class="size-chip" data-size="L">L</button>
              <button class="size-chip" data-size="XL">XL</button>
              <button class="size-chip" data-size="XXL">XXL</button>
            </div>
          </div>
        </div>
        
        <div class="product-actions">
          <button id="add-to-preorder-btn" class="btn btn-danger btn-add-cart" style="width: 100%; max-width: 320px;">
            <i class="fa-solid fa-cart-plus"></i> Add to Pre-order
          </button>
        </div>
        
        <div class="product-benefits">
          <div class="benefit-item"><i class="fa-solid fa-truck-fast"></i> Global Shipping</div>
          <div class="benefit-item"><i class="fa-solid fa-shield-halved"></i> Secure Checkout</div>
          <div class="benefit-item"><i class="fa-solid fa-shirt"></i> Heavyweight 100% Combed Cotton</div>
        </div>
      </div>
    </div>
  `;

  // Apply Dynamic Theme Glow color
  const glow = document.getElementById("product-glow");
  if (glow) {
    if (product.badgeClass === "redago-badge") {
      glow.style.background = "radial-gradient(circle, rgba(255, 18, 79, 0.18) 0%, rgba(0, 0, 0, 0) 70%)";
    } else if (product.badgeClass === "cursegod-badge") {
      glow.style.background = "radial-gradient(circle, rgba(160, 32, 240, 0.18) 0%, rgba(0, 0, 0, 0) 70%)";
    } else if (product.badgeClass === "berry-badge") {
      glow.style.background = "radial-gradient(circle, rgba(255, 215, 0, 0.18) 0%, rgba(0, 0, 0, 0) 70%)";
    } else if (product.badgeClass === "bundle-badge") {
      glow.style.background = "radial-gradient(circle, rgba(243, 156, 18, 0.18) 0%, rgba(0, 0, 0, 0) 70%)";
    }
  }

  // Attach size selector listeners
  const chips = container.querySelectorAll(".size-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeSize = chip.getAttribute("data-size");
    });
  });

  // Attach pre-order button listener
  const preorderBtn = document.getElementById("add-to-preorder-btn");
  if (preorderBtn) {
    preorderBtn.addEventListener("click", () => {
      window.addToCart(currentProductId, activeSize);
    });
  }
}

// Image Thumbnail Switcher
window.switchMainImage = function(thumbEl) {
  const mainImg = document.getElementById("main-product-img");
  const thumbnails = document.querySelectorAll(".thumb-img");
  
  if (!mainImg || !thumbEl) return;
  if (mainImg.src === thumbEl.src) return;

  // Toggle active class
  thumbnails.forEach(t => t.classList.remove("active"));
  thumbEl.classList.add("active");

  // Premium transition swap
  mainImg.style.transition = "opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
  mainImg.style.opacity = "0";
  mainImg.style.transform = "scale(0.95)";
  
  setTimeout(() => {
    mainImg.src = thumbEl.src;
    // Force reflow
    mainImg.offsetHeight;
    mainImg.style.opacity = "1";
    mainImg.style.transform = "scale(1)";
  }, 200);
};

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

    const closeBtnEmpty = itemsContainer.querySelector(".btn-close-drawer");
    if (closeBtnEmpty) {
      closeBtnEmpty.addEventListener("click", (e) => {
        e.preventDefault();
        toggleCartDrawer(false);
      });
    }
    return;
  }

  if (checkoutFooter) {
    checkoutFooter.style.display = "block";
  }

  itemsContainer.innerHTML = "";
  cart.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    
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
// CART OPERATIONS (ACCESSIBLE GLOBALLY)
// ==========================================================================
window.addToCart = function(id, size = "N/A") {
  const product = PRODUCTS_CATALOG[id];
  if (!product) return;

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

// Drawer Toggle
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleCartDrawer(false);
    }
  });
}

// ==========================================================================
// CHECKOUT WIZARD PROCESS
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

  let currentStep = 1;

  const showStep = (stepNum) => {
    currentStep = stepNum;
    
    document.querySelectorAll(".checkout-step-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    const targetPanel = document.getElementById(`checkout-step-${stepNum}`);
    if (targetPanel) targetPanel.classList.add("active");

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

    let subtotal = 0;
    cart.forEach(item => subtotal += item.price * item.quantity);
    const summaryTotal = document.getElementById("checkout-summary-total");
    if (summaryTotal) summaryTotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

    toggleCartDrawer(false);
    checkoutModal.classList.add("active");
    document.body.style.overflow = "hidden";
    showStep(1); 
  };

  const closeCheckout = () => {
    checkoutModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);
  if (closeBtn) closeBtn.addEventListener("click", closeCheckout);
  if (backdrop) backdrop.addEventListener("click", closeCheckout);

  if (shippingForm) {
    shippingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameVal = document.getElementById("ship-name").value;
      const emailVal = document.getElementById("ship-email").value;
      document.getElementById("success-name-text").textContent = nameVal;
      document.getElementById("success-email-text").textContent = emailVal;

      let subtotal = 0;
      cart.forEach(item => subtotal += item.price * item.quantity);
      document.getElementById("success-total-text").textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      
      const randomRef = "PRE-" + Math.floor(100000 + Math.random() * 900000);
      document.getElementById("success-order-id").textContent = randomRef;

      shippingForm.reset();
      cart = [];
      saveCartToStorage();
      updateCartUI();

      showStep(3); 
    });
  }

  if (paymentBack) {
    paymentBack.addEventListener("click", (e) => {
      e.preventDefault();
      showStep(1); 
    });
  }

  if (successBtn) {
    successBtn.addEventListener("click", () => {
      closeCheckout();
      window.location.href = "merch.html";
    });
  }
}

// Floating Toast Notifications helper
function showNotification(message, isError = false) {
  const container = document.getElementById("alert-container");
  if (!container) return;

  const alert = document.createElement("div");
  alert.className = `alert-card ${isError ? 'error' : ''}`;
  alert.innerHTML = `
    <i class="${isError ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(alert);

  setTimeout(() => {
    alert.classList.add("active");
  }, 10);

  setTimeout(() => {
    alert.classList.remove("active");
    setTimeout(() => {
      alert.remove();
    }, 400);
  }, 3500);
}
