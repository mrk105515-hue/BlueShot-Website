// ==========================================================================
// DXZ WIKI ORDER TRACKING & HISTORY LOGIC
// Handles guest lookups, Firebase account queries, and Admin management
// ==========================================================================

let db = null;
let auth = null;
let isDemoMode = true;
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  initFirebase();
  initTabs();
  initLookupForm();
  initAuthListener();
});

// ==========================================================================
// FIREBASE INITIALIZATION
// ==========================================================================
function initFirebase() {
  const isConfigured = typeof firebaseConfig !== 'undefined' && 
                       firebaseConfig.apiKey && 
                       firebaseConfig.apiKey !== "YOUR_API_KEY";

  if (typeof firebase !== 'undefined' && isConfigured) {
    try {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
      auth = firebase.auth();
      isDemoMode = false;
      console.log("Orders System: Live Firestore Mode Active");
    } catch (e) {
      console.error("Orders System: Live Firebase init failed. Falling back to Demo Mode.", e);
      setupDemoState();
    }
  } else {
    setupDemoState();
  }
}

function setupDemoState() {
  isDemoMode = true;
  console.log("Orders System: Running in Demo Offline Mode (using LocalStorage)");
  // Create some default mock orders in demo mode if empty, for testing
  const localOrders = JSON.parse(localStorage.getItem("dxz_demo_orders") || "[]");
  if (localOrders.length === 0) {
    const mockOrders = [
      {
        orderId: "pay_P21tFIsQSy60O",
        userId: "guest_user",
        email: "guest@gmail.com",
        phone: "9876543210",
        name: "Rahul Sharma",
        address: "45, Marine Drive",
        city: "Mumbai",
        zip: "400002",
        country: "India",
        items: [
          { id: "redago-tshirt", name: "REDAGO T-Shirt", price: 999, image: "assets/redago-new-1.png", size: "L", quantity: 1 }
        ],
        totalAmount: 999,
        status: "Processing",
        trackingNumber: "",
        courierPartner: "Shiprocket",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
      },
      {
        orderId: "pay_M99uGKsWTy88L",
        userId: "demo_user_123",
        email: "member@blueshot.com",
        phone: "9988776655",
        name: "Aman Verma",
        address: "7-B, Sector 22",
        city: "Noida",
        zip: "201301",
        country: "India",
        items: [
          { id: "cursegod-tshirt", name: "CURSE GOD T-Shirt", price: 799, image: "assets/cursegod-angle-1.png", size: "M", quantity: 1 },
          { id: "berry-tshirt", name: "BERRY T-Shirt", price: 599, image: "assets/berry-angle-1.png", size: "XL", quantity: 2 }
        ],
        totalAmount: 1997,
        status: "Shipped",
        trackingNumber: "SR10034829104",
        courierPartner: "Shiprocket",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
      }
    ];
    localStorage.setItem("dxz_demo_orders", JSON.stringify(mockOrders));
  }
}

// ==========================================================================
// NAVIGATION TAB SWITCHER
// ==========================================================================
function initTabs() {
  const tabGuestBtn = document.getElementById("tab-guest-btn");
  const tabAccountBtn = document.getElementById("tab-account-btn");
  const guestPanel = document.getElementById("guest-lookup-panel");
  const accountPanel = document.getElementById("account-history-panel");
  const detailsCard = document.getElementById("order-details-card");

  if (!tabGuestBtn || !tabAccountBtn) return;

  tabGuestBtn.addEventListener("click", () => {
    tabGuestBtn.classList.add("active");
    tabAccountBtn.classList.remove("active");
    guestPanel.style.display = "block";
    accountPanel.style.display = "none";
    detailsCard.classList.remove("active");
  });

  tabAccountBtn.addEventListener("click", () => {
    tabAccountBtn.classList.add("active");
    tabGuestBtn.classList.remove("active");
    guestPanel.style.display = "none";
    accountPanel.style.display = "block";
    detailsCard.classList.remove("active");
    
    if (currentUser) {
      loadAccountOrders();
    }
  });
}

// ==========================================================================
// GUEST ORDER LOOKUP FORM
// ==========================================================================
function initLookupForm() {
  const form = document.getElementById("guest-lookup-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const orderId = document.getElementById("lookup-order-id").value.trim();
    const email = document.getElementById("lookup-email").value.trim().toLowerCase();

    if (!orderId || !email) {
      showToastNotification("Please fill out all lookup fields!", true);
      return;
    }

    findAndDisplayOrder(orderId, email);
  });
}

