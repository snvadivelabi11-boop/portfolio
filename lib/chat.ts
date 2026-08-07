import { sanitizeInput } from '@/lib/store';

export interface ChatMemoryMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export function sanitizeUserPrompt(rawInput: string): string {
  // Prevent common prompt injection vectors
  let cleaned = rawInput.trim();
  cleaned = sanitizeInput(cleaned);
  // Cap length to prevent payload flooding
  if (cleaned.length > 2000) {
    cleaned = cleaned.substring(0, 2000);
  }
  return cleaned;
}

export function formatChatHistoryForGemini(
  messages: ChatMemoryMessage[]
): { role: 'user' | 'model'; parts: { text: string }[] }[] {
  return messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));
}
