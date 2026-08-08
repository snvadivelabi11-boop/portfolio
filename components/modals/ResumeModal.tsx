'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, X, CheckCircle2, Briefcase, GraduationCap, Code2, MapPin, Mail, Phone } from 'lucide-react';
import { useLiveAbout, useLiveProfile, useLiveSkills, useLiveExperience, useLiveEducation, useLiveCertificates, useLiveSettings, useLiveContact } from '@/hooks/useFirestoreCMS';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { about } = useLiveAbout();
  const { profile } = useLiveProfile();
  const { skills } = useLiveSkills();
  const { experiences } = useLiveExperience();
  const { education } = useLiveEducation();
  const { certificates } = useLiveCertificates();
  const { settings } = useLiveSettings();
  const { contact } = useLiveContact();
  const liveResumeUrl = about.resumeUrl || profile.resumeUrl || '';

  const activeName = settings?.personal?.name || profile.fullName || 'Abishek';
  const activeTitle = settings?.personal?.title || profile.jobTitle || about.whoAreYou || '';
  const activeLocation = settings?.personal?.location || profile.location || contact.location || '';
  const activeEmail = settings?.personal?.email || profile.email || contact.email || '';
  const activePhone = settings?.personal?.phone || profile.phone || contact.phone || '';

  // Build skill names from live Firestore data
  const skillNames = skills.length > 0
    ? skills.map((s) => s.name)
    : [];

  const handleDownload = () => {
    // If a resume PDF URL exists, open it directly
    if (liveResumeUrl && (liveResumeUrl.startsWith('http') || liveResumeUrl.startsWith('/'))) {
      window.open(liveResumeUrl, '_blank');
      return;
    }

    // Dynamic fallback: generate text resume from live Firebase data
    const expLines = experiences.map((exp) => {
      const years = exp.startYear && exp.endYear ? `(${exp.startYear} - ${exp.endYear})` : '';
      return `${exp.role} — ${exp.company} ${years}\n${exp.description || ''}`;
    }).join('\n\n');

    const eduLines = education.map((edu) => {
      const years = edu.startYear && edu.endYear ? `(${edu.startYear} - ${edu.endYear})` : '';
      return `${edu.degree} — ${edu.institution || ''} ${years}`;
    }).join('\n');

    const awardLines = certificates.map((cert) => {
      const year = cert.year || cert.date || '';
      return `${cert.title} — ${cert.organization || ''} ${year ? `(${year})` : ''}`;
    }).join('\n');

    const content = `${activeName} — ${activeTitle}
Location: ${activeLocation}
Phone: ${activePhone} | Email: ${activeEmail}

SUMMARY
${about.bio || about.tellAboutYourself || ''}

TECHNOLOGIES
${about.technologies || skillNames.join(', ')}

EXPERIENCE
${expLines || 'No experience records added yet.'}

EDUCATION
${eduLines || 'No education records added yet.'}

HONORS & AWARDS
${awardLines || 'No awards added yet.'}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeName.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl p-5 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeName} — Resume Summary</h3>
                  <p className="text-xs text-violet-300">{activeTitle}</p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold flex items-center gap-2 hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20"
              >
                <Download size={14} /> Download Resume
              </button>
            </div>

            <div className="space-y-6 text-xs text-white/70">
              {/* Header Info */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-wrap justify-between gap-2">
                {activeLocation && (
                  <div className="flex items-center gap-1.5"><MapPin size={13} className="text-violet-400" /> {activeLocation}</div>
                )}
                {activeEmail && (
                  <div className="flex items-center gap-1.5"><Mail size={13} className="text-violet-400" /> {activeEmail}</div>
                )}
                {activePhone && (
                  <div className="flex items-center gap-1.5"><Phone size={13} className="text-violet-400" /> {activePhone}</div>
                )}
              </div>

              {/* Skills Highlights — Dynamic from Firestore */}
              {skillNames.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-white mb-2 flex items-center gap-1.5">
                    <Code2 size={14} className="text-violet-400" /> Technical Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skillNames.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience — Dynamic from Firestore */}
              {experiences.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-white mb-2 flex items-center gap-1.5">
                    <Briefcase size={14} className="text-fuchsia-400" /> Work Experience
                  </h4>
                  <div className="space-y-3">
                    {experiences.map((exp) => {
                      const displayYears = exp.startYear && exp.endYear
                        ? `${exp.startYear} - ${exp.endYear}`
                        : exp.startYear || exp.endYear || '';

                      return (
                        <div key={exp.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="font-bold text-white">{exp.role}</div>
                          <div className="text-violet-300 mb-1">{exp.company} {displayYears ? `(${displayYears})` : ''}</div>
                          {exp.description && <p className="text-white/60 leading-relaxed">{exp.description}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Education — Dynamic from Firestore */}
              {education.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-white mb-2 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-indigo-400" /> Education
                  </h4>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    {education.map((edu) => {
                      const displayYears = edu.startYear && edu.endYear
                        ? `(${edu.startYear} - ${edu.endYear})`
                        : '';

                      return (
                        <div key={edu.id} className="font-bold text-white">
                          {edu.degree} {displayYears}
                          {edu.institution && <span className="block text-white/50 font-normal text-[11px]">{edu.institution}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Awards — Dynamic from Firestore */}
              {certificates.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-amber-400" /> Honors &amp; Awards
                  </h4>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                    {certificates.map((cert) => {
                      const year = cert.year || cert.date || '';
                      return (
                        <div key={cert.id} className="text-amber-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> {cert.title} {year ? `(${year})` : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
