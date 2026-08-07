'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          referer: document.referrer,
        }),
      }).catch(() => {
        // Silent catch for privacy blockouts
      });
    } catch {
      // Ignore
    }
  }, []);

  return null;
}
