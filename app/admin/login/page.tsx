'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { loginAdminWithFirebase, subscribeAdminAuthState } from '@/lib/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Safety fallback timer to guarantee form display within 300ms even on slow auth initialization
    const fallbackTimer = setTimeout(() => {
      setAuthInitialized(true);
    }, 300);

    const unsub = subscribeAdminAuthState((state) => {
      if (!state.loading) {
        clearTimeout(fallbackTimer);
        setAuthInitialized(true);
        if (state.isAuthenticated) {
          router.replace('/admin');
        }
      }
    });

    return () => {
      clearTimeout(fallbackTimer);
      unsub();
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your admin email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await loginAdminWithFirebase(email.trim(), password);
    if (res.success) {
      router.replace('/admin');
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
      setLoading(false);
    }
  };

  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center space-y-3">
        <RefreshCw size={28} className="animate-spin text-violet-400" />
        <p className="text-xs text-white/50 font-mono">Initializing Firebase Authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/20 mb-3">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Firebase Admin Auth
            </span>
          </h1>
          <p className="text-xs text-white/50">Enter authorized Firebase credentials to access Enterprise Control Panel.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-2">
            <XCircle size={16} /> {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="p-8 rounded-3xl border border-white/[0.08] bg-neutral-950/80 backdrop-blur-2xl space-y-5 shadow-2xl"
        >
          {/* Dummy hidden inputs to prevent Chrome autofill */}
          <input type="text" name="prevent_autofill_email" id="prevent_autofill_email" defaultValue="" className="hidden" tabIndex={-1} readOnly />
          <input type="password" name="prevent_autofill_pass" id="prevent_autofill_pass" defaultValue="" className="hidden" tabIndex={-1} readOnly />

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5 flex items-center gap-1.5">
              <Mail size={14} className="text-violet-400" /> Admin Email Address
            </label>
            <input
              type="email"
              name="admin_email_input"
              id="admin_email_input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full p-3 rounded-xl bg-neutral-900/90 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
              suppressHydrationWarning
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5 flex items-center gap-1.5">
              <Lock size={14} className="text-violet-400" /> Firebase Account Password
            </label>
            <input
              type="password"
              name="admin_password_input"
              id="admin_password_input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full p-3 rounded-xl bg-neutral-900/90 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            suppressHydrationWarning
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Verifying Firebase Token...
              </>
            ) : (
              <>
                Authenticate &amp; Launch SaaS Admin <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-xs text-white/40 hover:text-white transition-colors">
            ← Return to Public Portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
