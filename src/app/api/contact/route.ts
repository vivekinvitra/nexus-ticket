import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, topic, description } = await req.json();

    if (!name || !email || !topic || !description) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const res = await fetch('https://send-mail.avi-kh.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, topic, description }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || 'Failed to send message.' }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
