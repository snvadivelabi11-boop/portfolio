// Enterprise Logger Module for AI Telemetry & Diagnostics

export interface ChatLogEntry {
  timestamp: string;
  prompt: string;
  modelUsed?: string;
  responseTimeMs?: number;
  statusCode?: number;
  error?: string;
}

export function logAiInteraction(entry: ChatLogEntry): void {
  const time = new Date().toISOString();
  if (entry.error) {
    console.error(`[AI Logger - ERROR] [${time}] StatusCode: ${entry.statusCode || 500} | Prompt: "${entry.prompt.substring(0, 50)}..." | Error: ${entry.error}`);
  } else {
    console.log(`[AI Logger - SUCCESS] [${time}] Model: ${entry.modelUsed || 'default'} | Latency: ${entry.responseTimeMs}ms | Prompt: "${entry.prompt.substring(0, 50)}..."`);
  }
}
