// config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// ✅ Verify project ID matches your Firebase project
console.log('✅ Firebase Project ID from JSON:', serviceAccount.project_id);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ✅ Explicitly set the project ID to "jmorganic"
  projectId: 'jmorganic'
});

console.log('✅ Firebase Admin initialized');

module.exports = admin;