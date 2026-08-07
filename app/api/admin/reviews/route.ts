import { NextResponse } from 'next/server';
import { getAllReviews, updateReviewStatus, deleteReview } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json({ success: false, reviews: [] }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const updated = await updateReviewStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
    }

    const deleted = await deleteReview(id);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
