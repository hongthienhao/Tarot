import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  Droplets,
  Flame,
  Heart,
  Leaf,
  Moon,
  Sparkles,
  Star,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { ZODIAC_DETAILS, DAILY_ZODIAC_FORECASTS, ZODIAC_COMPATIBILITY } from '../utils/astrology';
import { ELEMENT_GUIDE, ZODIAC_RICH_CONTENT } from '../data/zodiacContent';
import ZodiacIcon from './ZodiacIcon';

const elementFilters = [
  { id: 'ALL', label: 'Tất Cả', icon: Sparkles },
  { id: 'FIRE', label: 'Hỏa', icon: Flame },
  { id: 'EARTH', label: 'Thổ', icon: Leaf },
  { id: 'AIR', label: 'Khí', icon: Wind },
  { id: 'WATER', label: 'Thủy', icon: Droplets },
];

const getElementInfo = (elementStr) => {
  if (elementStr?.includes('Hỏa')) return { Icon: Flame, label: 'Hỏa' };
  if (elementStr?.includes('Thổ')) return { Icon: Leaf, label: 'Thổ' };
  if (elementStr?.includes('Khí')) return { Icon: Wind, label: 'Khí' };
  if (elementStr?.includes('Thủy')) return { Icon: Droplets, label: 'Thủy' };
  return { Icon: Sparkles, label: elementStr || '' };
};

const elementToGuideKey = {
  FIRE: 'FIRE',
  EARTH: 'EARTH',
  AIR: 'AIR',
  WATER: 'WATER',
};

const matchesElement = (details, selectedElement) => {
  if (selectedElement === 'ALL') return true;
  if (selectedElement === 'FIRE') return details.element.includes('Hỏa');
  if (selectedElement === 'EARTH') return details.element.includes('Thổ');
  if (selectedElement === 'AIR') return details.element.includes('Khí');
  if (selectedElement === 'WATER') return details.element.includes('Thủy');
  return true;
};

