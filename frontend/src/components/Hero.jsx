import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Star, User, Compass, Zap } from 'lucide-react';
import DailyTarotModal from './DailyTarotModal';
import UserProfileModal from './UserProfileModal';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getZodiacDetails, calculateLifePathNumber, calculateDestinyNumber, calculatePersonalYearNumber } from '../utils/astrology';

const Hero = () => {
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const zodiacDetails = user?.birthDate ? getZodiacDetails(user.birthDate) : null;
  const lifePath = user?.birthDate ? calculateLifePathNumber(user.birthDate) : null;
  const destinyNumber = user?.name ? calculateDestinyNumber(user.name) : null;
  const personalYear = user?.birthDate ? calculatePersonalYearNumber(user.birthDate, 2026) : null;

  const scrollToSpreads = () => {
    const element = document.getElementById('spreads');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Cinematic Lighting Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(74,14,14,0.15)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="inline-block mb-6"
          >
            <span className="text-mystic-gold/60 uppercase tracking-[0.6em] text-[10px] md:text-xs font-semibold border-b border-mystic-gold/20 pb-2">
              Khám phá vũ trụ bên trong bạn
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 leading-[1.1] md:leading-[1.05] tracking-tight">
            Thấu Hiểu <br />
            <span className="gold-text italic block mt-4">Định Mệnh</span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="text-lg md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed font-accent italic"
          >
            "Nơi những lá bài không chỉ là hình vẽ, mà là tấm gương phản chiếu tiếng nói chân thực nhất của linh hồn bạn."
          </motion.p>

          {/* ASTRO NUMEROLOGY FLAGSHIP PORTAL CARD ON HOMEPAGE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="max-w-3xl mx-auto mb-12 p-6 rounded-3xl border border-mystic-gold/40 bg-mystic-dark/80 backdrop-blur-md shadow-[0_15px_45px_rgba(212,175,55,0.12)] text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-mystic-gold/15 rounded-full blur-3xl pointer-events-none group-hover:bg-mystic-gold/25 transition-all" />

            {zodiacDetails ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-mystic-gold animate-spin-slow" />
                    <span className="text-xs uppercase tracking-widest text-mystic-gold font-serif font-bold">
                      Cổng Chiêm Tinh & Bản Mệnh Linh Hồn
                    </span>
                  </div>
                  <h4 className="text-base md:text-lg font-serif font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>{zodiacDetails.name}</span>
                    {lifePath && <span className="text-xs font-normal text-amber-300 font-serif">| Số Chủ Đạo #{lifePath}</span>}
                    {destinyNumber && <span className="text-xs font-normal text-purple-300 font-serif">| Sứ Mệnh Name #{destinyNumber}</span>}
                    {personalYear && <span className="text-xs font-normal text-emerald-300 font-serif">| Năm 2026 #{personalYear}</span>}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-mystic-gold/15 border border-mystic-gold/30 text-mystic-gold font-medium">
                      Nguyên tố {zodiacDetails.element}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-medium">
                      {zodiacDetails.rulingPlanet}
                    </span>
                  </div>
                  <p className="text-xs italic text-gray-300 font-light pt-1">
                    ✨ "{zodiacDetails.vibe}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/cosmic')}
                    className="px-4 py-2.5 rounded-xl bg-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Xem Bản Đồ</span>
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 text-xs font-serif transition-all cursor-pointer"
                  >
                    Sửa
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-mystic-gold">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span className="text-xs uppercase tracking-widest font-serif font-bold">
                      Cá Nhân Hóa Năng Lượng Vũ Trụ
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-light">
                    Kích hoạt Cung Hoàng Đạo & Thần Số Học để Gemini AI đưa ra lời luận Tarot siêu chính xác dành riêng cho bạn.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/cosmic')}
                    className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Bản Đồ Mẫu
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-mystic-gold/20 hover:bg-mystic-gold/30 border border-mystic-gold/40 text-mystic-gold text-xs font-serif font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Hồ Sơ Bản Mệnh</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <motion.button 
              onClick={scrollToSpreads}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-mystic-gold text-mystic-dark font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all cursor-pointer shadow-lg"
            >
              Bắt đầu hành trình
            </motion.button>

            <motion.button 
              onClick={() => setIsDailyOpen(true)}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 px-8 py-5 border border-mystic-gold/40 text-mystic-gold font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all cursor-pointer backdrop-blur-md bg-mystic-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
            >
              <Sparkles className="w-4 h-4 text-mystic-gold animate-spin-slow" />
              <span>Lá Bài Hằng Ngày</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <DailyTarotModal isOpen={isDailyOpen} onClose={() => setIsDailyOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Scroll Indicator */}
      <motion.div 
        onClick={scrollToSpreads}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-4 cursor-pointer hover:opacity-100 transition-opacity"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-mystic-gold/50">Cuộn xuống</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="text-mystic-gold w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

