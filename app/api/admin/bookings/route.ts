import { NextResponse } from 'next/server';
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ success: true, bookings });
  } catch {
    return NextResponse.json({ success: false, bookings: [] }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, action } = await request.json();

    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    if (action === 'approve') {
      const updatedBooking = await approveBooking(id);
      if (updatedBooking) {
        return NextResponse.json({
          success: true,
          message: 'Booking approved! Google Meet link & .ics invite generated.',
          booking: updatedBooking,
        });
      }
    } else {
      const rejected = await rejectBooking(id);
      return NextResponse.json({ success: rejected });
    }

    return NextResponse.json({ success: false }, { status: 400 });
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

    const deleted = await deleteBooking(id);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
