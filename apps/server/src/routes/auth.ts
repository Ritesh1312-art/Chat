import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { UserModel } from '../models/User';
import { verifyIdToken } from '../config/firebase';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getRedisClient } from '../config/redis';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

router.post('/verify-otp', async (req, res) => {
  try {
    const { idToken, displayName, nativeLanguage, gender } = req.body;
    
    const decodedToken = await verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'No phone number in token' });
    }

    let user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      user = new UserModel({
        phoneNumber,
        displayName: displayName || 'User',
        nativeLanguage: nativeLanguage || 'en',
        gender: gender || 'prefer_not_to_say'
      });
      await user.save();
    }

    const jti = uuidv4();
    const token = jwt.sign({ sub: user._id.toString(), jti }, JWT_SECRET, { expiresIn: '7d' });
    
    await getRedisClient().set(`session:${jti}`, user._id.toString(), 'EX', 7 * 24 * 60 * 60);

    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token) as { jti: string };
      if (decoded && decoded.jti) {
        await RedisService.revokeSession(decoded.jti);
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = ['displayName', 'avatar', 'nativeLanguage', 'gender', 'languageFilter', 'genderFilter'];
    
    const validUpdates: any = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        validUpdates[key] = updates[key];
      }
    }

    const user = await UserModel.findByIdAndUpdate(req.userId, validUpdates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const authRouter = router;