function findAndDisplayOrder(orderId, email) {
  if (isDemoMode) {
    const localOrders = JSON.parse(localStorage.getItem("dxz_demo_orders") || "[]");
    const order = localOrders.find(o => o.orderId === orderId && o.email.toLowerCase() === email);
    
    if (order) {
      renderOrderDetails(order);
      showToastNotification("Order located successfully!");
    } else {
      showToastNotification("Order not found! Verify your Payment ID and Email.", true);
    }
  } else {
    // Live Firestore query
    const detailsCard = document.getElementById("order-details-card");
    db.collection("orders").doc(orderId).get()
      .then((doc) => {
        if (doc.exists) {
          const order = doc.data();
          if (order.email.toLowerCase() === email) {
            renderOrderDetails({ ...order, orderId: doc.id });
            showToastNotification("Order located successfully!");
          } else {
            showToastNotification("Order email verification failed!", true);
          }
        } else {
          showToastNotification("No order found with that Payment ID.", true);
        }
      })
      .catch((err) => {
        console.error("Firestore lookup error:", err);
        showToastNotification("Server error looking up order.", true);
      });
  }
}

// ==========================================================================
// ORDER HISTORY LOADER (ACCOUNT)
// ==========================================================================
function initAuthListener() {
  const isFirebaseConfigured = typeof firebaseConfig !== 'undefined' && 
                               firebaseConfig.apiKey && 
                               firebaseConfig.apiKey !== "YOUR_API_KEY";

  let useLiveFirebase = typeof firebase !== 'undefined' && isFirebaseConfigured;

  if (useLiveFirebase) {
    firebase.auth().onAuthStateChanged((user) => {
      handleAuthChange(user);
    });
  } else {
    // Fallback local listener
    window.addEventListener("dxz_user_changed", checkLocalUser);
    checkLocalUser();
  }
}

