import * as admin from 'firebase-admin'

let initialized = false

export function initFirebase() {
  if (initialized) return
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!
    })
  })
  initialized = true
  console.log('[Firebase] Initialized')
}

export async function verifyIdToken(idToken: string) {
  return admin.auth().verifyIdToken(idToken)
}

export default admin
