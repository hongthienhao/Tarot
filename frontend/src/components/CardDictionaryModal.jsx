import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Coins,
  Compass,
  Flame,
  Heart,
  HelpCircle,
  RotateCw,
  Search,
  Sparkles,
  Swords,
  X,
} from 'lucide-react';
import apiClient from '../api/client';
import { getArcanaLabel, getSuitLabel, getTarotCardContent } from '../data/tarotDictionaryContent';
import ProtectedImage from './ProtectedImage';

const categoryTabs = [
  { id: 'ALL', label: 'Tất cả', icon: BookOpen },
  { id: 'MAJOR', label: 'Đại Ẩn', icon: Sparkles },
  { id: 'WANDS', label: 'Bộ Gậy', icon: Flame },
  { id: 'CUPS', label: 'Bộ Cốc', icon: Heart },
  { id: 'SWORDS', label: 'Bộ Kiếm', icon: Swords },
  { id: 'PENTACLES', label: 'Bộ Xu', icon: Coins },
];

const topicTabs = [
  { id: 'overview', label: 'Tổng quan', icon: BookOpen },
  { id: 'love', label: 'Tình yêu', icon: Heart },
  { id: 'career', label: 'Công việc', icon: Briefcase },
  { id: 'finance', label: 'Tài chính', icon: Coins },
  { id: 'spirituality', label: 'Tinh thần', icon: Sparkles },
];

const getTopicText = (content, topicId) => {
  if (topicId === 'overview') return content.summary;
  return content[topicId];
};

