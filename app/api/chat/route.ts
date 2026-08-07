import { POST as openRouterHandler } from '@/app/api/ai/chat/route';

export async function POST(request: Request) {
  return openRouterHandler(request);
}
