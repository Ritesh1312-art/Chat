import { v2 as Translate } from '@google-cloud/translate';
import dotenv from 'dotenv';
dotenv.config();

const useMock = process.env.USE_TRANSLATE_MOCK === 'true' || !process.env.GOOGLE_TRANSLATE_API_KEY;
const translate = useMock ? null : new Translate.Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

export class TranslateService {
  static async translate(text: string, fromLang: string, toLang: string): Promise<string> {
    if (!this.needsTranslation(fromLang, toLang)) {
      return text;
    }

    if (useMock) {
      return `[MOCK-${toLang}] ${text}`;
    }

    try {
      if (translate) {
        const [translation] = await translate.translate(text, toLang);
        return translation;
      }
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  static needsTranslation(langA: string, langB: string): boolean {
    return langA !== langB;
  }
}
