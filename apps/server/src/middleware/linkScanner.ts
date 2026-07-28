import { Request, Response, NextFunction } from 'express';
import { ModerationService } from '../services/ModerationService';

const LINK_REGEX = /(https?:\/\/|www\.|\.(com|in|net|org|io|co|me|tv|xyz)(\/|\s|$))/gi;

export const linkScanner = async (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || !userId) {
    return next();
  }

  if (LINK_REGEX.test(content)) {
    try {
      const strikeResult = await ModerationService.handlePromoStrike(userId);
      
      // We would ideally emit via socket here, but in middleware we can just return an error response
      // or attach it to the req to be handled by the controller
      if (strikeResult.action === 'banned') {
        return res.status(403).json({ error: strikeResult.message, banned: true });
      } else {
        return res.status(400).json({ error: strikeResult.message, warning: true });
      }
    } catch (err) {
      return next(err);
    }
  }

  next();
};
