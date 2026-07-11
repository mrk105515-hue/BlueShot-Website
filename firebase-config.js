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
};

const shiprocketConfig = {
  // Option A: Secure Webhook Integration (Recommended)
  webhookUrl: "",

  // Option B: Direct API Token Integration (Note: exposed in browser, expires every 10 days)
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExMTQ3OTM5LCJzb3VyY2UiOiJzci1hdXRoLWludCIsImV4cCI6MTc4NDU0OTE0MywianRpIjoiUmZlWDdrb3BjVTBCOEw1bCIsImlhdCI6MTc4MzY4NTE0MywiaXNzIjoiaHR0cHM6Ly9zci1hdXRoLnNoaXByb2NrZXQuaW4vYXV0aG9yaXplL3VzZXIiLCJuYmYiOjE3ODM2ODUxNDMsImNpZCI6MTA1NzUyOTYsInRjIjozNjAsInZlcmJvc2UiOmZhbHNlLCJ2ZW5kb3JfaWQiOjAsInZlbmRvcl9jb2RlIjoiIn0.Co_MRq1Dpv3xmsReR-9AspbZ__ZL8Q52IHkfn3PocD4",
  pickupLocation: "Home", // Must match your Shiprocket panel's pickup location name
  channelId: "11155451" // Your connected Custom Channel ID
};
