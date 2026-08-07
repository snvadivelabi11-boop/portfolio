'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Plus, X, Send, CheckCircle2 } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { fadeInUp } from '@/utils/animations';
import { Review } from '@/types';

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (isMounted && data.success && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      } catch {
        // Fallback
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', role: '', company: '', content: '', rating: 5 });
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsModalOpen(false);
        }, 3000);
      }
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="reviews" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading title="Client Reviews" subtitle="Real Feedback System" />

        {/* CTA to Leave a Review */}
        <div className="flex justify-center mb-12">
          <button
            suppressHydrationWarning
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:scale-105 transition-all shadow-lg shadow-violet-500/10"
          >
            <Plus size={16} /> Submit Your Review
          </button>
        </div>

        {/* Reviews Carousel */}
        {reviews.length > 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl p-8 md:p-12">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-violet-500/10 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: reviews[current]?.rating || 5 }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 italic">
                    &ldquo;{reviews[current]?.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/30">
                      {reviews[current]?.name?.[0] || 'V'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{reviews[current]?.name}</div>
                      <div className="text-xs text-violet-300/80 font-medium">
                        {reviews[current]?.role} {reviews[current]?.company ? `at ${reviews[current]?.company}` : ''}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {reviews.length > 1 && (
                <div className="flex gap-3 mt-8 justify-end">
                  <button
                    onClick={prev}
                    className="p-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white hover:border-violet-500/30 transition-all"
                    aria-label="Previous review"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="p-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white hover:border-violet-500/30 transition-all"
                    aria-label="Next review"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {reviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'w-6 bg-violet-500' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-white/40 text-sm">
            No Data Available. Be the first to submit a review!
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-white mb-2">Submit Your Review</h3>
              <p className="text-xs text-white/50 mb-6">
                Share your experience working with Abishek. Your review will be reviewed by admin before publishing.
              </p>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Review Submitted!</h4>
                  <p className="text-xs text-white/60">
                    Thank you! Your feedback has been sent for admin moderation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 mb-1.5 font-medium">Role / Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Founder / CTO"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1.5 font-medium">Company (Optional)</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Acme Corp"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium">Rating (1 to 5 Stars)</label>
                    <div className="flex gap-2 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={22}
                            className={
                              star <= formData.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-white/20'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1.5 font-medium">Review Content *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your review here..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 resize-none"
                    />
                  </div>

                  <AnimatedButton variant="primary" className="w-full justify-center">
                    {isLoading ? 'Submitting...' : 'Submit Review'} <Send size={14} />
                  </AnimatedButton>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
