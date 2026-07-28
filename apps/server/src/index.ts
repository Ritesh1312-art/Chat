import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDatabase } from './config/database';
import { getRedisClient } from './config/redis';
import { initFirebase } from './config/firebase';
import { initSocket } from './socket';

import { authRouter } from './routes/auth';
import { walletRouter } from './routes/wallet';
import { webhookRouter } from './routes/webhook';
import { usersRouter } from './routes/users';
import { chatsRouter } from './routes/chats';

const app = express();
const server = http.createServer(app);

// Security & logging
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(morgan('dev'));

// Webhook MUST be before express.json() — needs raw body
app.use('/webhook', webhookRouter);

// JSON parser for all other routes
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/users', usersRouter);
app.use('/api/chats', chatsRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

const PORT = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
  try {
    // Init Firebase
    initFirebase();

    // Connect MongoDB
    await connectDatabase();

    // Init Redis (ping to verify)
    const redis = getRedisClient();
    await redis.ping();
    console.log('[Redis] Connected');

    // Init Socket.io (attaches to http server)
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

bootstrap();
