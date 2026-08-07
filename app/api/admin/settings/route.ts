import { NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings, adminEmail } = body;

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Settings payload is required' },
        { status: 400 }
      );
    }

    const updated = await updateSiteSettings(settings, adminEmail || 'SNVADIVEL11@gmail.com');

    return NextResponse.json({
      success: true,
      message: 'Website settings updated and version snapshot backed up to Firestore',
      settings: updated,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[API /api/admin/settings Error]:', errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg || 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
