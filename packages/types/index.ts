export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' }
];

export interface IUser {
  _id: string;
  phoneNumber: string;
  displayName?: string;
  avatar?: string;
  nativeLanguage: string;
  walletBalance: number;
  promoStrikes: number;
  nsfwStrikes: number;
  isBanned: boolean;
  banUntil?: Date | string | null;
  blocklist: string[];
  gender?: Gender;
  interests: string[];
  createdAt: Date | string;
}

export interface IMessage {
  sender: string;
  content: string;
  originalContent?: string;
  isTranslated: boolean;
  timestamp: Date | string;
  deleted: boolean;
  chatId: string;
}

export interface IChat {
  participants: string[];
  callPermissionGrantedBy: string[];
  messages: string[] | IMessage[];
  lastMessage?: string | IMessage;
  createdAt: Date | string;
}

export interface ICoin {
  amount: number;
  reason: string;
  userId: string;
  createdAt: Date | string;
}

export type ReportType = 'nsfw' | 'spam' | 'panic';

export interface IReport {
  reporterId: string;
  targetId: string;
  reason: string;
  type: ReportType;
  timestamp: Date | string;
}

export enum SocketEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN_ZONE_A = 'JOIN_ZONE_A',
  LEAVE_ZONE_A = 'LEAVE_ZONE_A',
  MATCH_FOUND = 'MATCH_FOUND',
  MATCH_ENDED = 'MATCH_ENDED',
  SEND_MESSAGE = 'SEND_MESSAGE',
  RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
  LOCK_WARNING = 'LOCK_WARNING',
  OFFER = 'OFFER',
  ANSWER = 'ANSWER',
  ICE_CANDIDATE = 'ICE_CANDIDATE',
  REVEAL_VOTE = 'REVEAL_VOTE',
  REMOVE_BLUR = 'REMOVE_BLUR',
  END_MATCH = 'END_MATCH',
  PANIC_PRESSED = 'PANIC_PRESSED',
  CALL_REQUEST = 'CALL_REQUEST',
  CALL_CONSENT = 'CALL_CONSENT',
  CALL_ENABLED = 'CALL_ENABLED',
  NSFW_REPORT = 'NSFW_REPORT',
  MODERATION_WARNING = 'MODERATION_WARNING',
  BANNED = 'BANNED',
  FORCE_LOGOUT = 'FORCE_LOGOUT',
  ONLINE_STATUS = 'ONLINE_STATUS',
  WALLET_UPDATED = 'WALLET_UPDATED',
  COIN_CREDITED = 'COIN_CREDITED',
  TICK = 'TICK'
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WalletPlan {
  id: string;
  name: string;
  coins: number;
  price: number;
  currency: string;
  popular?: boolean;
}
