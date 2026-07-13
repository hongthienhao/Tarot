import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Flame, Heart, Swords, Coins, Zap, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { ZODIAC_DETAILS, DAILY_ZODIAC_FORECASTS, ZODIAC_COMPATIBILITY } from '../utils/astrology';

const ZodiacDailySection = () => {
  const [selectedElement, setSelectedElement] = useState('ALL');
  const [activeZodiacKey, setActiveZodiacKey] = useState('Aries');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const keys = Object.keys(ZODIAC_DETAILS);

  const filteredKeys = keys.filter(key => {
    if (selectedElement === 'ALL') return true;
    const details = ZODIAC_DETAILS[key];
    if (selectedElement === 'FIRE' && details.element.includes('Hỏa')) return true;
    if (selectedElement === 'EARTH' && details.element.includes('Thổ')) return true;
    if (selectedElement === 'AIR' && details.element.includes('Khí')) return true;
    if (selectedElement === 'WATER' && details.element.includes('Thủy')) return true;
    return false;
  });

  const activeDetails = ZODIAC_DETAILS[activeZodiacKey];
  const activeForecast = DAILY_ZODIAC_FORECASTS[activeZodiacKey];
  const activeCompatibility = ZODIAC_COMPATIBILITY[activeZodiacKey];

  return (
    <section id="zodiac" className="py-8 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Mystical Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mystic-gold/30 bg-mystic-gold/10 text-mystic-gold text-xs font-serif uppercase tracking-[0.3em] mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-mystic-gold" />
          <span>Vòng Xoay Vũ Trụ & Năng Lượng Chiêm Tinh</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-serif text-white font-bold mb-6 tracking-tight">
          Dự Báo Năng Lượng <span className="gold-text italic">12 Cung Hoàng Đạo</span>
        </h2>

        <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed font-accent italic">
          Khám phá tần số rung động, nguyên tố cai trị và lời khuyên quẻ bài Tarot ứng nghiệm riêng cho từng Cung Hoàng Đạo ngày hôm nay.
        </p>

        {/* Element Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {[
            { id: 'ALL', label: 'Tất Cả 🌌' },
            { id: 'FIRE', label: 'Hỏa 🔥 (Bạch Dương, Sư Tử, Nhân Mã)' },
            { id: 'EARTH', label: 'Thổ 🌿 (Kim Ngưu, Xử Nữ, Ma Kết)' },
            { id: 'AIR', label: 'Khí 💨 (Song Tử, Thiên Bình, Bảo Bình)' },
            { id: 'WATER', label: 'Thủy 💧 (Cự Giải, Bọ Cạp, Song Ngư)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedElement(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-serif tracking-wider transition-all cursor-pointer ${
                selectedElement === tab.id
                  ? 'bg-mystic-gold text-mystic-dark font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 12 Zodiac Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredKeys.map((key) => {
          const item = ZODIAC_DETAILS[key];
          const forecast = DAILY_ZODIAC_FORECASTS[key];
          const isSelected = activeZodiacKey === key;

          return (
            <motion.div
              key={key}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveZodiacKey(key);
                setIsDetailOpen(true);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-mystic-gold/15 border-mystic-gold/60 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                  : 'bg-mystic-dark/80 border-white/10 hover:border-mystic-gold/40 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 text-mystic-gold font-bold">
                  {forecast.energyScore}% 🔥
                </span>
              </div>

              <div>
                <h4 className="text-sm font-serif font-bold text-white truncate mb-1">
                  {item.name.split(' (')[0]}
                </h4>
                <p className="text-[10px] text-gray-400 font-light mb-2">{item.dateRange}</p>
                <div className="flex items-center gap-1 text-[10px] text-amber-200/80 font-serif">
                  <span>{item.element}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-mystic-gold/70 group-hover:text-mystic-gold">
                <span>Xem Chi Tiết</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal Overlay for Zodiac Analysis */}
      <AnimatePresence>
        {isDetailOpen && activeDetails && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailOpen(false)}
              className="absolute inset-0 bg-mystic-dark/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-3xl border border-mystic-gold/40 bg-mystic-dark/95 p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-mystic-gold/20 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{activeDetails.icon}</span>
                  <div>
                    <h3 className="text-xl font-serif gold-text font-bold tracking-wider">
                      {activeDetails.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-light">
                      {activeDetails.dateRange} • Nguyên Tố {activeDetails.element} • Sao Trị Vì: {activeDetails.rulingPlanet}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Forecast Content */}
              <div className="space-y-6">
                {/* Score & Lucky Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-mystic-gold/10 border border-mystic-gold/25 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold">
                      Chỉ Số Năng Lượng Hôm Nay
                    </span>
                    <div className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                      <span>{activeForecast.energyScore}/100</span>
                      <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold">
                      Lá Bài Tarot Hộ Mệnh Trong Ngày
                    </span>
                    <div className="text-sm font-serif font-bold text-white flex items-center gap-1.5 pt-1">
                      <Star className="w-4 h-4 text-purple-300" />
                      <span>{activeForecast.luckyCard}</span>
                    </div>
                  </div>
                </div>

                {/* Daily Vibe Guidance */}
                <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                  <span className="text-xs font-serif gold-text uppercase tracking-wider block">
                    ✨ Lời Khuyên Năng Lượng Vũ Trụ
                  </span>
                  <p className="text-sm text-gray-200 font-light leading-relaxed italic">
                    "{activeForecast.advice}"
                  </p>
                </div>

                {/* Compatibility Card */}
                {activeCompatibility && (
                  <div className="p-5 rounded-2xl border border-mystic-gold/20 bg-mystic-gold/5 space-y-3">
                    <span className="text-xs font-serif text-mystic-gold uppercase tracking-wider block">
                      💞 Tương Hợp Chiêm Tinh & Nguyên Tố
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-gray-400">Các Cung Hợp Cạ Nhất:</span>
                      {activeCompatibility.bestMatches.map((m) => (
                        <span key={m} className="px-2.5 py-0.5 rounded-full bg-mystic-gold/20 border border-mystic-gold/40 text-mystic-gold font-bold">
                          {m}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-300 italic font-light border-t border-mystic-gold/15 pt-2">
                      🌿 <span className="text-amber-200/90">{activeCompatibility.note}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6 mt-6 border-t border-white/10">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ZodiacDailySection;
