import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { UserModel } from '../models/User';
import { ModerationService } from '../services/ModerationService';
import mongoose from 'mongoose';

const router = Router();

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
    const user = await UserModel.findById(req.userId).populate('blocklist', 'displayName avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.blocklist);
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
