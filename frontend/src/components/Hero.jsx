import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Star, User, Compass, Zap, ArrowRight } from 'lucide-react';
import DailyTarotModal from './DailyTarotModal';
import UserProfileModal from './UserProfileModal';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getZodiacDetails, calculateLifePathNumber } from '../utils/astrology';

const Hero = () => {
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const zodiacDetails = user?.birthDate ? getZodiacDetails(user.birthDate) : null;
  const lifePath = user?.birthDate ? calculateLifePathNumber(user.birthDate) : null;

  const scrollToSpreads = () => {
    const element = document.getElementById('spreads');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-between pt-28 pb-12 px-6 overflow-hidden">
      {/* Cinematic Lighting Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(74,14,14,0.18)_0%,transparent_55%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl w-full text-center my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtitle tag */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="inline-block mb-4"
          >
            <span className="text-mystic-gold/70 uppercase tracking-[0.5em] text-[10px] md:text-xs font-semibold border-b border-mystic-gold/20 pb-1.5">
              Khám phá vũ trụ bên trong bạn
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif mb-6 leading-[1.05] tracking-tight">
            Thấu Hiểu <br />
            <span className="gold-text italic block mt-2">Định Mệnh</span>
          </h1>

          {/* Subtitle Quote */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto mb-8 leading-relaxed font-accent italic"
          >
            "Nơi những lá bài không chỉ là hình vẽ, mà là tấm gương phản chiếu tiếng nói chân thực nhất của linh hồn bạn."
          </motion.p>

          {/* SLEEK COMPACT ASTRO STATUS PILL BADGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="inline-flex items-center mb-10"
          >
            {zodiacDetails ? (
              <div 
                onClick={() => navigate('/cosmic')}
                className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-mystic-gold/40 bg-mystic-dark/80 backdrop-blur-md hover:border-mystic-gold hover:bg-mystic-gold/15 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] cursor-pointer group"
              >
                <Star className="w-4 h-4 text-mystic-gold animate-spin-slow shrink-0" />
                <div className="flex items-center gap-2 text-xs font-serif text-white">
                  <span className="font-bold text-mystic-gold">{zodiacDetails.name}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-amber-200/90">{zodiacDetails.element}</span>
                  {lifePath && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-amber-300">Số #{lifePath}</span>
                    </>
                  )}
                </div>
                <span className="text-[10px] uppercase font-bold text-mystic-gold tracking-widest pl-2 border-l border-mystic-gold/20 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Bản Đồ <ArrowRight size={10} />
                </span>
              </div>
            ) : (
              <div 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-mystic-gold/30 bg-mystic-gold/10 backdrop-blur-md hover:bg-mystic-gold/20 transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] cursor-pointer text-xs font-serif text-mystic-gold font-bold tracking-wider"
              >
                <Zap size={14} className="animate-pulse" />
                <span>Cấu Hình Chiêm Tinh & Thần Số Để Cá Nhân Hóa Quẻ Bói</span>
                <ArrowRight size={12} />
              </div>
            )}
          </motion.div>
          
          {/* Main Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <motion.button 
              onClick={scrollToSpreads}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-9 py-4 bg-mystic-gold text-mystic-dark font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all cursor-pointer shadow-lg"
            >
              Bắt đầu hành trình
            </motion.button>

            <motion.button 
              onClick={() => navigate('/cosmic')}
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 border border-mystic-gold/40 text-mystic-gold font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all cursor-pointer backdrop-blur-md bg-mystic-gold/10"
            >
              <Compass className="w-4 h-4 text-mystic-gold" />
              <span>Bản Đồ Nguyên Khí</span>
            </motion.button>

            <motion.button 
              onClick={() => setIsDailyOpen(true)}
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 border border-mystic-gold/30 text-amber-200/90 font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all cursor-pointer backdrop-blur-md bg-white/5"
            >
              <Sparkles className="w-4 h-4 text-mystic-gold animate-spin-slow" />
              <span>Bài Hằng Ngày</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <DailyTarotModal isOpen={isDailyOpen} onClose={() => setIsDailyOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Non-overlapping Relative Scroll Indicator */}
      <motion.div 
        onClick={scrollToSpreads}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-12 flex flex-col items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity z-10"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-mystic-gold/60 font-serif">Cuộn xuống</span>
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="text-mystic-gold w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;


