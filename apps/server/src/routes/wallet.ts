import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { UserModel } from '../models/User';
import { RazorpayService } from '../services/RazorpayService';
import { getRedisClient } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/balance', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/order', verifyToken, async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: 'planId required' });
    
    const order = await RazorpayService.createOrder(req.userId!, planId);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Server error' });
  }
});

router.get('/ad-token', verifyToken, async (req, res) => {
  try {
    const token = uuidv4();
    await getRedisClient().set(`ad_token:${token}`, req.userId!, 'EX', 35);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/ad-reward', verifyToken, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token required' });

    const userId = await getRedisClient().get(`ad_token:${token}`);
    if (!userId || userId !== req.userId) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    await getRedisClient().del(`ad_token:${token}`);
    const user = await UserModel.findByIdAndUpdate(req.userId, { $inc: { walletBalance: 10 } }, { new: true });
    
    res.json({ success: true, newBalance: user?.walletBalance });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  // Simplified history since schema didn't explicitly request a transaction collection
  res.json({ history: [] });
});

export const walletRouter = router;
