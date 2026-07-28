'use client'
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, Auth } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const isValidKey = apiKey && !apiKey.includes('PLACEHOLDER');

const firebaseConfig = {
  apiKey: isValidKey ? apiKey : 'AIzaSyDemoDummyKeyForLocalDevOnly12345',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

let app: any;
let auth: any;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
} catch (e) {
  console.warn('[Firebase] Client init warning:', e);
}

export { app, auth, RecaptchaVerifier };

export async function sendOtp(phoneNumber: string, appVerifier: any): Promise<any> {
  if (!isValidKey || !auth) {
    console.warn('[Firebase] Firebase API key is placeholder. Mocking OTP send.');
    return {
      confirm: async (_otp: string) => ({
        user: { getIdToken: async () => 'mock-local-token' }
      })
    };
  }
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

export async function verifyOtp(confirmationResult: any, otp: string): Promise<{ idToken: string }> {
  if (!isValidKey || !confirmationResult?.confirm) {
    return { idToken: 'mock-local-token' };
  }
  const result = await confirmationResult.confirm(otp);
  const idToken = await result.user.getIdToken();
  return { idToken };
}
