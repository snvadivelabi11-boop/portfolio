import { NextResponse } from 'next/server';
import { getContactMessages, deleteContactMessage, updateContactMessageStatus } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const messages = await getContactMessages();
    return NextResponse.json({ success: true, messages });
  } catch {
    return NextResponse.json({ success: false, messages: [] }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing message ID or status' }, { status: 400 });
    }

    const updated = await updateContactMessageStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update message status' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
    }

    const deleted = await deleteContactMessage(id);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
