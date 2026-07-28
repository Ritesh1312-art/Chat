import { User } from '../models/User';

const LINK_REGEX = /(https?:\/\/|www\.|\.(com|in|net|org|io|co|me|tv|xyz)([\/\s]|$))/gi;

export class ModerationService {
  // ─── PROMO STRIKE ──────────────────────────────────────────────
  static async handlePromoStrike(
    userId: string
  ): Promise<{ action: 'warn' | 'final_warning' | 'banned'; message: string }> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.promoStrikes = (user.promoStrikes || 0) + 1;
    await user.save();

    if (user.promoStrikes <= 2) {
      return { action: 'warn', message: `⚠️ Warning ${user.promoStrikes}/3: Links are not allowed. Message deleted.` };
    }
    if (user.promoStrikes === 3) {
      return { action: 'final_warning', message: '🚨 FINAL WARNING: Next link will result in a permanent ban.' };
    }
    // Strike 4+: ban
    user.isBanned = true;
    await user.save();
    return { action: 'banned', message: 'You have been permanently banned for sending promotional links.' };
  }

  // ─── NSFW STRIKE ──────────────────────────────────────────────
  static async handleNsfwStrike(
    userId: string
  ): Promise<{ action: 'warn' | 'temp_ban_24h' | 'temp_ban_48h' | 'permanent_ban'; banUntil?: Date }> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.nsfwStrikes = (user.nsfwStrikes || 0) + 1;

    if (user.nsfwStrikes === 1) {
      await user.save();
      return { action: 'warn' };
    }
    if (user.nsfwStrikes === 2) {
      user.banUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();
      return { action: 'temp_ban_24h', banUntil: user.banUntil };
    }
    if (user.nsfwStrikes === 3) {
      user.banUntil = new Date(Date.now() + 48 * 60 * 60 * 1000);
      await user.save();
      return { action: 'temp_ban_48h', banUntil: user.banUntil };
    }
    // Strike 4+: permanent ban
    user.isBanned = true;
    user.banUntil = null;
    user.walletBalance = 0;
    await user.save();
    return { action: 'permanent_ban' };
  }

  // ─── BAN LIFT CHECK ───────────────────────────────────────────
  static async checkAndLiftBan(userId: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user || user.isBanned) return false;
    if (user.banUntil && user.banUntil < new Date()) {
      user.banUntil = null;
      await user.save();
      return true; // ban lifted
    }
    return false;
  }

  // ─── LINK SCANNER ─────────────────────────────────────────────
  static containsLink(text: string): boolean {
    return LINK_REGEX.test(text);
  }

  // ─── BLOCKLIST ────────────────────────────────────────────────
  static async addToBlocklist(userId: string, targetId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $addToSet: { blockedUsers: targetId } });
  }
}
