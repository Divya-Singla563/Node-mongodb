// src/config/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./backend-test-855e5-firebase-adminsdk-fbsvc-8a0483e304.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
