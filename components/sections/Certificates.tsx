'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Download, ExternalLink, FileText, Award, X, ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { useLiveCertificationsCollection } from '@/hooks/useFirestoreCMS';
import { CertificationRecord } from '@/lib/firestoreCMS';

export default function Certificates() {
  const { certifications } = useLiveCertificationsCollection();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Filter visible certificates
  const visibleCertificates = certifications.filter((c) => c.visible !== false);

  const isPdf = (url?: string, fileType?: string) => {
    if (fileType === 'pdf' || fileType === 'application/pdf') return true;
    if (!url) return false;
    return url.toLowerCase().includes('.pdf') || url.includes('application/pdf');
  };

  const handleDownload = (cert: CertificationRecord) => {
    const targetUrl = cert.certificateImage || cert.certificatePdf || cert.credentialUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
  };

  const handleOpenLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setZoomScale(1);
  };

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomScale(1);

  return (
    <section id="certificates" className="relative py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Verified Certifications &amp; Credentials"
          subtitle="Professional Industry Achievements"
        />

        {visibleCertificates.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-neutral-900/40">
            <ShieldCheck className="w-12 h-12 text-emerald-400/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Certifications Published</h3>
            <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
              Add your professional credentials and technical certificates via Admin CMS.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleCertificates.map((cert) => {
              const certTitle = cert.name || cert.title || 'Professional Certification';
              const certIssuer = cert.issuer || 'Issuing Organization';
              const certDate = cert.issueDate || cert.issueYear || '';
              const certUrl = cert.certificateImage || cert.certificatePdf || cert.credentialUrl || '';
              const isPdfFile = isPdf(certUrl, cert.fileType);
              const imageUrl = cert.certificateImage || (!isPdfFile ? certUrl : '');

              return (
                <motion.div key={cert.id || certTitle} variants={fadeInUp}>
                  <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between h-full">
                    <div>
                      {/* Top Preview Block */}
                      {imageUrl ? (
                        <div
                          className="relative w-full h-52 rounded-xl bg-white/95 border border-white/20 p-3 mb-5 flex items-center justify-center overflow-hidden cursor-pointer group/img shadow-inner"
                          onClick={() => handleOpenLightbox(imageUrl)}
                          title="Click to view full-screen image with zoom"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={certTitle}
                            className="max-w-full h-auto max-h-full object-contain rounded transition-transform duration-500 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-full bg-emerald-600/90 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg">
                              <ZoomIn size={14} /> Full Screen Preview
                            </span>
                          </div>
                        </div>
                      ) : isPdfFile ? (
                        <div
                          className="w-full h-52 rounded-xl bg-emerald-950/30 border border-emerald-500/20 p-6 mb-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/40 transition-colors"
                          onClick={() => window.open(certUrl, '_blank')}
                        >
                          <FileText size={48} className="text-emerald-400 mb-2 animate-bounce" />
                          <span className="text-xs font-bold text-white truncate max-w-[90%]">{certTitle}.pdf</span>
                          <span className="text-[10px] text-emerald-400 font-mono mt-1">Verified PDF Document</span>
                        </div>
                      ) : (
                        <div className="w-full h-52 rounded-xl bg-neutral-900/60 border border-white/10 p-6 mb-5 flex flex-col items-center justify-center text-center">
                          <ImageIcon size={40} className="text-white/20 mb-2" />
                          <span className="text-xs font-bold text-white/50">No Certificate Uploaded</span>
                          <span className="text-[10px] text-white/30 mt-0.5">Upload image via Admin CMS</span>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                            {certTitle}
                          </h4>
                          {certDate && (
                            <span className="shrink-0 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                              {certDate}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                          <Award size={13} className="shrink-0" /> {certIssuer}
                        </p>

                        {cert.category && (
                          <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-white/50">
                            {cert.category}
                          </span>
                        )}

                        {cert.description && (
                          <p className="text-xs text-white/60 leading-relaxed pt-1 line-clamp-3">
                            {cert.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/[0.06] mt-5">
                      {imageUrl && (
                        <button
                          onClick={() => handleOpenLightbox(imageUrl)}
                          className="flex-1 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ZoomIn size={13} /> Preview
                        </button>
                      )}
                      {isPdfFile && certUrl && (
                        <button
                          onClick={() => window.open(certUrl, '_blank')}
                          className="flex-1 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ExternalLink size={13} /> View PDF
                        </button>
                      )}
                      {certUrl && (
                        <button
                          onClick={() => handleDownload(cert)}
                          className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                          title="Download Certificate File"
                        >
                          <Download size={13} /> Download
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Image Lightbox Modal with Interactive Zoom */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Toolbar */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-neutral-900/90 border border-white/20 backdrop-blur-xl p-2 rounded-2xl shadow-2xl">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Zoom In (+)"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Reset Zoom"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <div className="w-px h-6 bg-white/20 mx-1" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                    title="Close Preview (ESC)"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Zoomable Image Container */}
                <div className="overflow-auto max-w-full max-h-[85vh] p-4 flex items-center justify-center">
                  <motion.img
                    animate={{ scale: zoomScale }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    src={selectedImage}
                    alt="Certificate Lightbox Fullscreen Preview"
                    className="max-w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20 bg-white/95"
                  />
                </div>

                {/* Zoom Status Indicator */}
                <div className="mt-3 text-xs font-mono text-white/50 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  Zoom: {Math.round(zoomScale * 100)}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
