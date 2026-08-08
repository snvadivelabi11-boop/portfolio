import { getSystemPrompt } from '@/lib/systemPrompt';

export const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.5-flash';
export const FALLBACK_OPENROUTER_MODEL = 'google/gemini-2.0-flash-exp';

export interface ChatMessagePayload {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  success: boolean;
  reply?: string;
  error?: string;
  modelUsed?: string;
  statusCode?: number;
}

export async function callOpenRouterAI(
  userPrompt: string,
  history: ChatMessagePayload[] = []
): Promise<OpenRouterResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      error: 'OpenRouter API key is not configured on the server. Please check your environment variables.',
      statusCode: 500,
    };
  }

  const systemInstruction = getSystemPrompt();

  // Build full message list
  const messages: ChatMessagePayload[] = [
    { role: 'system', content: systemInstruction },
  ];

  // Append history (excluding old system messages)
  for (const h of history) {
    if (h.role !== 'system' && h.content) {
      messages.push({
        role: h.role,
        content: h.content,
      });
    }
  }

  // Ensure latest user prompt is appended
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userPrompt) {
    messages.push({ role: 'user', content: userPrompt });
  }

  // Attempt 1: Default Model (google/gemini-2.5-flash)
  const primaryResult = await executeOpenRouterRequest(apiKey, DEFAULT_OPENROUTER_MODEL, messages);
  if (primaryResult.success) {
    return primaryResult;
  }

  console.warn(
    `[OpenRouter AI] Primary model (${DEFAULT_OPENROUTER_MODEL}) failed: ${primaryResult.error}. Switching to fallback model (${FALLBACK_OPENROUTER_MODEL})...`
  );

  // Attempt 2: Fallback Model (google/gemini-2.0-flash-exp)
  const fallbackResult = await executeOpenRouterRequest(apiKey, FALLBACK_OPENROUTER_MODEL, messages);
  if (fallbackResult.success) {
    return fallbackResult;
  }

  return {
    success: false,
    error:
      fallbackResult.error ||
      primaryResult.error ||
      'AI model service is currently unavailable. Please try again in a few moments.',
    statusCode: fallbackResult.statusCode || primaryResult.statusCode || 500,
  };
}

async function executeOpenRouterRequest(
  apiKey: string,
  model: string,
  messages: ChatMessagePayload[]
): Promise<OpenRouterResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abishektech.online';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': 'Abishek Portfolio',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1600,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      return {
        success: false,
        error: 'Invalid OpenRouter API Key. Please verify your environment settings.',
        statusCode: 401,
      };
    }

    if (response.status === 429) {
      return {
        success: false,
        error: 'AI request limit reached. Please wait a moment before asking another question.',
        statusCode: 429,
      };
    }

    if (response.status === 404 || response.status === 503 || response.status === 502) {
      return {
        success: false,
        error: `AI Model ${model} is temporarily unavailable.`,
        statusCode: response.status,
      };
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        success: false,
        error: `OpenRouter API HTTP ${response.status}: ${errorText.slice(0, 120)}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply || reply.trim() === '') {
      return {
        success: false,
        error: 'Received empty answer from AI assistant.',
        statusCode: 500,
      };
    }

    return {
      success: true,
      reply: reply.trim(),
      modelUsed: model,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        error: 'OpenRouter AI connection timed out after 18 seconds. Please check your internet connection.',
        statusCode: 408,
      };
    }
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Network failure connecting to OpenRouter AI: ${msg}`,
      statusCode: 500,
    };
  }
}
