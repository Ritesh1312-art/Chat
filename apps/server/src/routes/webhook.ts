import { Router, Request, Response } from 'express';
import { RazorpayService } from '../services/RazorpayService';
import { getIo } from '../socket';

const router = Router();

// MUST use express.raw() — raw body needed for HMAC verification
router.post('/razorpay', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const isValid = RazorpayService.verifyWebhookSignature(req.body as Buffer, signature);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse((req.body as Buffer).toString());

    if (event.event === 'payment.captured') {
      const { userId, coinsAdded } = await RazorpayService.processPaymentCapture(event);

      // Notify user via Socket.io
      try {
        const io = getIo();
        io.to(`user:${userId}`).emit('WALLET_UPDATED', { coinsAdded });
        io.to(`user:${userId}`).emit('COIN_CREDITED', { amount: coinsAdded });
      } catch (_) {
        // Socket might not be connected, not critical
      }
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    if (error.message === 'Already processed') {
      return res.status(200).json({ received: true, note: 'Already processed' });
    }
    console.error('[Webhook] Razorpay error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export const webhookRouter = router;

// Need to import express for express.raw
import express from 'express';
