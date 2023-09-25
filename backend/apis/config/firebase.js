// config/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./path-to-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://node-test-project-3d4c5.firebaseio.com", // Replace with your Firebase project's URL
});

module.exports = admin;
