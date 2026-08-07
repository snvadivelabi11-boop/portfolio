import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveContactMessage } from '@/lib/store';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const savedMessage = await saveContactMessage(result.data);
    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: savedMessage,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error processing your message.' },
      { status: 500 }
    );
  }
}
