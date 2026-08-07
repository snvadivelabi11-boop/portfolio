import { NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/lib/store';

export async function GET() {
  try {
    const stats = await getAnalyticsStats();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
