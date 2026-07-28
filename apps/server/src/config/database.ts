import mongoose from 'mongoose'

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI!
  if (!uri) throw new Error('MONGODB_URI is not defined')
  
  mongoose.connection.on('connected', () => console.log('[MongoDB] Connected'))
  mongoose.connection.on('error', (err) => console.error('[MongoDB] Error:', err))
  mongoose.connection.on('disconnected', () => console.log('[MongoDB] Disconnected'))
  
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  })
}
