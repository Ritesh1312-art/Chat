import mongoose from 'mongoose'

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('PLACEHOLDER')) {
    console.warn('[MongoDB] MONGODB_URI is placeholder or undefined. Database operations will require valid URI in .env');
    return;
  }
  
  mongoose.connection.on('connected', () => console.log('[MongoDB] Connected'));
  mongoose.connection.on('error', (err) => console.error('[MongoDB] Error:', err));
  mongoose.connection.on('disconnected', () => console.log('[MongoDB] Disconnected'));
  
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  });
}
