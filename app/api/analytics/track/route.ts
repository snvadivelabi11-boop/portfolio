import { NextResponse } from 'next/server';
import { trackVisitorLog } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path = '/', userAgent = '', referer = '' } = body;

    // Detect device type from userAgent
    let device: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
    if (/mobile/i.test(userAgent)) device = 'Mobile';
    else if (/ipad|tablet/i.test(userAgent)) device = 'Tablet';

    // Detect browser
    let browser = 'Chrome';
    if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
    else if (/edg/i.test(userAgent)) browser = 'Edge';

    await trackVisitorLog({
      path,
      ipHash: 'anon-ip',
      userAgent: userAgent.substring(0, 100),
      device,
      browser,
      country: 'India',
      city: 'Tiruvannamalai',
      referer: referer.substring(0, 100),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
