import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, from, to } = body;

    if (!text || !to) {
      return NextResponse.json({ error: 'Text and target language required' }, { status: 400 });
    }

    if (process.env.USE_TRANSLATE_MOCK === 'true') {
      // Mock translation
      return NextResponse.json({ 
        translated: `[MOCK-${to.toUpperCase()}] ${text}`,
        mock: true
      });
    }

    // Actual Google Translate API call (assuming simple REST API approach)
    // Needs GOOGLE_TRANSLATE_API_KEY in .env
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      throw new Error('Google Translate API key missing');
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target: to, source: from || undefined })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json({
      translated: data.data.translations[0].translatedText,
      mock: false
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed', details: error.message }, { status: 500 });
  }
}
