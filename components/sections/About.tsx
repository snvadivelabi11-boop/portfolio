'use client';

import { motion } from 'framer-motion';
import { Code2, Briefcase, Award, Users, CheckCircle2, Terminal, Lightbulb, Compass, Zap } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { useLiveAbout, useLiveSettings, useLiveEducation, useLiveCertificates, useLiveProjects, useLiveExperience } from '@/hooks/useFirestoreCMS';

export default function About() {
  const { about } = useLiveAbout();
  const { settings } = useLiveSettings();
  const { education } = useLiveEducation();
  const { certificates: awards } = useLiveCertificates();
  const { projects } = useLiveProjects();
  const { experiences } = useLiveExperience();

  const activeName = settings?.personal?.name || 'Abishek';
  const activeTitle = settings?.personal?.title || 'Full Stack Developer & AI Creator';
  const activeLocation = settings?.personal?.location || 'Tiruvannamalai, Tamil Nadu, India';

  // Calculate Years of Experience automatically from earliest startYear in experience collection
  const currentYear = new Date().getFullYear();
  const startYears = experiences
    .map((e) => parseInt(e.startYear || '', 10))
    .filter((yr) => !isNaN(yr) && yr > 1990 && yr <= currentYear);

  const minStartYear = startYears.length > 0 ? Math.min(...startYears) : null;
  const calculatedYears = minStartYear
    ? Math.max(1, currentYear - minStartYear)
    : (about.yearsExperience || experiences.length || 1);

  // Dynamic live collection counters
  const totalProjectsCount = projects.length;
  const totalAwardsCount = awards.length;
  const totalClientsCount = about.clientsCount ? about.clientsCount : (totalProjectsCount > 0 ? Math.max(1, Math.ceil(totalProjectsCount * 0.7)) : 0);

  const stats = [
    {
      icon: Briefcase,
      value: `${calculatedYears} Year${calculatedYears > 1 ? 's' : ''}`,
      label: 'Dedicated Experience',
    },
    {
      icon: Code2,
      value: `${totalProjectsCount}+`,
      label: 'Completed Projects',
    },
    {
      icon: Users,
      value: `${totalClientsCount}`,
      label: 'Satisfied Clients',
    },
    {
      icon: Award,
      value: `${totalAwardsCount}`,
      label: 'Honors & Awards',
    },
  ];
  return (
    <section id="about" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading title="About Me" subtitle="Engineering & Vision" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Avatar / Profile Graphic Card */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-white/[0.08] bg-neutral-900/60 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-fuchsia-600/20 opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                  Full Stack &amp; AI
                </span>
                <span className="text-xs text-white/40 font-mono">{activeLocation}</span>
              </div>

              <div className="relative z-10 my-8 text-center">
                <div className="w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] lg:w-[170px] lg:h-[170px] mx-auto rounded-2xl bg-neutral-950/80 border-2 border-violet-500/40 shadow-[0_0_25px_rgba(168,85,247,0.35)] group-hover:shadow-[0_0_35px_rgba(168,85,247,0.55)] group-hover:border-violet-400/60 transition-all duration-500 overflow-hidden mb-4 flex items-center justify-center">
                  {about.profilePhoto && (about.profilePhoto.startsWith('http') || about.profilePhoto.startsWith('/')) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={about.profilePhoto}
                      alt={activeName}
                      width={170}
                      height={170}
                      className="w-full h-full object-cover object-center rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-5xl font-extrabold text-white bg-gradient-to-tr from-violet-600 to-fuchsia-600 w-full h-full flex items-center justify-center">
                      {activeName.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white">{activeName}</h3>
                <p className="text-sm text-violet-300 font-medium">{activeTitle}</p>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-2 pt-4 border-t border-white/[0.08] text-xs text-white/60">
                <div>
                  <span className="block text-white font-bold">{calculatedYears} Year{calculatedYears > 1 ? 's' : ''}</span>
                  <span>Experience</span>
                </div>
                <div>
                  <span className="block text-white font-bold">{totalProjectsCount}+ Projects</span>
                  <span>Delivered</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Narrative Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Architecting intelligent web products with
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {' '}modern precision
              </span>
            </h3>

            {/* Structured Content Grid */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <h4 className="text-base font-semibold text-violet-300 mb-2 flex items-center gap-2">
                  <Terminal size={18} className="text-violet-400" /> Who I Am
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">{about.whoIAm || about.bio}</p>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <h4 className="text-base font-semibold text-fuchsia-300 mb-2 flex items-center gap-2">
                  <Zap size={18} className="text-fuchsia-400" /> Technologies I Work With
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">{about.technologies || about.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                    <Compass size={16} className="text-indigo-400" /> My Vision
                  </h4>
                  <p className="text-white/50 text-xs leading-relaxed">{about.vision || ''}</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <h4 className="text-sm font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                    <Lightbulb size={16} className="text-emerald-400" /> My Learning Journey
                  </h4>
                  <p className="text-white/50 text-xs leading-relaxed">{about.currentlyLearning || about.learningJourney || ''}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-500/[0.03]">
                <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" /> Why Clients Work With Me
                </h4>
                <p className="text-white/70 text-sm leading-relaxed">{about.whyWorkWithMe || ''}</p>
              </div>

              {/* Live Education Timeline */}
              {education.length > 0 && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Terminal size={16} className="text-violet-400" /> Education &amp; Academic Background
                  </h4>
                  <div className="space-y-3 font-mono text-xs">
                    {education.map((edu) => (
                      <div key={edu.id || edu.degree} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white">{edu.degree}</span>
                          <span className="text-violet-400 text-[11px]">{edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.duration || ''}</span>
                        </div>
                        <p className="text-white/60 text-[11px] mt-0.5">{edu.institution} {edu.location ? `(${edu.location})` : ''}</p>
                        {edu.description && <p className="text-white/40 text-[10px] mt-1">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Certifications & Honors */}
              {awards.length > 0 && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Award size={16} className="text-fuchsia-400" /> Honors &amp; Verified Certifications
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    {awards.map((cert) => (
                      <div key={cert.id || cert.title} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <span className="font-bold text-white block">{cert.title}</span>
                        <span className="text-white/50 text-[11px] block">{cert.organization} {cert.year || cert.date ? `• ${cert.year || cert.date}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4"
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <motion.div key={label} variants={fadeInUp}>
                  <GlassCard className="text-center py-4 px-2" hover={false}>
                    <Icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white mb-0.5">{value}</div>
                    <div className="text-[11px] text-white/40">{label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
