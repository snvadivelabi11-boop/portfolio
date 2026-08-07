import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addBookingDocument } from '@/lib/firestoreCMS';
import { sanitizeInput } from '@/lib/store';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  company: z.string().optional(),
  serviceSelected: z.string().optional(),
  purpose: z.string().optional(),
  date: z.string().optional(),
  preferredDate: z.string().optional(),
  time: z.string().optional(),
  preferredTime: z.string().optional(),
  timezone: z.string().optional(),
  projectBudget: z.string().optional(),
  projectDescription: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const now = new Date().toISOString();
    const generatedId = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const bookingPayload: Omit<import('@/types').Booking, 'id'> = {
      bookingId: generatedId,
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      company: data.company ? sanitizeInput(data.company) : undefined,
      serviceSelected: sanitizeInput(data.serviceSelected || data.purpose || 'Full Stack Web Architecture Consultation'),
      purpose: sanitizeInput(data.purpose || data.serviceSelected || 'Full Stack Web Architecture Consultation'),
      preferredDate: sanitizeInput(data.preferredDate || data.date || now.split('T')[0]),
      date: sanitizeInput(data.date || data.preferredDate || now.split('T')[0]),
      preferredTime: sanitizeInput(data.preferredTime || data.time || '10:00 AM'),
      time: sanitizeInput(data.time || data.preferredTime || '10:00 AM'),
      timezone: sanitizeInput(data.timezone || 'Asia/Kolkata (IST)'),
      projectBudget: data.projectBudget ? sanitizeInput(data.projectBudget) : '$2,500 - $5,000',
      projectDescription: sanitizeInput(data.projectDescription || data.message || data.purpose || 'Strategy Call Request'),
      message: sanitizeInput(data.message || data.projectDescription || data.purpose || 'Strategy Call Request'),
      status: 'New',
      unread: true,
      createdAt: now,
      updatedAt: now,
    };

    const docId = await addBookingDocument(bookingPayload);

    return NextResponse.json({
      success: true,
      message: 'Booking request received! It is pending admin review.',
      booking: { id: docId, ...bookingPayload },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, message: `Failed to submit booking request: ${msg}` },
      { status: 500 }
    );
  }
}
