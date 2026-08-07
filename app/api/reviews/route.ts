import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getApprovedReviews, submitReview } from '@/lib/store';

const reviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.string().min(2, 'Role/Title is required').max(100),
  company: z.string().max(100).optional(),
  content: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  rating: z.number().min(1).max(5),
  avatar: z.string().url().or(z.literal('')).optional(),
});

export async function GET() {
  try {
    const reviews = await getApprovedReviews();
    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json({ success: false, reviews: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const review = await submitReview(result.data);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully! It will appear once approved by admin.',
      review,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error processing review.' },
      { status: 500 }
    );
  }
}
