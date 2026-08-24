import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, Bot, ShieldCheck, AlertTriangle, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ABOUT_CONTENT } from '../data/aboutContent';

const SECTION_ICONS = [BookOpen, Bot, ShieldCheck, AlertTriangle];
const PILLAR_COLORS = [
  { border: 'border-mystic-gold/25', bg: 'bg-mystic-gold/5', accent: 'text-mystic-gold' },
  { border: 'border-purple-500/25', bg: 'bg-purple-500/5', accent: 'text-purple-300' },
  { border: 'border-emerald-500/25', bg: 'bg-emerald-500/5', accent: 'text-emerald-300' },
  { border: 'border-rose-400/25', bg: 'bg-rose-400/5', accent: 'text-rose-300' },
];

const AboutModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-mystic-dark/95 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-black/40 border border-mystic-gold/25 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col glass"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all shadow-md cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content Panel */}
            <div className="overflow-y-auto custom-scrollbar flex-1 p-8 md:p-16">
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-mystic-gold animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-mystic-gold">
                    {ABOUT_CONTENT.eyebrow}
                  </span>
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 leading-tight">
                  {ABOUT_CONTENT.title}
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent mx-auto mt-6" />
              </div>

              {/* Main Content */}
              <div className="space-y-10 text-gray-300 font-light leading-relaxed text-sm md:text-base tracking-wide selection:bg-mystic-gold selection:text-mystic-dark">
                {/* Intro paragraph */}
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-mystic-gold first-letter:float-left first-letter:mr-3 first-letter:font-bold">
                  {ABOUT_CONTENT.intro}
                </p>

                {/* Blockquote */}
                <div className="border-l-2 border-mystic-gold/35 bg-mystic-gold/5 p-6 rounded-2xl md:p-8 italic shadow-[inset_0_2px_8px_rgba(212,175,55,0.02)]">
                  <h4 className="text-mystic-gold font-serif font-bold text-lg mb-3 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-mystic-gold animate-spin-slow" /> Triết lý cốt lõi
                  </h4>
                  "{ABOUT_CONTENT.quote}"
                </div>

                {/* Content Sections */}
                <div className="space-y-6 mt-10">
                  {ABOUT_CONTENT.sections.map((section, idx) => {
                    const Icon = SECTION_ICONS[idx] || BookOpen;
                    return (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-2xl bg-mystic-gold/10 border border-mystic-gold/20 text-mystic-gold shrink-0 mt-0.5">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-serif font-bold text-base mb-2">{section.title}</h4>
                            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">{section.body}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pillars Grid */}
                <div className="mt-12">
                  <h3 className="text-xl font-serif gold-text font-bold text-center mb-8">
                    Tại sao dùng Tarot Mystic?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {ABOUT_CONTENT.pillars.map((pillar, idx) => {
                      const color = PILLAR_COLORS[idx] || PILLAR_COLORS[0];
                      return (
                        <motion.div
                          key={pillar.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + idx * 0.08 }}
                          className={`p-6 rounded-3xl ${color.bg} border ${color.border} space-y-3`}
                        >
                          <h4 className={`font-serif font-bold text-sm ${color.accent}`}>{pillar.title}</h4>
                          <p className="text-xs text-gray-400 font-light leading-relaxed">{pillar.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/tarot"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Bắt đầu trải bài</span>
                  </Link>
                  <Link
                    to="/cosmic"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-mystic-gold/35 bg-mystic-gold/10 text-mystic-gold font-serif font-bold text-xs uppercase tracking-widest hover:bg-mystic-gold/15 transition-all"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Cấu hình hồ sơ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Closing tagline */}
                <p className="text-center pt-6 text-xs text-mystic-gold/60 font-serif uppercase tracking-[0.3em] font-semibold">
                  Chúc bạn có một hành trình đầy tuệ giác và bình yên!
                </p>
              </div>
            </div>
            
            {/* Decors: Golden bottom margin bar */}
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent shrink-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
