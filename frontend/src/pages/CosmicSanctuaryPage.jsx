import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Compass, User, Hash, Zap, BookOpen, Layers, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  getZodiacDetails, 
  calculateLifePathNumber, 
  calculateDestinyNumber, 
  calculatePersonalYearNumber,
  LIFE_PATH_MEANINGS,
  DESTINY_MEANINGS,
  PERSONAL_YEAR_MEANINGS
} from '../utils/astrology';
import UserProfileModal from '../components/UserProfileModal';

const CosmicSanctuaryPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ASTROLOGY'); // 'ASTROLOGY' | 'NUMEROLOGY' | 'RESONANCE'
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const zodiacDetails = user?.birthDate ? getZodiacDetails(user.birthDate) : null;
  const lifePath = user?.birthDate ? calculateLifePathNumber(user.birthDate) : null;
  const destinyNumber = user?.name ? calculateDestinyNumber(user.name) : null;
  const personalYear = user?.birthDate ? calculatePersonalYearNumber(user.birthDate, 2026) : null;

  // Cosmic Resonance Score % calculation
  const resonanceScore = React.useMemo(() => {
    if (!user?.birthDate) return 50;
    let base = 80;
    if (zodiacDetails) base += 5;
    if (lifePath) base += 5;
    if (destinyNumber) base += 5;
    if (personalYear) base += 4;
    return Math.min(base, 99);
  }, [user, zodiacDetails, lifePath, destinyNumber, personalYear]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto relative">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="text-center max-w-4xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-mystic-gold/40 bg-mystic-gold/10 text-mystic-gold text-xs font-serif uppercase tracking-[0.4em] mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-mystic-gold animate-spin-slow" />
          <span>Bản Đồ Nguyên Khí Vũ Trụ (Cosmic Soul Hub)</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 tracking-tight">
          Chiêm Tinh & <span className="gold-text italic">Thần Số Học</span>
        </h1>

        <p className="text-gray-300 font-light text-base md:text-xl leading-relaxed font-accent italic max-w-3xl mx-auto">
          "Cấu trúc bản mệnh của linh hồn được khắc họa qua vị trí các chòm sao, nguyên tố tự nhiên và nhịp đập của những con số thiêng."
        </p>

        {/* Action button to open profile modal */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-6 py-3 rounded-full bg-mystic-gold/15 hover:bg-mystic-gold/25 border border-mystic-gold/40 text-mystic-gold font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center gap-2 cursor-pointer"
          >
            <User size={16} />
            <span>Chỉnh Sửa Hồ Sơ Chiêm Tinh</span>
          </button>
        </div>
      </div>

      {/* Flagship Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12 border-b border-white/10 pb-6 max-w-3xl mx-auto">
        {[
          { id: 'ASTROLOGY', label: 'Bản Đồ Chiêm Tinh 🌟', icon: <Compass className="w-4 h-4" /> },
          { id: 'NUMEROLOGY', label: 'Tam Hợp Thần Số 🔢', icon: <Hash className="w-4 h-4" /> },
          { id: 'RESONANCE', label: 'Tần Số Linh Hồn ✨', icon: <Zap className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-serif font-bold tracking-widest uppercase transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-mystic-gold text-mystic-dark shadow-[0_0_25px_rgba(212,175,55,0.35)]'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: ASTROLOGY PORTAL */}
      {activeTab === 'ASTROLOGY' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {zodiacDetails ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Zodiac Card */}
              <div className="lg:col-span-1 glass rounded-3xl p-8 border border-mystic-gold/30 bg-mystic-dark/90 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-mystic-gold/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="text-6xl mb-4">{zodiacDetails.icon}</div>
                  <span className="text-xs uppercase tracking-widest text-mystic-gold font-serif font-bold">
                    Cung Bản Mệnh
                  </span>
                  <h2 className="text-3xl font-serif text-white font-bold mt-1 mb-2">
                    {zodiacDetails.name}
                  </h2>
                  <p className="text-xs text-gray-400 font-light mb-6">{zodiacDetails.dateRange}</p>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Nguyên Tố:</span>
                      <span className="px-3 py-1 rounded-full bg-mystic-gold/20 border border-mystic-gold/40 text-mystic-gold font-bold">
                        {zodiacDetails.element}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Hành Tinh Trị Vì:</span>
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
                        {zodiacDetails.rulingPlanet}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-mystic-gold/15 italic text-xs text-gray-300 font-light">
                  " {zodiacDetails.vibe} "
                </div>
              </div>

              {/* Astrological Analysis & Compatibility Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Compatibility Card */}
                {zodiacDetails.compatibility && (
                  <div className="glass rounded-3xl p-8 border border-mystic-gold/25 bg-mystic-dark/80 space-y-4">
                    <h3 className="text-lg font-serif gold-text font-bold tracking-wider flex items-center gap-2">
                      <Heart className="w-5 h-5 text-mystic-gold" />
                      Ma Trận Tương Hợp Chiêm Tinh
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <span className="text-xs text-gray-400 font-serif">Cung Hoàng Đạo Hợp Cạ Nhất:</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {zodiacDetails.compatibility.bestMatches.map((m) => (
                            <span key={m} className="px-3 py-1 rounded-full bg-mystic-gold/20 border border-mystic-gold/40 text-mystic-gold font-bold text-xs">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <span className="text-xs text-gray-400 font-serif">Nguyên Tố Tương Sinh:</span>
                        <div className="pt-1">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                            {zodiacDetails.compatibility.supportingElement}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 italic font-light pt-2">
                      ✨ {zodiacDetails.compatibility.note}
                    </p>
                  </div>
                )}

                {/* Daily Forecast Insight */}
                {zodiacDetails.forecast && (
                  <div className="glass rounded-3xl p-8 border border-purple-500/25 bg-purple-950/20 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-serif text-purple-300 font-bold tracking-wider flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-300" />
                        Dự Báo Năng Lượng Chiêm Tinh Hôm Nay
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
                        {zodiacDetails.forecast.energyScore}% Năng Lượng
                      </span>
                    </div>

                    <p className="text-sm text-gray-200 leading-relaxed font-light italic">
                      "{zodiacDetails.forecast.advice}"
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs text-purple-300/80 font-serif">
                      <span>Lá Bài Tarot Hộ Mệnh Hôm Nay:</span>
                      <span className="font-bold text-white underline">{zodiacDetails.forecast.luckyCard}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-3xl p-10 border border-white/10 max-w-2xl mx-auto">
              <Compass className="w-16 h-16 text-mystic-gold/40 mx-auto mb-4 animate-spin-slow" />
              <h3 className="text-xl font-serif text-white font-bold mb-2">Chưa Cấu Hình Ngày Sinh</h3>
              <p className="text-gray-400 text-sm mb-6 font-light">
                Vui lòng cập nhật ngày sinh của bạn để kích hoạt bản đồ chiêm tinh và nguyên tố cai trị bản mệnh.
              </p>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="px-6 py-2.5 rounded-full bg-mystic-gold text-mystic-dark font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cài Đặt Ngày Sinh
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Tab 2: NUMEROLOGY MATRIX */}
      {activeTab === 'NUMEROLOGY' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Life Path Number */}
          <div className="glass rounded-3xl p-8 border border-mystic-gold/30 bg-mystic-dark/90 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="p-3 bg-mystic-gold/15 rounded-2xl text-mystic-gold border border-mystic-gold/30">
                  <Hash size={24} />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold">Thần Số Học</span>
              </div>
              <span className="text-xs text-gray-400 font-serif">Con Số Chủ Đạo (Life Path)</span>
              <h3 className="text-4xl font-serif font-bold gold-text mt-1 mb-3">
                {lifePath ? `Số #${lifePath}` : 'Chưa nhập ngày sinh'}
              </h3>
              {lifePath && LIFE_PATH_MEANINGS[lifePath] && (
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {LIFE_PATH_MEANINGS[lifePath]}
                </p>
              )}
            </div>
            <div className="pt-4 border-t border-white/10 text-[10px] text-gray-400">
              Được tính toán từ tổng các con số trong Ngày - Tháng - Năm sinh.
            </div>
          </div>

          {/* Card 2: Destiny Number */}
          <div className="glass rounded-3xl p-8 border border-purple-500/30 bg-mystic-dark/90 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="p-3 bg-purple-500/15 rounded-2xl text-purple-300 border border-purple-500/30">
                  <Star size={24} />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold">Thần Số Học</span>
              </div>
              <span className="text-xs text-gray-400 font-serif">Con Số Sứ Mệnh (Destiny Name)</span>
              <h3 className="text-4xl font-serif font-bold text-purple-300 mt-1 mb-3">
                {destinyNumber ? `Số #${destinyNumber}` : 'Chưa nhập tên'}
              </h3>
              {destinyNumber && DESTINY_MEANINGS[destinyNumber] && (
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {DESTINY_MEANINGS[destinyNumber]}
                </p>
              )}
            </div>
            <div className="pt-4 border-t border-white/10 text-[10px] text-gray-400">
              Được tính từ danh xưng qua hệ thống mã hóa Pythagoras.
            </div>
          </div>

          {/* Card 3: Personal Year 2026 */}
          <div className="glass rounded-3xl p-8 border border-emerald-500/30 bg-mystic-dark/90 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-300 border border-emerald-500/30">
                  <Zap size={24} />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Năm 2026</span>
              </div>
              <span className="text-xs text-gray-400 font-serif">Con Số Năm Cá Nhân 2026</span>
              <h3 className="text-4xl font-serif font-bold text-emerald-300 mt-1 mb-3">
                {personalYear ? `Năm Số #${personalYear}` : 'Chưa nhập ngày sinh'}
              </h3>
              {personalYear && PERSONAL_YEAR_MEANINGS[personalYear] && (
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {PERSONAL_YEAR_MEANINGS[personalYear]}
                </p>
              )}
            </div>
            <div className="pt-4 border-t border-white/10 text-[10px] text-gray-400">
              Dự báo xu hướng phát triển bản thân trong chu kỳ năm nay.
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: RESONANCE & TAROT SCORE */}
      {activeTab === 'RESONANCE' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto glass rounded-3xl p-8 md:p-12 border border-mystic-gold/30 bg-mystic-dark/90 text-center space-y-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-mystic-gold/10 border-2 border-mystic-gold/40 flex items-center justify-center relative shadow-[0_0_35px_rgba(212,175,55,0.25)]">
            <span className="text-4xl font-serif font-bold gold-text">{resonanceScore}%</span>
            <div className="absolute inset-0 border border-mystic-gold/30 rounded-full animate-ping pointer-events-none" />
          </div>

          <div>
            <h3 className="text-2xl font-serif text-white font-bold mb-2">Chỉ Số Hài Hòa Tâm Linh & Tarot</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-lg mx-auto">
              Đánh giá mức độ đồng điệu giữa Cung Hoàng Đạo, Thần Số Học và các quẻ bói Tarot được Gemini AI cá nhân hóa dành riêng cho linh hồn bạn.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => navigate('/#spreads')}
              className="px-8 py-4 rounded-full bg-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Trải Bài Tarot Cá Nhân Hóa Ngay</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default CosmicSanctuaryPage;
