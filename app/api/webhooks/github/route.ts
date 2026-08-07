import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const event = request.headers.get('x-github-event') || 'push';

    console.log(`[GitHub Webhook] Received ${event} event from repository: ${payload.repository?.full_name || 'unknown'}`);

    if (event === 'push' || payload.commits) {
      const headCommit = payload.head_commit || (payload.commits && payload.commits[0]);
      const telemetry = {
        repoName: payload.repository?.name || 'snvadivelabi11-boop',
        repoUrl: payload.repository?.html_url || 'https://github.com/snvadivelabi11-boop',
        latestCommitMsg: headCommit?.message || 'Updated codebase & synced telemetry',
        latestCommitHash: headCommit?.id ? headCommit.id.substring(0, 7) : 'head',
        author: headCommit?.author?.name || payload.pusher?.name || 'Abishek',
        pushedAt: new Date().toISOString(),
        branch: payload.ref?.replace('refs/heads/', '') || 'main',
        totalCommitsCount: payload.commits?.length || 1,
        event: 'push',
      };

      if (db) {
        try {
          await setDoc(doc(db, 'github_telemetry', 'latest'), telemetry, { merge: true });
          await addDoc(collection(db, 'github_history'), telemetry);
          console.log(`[GitHub Webhook] Saved live push telemetry to Firestore github_telemetry/latest.`);
        } catch (err) {
          console.error('[GitHub Webhook Firestore Error]:', err);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'GitHub webhook push event processed and telemetry synced live to Firestore',
        telemetry,
      });
    }

    return NextResponse.json({ success: true, message: `Event ${event} acknowledged` });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[GitHub Webhook Error]:', errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
