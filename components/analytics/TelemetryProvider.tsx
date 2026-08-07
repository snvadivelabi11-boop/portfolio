'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisitorSession } from '@/lib/telemetry';

export default function TelemetryProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackVisitorSession(pathname);
    }
  }, [pathname]);

  return null;
}
