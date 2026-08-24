import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Compass,
  Hash,
  Heart,
  Layers,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import {
  calculateDestinyNumber,
  calculateLifePathNumber,
  calculatePersonalYearNumber,
  getZodiacDetails,
  LIFE_PATH_MEANINGS,
  DESTINY_MEANINGS,
  PERSONAL_YEAR_MEANINGS,
} from '../utils/astrology';
import {
  buildCosmicInsights,
  COSMIC_EMPTY_PROMISES,
  getNumberArchetype,
  getRecommendedSpread,
  NUMEROLOGY_CONTENT,
  RESONANCE_AXES,
  SAMPLE_PROFILE,
} from '../data/cosmicContent';
import { ZODIAC_RICH_CONTENT } from '../data/zodiacContent';
import UserProfileModal from '../components/UserProfileModal';
import ZodiacIcon from '../components/ZodiacIcon';

const tabs = [
  { id: 'ASTROLOGY', label: 'Bản Đồ Chiêm Tinh', icon: Compass },
  { id: 'NUMEROLOGY', label: 'Tam Hợp Thần Số', icon: Hash },
  { id: 'RESONANCE', label: 'Tần Số Linh Hồn', icon: Zap },
];

const CosmicSanctuaryPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ASTROLOGY');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const zodiacDetails = user?.birthDate ? getZodiacDetails(user.birthDate) : null;
  const zodiacRich = zodiacDetails?.key ? ZODIAC_RICH_CONTENT[zodiacDetails.key] : null;
  const lifePath = user?.birthDate ? calculateLifePathNumber(user.birthDate) : null;
  const destinyNumber = user?.name ? calculateDestinyNumber(user.name) : null;
  const personalYear = user?.birthDate ? calculatePersonalYearNumber(user.birthDate, currentYear) : null;
  const recommendedSpread = getRecommendedSpread({ lifePath, zodiacDetails });
  const insights = buildCosmicInsights({ zodiacDetails, lifePath, destinyNumber, personalYear });

  const resonanceScore = useMemo(() => {
    let base = 52;
    if (zodiacDetails) base += 16;
    if (lifePath) base += 12;
    if (destinyNumber) base += 10;
    if (personalYear) base += 8;
    return Math.min(base, 98);
  }, [zodiacDetails, lifePath, destinyNumber, personalYear]);

  const axisScores = useMemo(() => ({
    intuition: Math.min(95, 58 + (zodiacDetails ? 12 : 0) + (lifePath === 7 || lifePath === 11 ? 18 : 7)),
    emotion: Math.min(94, 55 + (zodiacDetails?.element?.includes('Thủy') ? 22 : 8) + (destinyNumber ? 6 : 0)),
    action: Math.min(93, 54 + (zodiacDetails?.element?.includes('Hỏa') ? 22 : 8) + (personalYear === 1 || personalYear === 8 ? 8 : 3)),
    grounding: Math.min(92, 56 + (zodiacDetails?.element?.includes('Thổ') ? 20 : 7) + (lifePath === 4 || lifePath === 8 ? 8 : 3)),
  }), [destinyNumber, lifePath, personalYear, zodiacDetails]);

  const handleProfileAction = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsProfileOpen(true);
  };

  const hasProfile = Boolean(zodiacDetails || lifePath || destinyNumber || personalYear);

  const numerologyCards = [
    {
      id: 'lifePath',
      value: lifePath,
      meaning: lifePath ? LIFE_PATH_MEANINGS[lifePath] : null,
      color: 'mystic-gold',
      border: 'border-mystic-gold/30',
      text: 'text-mystic-gold',
    },
    {
      id: 'destiny',
      value: destinyNumber,
      meaning: destinyNumber ? DESTINY_MEANINGS[destinyNumber] : null,
      color: 'purple-300',
      border: 'border-purple-500/30',
      text: 'text-purple-300',
    },
    {
      id: 'personalYear',
      value: personalYear,
      meaning: personalYear ? PERSONAL_YEAR_MEANINGS[personalYear] : null,
      color: 'emerald-300',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300',
    },
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-20 px-3.5 sm:px-6 md:px-8 max-w-[1536px] mx-auto relative">
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none -z-10" />

      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 mb-10 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl sm:rounded-3xl border border-mystic-gold/25 bg-mystic-dark/85 p-5 sm:p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-10 w-72 h-72 bg-mystic-gold/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-mystic-gold/40 bg-mystic-gold/10 text-mystic-gold text-[10px] font-serif uppercase tracking-[0.32em] mb-6 shadow-[0_0_20px_rgba(212,175,55,0.18)]">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Cosmic Soul Hub</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-6 leading-tight">
              Bản Đồ <span className="gold-text italic">Linh Hồn</span>
            </h1>

            <p className="text-gray-300 font-light text-base md:text-lg leading-relaxed max-w-3xl">
              Nơi tổng hợp chiêm tinh, thần số học và Tarot profile thành một bản đọc có cấu trúc:
              bạn là ai, đang ở chu kỳ nào, và nên hỏi Tarot điều gì để đi tiếp rõ hơn.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleProfileAction}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all cursor-pointer"
              >
                <User size={16} />
                <span>{isAuthenticated ? 'Cập nhật hồ sơ' : 'Đăng nhập để cá nhân hóa'}</span>
              </button>
              <button
                onClick={() => navigate('/tarot')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-mystic-gold/35 bg-mystic-gold/10 text-mystic-gold font-serif font-bold text-xs uppercase tracking-widest hover:bg-mystic-gold/15 transition-all cursor-pointer"
              >
                <BookOpen size={16} />
                <span>Trải bài theo bản đồ</span>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl border border-mystic-gold/25 bg-mystic-dark/85 p-6 md:p-8 flex flex-col"
        >
          {!user?.birthDate ? (
            <div className="flex flex-col items-center justify-center h-full text-center min-h-[200px] opacity-70 m-auto">
              <Star className="w-8 h-8 text-mystic-gold/50 mb-3" />
              <p className="text-sm text-gray-300 font-light">
                Cập nhật ngày sinh để mở khóa <br /> bản đọc chuyên sâu của bạn.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-2xl bg-mystic-gold/15 border border-mystic-gold/25 text-mystic-gold">
                  <Layers className="w-5 h-5 text-mystic-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-mystic-gold font-bold font-serif">Bản đọc nhiều lớp</p>
                  <h2 className="text-xl font-serif font-bold text-white">
                    Insight cá nhân của bạn
                  </h2>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed font-light mb-5">
                Các insight dưới đây được tổng hợp từ dữ liệu chiêm tinh và thần số học của bạn.
              </p>

              <div className="space-y-3">
                {insights.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex gap-3">
                    <ShieldCheck className="w-4 h-4 text-mystic-gold shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </section>

      {!user?.birthDate ? (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 md:p-12 border border-mystic-gold/20 bg-mystic-dark/85 text-center max-w-2xl mx-auto">
          <Star className="w-16 h-16 text-mystic-gold/50 mx-auto mb-6 animate-pulse" />
          <h3 className="text-3xl font-serif text-white font-bold mb-4">Cần Thông Tin Ngày Sinh</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light mb-8">
            Để mở khóa Bản Đồ Chiêm Tinh, Tam Hợp Thần Số và Tần Số Linh Hồn, hệ thống cần biết ngày sinh của bạn. 
            Vui lòng cập nhật thông tin này để nhận các phân tích cá nhân hóa chính xác nhất.
          </p>
          <button
            onClick={handleProfileAction}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-mystic-gold text-mystic-dark font-serif font-bold text-sm uppercase tracking-widest hover:bg-yellow-300 transition-all cursor-pointer"
          >
            <User size={18} />
            <span>Thêm Ngày Sinh</span>
          </button>
        </motion.div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 border-b border-white/10 pb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-serif font-bold tracking-widest uppercase transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-mystic-gold text-mystic-dark shadow-[0_0_25px_rgba(212,175,55,0.35)]'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 text-mystic-gold" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'ASTROLOGY' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {zodiacDetails && zodiacRich ? (
                <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8">
                  <div className="glass rounded-3xl p-8 border border-mystic-gold/30 bg-mystic-dark/90 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-mystic-gold/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative">
                      <ZodiacIcon name={zodiacDetails.key} className="w-16 h-16 mb-5" />
                      <span className="text-xs uppercase tracking-widest text-mystic-gold font-serif font-bold">
                        Cung Bản Mệnh
                      </span>
                      <h2 className="text-3xl font-serif text-white font-bold mt-1 mb-2">{zodiacDetails.name}</h2>
                      <p className="text-xs text-gray-400 font-light mb-6">{zodiacDetails.dateRange}</p>

                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs gap-3">
                          <span className="text-gray-400">Nguyên tố</span>
                          <span className="px-3 py-1 rounded-full bg-mystic-gold/20 border border-mystic-gold/40 text-mystic-gold font-bold">
                            {zodiacDetails.element}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs gap-3">
                          <span className="text-gray-400">Hành tinh trị vì</span>
                          <span className="px-3 py-1 rounded-full bg-mystic-gold/15 border border-mystic-gold/30 text-mystic-gold font-bold">
                            {zodiacDetails.rulingPlanet}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs gap-3">
                          <span className="text-gray-400">Tarot hộ mệnh</span>
                          <span className="text-amber-200 font-serif font-bold text-right">{zodiacRich.tarotAlly}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-3xl border border-mystic-gold/20 bg-white/5 p-6">
                      <h3 className="text-lg font-serif gold-text font-bold mb-3">Bản chất năng lượng</h3>
                      <p className="text-sm text-gray-300 leading-relaxed font-light">{zodiacRich.core}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-3xl border border-mystic-gold/30 bg-mystic-gold/5 p-5">
                        <h4 className="text-sm font-serif font-bold text-mystic-gold mb-2">Điểm mạnh</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{zodiacRich.light}</p>
                      </div>
                      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5">
                        <h4 className="text-sm font-serif font-bold text-amber-300 mb-2">Bài học bóng tối</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{zodiacRich.shadow}</p>
                      </div>
                    </div>
                    {zodiacDetails.compatibility && (
                      <div className="rounded-3xl border border-mystic-gold/20 bg-mystic-gold/5 p-6">
                        <h4 className="text-sm font-serif font-bold text-mystic-gold mb-3 flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Tương hợp và cách đọc
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {zodiacDetails.compatibility.bestMatches.map((match) => (
                            <span key={match} className="px-3 py-1 rounded-full bg-mystic-gold/15 border border-mystic-gold/30 text-mystic-gold font-bold text-xs">
                              {match}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{zodiacDetails.compatibility.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="glass rounded-3xl p-8 md:p-10 border border-white/10 bg-mystic-dark/85">
                  <div className="max-w-3xl mb-8">
                    <Compass className="w-14 h-14 text-mystic-gold/50 mb-4 animate-spin-slow" />
                    <h3 className="text-2xl font-serif text-white font-bold mb-3">Mở khóa bản đồ chiêm tinh cá nhân</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-light">
                      Thêm ngày sinh để hệ thống xác định cung bản mệnh, nguyên tố, hành tinh trị vì và lá Tarot đồng hành.
                      Trước khi cấu hình, bạn vẫn có thể xem trước các lớp phân tích bên dưới.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {COSMIC_EMPTY_PROMISES.map((item) => (
                      <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <h4 className="text-sm font-serif font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'NUMEROLOGY' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {numerologyCards.map((card) => {
                const meta = NUMEROLOGY_CONTENT[card.id];
                const archetype = getNumberArchetype(card.value);

                return (
                  <div key={card.id} className={`glass rounded-3xl p-7 border ${card.border} bg-mystic-dark/90 space-y-5 flex flex-col`}>
                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <span className="p-3 bg-white/5 rounded-2xl text-mystic-gold border border-white/10">
                          <Hash size={22} />
                        </span>
                        <span className={`text-[10px] uppercase tracking-widest ${card.text} font-bold`}>
                          {currentYear}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-serif">{meta.label}</span>
                      <h3 className={`text-4xl font-serif font-bold mt-1 mb-3 ${card.text}`}>
                        {card.value ? `Số #${card.value}` : 'Chờ dữ liệu'}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">{meta.desc}</p>
                      {card.meaning && (
                        <p className="text-xs text-gray-300 font-light leading-relaxed border-t border-white/10 pt-4">
                          {card.meaning}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <p className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold mb-1">Bài học</p>
                        <p className="text-xs text-gray-300 leading-relaxed">{archetype.lesson}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <p className="text-[10px] uppercase tracking-widest text-purple-200 font-bold mb-1">Hành động</p>
                        <p className="text-xs text-gray-300 leading-relaxed">{archetype.action}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'RESONANCE' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8">
              <div className="glass rounded-3xl p-8 md:p-10 border border-mystic-gold/30 bg-mystic-dark/90 text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-mystic-gold/10 border-2 border-mystic-gold/40 flex items-center justify-center relative shadow-[0_0_35px_rgba(212,175,55,0.25)] mb-6">
                  <span className="text-4xl font-serif font-bold gold-text">{resonanceScore}%</span>
                  <div className="absolute inset-0 border border-mystic-gold/30 rounded-full animate-ping pointer-events-none" />
                </div>
                <h3 className="text-2xl font-serif text-white font-bold mb-3">Chỉ Số Hài Hòa Tâm Linh</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Điểm này không phải phán quyết, mà là mức dữ liệu cá nhân hiện có và độ đồng điệu giữa cung, thần số và hướng trải bài.
                </p>
                <button
                  onClick={() => navigate(recommendedSpread.path)}
                  className="mt-8 px-7 py-3 rounded-full bg-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Thử {recommendedSpread.name}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-serif gold-text font-bold mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-mystic-gold" />
                    Spread được đề xuất
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">{recommendedSpread.reason}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RESONANCE_AXES.map((axis) => (
                    <div key={axis.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-serif font-bold text-white">{axis.label}</h4>
                        <span className="text-sm font-serif font-bold text-mystic-gold">{axisScores[axis.id]}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                        <div className="h-full bg-mystic-gold rounded-full" style={{ width: `${axisScores[axis.id]}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{axis.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-mystic-gold/20 bg-mystic-gold/5 p-6">
                  <h3 className="text-lg font-serif font-bold text-mystic-gold mb-4">Bản đồ của bạn nói gì?</h3>
                  <div className="space-y-3">
                    {insights.map((insight) => (
                      <div key={insight} className="flex gap-3 rounded-2xl bg-mystic-dark/50 border border-white/10 p-4">
                        <Star className="w-4 h-4 text-mystic-gold shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-300 leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {isAuthenticated && (
        <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
};

export default CosmicSanctuaryPage;
