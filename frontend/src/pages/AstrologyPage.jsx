import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Compass, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ZodiacDailySection from '../components/ZodiacDailySection';
import { DAILY_ASTRO_OVERVIEW } from '../data/zodiacContent';

const AstrologyPage = () => {
  const todayLabel = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-16 relative z-10">
      <section className="max-w-[1536px] mx-auto px-3.5 sm:px-6 md:px-8 mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 sm:gap-8 items-stretch"
        >
          <div className="glass rounded-2xl sm:rounded-3xl border border-mystic-gold/30 bg-gradient-to-br from-amber-950/20 via-mystic-dark/90 to-mystic-dark/80 p-5 sm:p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-mystic-gold/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mystic-gold/30 bg-mystic-gold/10 text-mystic-gold text-xs uppercase tracking-wider font-serif font-bold mb-6">
                <Star className="w-4 h-4 animate-spin-slow text-mystic-gold" />
                <span>Chiêm tinh ứng dụng</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-5">
                Đọc Năng Lượng <span className="gold-text italic">12 Cung Hoàng Đạo</span>
              </h1>

              <p className="text-gray-300 font-light text-base md:text-lg leading-relaxed max-w-2xl">
                Không chỉ là tử vi ngắn trong ngày, đây là không gian để bạn hiểu nguyên tố, hành tinh trị vì,
                mặt sáng, mặt bóng và cách liên hệ năng lượng cung hoàng đạo với Tarot.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/cosmic"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Cá nhân hóa hồ sơ</span>
                </Link>
                <Link
                  to="/tarot"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-mystic-gold/35 text-mystic-gold bg-mystic-gold/10 hover:bg-mystic-gold/15 font-serif font-bold text-xs uppercase tracking-widest transition-all"
                >
                  <Sparkles className="w-4 h-4 text-mystic-gold" />
                  <span>Rút bài theo năng lượng</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl border border-mystic-gold/20 bg-mystic-dark/85 p-6 md:p-8 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-2xl bg-mystic-gold/15 border border-mystic-gold/25 text-mystic-gold">
                  <CalendarDays className="w-5 h-5 text-mystic-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-mystic-gold font-bold font-serif">
                    {DAILY_ASTRO_OVERVIEW.label}
                  </p>
                  <h2 className="text-xl font-serif font-bold text-white">{DAILY_ASTRO_OVERVIEW.title}</h2>
                </div>
              </div>

              <p className="text-xs text-mystic-gold/80 font-serif mb-4">{todayLabel}</p>
              <p className="text-sm text-gray-300 leading-relaxed font-light">{DAILY_ASTRO_OVERVIEW.theme}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-300 mb-1 font-serif">Nguyên tố nổi bật</p>
                <p className="text-sm font-serif font-bold text-mystic-gold">{DAILY_ASTRO_OVERVIEW.dominantElement}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-300 mb-1 font-serif">Lá Tarot đại diện</p>
                <p className="text-sm font-serif font-bold text-mystic-gold">{DAILY_ASTRO_OVERVIEW.tarotCard}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-mystic-gold/20 bg-mystic-gold/5 p-4">
              <p className="text-xs uppercase tracking-wider text-mystic-gold font-bold mb-2">Hành động nhỏ hôm nay</p>
              <p className="text-sm text-gray-300 leading-relaxed font-light">{DAILY_ASTRO_OVERVIEW.action}</p>
            </div>

            <Link
              to="/cosmic"
              className="inline-flex items-center justify-between gap-3 text-sm text-mystic-gold/90 hover:text-mystic-gold transition-colors font-serif"
            >
              <span>Mở Bản Đồ Nguyên Khí để ghép chiêm tinh với thần số học</span>
              <ArrowRight size={16} className="text-mystic-gold" />
            </Link>
          </div>
        </motion.div>
      </section>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <ZodiacDailySection />
      </motion.main>
    </div>
  );
};

export default AstrologyPage;
