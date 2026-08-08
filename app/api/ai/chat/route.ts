import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callOpenRouterAI } from '@/lib/openrouter';
import { sanitizeUserPrompt } from '@/lib/chat';
import { saveContactMessage } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const chatRequestSchema = z.object({
  message: z.string().optional(),
  prompt: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const validation = chatRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid message request payload format.' },
        { status: 400 }
      );
    }

    const { message, prompt, messages = [] } = validation.data;
    const rawPrompt = message || prompt || (messages.length ? messages[messages.length - 1]?.content : '');

    if (!rawPrompt || !rawPrompt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    const sanitizedPrompt = sanitizeUserPrompt(rawPrompt);

    // Invoke OpenRouter AI backend engine with model fallback
    const result = await callOpenRouterAI(sanitizedPrompt, messages);

    if (!result.success || !result.reply) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to generate response from OpenRouter AI assistant.',
        },
        { status: result.statusCode || 500 }
      );
    }

    let replyText = result.reply;

    // Automated Lead Capture Trigger
    const textLower = sanitizedPrompt.toLowerCase();
    if (
      textLower.includes('budget') ||
      textLower.includes('timeline') ||
      textLower.includes('requirements') ||
      textLower.includes('hire')
    ) {
      await saveContactMessage({
        name: 'AI Chat Lead',
        email: process.env.ADMIN_EMAIL || 'SNVADIVEL11@gmail.com',
        subject: 'New Inquiry via OpenRouter AI Assistant',
        message: `Captured Chat Inquiry:\n${sanitizedPrompt}`,
      }).catch(() => {});
    }

    // Meeting Booking Trigger Detection
    let openBookingModal = false;
    if (
      replyText.includes('[ACTION:OPEN_BOOKING_MODAL]') ||
      textLower.includes('book meeting') ||
      textLower.includes('schedule call')
    ) {
      openBookingModal = true;
      replyText = replyText.replace('[ACTION:OPEN_BOOKING_MODAL]', '').trim();
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      message: replyText, // Backward compatibility
      openBookingModal,
      modelUsed: result.modelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[OpenRouter /api/ai/chat Exception]:', errorMsg);
    return NextResponse.json(
      { success: false, error: 'Server network failure processing OpenRouter AI chat request.' },
      { status: 500 }
    );
  }
}
