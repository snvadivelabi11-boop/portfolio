'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Plus, X, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { fadeInUp } from '@/utils/animations';
import { Review } from '@/types';

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let isMounted = true;

    import('@/lib/store').then(({ subscribeApprovedReviews, getApprovedReviews }) => {
      if (!isMounted) return;

      // Subscribe to Realtime Firestore updates
      unsub = subscribeApprovedReviews((list) => {
        if (isMounted) {
          setReviews(list);
          setLoading(false);
        }
      });

      // Initial fetch fallback
      getApprovedReviews().then((list) => {
        if (isMounted && list.length > 0) {
          setReviews((prev) => (prev.length === 0 ? list : prev));
          setLoading(false);
        } else if (isMounted) {
          setLoading(false);
        }
      });
    });

    return () => {
      isMounted = false;
      if (unsub) unsub();
    };
  }, []);

  // Limit to 5 reviews initially
  const visibleReviews = showAll ? reviews : reviews.slice(0, 5);

  const safeCurrentIndex = visibleReviews.length > 0 ? (current >= visibleReviews.length ? 0 : current) : 0;

  const next = () => {
    if (visibleReviews.length === 0) return;
    setCurrent((prev) => (prev + 1) % visibleReviews.length);
  };

  const prev = () => {
    if (visibleReviews.length === 0) return;
    setCurrent((prev) => (prev - 1 + visibleReviews.length) % visibleReviews.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.content.trim()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setSubmitError('');

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
        }, 2500);
      } else {
        setSubmitError(data.message || 'Failed to submit review to Firebase.');
      }
    } catch {
      setSubmitError('Firebase connection error. Please try again.');
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
            onClick={() => {
              setSubmitError('');
              setSubmitSuccess(false);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:scale-105 transition-all shadow-lg shadow-violet-500/10"
          >
            <Plus size={16} /> Submit Your Review
          </button>
        </div>

        {/* Reviews Render */}
        {loading ? (
          <div className="text-center py-12 text-white/40 text-sm animate-pulse">
            Loading reviews from Firebase...
          </div>
        ) : visibleReviews.length > 0 ? (
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
                  key={safeCurrentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1">
                      {Array.from({ length: visibleReviews[safeCurrentIndex]?.rating || 5 }).map((_, i) => (
                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {visibleReviews[safeCurrentIndex]?.createdAt && (
                      <span className="text-[11px] text-white/40 font-mono">
                        {new Date(visibleReviews[safeCurrentIndex].createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 italic">
                    &ldquo;{visibleReviews[safeCurrentIndex]?.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/30">
                      {visibleReviews[safeCurrentIndex]?.name?.[0] || 'V'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{visibleReviews[safeCurrentIndex]?.name}</div>
                      <div className="text-xs text-violet-300/80 font-medium">
                        {visibleReviews[safeCurrentIndex]?.role}{' '}
                        {visibleReviews[safeCurrentIndex]?.company ? `at ${visibleReviews[safeCurrentIndex]?.company}` : ''}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {visibleReviews.length > 1 && (
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

            {/* Pagination Dots */}
            {visibleReviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {visibleReviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === safeCurrentIndex ? 'w-6 bg-violet-500' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* More Reviews Button */}
            {reviews.length > 5 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/[0.04] hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 text-white/80 hover:text-white transition-all shadow-md"
                >
                  {showAll ? (
                    <>
                      Show Less Reviews <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      More Reviews ({reviews.length - 5} More) <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-white/40 text-sm">
            No reviews yet. Be the first to submit a review!
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
                Share your experience working with Abishek. Your review will be saved live to Firebase.
              </p>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 size={48} className="text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold text-white">Review Submitted!</h4>
                  <p className="text-xs text-white/60">
                    Thank you! Your feedback has been saved live to Firebase.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {submitError}
                    </div>
                  )}

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

                  <AnimatedButton
                    variant="primary"
                    className="w-full justify-center disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting to Firebase...' : 'Submit Review'} <Send size={14} />
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
