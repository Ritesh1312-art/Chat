import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const response = await fetch(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: token || '' },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
