import { GoogleGenAI } from '@google/genai';
import { getSystemPrompt } from '@/lib/systemPrompt';
import { formatChatHistoryForGemini, ChatMemoryMessage } from '@/lib/chat';
import { logAiInteraction } from '@/lib/logger';

// List of production-ready supported models in priority fallback order
export const SUPPORTED_GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

export interface GeminiResponseResult {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
  modelUsed?: string;
  responseTimeMs?: number;
}

export async function generateGeminiChatResponse(
  userPrompt: string,
  history: ChatMemoryMessage[] = []
): Promise<GeminiResponseResult> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const startTime = Date.now();

  // 1. Validate API Key Presence
  if (!apiKey.trim()) {
    console.error('[Google Gen AI SDK Error]: GEMINI_API_KEY is unconfigured in process.env.');
    logAiInteraction({
      timestamp: new Date().toISOString(),
      prompt: userPrompt,
      statusCode: 401,
      error: 'Gemini API Key Missing',
    });
    return {
      success: false,
      error: 'Gemini API Key Missing',
      statusCode: 401,
    };
  }

  // Initialize official @google/genai GoogleGenAI SDK Client
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = getSystemPrompt();

  let lastError: Error | unknown = null;

  // 2. Iterate across supported models with automated fallback & retry
  for (const modelName of SUPPORTED_GEMINI_MODELS) {
    let attempts = 0;
    const maxAttempts = 2; // Auto-retry temporary errors once

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const formattedHistory = formatChatHistoryForGemini(history);

        const contents = [
          ...formattedHistory.map((h) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.parts[0].text }],
          })),
          { role: 'user', parts: [{ text: userPrompt }] },
        ];

        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const responseText = response.text || '';

        if (!responseText.trim()) {
          throw new Error(`Empty response text returned from model ${modelName}`);
        }

        const responseTimeMs = Date.now() - startTime;

        logAiInteraction({
          timestamp: new Date().toISOString(),
          prompt: userPrompt,
          modelUsed: modelName,
          responseTimeMs,
        });

        return {
          success: true,
          message: responseText,
          modelUsed: modelName,
          responseTimeMs,
        };
      } catch (err: unknown) {
        lastError = err;
        const errStr = String(err);

        console.warn(
          `[Google Gen AI SDK]: Model '${modelName}' attempt ${attempts}/${maxAttempts} failed: ${errStr}`
        );

        // Handle Free Tier / Daily Quota Exceeded (429 / RESOURCE_EXHAUSTED) gracefully
        if (
          errStr.includes('429') ||
          errStr.includes('RESOURCE_EXHAUSTED') ||
          errStr.includes('Quota exceeded')
        ) {
          console.error('[Google Gen AI SDK Error]: Gemini Free API Quota Limit Reached (429).');
          logAiInteraction({
            timestamp: new Date().toISOString(),
            prompt: userPrompt,
            statusCode: 429,
            error: 'Daily AI limit reached. Please try again later.',
          });
          return {
            success: false,
            error: 'Daily AI limit reached. Please try again later.',
            statusCode: 429,
          };
        }

        // Handle Invalid Key
        if (errStr.includes('401') || errStr.includes('403') || errStr.includes('API_KEY_INVALID')) {
          console.error('[Google Gen AI SDK Error]: Invalid GEMINI_API_KEY detected.');
          logAiInteraction({
            timestamp: new Date().toISOString(),
            prompt: userPrompt,
            statusCode: 403,
            error: 'Invalid Gemini API Key',
          });
          return {
            success: false,
            error: 'Invalid Gemini API Key',
            statusCode: 403,
          };
        }

        // Retry brief delay
        if (attempts < maxAttempts) {
          await new Promise((res) => setTimeout(res, 400));
        }
      }
    }
  }

  // 3. Fallback error formatting if all models fail
  const fatalErrStr = String(lastError);
  console.error('[Google Gen AI SDK Traceback]: All fallback models failed.', lastError);

  let userFriendlyError = 'Gemini API Error';
  let statusCode = 500;

  if (fatalErrStr.includes('404') || fatalErrStr.includes('not found') || fatalErrStr.includes('MODEL_NOT_FOUND')) {
    userFriendlyError = 'Invalid Gemini Model';
    statusCode = 404;
  } else if (fatalErrStr.includes('fetch failed') || fatalErrStr.includes('ENOTFOUND') || fatalErrStr.includes('Network')) {
    userFriendlyError = 'Network Error';
    statusCode = 503;
  }

  logAiInteraction({
    timestamp: new Date().toISOString(),
    prompt: userPrompt,
    statusCode,
    error: userFriendlyError,
  });

  return {
    success: false,
    error: userFriendlyError,
    statusCode,
  };
}
