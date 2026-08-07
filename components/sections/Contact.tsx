'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, GitBranch, Link as LinkIcon, CheckCircle2, MessageSquare } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedButton from '@/components/ui/AnimatedButton';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { useLiveSettings, useLiveContact, useLiveSocials } from '@/hooks/useFirestoreCMS';

export default function Contact() {
  const { settings } = useLiveSettings();
  const { contact } = useLiveContact();
  const { socials } = useLiveSocials();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const activeEmail = settings?.personal?.email || contact.email || 'SNVADIVEL11@gmail.com';
  const activePhone = settings?.personal?.phone || contact.phone || '9786801597';
  const activeLocation = settings?.personal?.location || contact.location || 'Tiruvannamalai, Tamil Nadu, India';
  const activeWhatsapp = settings?.socials?.whatsapp || contact.whatsapp || socials.whatsapp || 'https://wa.me/919786801597';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Validation failed');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error submitting contact request');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactItems = [
    { icon: Mail, label: 'Email', value: activeEmail, href: `mailto:${activeEmail}` },
    { icon: Phone, label: 'Phone', value: activePhone, href: `tel:${activePhone}` },
    { icon: MessageSquare, label: 'WhatsApp', value: '+91 9786801597', href: activeWhatsapp },
    { icon: MapPin, label: 'Location', value: activeLocation, href: '#contact' },
  ];

  return (
    <section id="contact" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading title="Get In Touch" subtitle="Let's Build Together" />

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Details Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-bold text-white mb-2">Direct Communication</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-4">
                Have a web application, full-stack architecture, or AI automation project in mind? Reach out directly via form, email, phone, or WhatsApp.
              </p>
            </motion.div>

            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <motion.div key={label} variants={fadeInUp}>
                <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="block group">
                  <GlassCard hover={true} className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 font-mono mb-0.5">{label}</div>
                        <div className="text-xs text-white font-medium group-hover:text-violet-300 transition-colors">
                          {value}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </a>
              </motion.div>
            ))}

            <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
              {[
                { name: 'GitHub', url: settings?.socials?.github || 'https://github.com/snvadivelabi11-boop', icon: GitBranch },
                { name: 'LinkedIn', url: settings?.socials?.linkedin || 'https://www.linkedin.com/in/abishek-v-a984a6382', icon: LinkIcon },
                { name: 'Instagram', url: settings?.socials?.instagram || 'https://www.instagram.com/abishek_creator_/', icon: InstagramIcon },
              ].map(({ name, url, icon: Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-300"
                  aria-label={name}
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl p-8 space-y-5">
              {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} /> Thank you! Your message has been sent directly to Abishek.
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                  {errorMessage || 'Failed to submit message. Please try again.'}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs text-white/60 mb-2 font-medium">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    suppressHydrationWarning
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs text-white/60 mb-2 font-medium">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    suppressHydrationWarning
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-xs text-white/60 mb-2 font-medium">Phone Number (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    suppressHydrationWarning
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs text-white/60 mb-2 font-medium">Subject *</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    suppressHydrationWarning
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                    placeholder="Project inquiry / Full stack development"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs text-white/60 mb-2 font-medium">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                  placeholder="Describe your project, timeline, or objectives..."
                />
              </div>

              <AnimatedButton variant="primary" className="w-full justify-center">
                {status === 'submitting' ? 'Sending Message...' : 'Send Message'} <Send size={16} />
              </AnimatedButton>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
