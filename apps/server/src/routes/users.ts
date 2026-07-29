import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { UserModel } from '../models/User';
import { ModerationService } from '../services/ModerationService';
import mongoose from 'mongoose';

const router = Router();

router.get('/explore', async (req, res) => {
  try {
    let users = await UserModel.find({ isBanned: false })
      .select('displayName avatar nativeLanguage gender interests isVIP')
      .limit(30);

    if (!users || users.length === 0) {
      users = [
        { _id: '65f1a2b3c4d5e6f7a8b9c0d1', displayName: 'Priya Sharma', nativeLanguage: 'hi', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', isVIP: true } as any,
        { _id: '65f1a2b3c4d5e6f7a8b9c0d2', displayName: 'Carlos Rodriguez', nativeLanguage: 'es', gender: 'male', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', isVIP: false } as any,
        { _id: '65f1a2b3c4d5e6f7a8b9c0d3', displayName: 'Aisha Al-Mansoor', nativeLanguage: 'ar', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha', isVIP: true } as any,
        { _id: '65f1a2b3c4d5e6f7a8b9c0d4', displayName: 'Yuki Tanaka', nativeLanguage: 'ja', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki', isVIP: false } as any
      ];
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search', verifyToken, async (req, res) => {
  try {
    const { gender, language, limit = 20 } = req.query;
    
    const query: any = {};
    if (gender && gender !== 'any') query.gender = gender;
    if (language) query.nativeLanguage = language;
    
    const users = await UserModel.find(query)
      .select('displayName avatar nativeLanguage gender interests')
      .limit(Number(limit));
      
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/blocklist', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).populate('blockedUsers', 'displayName avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.blockedUsers || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).select('displayName avatar nativeLanguage gender interests');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:userId/block', verifyToken, async (req, res) => {
  try {
    await ModerationService.addToBlocklist(req.userId!, req.params.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:userId/block', verifyToken, async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(req.userId, {
      $pull: { blocklist: new mongoose.Types.ObjectId(req.params.userId) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const usersRouter = router;
