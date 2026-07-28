import * as admin from 'firebase-admin'

let initialized = false

export function initFirebase() {
  if (initialized) return;
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!privateKey || privateKey.includes('PLACEHOLDER')) {
      console.warn('[Firebase] Warning: FIREBASE_PRIVATE_KEY is placeholder or missing. Firebase features will require credentials in .env');
      return;
    }
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!
      })
    });
    initialized = true;
    console.log('[Firebase] Initialized');
  } catch (err: any) {
    console.warn('[Firebase] Initialization warning:', err.message);
  }
}

export async function verifyIdToken(idToken: string) {
  return admin.auth().verifyIdToken(idToken)
}

export default admin
