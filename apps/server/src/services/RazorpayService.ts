import Razorpay from 'razorpay';
import crypto from 'crypto';
import { User } from '../models/User';
import { getRedisClient } from '../config/redis';

const PLANS: Record<string, { amount: number; coins: number; name: string }> = {
  starter_5: { amount: 500, coins: 45, name: 'Starter Pack' },
  vip_10:    { amount: 1000, coins: 100, name: 'VIP Pass' },
  power_20:  { amount: 2000, coins: 210, name: 'Power Pack' },
};

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return razorpayInstance;
}

export class RazorpayService {
  static async createOrder(userId: string, planId: string) {
    const plan = PLANS[planId];
    if (!plan) throw new Error(`Unknown plan: ${planId}`);

    const order = await getRazorpay().orders.create({
      amount: plan.amount, // in paise
      currency: 'INR',
      receipt: `${userId}_${planId}_${Date.now()}`,
      notes: { userId, planId, coins: plan.coins.toString() },
    });

    return {
      orderId: order.id,
      amount: plan.amount,
      currency: 'INR',
      planName: plan.name,
      coins: plan.coins,
    };
  }

  static verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBody);
    const digest = hmac.digest('hex');
    return digest === signature;
  }

  static async processPaymentCapture(event: any): Promise<{ userId: string; coinsAdded: number }> {
    const redis = getRedisClient();
    const orderId = event?.payload?.payment?.entity?.order_id;
    const notes = event?.payload?.payment?.entity?.notes;

    if (!orderId || !notes) throw new Error('Invalid event payload');

    // Idempotency: check if already processed
    const idempKey = `razorpay:processed:${orderId}`;
    const alreadyDone = await redis.get(idempKey);
    if (alreadyDone) throw new Error('Already processed');

    const userId = notes.userId;
    const coins = parseInt(notes.coins, 10);

    if (!userId || isNaN(coins)) throw new Error('Invalid order notes');

    // Update wallet
    await User.findByIdAndUpdate(userId, { $inc: { walletBalance: coins } });

    // Mark as processed (keep for 30 days)
    await redis.set(idempKey, '1', 'EX', 60 * 60 * 24 * 30);

    return { userId, coinsAdded: coins };
  }
}
