'use client';

import { motion } from 'framer-motion';
import { Award, Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { useLiveExperience, useLiveEducation, useLiveCertificates } from '@/hooks/useFirestoreCMS';

export default function Experience() {
  const { experiences: liveExperiences } = useLiveExperience();
  const { education: liveEducation } = useLiveEducation();
  const { certificates: liveCertificates } = useLiveCertificates();

  const experiencesList = liveExperiences;
  const educationList = liveEducation;
  const awardsList = liveCertificates;

  return (
    <section id="experience" className="relative py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading title="Experience, Education &amp; Award" subtitle="Authentic Track Record" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Work Experience */}
          <div className="lg:col-span-6">
            <h3 className="text-xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Briefcase size={20} />
              </div>
              Work Experience
            </h3>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative border-l-2 border-violet-500/30 ml-2 sm:ml-4 pl-6 sm:pl-8 space-y-6 sm:space-y-8"
            >
              {experiencesList.length === 0 ? (
                <div className="text-xs text-white/40 italic py-6 border border-dashed border-white/10 rounded-2xl text-center">
                  No experience records added yet. Add via Admin CMS.
                </div>
              ) : (
                experiencesList.map((exp, idx) => {
                  const displayYears = exp.startYear && exp.endYear
                    ? `${exp.startYear} - ${exp.endYear}`
                    : exp.startYear || exp.endYear || exp.duration || '';

                  return (
                    <motion.div key={exp.id || idx} variants={fadeInUp} className="relative">
                      <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full bg-violet-500 border-4 border-neutral-950 shadow-lg shadow-violet-500/50" />

                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 hover:border-violet-500/30 transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                          {displayYears && (
                            <span className="text-xs text-violet-300 font-mono font-semibold px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center gap-1">
                              <Calendar size={12} /> {displayYears}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-violet-400 font-medium mb-4 flex items-center gap-1">
                          <MapPin size={13} /> {exp.company}
                        </p>

                        <p className="text-xs text-white/60 leading-relaxed mb-4">{exp.description}</p>

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-white/[0.04] text-white/60 border border-white/[0.06]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>

          {/* Education & Award */}
          <div className="lg:col-span-6 space-y-12">
            {/* Education */}
            <div>
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                  <GraduationCap size={20} />
                </div>
                Education
              </h3>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative border-l-2 border-fuchsia-500/30 ml-2 sm:ml-4 pl-6 sm:pl-8 space-y-6 sm:space-y-8"
              >
                {educationList.length === 0 ? (
                  <div className="text-xs text-white/40 italic py-6 border border-dashed border-white/10 rounded-2xl text-center">
                    No education records added yet. Add via Admin CMS.
                  </div>
                ) : (
                  educationList.map((edu, idx) => {
                    const displayEduYears = edu.startYear && edu.endYear
                      ? `${edu.startYear} - ${edu.endYear}`
                      : edu.startYear || edu.endYear || edu.duration || '';

                    return (
                      <motion.div key={edu.id || idx} variants={fadeInUp} className="relative">
                        <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full bg-fuchsia-500 border-4 border-neutral-950 shadow-lg shadow-fuchsia-500/50" />

                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 hover:border-fuchsia-500/30 transition-all">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                            {displayEduYears && (
                              <span className="text-xs text-fuchsia-300 font-mono font-semibold px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20">
                                {displayEduYears}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-fuchsia-400 font-medium mb-3">{edu.institution || (edu.college ? `${edu.college}` : 'Institution')}</p>
                          <p className="text-xs text-white/50 leading-relaxed">{edu.description}</p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </div>

            {/* Award */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award size={20} />
                </div>
                Honors &amp; Awards ({awardsList.length})
              </h3>

              <div className="space-y-4">
                {awardsList.length === 0 ? (
                  <div className="text-xs text-white/40 italic py-6 border border-dashed border-white/10 rounded-2xl text-center">
                    No awards recorded yet. Add via Admin CMS.
                  </div>
                ) : (
                  awardsList.map((award, idx) => {
                    const awardYear = award.year || award.date || '';

                    return (
                      <div
                        key={award.id || idx}
                        className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.03] backdrop-blur-xl p-6 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-base font-bold text-white">{award.title}</h4>
                            <p className="text-xs text-amber-300 font-medium mt-0.5">{award.organization}</p>
                          </div>
                          {awardYear && (
                            <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                              {awardYear}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed mt-2">{award.description}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
