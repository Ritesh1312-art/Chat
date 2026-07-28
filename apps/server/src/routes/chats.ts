import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { ChatModel } from '../models/Chat';
import mongoose from 'mongoose';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const chats = await ChatModel.find({ participants: req.userId })
      .sort({ lastActivity: -1 })
      .populate('participants', 'displayName avatar');
      
    // Return chats with just the last message for preview
    const chatsWithPreview = chats.map(chat => {
      const obj = chat.toObject();
      obj.messages = obj.messages.length > 0 ? [obj.messages[obj.messages.length - 1]] : [];
      return obj;
    });

    res.json(chatsWithPreview);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:chatId', verifyToken, async (req, res) => {
  try {
    const chat = await ChatModel.findOne({ _id: req.params.chatId, participants: req.userId })
      .populate('participants', 'displayName avatar');
      
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    
    // Simplistic pagination returning last 50
    const obj = chat.toObject();
    obj.messages = obj.messages.slice(-50);
    
    res.json(obj);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:chatId/call-consent', verifyToken, async (req, res) => {
  try {
    const chat = await ChatModel.findOneAndUpdate(
      { _id: req.params.chatId, participants: req.userId },
      { $addToSet: { callPermissionGrantedBy: new mongoose.Types.ObjectId(req.userId) } },
      { new: true }
    );
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:chatId', verifyToken, async (req, res) => {
  try {
    await ChatModel.findOneAndUpdate(
      { _id: req.params.chatId },
      { $pull: { participants: new mongoose.Types.ObjectId(req.userId) } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const chatsRouter = router;