const CardDictionaryModal = ({ isOpen, onClose }) => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedCard, setSelectedCard] = useState(null);
  const [isReversed, setIsReversed] = useState(false);
  const [activeTopic, setActiveTopic] = useState('overview');

  useEffect(() => {
    if (!isOpen) return;

    const fetchCards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/cards');
        if (response.data?.status === 'success') {
          setCards(response.data.data.cards);
        } else {
          throw new Error('Không thể tải thư viện bài');
        }
      } catch (err) {
        console.error('Lỗi khi tải từ điển bài:', err);
        setError('Tín hiệu đến cổ thư giải nghĩa bị gián đoạn. Vui lòng gửi lại tín hiệu sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
    setSelectedCard(null);
    setIsReversed(false);
    setSearchTerm('');
    setActiveTab('ALL');
    setActiveTopic('overview');
  }, [isOpen]);

  const filteredCards = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return cards.filter((card) => {
      const content = getTarotCardContent(card);
      const haystack = [
        card.name,
        card.arcana,
        card.suit,
        getArcanaLabel(card.arcana),
        getSuitLabel(card.suit),
        content?.viName,
        content?.summary,
        ...(content?.keywords || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const searchMatch = !normalizedSearch || haystack.includes(normalizedSearch);
      const tabMatch = activeTab === 'ALL'
        || (activeTab === 'MAJOR' && card.arcana === 'MAJOR')
        || (card.arcana === 'MINOR' && card.suit === activeTab);

      return searchMatch && tabMatch;
    });
  }, [cards, searchTerm, activeTab]);

  const selectedContent = getTarotCardContent(selectedCard);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsReversed(false);
    setActiveTopic('overview');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-mystic-dark/95 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-7xl h-[88vh] bg-black/40 border border-mystic-gold/25 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col glass"
          >
            <div className="p-6 md:p-8 border-b border-mystic-gold/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-mystic-dark/50 z-20 shrink-0">
              <div className="flex items-center gap-4 pr-12 lg:pr-0">
                <div className="p-3 bg-mystic-gold/10 rounded-2xl text-mystic-gold border border-mystic-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <BookOpen className="w-6 h-6 animate-pulse-slow" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-white tracking-widest uppercase">
                    Cổ Thư <span className="gold-text italic">Giải Nghĩa</span>
                  </h2>
                  <p className="text-[10px] text-mystic-gold/60 uppercase tracking-[0.25em] font-serif font-bold">
                    78 lá bài - xuôi, ngược, tình yêu, công việc, tài chính và tinh thần
                  </p>
                </div>
              </div>

              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tra cứu tên lá, keyword, bộ bài..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 bg-mystic-dark/70 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-mystic-gold/40 focus:ring-1 focus:ring-mystic-gold/20 transition-all font-light"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="absolute top-6 right-6 lg:static p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all shadow-md cursor-pointer"
                title="Đóng cổ thư"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 md:px-8 py-4 border-b border-white/5 bg-mystic-dark/30 z-10 overflow-x-auto no-scrollbar shrink-0 flex gap-2">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-mystic-gold text-mystic-dark border-mystic-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] font-bold'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {selectedCard && selectedContent ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-mystic-dark/90"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">
                      <div className="flex flex-col items-center gap-6">
                        <button
                          onClick={() => setSelectedCard(null)}
                          className="self-start flex items-center gap-2 text-mystic-gold/70 hover:text-mystic-gold text-xs uppercase tracking-widest font-bold font-serif transition-all cursor-pointer group"
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          <span>Trở về thư viện</span>
                        </button>

                        <div className="relative w-[230px] h-[391px] md:w-[270px] md:h-[459px] shrink-0 overflow-hidden rounded-[2rem] border-2 border-mystic-gold/30 shadow-2xl bg-mystic-dark">
                          <motion.div
                            animate={{ rotate: isReversed ? 180 : 0 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 120 }}
                            className="w-full h-full relative flex items-center justify-center"
                          >
                            <ProtectedImage src={selectedCard.imagePath} alt={selectedCard.name} className="w-full h-full object-cover" showWatermark={true} />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
                          </motion.div>
                        </div>

                        <button
                          onClick={() => setIsReversed(!isReversed)}
                          className="flex items-center gap-2.5 px-6 py-3 bg-mystic-gold/15 hover:bg-mystic-gold/25 border border-mystic-gold/45 rounded-xl text-mystic-gold text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] cursor-pointer"
                        >
                          <RotateCw className={`w-4 h-4 transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`} />
                          <span>Chiều {isReversed ? 'Ngược' : 'Xuôi'}</span>
                        </button>

                        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-5">
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Metadata</p>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between gap-4">
                              <span className="text-gray-400">Arcana</span>
                              <span className="text-mystic-gold font-bold">{getArcanaLabel(selectedCard.arcana)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-gray-400">Bộ</span>
                              <span className="text-purple-200 font-bold">{selectedCard.suit ? getSuitLabel(selectedCard.suit) : 'Major'}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-gray-400">Số</span>
                              <span className="text-white font-bold">#{selectedCard.number}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-7">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-mystic-gold/60 uppercase tracking-[0.28em] text-[10px] font-bold mb-3">
                            <span>{getArcanaLabel(selectedCard.arcana)}</span>
                            {selectedCard.suit && (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold/20" />
                                <span>{getSuitLabel(selectedCard.suit)}</span>
                              </>
                            )}
                          </div>
                          <h1 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg font-bold mb-2">
                            {selectedCard.name}
                          </h1>
                          <p className="text-lg font-serif text-mystic-gold">{selectedContent.viName}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {selectedContent.keywords.map((keyword) => (
                            <span key={keyword} className="px-3 py-1 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 text-mystic-gold text-xs font-semibold">
                              {keyword}
                            </span>
                          ))}
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                          <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-center gap-2">
                            <Compass className="w-5 h-5 text-mystic-gold" />
                            Tổng quan biểu tượng
                          </h3>
                          <p className="text-sm text-gray-300 leading-relaxed font-light">{selectedContent.summary}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${
                            !isReversed
                              ? 'bg-mystic-gold/10 border-mystic-gold/40 shadow-[0_15px_30px_rgba(212,175,55,0.08)]'
                              : 'bg-white/5 border-white/10 opacity-65'
                          }`}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-mystic-gold/20 flex items-center justify-center text-mystic-gold font-bold text-xs">↑</div>
                              <h3 className="text-lg font-serif font-bold text-mystic-gold">Ý Nghĩa Xuôi</h3>
                            </div>
                            <p className="text-sm font-light text-gray-200 leading-relaxed">{selectedCard.meaningUpright}</p>
                          </div>

                          <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${
                            isReversed
                              ? 'bg-mystic-gold/10 border-mystic-gold/40 shadow-[0_15px_30px_rgba(212,175,55,0.08)]'
                              : 'bg-white/5 border-white/10 opacity-65'
                          }`}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-mystic-gold/20 flex items-center justify-center text-mystic-gold font-bold text-xs">↓</div>
                              <h3 className="text-lg font-serif font-bold text-mystic-gold">Ý Nghĩa Ngược</h3>
                            </div>
                            <p className="text-sm font-light text-gray-200 leading-relaxed">{selectedCard.meaningReversed}</p>
                          </div>
                        </div>

                        <div className="rounded-[2rem] border border-purple-500/20 bg-purple-500/5 p-5">
                          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
                            {topicTabs.map((tab) => {
                              const Icon = tab.icon;
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => setActiveTopic(tab.id)}
                                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                                    activeTopic === tab.id
                                      ? 'bg-purple-300 text-mystic-dark'
                                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  <span>{tab.label}</span>
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-sm text-gray-200 leading-relaxed font-light">
                            {getTopicText(selectedContent, activeTopic)}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-[2rem] border border-mystic-gold/20 bg-mystic-gold/5 p-6">
                            <h4 className="text-xs uppercase tracking-[0.2em] font-serif text-mystic-gold font-bold mb-3 flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              Câu hỏi chiêm nghiệm
                            </h4>
                            <p className="text-sm font-light text-gray-300 leading-relaxed italic">
                              "{selectedContent.journalPrompt}"
                            </p>
                          </div>

                          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                            <h4 className="text-xs uppercase tracking-[0.2em] font-serif text-mystic-gold font-bold mb-3">
                              Hành động nhỏ
                            </h4>
                            <p className="text-sm font-light text-gray-300 leading-relaxed">{selectedContent.advice}</p>
                          </div>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-mystic-dark/70 p-6">
                          <h4 className="text-xs uppercase tracking-[0.2em] font-serif text-gray-400 font-bold mb-3">Lá liên quan nên khám phá tiếp</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedContent.relatedCards.map((cardName) => (
                              <span key={cardName} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                                {cardName}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-4">
                            Các lá liên quan giúp bạn đọc rộng hơn một tình huống thay vì xem một lá bài như câu trả lời tuyệt đối.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="catalog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 md:p-8"
                  >
                    {isLoading && (
                      <div className="h-full flex flex-col items-center justify-center text-center py-24">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="mb-4">
                          <Sparkles className="w-10 h-10 text-mystic-gold" />
                        </motion.div>
                        <p className="text-mystic-gold/50 font-serif tracking-widest text-sm animate-pulse">
                          ĐANG TRUY VẤN CỔ THƯ GIẢI NGHĨA...
                        </p>
                      </div>
                    )}

                    {!isLoading && error && (
                      <div className="max-w-md mx-auto text-center py-20 p-8 glass border-red-500/20 rounded-3xl">
                        <HelpCircle className="w-12 h-12 text-red-400 mx-auto mb-4 animate-bounce" />
                        <p className="text-red-300 font-light text-sm">{error}</p>
                      </div>
                    )}

                    {!isLoading && !error && filteredCards.length === 0 && (
                      <div className="text-center py-32 text-gray-500 font-light text-sm max-w-sm mx-auto">
                        <Compass className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p>Không tìm thấy lá bài nào khớp với tên, keyword hoặc bộ bài.</p>
                      </div>
                    )}

                    {!isLoading && !error && filteredCards.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {filteredCards.map((card, index) => {
                          const content = getTarotCardContent(card);
                          return (
                            <motion.button
                              key={card.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(index * 0.015, 0.3) }}
                              onClick={() => handleCardClick(card)}
                              whileHover={{ y: -6 }}
                              className="group relative cursor-pointer text-left"
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-mystic-gold/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                              <div className="glass p-3 rounded-2xl border-white/5 group-hover:border-mystic-gold/30 transition-all duration-300 flex flex-col h-full bg-mystic-dark/40 shadow-lg">
                                <div className="aspect-[1/1.7] rounded-xl overflow-hidden border border-white/10 group-hover:border-mystic-gold/20 transition-colors duration-300 relative shadow-inner mb-3">
                                  <ProtectedImage src={card.imagePath} alt={card.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" showWatermark={true} />
                                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors pointer-events-none" />
                                </div>

                                <h4 className="text-xs md:text-sm font-serif text-gray-300 group-hover:text-mystic-gold transition-colors font-medium text-center w-full px-1 leading-snug">
                                  {card.name}
                                </h4>

                                <p className="text-[9px] text-center font-bold uppercase tracking-widest text-mystic-gold/50 mt-1.5">
                                  {content.viName}
                                </p>

                                <div className="flex flex-wrap justify-center gap-1 mt-3">
                                  {content.keywords.slice(0, 2).map((keyword) => (
                                    <span key={keyword} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] text-gray-400">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CardDictionaryModal;
