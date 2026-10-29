// ==========================================================================
// DXZ COMMUNITY HUB FIREBASE CONFIGURATION
// Create a free project at console.firebase.google.com
// Enable Email/Password Sign-In under Auth, and enable Cloud Firestore.
// Copy-paste your Web App config snippet properties here.
// ==========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyDpLmB9A3Qcky153SBWI_XzOh8nsZcjI48",
  authDomain: "blueshotwiki.firebaseapp.com",
  projectId: "blueshotwiki",
  storageBucket: "blueshotwiki.firebasestorage.app",
  messagingSenderId: "432209991069",
  appId: "1:432209991069:web:3cea1637058783892e0b74",
  // Paste your Google reCAPTCHA v3 PUBLIC Site Key here to enable App Check:
  appCheckSiteKey: "6LcH5mItAAAAAJcY_Npdhf4od7Ljy43zsvKKXaIp"
};

const shiprocketConfig = {
  // Option A: Secure Webhook Integration (Recommended)
  webhookUrl: "",

  // Option B: Dynamic API User Authentication (Never expires)
  email: "Blueshotx99@gmail.com",
  password: "BAiDJk7PjXqDmiQec0wUJO*tS#@RuQ9Y",
  token: null,
  apiBaseUrl: "https://misty-hall-0686.mrk105515.workers.dev",
  pickupLocation: "Home", // Must match your Shiprocket panel's pickup location name
  channelId: "11155451" // Your connected Custom Channel ID
};

// Initialize Firebase & App Check centrally
if (typeof firebase !== "undefined") {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Activate App Check if site key is configured
  if (firebaseConfig.appCheckSiteKey && firebaseConfig.appCheckSiteKey !== "PASTE_YOUR_RECAPTCHA_V3_SITE_KEY_HERE" && firebase.appCheck) {
    const appCheck = firebase.appCheck();
    
    // Enable debug mode automatically on localhost for developer testing convenience
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    
    appCheck.activate(firebaseConfig.appCheckSiteKey, true);
    console.log("Firebase App Check initialized successfully.");
  }
}