const ZodiacDailySection = () => {
  const [selectedElement, setSelectedElement] = useState('ALL');
  const [activeZodiacKey, setActiveZodiacKey] = useState('Aries');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const keys = Object.keys(ZODIAC_DETAILS);
  const filteredKeys = keys.filter((key) => matchesElement(ZODIAC_DETAILS[key], selectedElement));
  const activeDetails = ZODIAC_DETAILS[activeZodiacKey];
  const activeForecast = DAILY_ZODIAC_FORECASTS[activeZodiacKey];
  const activeCompatibility = ZODIAC_COMPATIBILITY[activeZodiacKey];
  const activeRich = ZODIAC_RICH_CONTENT[activeZodiacKey];
  const { Icon: ActiveElemIcon } = getElementInfo(activeDetails?.element);

  return (
    <section id="zodiac" className="py-8 px-3.5 sm:px-6 md:px-8 max-w-[1536px] mx-auto relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mystic-gold/30 bg-mystic-gold/10 text-mystic-gold text-xs font-serif uppercase tracking-[0.3em] mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-mystic-gold" />
          <span>Vòng Xoay Vũ Trụ</span>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-bold mb-4 sm:mb-6 tracking-tight">
          12 Cung Hoàng Đạo <span className="gold-text italic">Và Lá Bài Đồng Hành</span>
        </h2>

        <p className="text-gray-400 font-light text-sm sm:text-base md:text-lg leading-relaxed font-accent italic">
          Mỗi cung được đọc qua bốn lớp: bản chất, mặt sáng, mặt bóng và hướng hành động. Chọn cung để mở bản đọc chi tiết.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          {elementFilters.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedElement(tab.id)}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-serif tracking-wider transition-all cursor-pointer ${
                  selectedElement === tab.id
                    ? 'bg-mystic-gold text-mystic-dark font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                    : 'bg-white/5 border border-mystic-gold/20 text-mystic-gold/80 hover:text-mystic-gold hover:bg-mystic-gold/10 hover:border-mystic-gold/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-mystic-gold" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedElement !== 'ALL' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 max-w-3xl mx-auto rounded-2xl sm:rounded-3xl border border-mystic-gold/25 bg-white/5 p-4 sm:p-5 flex flex-col md:flex-row gap-4 md:items-center"
        >
          <div className="p-2.5 sm:p-3 rounded-2xl bg-mystic-gold/10 border border-mystic-gold/25 text-mystic-gold self-start">
            <Compass className="w-5 h-5 text-mystic-gold" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white">
              Nguyên tố {ELEMENT_GUIDE[elementToGuideKey[selectedElement]]?.label}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              <span className="text-mystic-gold">{ELEMENT_GUIDE[elementToGuideKey[selectedElement]]?.focus}.</span>{' '}
              {ELEMENT_GUIDE[elementToGuideKey[selectedElement]]?.advice}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredKeys.map((key) => {
          const item = ZODIAC_DETAILS[key];
          const forecast = DAILY_ZODIAC_FORECASTS[key];
          const rich = ZODIAC_RICH_CONTENT[key];
          const isSelected = activeZodiacKey === key;
          const { Icon: ElemIcon, label: elemLabel } = getElementInfo(item.element);

          return (
            <motion.button
              key={key}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveZodiacKey(key);
                setIsDetailOpen(true);
              }}
              className={`group text-left p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[210px] sm:min-h-[230px] ${
                isSelected
                  ? 'bg-mystic-gold/15 border-mystic-gold/60 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                  : 'bg-mystic-dark/80 border-white/10 hover:border-mystic-gold/40 hover:bg-white/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <ZodiacIcon name={key} className="w-9 h-9" />
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-mystic-gold/15 border border-mystic-gold/30 text-mystic-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                    {forecast.energyScore}%
                  </span>
                </div>

                <h4 className="text-sm font-serif font-bold text-white mb-1">
                  {item.name.split(' (')[0]}
                </h4>
                <p className="text-[10px] text-gray-400 font-light mb-3">{item.dateRange}</p>
                <div className="flex flex-wrap gap-1.5">
                  {rich.keywords.slice(0, 2).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-0.5 rounded-full bg-white/5 border border-mystic-gold/20 text-[9px] text-gray-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-mystic-gold font-medium tracking-wide">
                  <ElemIcon className="w-3.5 h-3.5 text-mystic-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                  <span>{elemLabel}</span>
                </span>
                <ArrowRight size={12} className="text-mystic-gold group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: 'Sun Sign',
            desc: 'Cung Mặt Trời mô tả bản sắc cốt lõi và cách bạn muốn tỏa sáng trong đời sống.',
            icon: Star,
          },
          {
            title: 'Nguyên tố',
            desc: 'Hỏa, Thổ, Khí, Thủy cho biết cách năng lượng vận hành: hành động, xây nền, tư duy hay cảm xúc.',
            icon: Flame,
          },
          {
            title: 'Tarot Ally',
            desc: 'Lá bài đồng hành giúp bạn chuyển insight chiêm tinh thành câu hỏi và hành động cụ thể.',
            icon: BookOpen,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-3xl border border-mystic-gold/20 bg-white/5 p-6">
              <div className="w-11 h-11 rounded-2xl bg-mystic-gold/15 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Icon className="w-5 h-5 text-mystic-gold" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isDetailOpen && activeDetails && activeRich && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailOpen(false)}
              className="absolute inset-0 bg-mystic-dark/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto custom-scrollbar glass rounded-3xl border border-mystic-gold/40 bg-mystic-dark/95 p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] z-10"
            >
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-mystic-gold/20 mb-6">
                <div className="flex items-center gap-4">
                  <ZodiacIcon name={activeZodiacKey} className="w-14 h-14" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-mystic-gold font-bold font-serif mb-1">
                      <span>{activeDetails.dateRange}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ActiveElemIcon className="w-3.5 h-3.5 text-mystic-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                        {activeDetails.element}
                      </span>
                      <span>•</span>
                      <span>{activeDetails.rulingPlanet}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif gold-text font-bold tracking-wider">
                      {activeDetails.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {activeRich.keywords.map((keyword) => (
                        <span key={keyword} className="px-3 py-1 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 text-xs text-mystic-gold">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 rounded-xl bg-white/5 border border-mystic-gold/20 text-mystic-gold hover:text-white hover:bg-mystic-gold/15 transition-all cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-6">
                <div className="space-y-5">
                  <div className="rounded-3xl border border-mystic-gold/20 bg-white/5 p-6">
                    <h4 className="text-lg font-serif font-bold text-white mb-3 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-mystic-gold" />
                      Bản Chất Cốt Lõi
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed font-light">{activeRich.core}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-mystic-gold/30 bg-mystic-gold/5 p-5">
                      <h5 className="text-sm font-serif font-bold text-mystic-gold mb-2">Mặt sáng</h5>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">{activeRich.light}</p>
                    </div>
                    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5">
                      <h5 className="text-sm font-serif font-bold text-amber-300 mb-2">Mặt bóng</h5>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">{activeRich.shadow}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-mystic-gold/30 bg-mystic-gold/5 p-5">
                      <h5 className="text-sm font-serif font-bold text-mystic-gold mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-mystic-gold" />
                        Tình cảm
                      </h5>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">{activeRich.love}</p>
                    </div>
                    <div className="rounded-3xl border border-mystic-gold/30 bg-mystic-gold/5 p-5">
                      <h5 className="text-sm font-serif font-bold text-mystic-gold mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-mystic-gold" />
                        Công việc
                      </h5>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">{activeRich.work}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-mystic-gold/30 bg-mystic-gold/5 p-6">
                    <p className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold mb-2">Dự báo tham khảo</p>
                    <div className="flex items-center gap-2 text-2xl font-serif font-bold text-white mb-3">
                      <span className="gold-text">{activeForecast.energyScore}/100</span>
                      <Zap className="w-5 h-5 text-mystic-gold animate-pulse" />
                    </div>
                    <p className="text-sm text-gray-300 italic leading-relaxed font-light">"{activeForecast.advice}"</p>
                  </div>

                  <div className="rounded-3xl border border-mystic-gold/30 bg-mystic-gold/5 p-6">
                    <p className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold mb-2">Tarot đồng hành</p>
                    <h4 className="text-lg font-serif font-bold text-white mb-2">{activeRich.tarotAlly}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">
                      Lá bài này giúp bạn biến năng lượng cung thành một câu hỏi rõ hơn trước khi trải bài.
                    </p>
                  </div>

                  {activeCompatibility && (
                    <div className="rounded-3xl border border-mystic-gold/20 bg-white/5 p-6">
                      <p className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold mb-3">Tương hợp nguyên tố</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {activeCompatibility.bestMatches.map((match) => (
                          <span key={match} className="px-3 py-1 rounded-full bg-mystic-gold/15 border border-mystic-gold/30 text-mystic-gold font-bold text-xs">
                            {match}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">{activeCompatibility.note}</p>
                    </div>
                  )}

                  <div className="rounded-3xl border border-mystic-gold/30 bg-mystic-dark/70 p-6">
                    <h5 className="text-sm font-serif font-bold text-mystic-gold mb-2 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-mystic-gold" />
                      Câu hỏi chiêm nghiệm
                    </h5>
                    <p className="text-sm text-gray-200 italic leading-relaxed">"{activeRich.journalPrompt}"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ZodiacDailySection;
