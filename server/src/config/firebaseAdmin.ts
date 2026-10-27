import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;
let isFirebaseAdminConfigured = false;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
    });
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    isFirebaseAdminConfigured = true;
    console.log('Firebase Admin SDK initialized successfully.');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    isFirebaseAdminConfigured = true;
    console.log('Firebase Admin SDK initialized with Google Application Credentials.');
  } else {
    console.log('Firebase Admin credentials not set. Running with resilient local fallback store.');
  }
} catch (error) {
  console.warn('Firebase Admin SDK init note (running fallback):', error);
}

export { admin, adminAuth, adminDb, isFirebaseAdminConfigured };
