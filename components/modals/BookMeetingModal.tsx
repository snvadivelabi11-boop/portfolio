'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, Send, CheckCircle2, Video, Globe, Phone, Building, User, Mail } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface BookMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookMeetingModal({ isOpen, onClose }: BookMeetingModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00 AM',
    name: '',
    email: '',
    phone: '',
    purpose: 'Full Stack Web Architecture Consultation',
    company: '',
    timezone: 'Asia/Kolkata (IST)',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
        }, 3500);
      } else {
        setErrorMessage(data.message || 'Validation failed');
      }
    } catch {
      setErrorMessage('Network error submitting booking request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Book a Strategy Call</h3>
                <p className="text-xs text-white/50">30-min Consultation with Abishek</p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Booking Request Submitted!</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Your request is stored as <span className="text-amber-400 font-bold">Pending</span>. Upon admin approval, a Google Meet link and .ics calendar invite will be sent to <span className="text-violet-300 font-mono">{formData.email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium flex items-center gap-1">
                      <User size={12} /> Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium flex items-center gap-1">
                      <Mail size={12} /> Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium flex items-center gap-1">
                      <Phone size={12} /> Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium flex items-center gap-1">
                      <Building size={12} /> Company (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium flex items-center gap-1">
                      <Calendar size={12} /> Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium flex items-center gap-1">
                      <Clock size={12} /> Preferred Time *
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="09:00 PM">09:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 mb-1.5 font-medium flex items-center gap-1">
                    <Globe size={12} /> Timezone *
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">Meeting Purpose / Project Focus *</label>
                  <input
                    type="text"
                    name="purpose"
                    required
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="e.g. Next.js App Architecture & AI Pipeline"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] flex items-center gap-2">
                  <Video size={14} /> Google Meet invite &amp; .ics calendar payload generated automatically upon approval.
                </div>

                <AnimatedButton variant="primary" className="w-full justify-center">
                  {isSubmitting ? 'Submitting Request...' : 'Submit Booking Request'} <Send size={14} />
                </AnimatedButton>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