function checkLocalUser() {
  const savedUser = localStorage.getItem("dxz_demo_user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  handleAuthChange(user);
}

function handleAuthChange(user) {
  currentUser = user;
  const blocker = document.getElementById("history-auth-blocker");
  const listView = document.getElementById("history-list-view");

  if (!blocker || !listView) return;

  if (user) {
    blocker.style.display = "none";
    listView.style.display = "block";
    loadAccountOrders();
  } else {
    blocker.style.display = "block";
    listView.style.display = "none";
  }
}

function loadAccountOrders() {
  const container = document.getElementById("orders-history-container");
  if (!container) return;

  container.innerHTML = `<div style="text-align:center; padding: 2rem; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading order history...</div>`;

  if (isDemoMode) {
    // Fetch from localStorage
    const localOrders = JSON.parse(localStorage.getItem("dxz_demo_orders") || "[]");
    // Match either by uid or email
    const userEmail = currentUser ? currentUser.email.toLowerCase() : "";
    const userId = currentUser ? currentUser.uid : "";
    
    const userOrders = localOrders.filter(o => 
      (o.userId === userId && userId !== "") || 
      (o.email.toLowerCase() === userEmail && userEmail !== "")
    );

    renderHistoryList(userOrders);
  } else {
    // Firestore query
    const userEmail = currentUser.email.toLowerCase();
    const userId = currentUser.uid;

    db.collection("orders")
      .where("email", "==", userEmail)
      .get()
      .then((snapshot) => {
        const orders = [];
        snapshot.forEach(doc => {
          orders.push({ ...doc.data(), orderId: doc.id });
        });
        
        // Also search by userId just in case they have a different email now
        db.collection("orders")
          .where("userId", "==", userId)
          .get()
          .then((snap2) => {
            snap2.forEach(doc => {
              if (!orders.find(o => o.orderId === doc.id)) {
                orders.push({ ...doc.data(), orderId: doc.id });
              }
            });
            // Sort by date desc
            orders.sort((a, b) => {
              const dateA = a.createdAt ? (a.createdAt.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime()) : 0;
              const dateB = b.createdAt ? (b.createdAt.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime()) : 0;
              return dateB - dateA;
            });
            renderHistoryList(orders);
          });
      })
      .catch((err) => {
        console.error("Firestore history load error:", err);
        container.innerHTML = `<div style="text-align:center; padding: 2rem; color:var(--color-red-neon);"><i class="fa-solid fa-triangle-exclamation"></i> Error loading order history.</div>`;
      });
  }
}

function renderHistoryList(orders) {
  const container = document.getElementById("orders-history-container");
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <i class="fa-solid fa-bag-shopping" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
        <p>No orders found under your account profile.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  orders.forEach(order => {
    const formattedDate = formatDate(order.createdAt);
    const statusClass = getStatusClass(order.status);
    
    // Create card
    const card = document.createElement("div");
    card.className = "history-order-card";
    card.innerHTML = `
      <div class="history-card-header">
        <span class="order-id-badge">${order.orderId}</span>
        <span class="order-status-badge ${statusClass}">${order.status}</span>
      </div>
      <div class="history-card-meta">
        <span>Placed on: <strong>${formattedDate}</strong></span>
        <span style="float: right;">Total: <strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></span>
      </div>
      <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-secondary);">
        Items: ${order.items.map(it => `${it.quantity}x ${it.name}`).join(", ")}
      </div>
    `;
    
    card.addEventListener("click", () => {
      renderOrderDetails(order);
      // Scroll details card into view
      const detailsCard = document.getElementById("order-details-card");
      detailsCard.scrollIntoView({ behavior: "smooth" });
    });
    
    container.appendChild(card);
  });
}

// ==========================================================================
// RENDER ORDER DETAILS & STATUS TIMELINE
// ==========================================================================
function renderOrderDetails(order) {
  const card = document.getElementById("order-details-card");
  if (!card) return;

  const formattedDate = formatDate(order.createdAt);
  const statusClass = getStatusClass(order.status);
  
  // Calculate Progress percentage
  let progressWidth = "0%";
  let step1Class = "completed";
  let step2Class = "active";
  let step3Class = "";
  let step4Class = "";

  if (order.status === "Processing") {
    progressWidth = "33%";
    step1Class = "completed";
    step2Class = "active";
  } else if (order.status === "Shipped") {
    progressWidth = "66%";
    step1Class = "completed";
    step2Class = "completed";
    step3Class = "active";
  } else if (order.status === "Delivered") {
    progressWidth = "100%";
    step1Class = "completed";
    step2Class = "completed";
    step3Class = "completed";
    step4Class = "completed";
  }

  // Draw Shiprocket Tracking panel if available
  let shiprocketHTML = "";
  if (order.status === "Shipped" && order.trackingNumber) {
    shiprocketHTML = `
      <div class="shiprocket-tracking-box">
        <div class="shiprocket-tracking-info">
          <h4>Courier Partner: ${order.courierPartner || 'Shiprocket'}</h4>
          <p>AWB Tracking ID: ${order.trackingNumber}</p>
        </div>
        <a href="https://shiprocket.co/tracking/${order.trackingNumber}" target="_blank" class="btn btn-primary" style="padding: 0.6rem 1.25rem; font-size: 0.85rem; border-radius: 30px; border:none; text-decoration:none;">
          <i class="fa-solid fa-truck-fast"></i> Track on Shiprocket
        </a>
      </div>
    `;
  }

  // Detailed checkpoints list on customer receipt
  let checkpointsHTML = "";
  if (order.checkpoints && order.checkpoints.length > 0) {
    // Sort checkpoints descending by timestamp
    const sortedCP = [...order.checkpoints].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    checkpointsHTML = `
      <div class="order-checkpoints-box" style="margin-top: 1.5rem; margin-bottom: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 1.25rem; border-radius: 12px; max-width: 100%;">
        <h4 style="color: var(--color-blue-neon); font-size: 1rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--font-display);"><i class="fa-solid fa-clock-rotate-left"></i> Shipment Milestone Updates</h4>
        <div class="checkpoint-timeline" style="position: relative; padding-left: 1.5rem; border-left: 2px solid rgba(0, 229, 255, 0.15); margin-left: 0.5rem;">
          ${sortedCP.map((cp, idx) => {
            const dateStr = formatDate(cp.timestamp);
            const isLatest = idx === 0;
            const dotColor = isLatest ? "var(--color-blue-neon)" : "rgba(255,255,255,0.3)";
            const dotShadow = isLatest ? "0 0 8px var(--color-blue-neon)" : "none";
            const fontColor = isLatest ? "#FFF" : "var(--text-secondary)";
            return `
              <div class="checkpoint-node" style="position: relative; margin-bottom: 1.25rem;">
                <div class="checkpoint-dot" style="position: absolute; left: calc(-1.5rem - 6px); top: 6px; width: 10px; height: 10px; border-radius: 50%; background: ${dotColor}; box-shadow: ${dotShadow};"></div>
                <div style="font-size: 0.9rem; font-weight: ${isLatest ? '700' : '400'}; color: ${fontColor};">${cp.message}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">${dateStr}</div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="order-header-row">
      <div>
        <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem;">Receipt &amp; Tracking Details</div>
        <span class="order-id-badge">${order.orderId}</span>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Placed on: <strong>${formattedDate}</strong></div>
      </div>
      <span class="order-status-badge ${statusClass}">${order.status}</span>
    </div>

    <!-- Timeline Tracker -->
    <div class="tracker-timeline">
      <div class="timeline-progress-bar" style="width: ${progressWidth};"></div>
      
      <div class="timeline-step ${step1Class}">
        <div class="timeline-node"><i class="fa-solid fa-check"></i></div>
        <div class="timeline-label">Placed</div>
      </div>
      
      <div class="timeline-step ${step2Class}">
        <div class="timeline-node"><i class="fa-solid fa-spinner fa-spin-pulse"></i></div>
        <div class="timeline-label">Processing</div>
      </div>
      
      <div class="timeline-step ${step3Class}">
        <div class="timeline-node"><i class="fa-solid fa-truck"></i></div>
        <div class="timeline-label">Shipped</div>
      </div>
      
      <div class="timeline-step ${step4Class}">
        <div class="timeline-node"><i class="fa-solid fa-box-open"></i></div>
        <div class="timeline-label">Delivered</div>
      </div>
    </div>

    <!-- Shiprocket Box -->
    ${shiprocketHTML}

    <!-- Detailed Checkpoints Timeline -->
    ${checkpointsHTML}

    <!-- Items Grid -->
    <div class="order-items-grid">
      <div class="order-items-header">Items Ordered</div>
      <div class="order-items-list">
        ${order.items.map(item => `
          <div class="order-item-row">
            <img src="${item.image}" alt="${item.name}" class="order-item-thumb" onerror="this.src='assets/redago-new-1.png'">
            <div class="order-item-details">
              <div class="order-item-name">${item.name}</div>
              <div class="order-item-meta">Size: <strong>${item.size}</strong> | Qty: <strong>${item.quantity}</strong></div>
            </div>
            <div class="order-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          </div>
        `).join("")}
      </div>
      <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.15rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.25rem; margin-top: 1rem; color:#FFF;">
        <span>Grand Total Paid</span>
        <span style="color: var(--color-blue-neon);">₹${order.totalAmount.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <!-- Shipping Details -->
    <div class="order-address-box">
      <h4>Shipping Address</h4>
      <p><strong>Recipient:</strong> ${order.name}</p>
      <p>${order.address}, ${order.city}</p>
      <p>Zip: ${order.zip}, ${order.country}</p>
      <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">Contact Email: ${order.email} | Phone: ${order.phone || 'N/A'}</p>
    </div>
  `;

  card.classList.add("active");
}

// ==========================================================================
// UTILITY HELPERS
// ==========================================================================
function formatDate(timestamp) {
  if (!timestamp) return "Unknown Date";
  
  let dateObj;
  // Check if firestore server timestamp
  if (timestamp.seconds) {
    dateObj = new Date(timestamp.seconds * 1000);
  } else {
    dateObj = new Date(timestamp);
  }
  
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return dateObj.toLocaleDateString('en-IN', options);
}

function getStatusClass(status) {
  if (status === "Processing") return "status-processing";
  if (status === "Shipped") return "status-shipped";
  if (status === "Delivered") return "status-delivered";
  return "";
}

// Custom Toast notification implementation matching rest of website toast logic
function showToastNotification(message, isError = false) {
  const container = document.getElementById("alert-container");
  if (!container) return;

  const alert = document.createElement("div");
  alert.className = `alert-toast ${isError ? 'error' : ''}`;
  alert.innerHTML = `
    <div class="alert-toast-icon">
      <i class="fa-solid ${isError ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
    </div>
    <div class="alert-toast-content">
      <p>${message}</p>
    </div>
  `;

  container.appendChild(alert);

  // Trigger browser animation
  setTimeout(() => {
    alert.classList.add("active");
  }, 10);

  // Self destroy after 4 seconds
  setTimeout(() => {
    alert.classList.remove("active");
    setTimeout(() => {
      alert.remove();
    }, 400);
  }, 4000);
}
