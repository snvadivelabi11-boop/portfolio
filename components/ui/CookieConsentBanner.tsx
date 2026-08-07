'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

const CONSENT_COOKIE_KEY = 'abishek_cookie_consent_accepted';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_COOKIE_KEY, 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 z-50 max-w-md p-4 rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-white/80"
        >
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1">
            <h5 className="font-bold text-white text-xs mb-0.5">Privacy & Analytics</h5>
            <p className="text-[11px] text-white/60 leading-relaxed">
              We use anonymous visitor identifiers for performance analytics and session preferences. No personal passwords or sensitive data are stored.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-[11px] hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
            >
              Accept
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
