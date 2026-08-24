import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Compass,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ABOUT_CONTENT } from '../data/aboutContent';

const SECTION_ICONS = [BookOpen, Bot, ShieldCheck, AlertTriangle];
const PILLAR_COLORS = [
  { border: 'border-mystic-gold/25', bg: 'bg-mystic-gold/5', accent: 'text-mystic-gold', glow: 'bg-mystic-gold/10' },
  { border: 'border-purple-500/25', bg: 'bg-purple-500/5', accent: 'text-purple-300', glow: 'bg-purple-500/10' },
  { border: 'border-emerald-500/25', bg: 'bg-emerald-500/5', accent: 'text-emerald-300', glow: 'bg-emerald-500/10' },
  { border: 'border-rose-400/25', bg: 'bg-rose-400/5', accent: 'text-rose-300', glow: 'bg-rose-400/10' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-20 relative z-10">
      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none -z-10" />

      {/* ── Hero Section ── */}
      <section className="max-w-[1536px] mx-auto px-3.5 sm:px-6 md:px-8 mb-12 sm:mb-16">
        <motion.div {...fadeUp(0)} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-mystic-gold animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-mystic-gold">
              {ABOUT_CONTENT.eyebrow}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold leading-tight mb-4 sm:mb-6">
            {ABOUT_CONTENT.title}
          </h1>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent mx-auto mb-8 sm:mb-10" />

          <p className="max-w-3xl mx-auto text-gray-300 font-light text-sm sm:text-base md:text-lg leading-relaxed">
            {ABOUT_CONTENT.intro}
          </p>
        </motion.div>
      </section>

      {/* ── Blockquote / Philosophy ── */}
      <section className="max-w-[1536px] mx-auto px-3.5 sm:px-6 md:px-8 mb-12 sm:mb-16">
        <motion.div
          {...fadeUp(0.15)}
          className="border-l-2 border-mystic-gold/35 bg-mystic-gold/5 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl italic shadow-[inset_0_2px_8px_rgba(212,175,55,0.02)] relative overflow-hidden max-w-4xl mx-auto"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-mystic-gold/5 blur-3xl rounded-full pointer-events-none" />
          <div className="relative">
            <h3 className="text-mystic-gold font-serif font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 not-italic">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-mystic-gold animate-spin-slow" />
              Triết lý cốt lõi
            </h3>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed font-light">
              "{ABOUT_CONTENT.quote}"
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Content Sections ── */}
      <section className="max-w-[1536px] mx-auto px-3.5 sm:px-6 md:px-8 mb-16 sm:mb-20">
        <motion.div {...fadeUp(0.2)} className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif gold-text font-bold">
            Nguyên tắc & Cam kết
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-2 sm:mt-3 max-w-xl mx-auto">
            Những nguyên tắc nền tảng định hình cách Tarot Mystic hoạt động và phục vụ bạn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {ABOUT_CONTENT.sections.map((section, idx) => {
            const Icon = SECTION_ICONS[idx] || BookOpen;
            return (
              <motion.div
                key={section.title}
                {...fadeUp(0.25 + idx * 0.08)}
                className="glass rounded-2xl sm:rounded-3xl border border-white/10 bg-mystic-dark/60 p-5 sm:p-7 md:p-8 relative overflow-hidden group hover:border-mystic-gold/20 transition-all duration-500"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-mystic-gold/5 blur-2xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-mystic-gold/10 border border-mystic-gold/20 text-mystic-gold shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-white font-serif font-bold text-base sm:text-lg pt-1 sm:pt-2">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed pl-10 sm:pl-[52px]">
                    {section.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Pillars — "Tại sao dùng Tarot Mystic?" ── */}
      <section className="max-w-[1536px] mx-auto px-3.5 sm:px-6 md:px-8 mb-16 sm:mb-20">
        <motion.div {...fadeUp(0.3)} className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif gold-text font-bold">
            Tại sao dùng Tarot Mystic?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-2 sm:mt-3 max-w-xl mx-auto">
            Bốn trụ cột xây dựng trải nghiệm chiêm nghiệm có trách nhiệm.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {ABOUT_CONTENT.pillars.map((pillar, idx) => {
            const color = PILLAR_COLORS[idx] || PILLAR_COLORS[0];
            return (
              <motion.div
                key={pillar.title}
                {...fadeUp(0.35 + idx * 0.08)}
                className={`rounded-2xl sm:rounded-3xl ${color.bg} border ${color.border} p-5 sm:p-6 space-y-3 sm:space-y-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className={`absolute -bottom-6 -right-6 w-20 h-20 ${color.glow} blur-2xl rounded-full pointer-events-none`} />
                <div className="relative">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl ${color.glow} border ${color.border} flex items-center justify-center ${color.accent} mb-3`}>
                    <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className={`font-serif font-bold text-xs sm:text-sm ${color.accent} mb-1 sm:mb-2`}>
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="max-w-[1536px] mx-auto px-3.5 sm:px-6 md:px-8">
        <motion.div
          {...fadeUp(0.45)}
          className="glass rounded-2xl sm:rounded-3xl border border-mystic-gold/25 bg-gradient-to-br from-mystic-gold/5 via-mystic-dark/80 to-mystic-dark/60 p-6 sm:p-10 md:p-14 text-center relative overflow-hidden max-w-3xl mx-auto"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_65%)] pointer-events-none" />
          <div className="relative">
            <Sparkles className="w-10 h-10 text-mystic-gold mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl md:text-3xl font-serif text-white font-bold mb-4">
              Sẵn sàng lắng nghe tiếng nói bên trong?
            </h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed mb-10 max-w-lg mx-auto">
              Bắt đầu hành trình chiêm nghiệm với Tarot, chiêm tinh và thần số học — được thiết kế cho sự tỉnh thức, không phải nỗi sợ.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tarot"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bắt đầu trải bài</span>
              </Link>
              <Link
                to="/cosmic"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-mystic-gold/35 bg-mystic-gold/10 text-mystic-gold font-serif font-bold text-xs uppercase tracking-widest hover:bg-mystic-gold/15 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Cấu hình hồ sơ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Closing tagline */}
        <p className="text-center mt-12 text-xs text-mystic-gold/50 font-serif uppercase tracking-[0.3em] font-semibold">
          Chúc bạn có một hành trình đầy tuệ giác và bình yên ✦
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
