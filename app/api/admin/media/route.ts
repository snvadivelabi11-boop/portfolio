import { NextResponse } from 'next/server';
import { getMediaAssets, uploadMediaAsset, deleteMediaAsset, MediaItem } from '@/lib/mediaStorage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const media = await getMediaAssets();
    return NextResponse.json({ success: true, media });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as MediaItem['category']) || 'projects';
    const adminEmail = (formData.get('adminEmail') as string) || 'SNVADIVEL11@gmail.com';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file payload provided' }, { status: 400 });
    }

    console.log(`[API /api/admin/media] Uploading file ${file.name} under category: ${category}...`);
    const uploadedAsset = await uploadMediaAsset(file, category, adminEmail);

    return NextResponse.json({
      success: true,
      message: 'File successfully uploaded to Cloudinary CDN and metadata archived in Firestore',
      media: uploadedAsset,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[API /api/admin/media Error]:', errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const storagePath = searchParams.get('storagePath') || undefined;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Media ID required' }, { status: 400 });
    }

    await deleteMediaAsset(id, storagePath);
    return NextResponse.json({
      success: true,
      message: 'File deleted from Firebase Storage and Firestore',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
