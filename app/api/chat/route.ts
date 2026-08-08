import { POST as openRouterHandler } from '@/app/api/ai/chat/route';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  return openRouterHandler(request);
}
