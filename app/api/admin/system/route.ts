import { NextResponse } from 'next/server';
import { getSystemMetrics, updateSystemMetrics } from '@/lib/platformMonitor';
import { getRecentErrorLogs, logSystemError } from '@/lib/errorLogger';
import { createSystemBackup, getSystemBackups, restoreSystemBackup } from '@/lib/backupEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const metrics = await getSystemMetrics();
    const errors = await getRecentErrorLogs(15);
    const backups = await getSystemBackups();

    return NextResponse.json({
      success: true,
      metrics,
      errors,
      backups,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name, backupId } = body;

    if (action === 'backup') {
      const snapshot = await createSystemBackup(name || undefined, 'Manual');
      return NextResponse.json({
        success: true,
        message: `System backup "${snapshot.name}" archived successfully`,
        backup: snapshot,
      });
    }

    if (action === 'restore') {
      if (!backupId) {
        return NextResponse.json({ success: false, error: 'Backup ID required for restore' }, { status: 400 });
      }
      const restored = await restoreSystemBackup(backupId);
      return NextResponse.json({
        success: restored,
        message: restored ? 'System settings restored from backup snapshot' : 'Failed to restore snapshot',
      });
    }

    if (action === 'log_error') {
      const errorItem = await logSystemError(
        body.source || 'Backend API',
        body.message || 'System diagnostic error',
        body.severity || 'medium',
        body.route || '/admin'
      );
      return NextResponse.json({ success: true, errorItem });
    }

    // Refresh metrics trigger
    const updatedMetrics = await updateSystemMetrics({
      lastHealthCheck: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'System health check metrics updated',
      metrics: updatedMetrics,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
