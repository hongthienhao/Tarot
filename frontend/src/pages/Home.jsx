import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Compass, Star, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import ZodiacDailySection from '../components/ZodiacDailySection';
import SpreadSelector from '../components/SpreadSelector';

const Home = () => {
  const [activeSanctuary, setActiveSanctuary] = useState('ALL'); // 'ALL' | 'TAROT' | 'ASTROLOGY'

  return (
    <div className="min-h-screen relative">
      {/* Hero Entrance Section */}
      <Hero />

      {/* SANCTUARY CATEGORY SWITCHER BAR */}
      <div className="sticky top-20 z-40 py-4 bg-mystic-dark/90 backdrop-blur-xl border-y border-mystic-gold/15 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mystic-gold animate-spin-slow" />
            <span className="text-xs uppercase tracking-widest text-mystic-gold font-serif font-bold">
              Phân Khu Thánh Đường:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'Tất Cả Phân Khu 🏛️' },
              { id: 'TAROT', label: '🔮 Khu Trải Bài Tarot' },
              { id: 'ASTROLOGY', label: '✨ Khu Chiêm Tinh & Thần Số' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSanctuary(tab.id);
                  if (tab.id === 'TAROT') {
                    const el = document.getElementById('spreads');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else if (tab.id === 'ASTROLOGY') {
                    const el = document.getElementById('zodiac-sanctuary');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-serif font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeSanctuary === tab.id
                    ? 'bg-mystic-gold text-mystic-dark shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT SECTIONS WITH CLEAR VISUAL SEPARATION */}
      <main className="space-y-24 py-12">
        {/* KHU VỰC 1: TRẢI BÀI TAROT SANCTUARY */}
        {(activeSanctuary === 'ALL' || activeSanctuary === 'TAROT') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            id="tarot-sanctuary"
            className="relative"
          >
            {/* Visual Section Boundary Banner */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
              <div className="p-4 rounded-3xl border border-mystic-gold/30 bg-gradient-to-r from-mystic-gold/15 via-mystic-dark/80 to-mystic-gold/15 backdrop-blur-md flex items-center justify-between shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-mystic-gold/20 rounded-2xl text-mystic-gold border border-mystic-gold/30">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold font-serif">
                      Phân Khu 01
                    </span>
                    <h3 className="text-base font-serif font-bold text-white tracking-wider">
                      🔮 THÁNH ĐƯỜNG TRẢI BÀI TAROT
                    </h3>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-xs font-serif italic text-gray-400">
                  Lắng nghe thông điệp qua các bộ quẻ bài
                </span>
              </div>
            </div>

            {/* Core Tarot Spread Selector */}
            <SpreadSelector />
          </motion.div>
        )}

        {/* DECORATIVE SEPARATOR DIVIDER */}
        {activeSanctuary === 'ALL' && (
          <div className="max-w-4xl mx-auto px-6 flex items-center gap-4 my-16 opacity-40">
            <div className="h-px bg-gradient-to-r from-transparent via-mystic-gold to-transparent flex-1" />
            <Sparkles className="w-5 h-5 text-mystic-gold animate-pulse" />
            <div className="h-px bg-gradient-to-r from-transparent via-mystic-gold to-transparent flex-1" />
          </div>
        )}

        {/* KHU VỰC 2: CHIÊM TINH & THẦN SỐ HỌC SANCTUARY */}
        {(activeSanctuary === 'ALL' || activeSanctuary === 'ASTROLOGY') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            id="zodiac-sanctuary"
            className="relative"
          >
            {/* Visual Section Boundary Banner */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
              <div className="p-4 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-mystic-dark/80 to-purple-950/30 backdrop-blur-md flex items-center justify-between shadow-[0_10px_30px_rgba(168,85,247,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/20 rounded-2xl text-purple-300 border border-purple-500/30">
                    <Star className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold font-serif">
                      Phân Khu 02
                    </span>
                    <h3 className="text-base font-serif font-bold text-white tracking-wider">
                      ✨ THÁNH ĐƯỜNG CHIÊM TINH & THẦN SỐ HỌC
                    </h3>
                  </div>
                </div>

                <a
                  href="/cosmic"
                  className="px-4 py-1.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Mở Bản Đồ Full</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Zodiac & Daily Cosmic Energy Hub */}
            <ZodiacDailySection />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Home;
