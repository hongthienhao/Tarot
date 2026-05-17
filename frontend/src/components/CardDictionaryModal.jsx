import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Sparkles, 
  BookOpen, 
  RotateCw, 
  Compass, 
  HelpCircle,
  Flame,
  Heart,
  Swords,
  Coins,
  ArrowLeft
} from 'lucide-react';
import apiClient from '../api/client';

const CardDictionaryModal = ({ isOpen, onClose }) => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'MAJOR' | 'WANDS' | 'CUPS' | 'SWORDS' | 'PENTACLES'
  const [selectedCard, setSelectedCard] = useState(null);
  const [isReversed, setIsReversed] = useState(false);

  // Fetch all seeded cards on mount when modal opens
  useEffect(() => {
    if (isOpen) {
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
          setError('Không thể mở cổ thư giải nghĩa. Vui lòng kết nối lại sau.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCards();
      // Reset views
      setSelectedCard(null);
      setIsReversed(false);
      setSearchTerm('');
      setActiveTab('ALL');
    }
  }, [isOpen]);

  // Filter cards based on search input and active category tab
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // 1. Search term match
      const nameMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Tab filter match
      let tabMatch = false;
      if (activeTab === 'ALL') {
        tabMatch = true;
      } else if (activeTab === 'MAJOR') {
        tabMatch = card.arcana === 'MAJOR';
      } else {
        // Minor Suits
        tabMatch = card.arcana === 'MINOR' && card.suit === activeTab;
      }

      return nameMatch && tabMatch;
    });
  }, [cards, searchTerm, activeTab]);

  const tabs = [
    { id: 'ALL', label: 'Tất cả', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'MAJOR', label: 'Đại Ẩn (Major)', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'WANDS', label: 'Bộ Gậy (Wands)', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'CUPS', label: 'Bộ Cốc (Cups)', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'SWORDS', label: 'Bộ Kiếm (Swords)', icon: <Swords className="w-3.5 h-3.5" /> },
    { id: 'PENTACLES', label: 'Bộ Tiền (Pentacles)', icon: <Coins className="w-3.5 h-3.5" /> }
  ];

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsReversed(false);
  };

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

          {/* Main Modal Chamber */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-7xl h-[88vh] bg-black/40 border border-mystic-gold/25 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col glass"
          >
            {/* Elegant Header */}
            <div className="p-6 md:p-8 border-b border-mystic-gold/15 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-mystic-dark/50 z-20 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mystic-gold/10 rounded-2xl text-mystic-gold border border-mystic-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <BookOpen className="w-6 h-6 animate-pulse-slow" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-white tracking-widest uppercase">
                    Cổ Thư <span className="gold-text italic">Giải Nghĩa</span>
                  </h2>
                  <p className="text-[10px] text-mystic-gold/60 uppercase tracking-[0.25em] font-serif font-bold">
                    Khám Phá Sâu Sắc Ý Nghĩa 78 Lá Bài Tarot
                  </p>
                </div>
              </div>

              {/* Search input field */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tra cứu tên lá bài..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 bg-mystic-dark/70 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-mystic-gold/40 focus:ring-1 focus:ring-mystic-gold/20 transition-all font-light"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Close Modal Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 md:static p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all shadow-md cursor-pointer"
                title="Đóng cổ thư"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-header Filter Tabs */}
            <div className="px-6 md:px-8 py-4 border-b border-white/5 bg-mystic-dark/30 z-10 overflow-x-auto no-scrollbar shrink-0 flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-mystic-gold text-mystic-dark border-mystic-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] font-bold'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Middle Container: Grid Catalog or Detailed view */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {selectedCard ? (
                  /* --- CARD DETAIL VIEW PANEL --- */
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 md:p-12 bg-mystic-dark/90 flex flex-col lg:flex-row gap-12"
                  >
                    {/* Left: Interactive 3D Card Graphic */}
                    <div className="flex flex-col items-center gap-6 shrink-0 lg:w-[400px]">
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="self-start flex items-center gap-2 text-mystic-gold/60 hover:text-mystic-gold text-xs uppercase tracking-widest font-bold font-serif mb-2 transition-all cursor-pointer group"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Trở về thư viện</span>
                      </button>

                      {/* Card Container (Z-Axis flat rotation representing Tarot reversal) */}
                      <div className="relative w-[230px] h-[391px] md:w-[270px] md:h-[459px] shrink-0 overflow-hidden rounded-[2rem] border-2 border-mystic-gold/30 shadow-2xl bg-mystic-dark">
                        <motion.div
                          animate={{ rotate: isReversed ? 180 : 0 }}
                          transition={{ type: 'spring', damping: 22, stiffness: 120 }}
                          className="w-full h-full relative flex items-center justify-center"
                        >
                          <img
                            src={selectedCard.imagePath}
                            alt={selectedCard.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
                        </motion.div>
                      </div>

                      {/* Card Interaction Flip Trigger */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsReversed(!isReversed)}
                        className="flex items-center gap-2.5 px-6 py-3 bg-mystic-gold/15 hover:bg-mystic-gold/25 border border-mystic-gold/45 rounded-xl text-mystic-gold text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] cursor-pointer"
                      >
                        <RotateCw className={`w-4 h-4 transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`} />
                        <span>Xoay 180° xem chiều {isReversed ? 'Ngược' : 'Xuôi'}</span>
                      </motion.button>
                    </div>

                    {/* Right: Immersive Card Meanings Content */}
                    <div className="flex-1 space-y-8">
                      <div>
                        <div className="flex items-center gap-3 text-mystic-gold/60 uppercase tracking-[0.35em] text-[10px] font-bold mb-2">
                          <span>{selectedCard.arcana} ARCANA</span>
                          {selectedCard.suit && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold/20" />
                              <span>Bộ {selectedCard.suit}</span>
                            </>
                          )}
                          <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold/20" />
                          <span>Lá Số {selectedCard.number}</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg font-bold">
                          {selectedCard.name}
                        </h1>
                      </div>

                      {/* Interactive Display of Upright/Reversed Text based on visual state */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                        {/* Upright Meaning Box */}
                        <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ${
                          !isReversed 
                            ? 'bg-mystic-gold/10 border-mystic-gold/40 shadow-[0_15px_30px_rgba(212,175,55,0.08)] scale-[1.02]' 
                            : 'bg-white/5 border-white/5 opacity-50'
                        }`}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-mystic-gold/20 flex items-center justify-center text-mystic-gold font-bold text-xs uppercase tracking-wide">
                              ↑
                            </div>
                            <h3 className="text-lg font-serif font-bold text-mystic-gold">Ý Nghĩa Xuôi (Upright)</h3>
                          </div>
                          <p className="text-sm font-light text-gray-200 leading-relaxed tracking-wide">
                            {selectedCard.meaningUpright}
                          </p>
                        </div>

                        {/* Reversed Meaning Box */}
                        <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ${
                          isReversed 
                            ? 'bg-mystic-gold/10 border-mystic-gold/40 shadow-[0_15px_30px_rgba(212,175,55,0.08)] scale-[1.02]' 
                            : 'bg-white/5 border-white/5 opacity-50'
                        }`}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-mystic-gold/20 flex items-center justify-center text-mystic-gold font-bold text-xs uppercase tracking-wide">
                              ↓
                            </div>
                            <h3 className="text-lg font-serif font-bold text-mystic-gold">Ý Nghĩa Ngược (Reversed)</h3>
                          </div>
                          <p className="text-sm font-light text-gray-200 leading-relaxed tracking-wide">
                            {selectedCard.meaningReversed}
                          </p>
                        </div>
                      </div>

                      {/* Spiritual Guidance Advice */}
                      <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-mystic-purple/10 to-transparent relative overflow-hidden">
                        <div className="absolute -top-6 -right-6">
                          <Compass className="w-12 h-12 text-mystic-gold/20" />
                        </div>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-serif text-mystic-gold font-bold mb-3 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-mystic-gold" /> Chiêm nghiệm cốt tủy
                        </h4>
                        <p className="text-sm font-light text-gray-300 leading-relaxed italic">
                          Mỗi lá bài rút lên phản chiếu chính xác tần sóng rung động của bạn. Lá {selectedCard.name} ở chiều {isReversed ? 'Ngược' : 'Xuôi'} nhắn gửi bạn hướng trực giác vào sâu bên trong, khám phá thông điệp chữa lành và định vị lại những ngả rẽ mệnh vận trong cuộc đời.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* --- GRID CATALOG OF ALL FILTERED CARDS --- */
                  <motion.div
                    key="catalog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 md:p-8"
                  >
                    {isLoading && (
                      <div className="h-full flex flex-col items-center justify-center text-center py-24">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mb-4"
                        >
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
                        <p>Không tìm thấy lá bài nào khớp với từ khóa tìm kiếm.</p>
                      </div>
                    )}

                    {!isLoading && !error && filteredCards.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {filteredCards.map((card, index) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.015, 0.3) }}
                            onClick={() => handleCardClick(card)}
                            whileHover={{ y: -6 }}
                            className="group relative cursor-pointer"
                          >
                            {/* Cosmic Gold Shadow Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-mystic-gold/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                            
                            <div className="glass p-3 rounded-2xl border-white/5 group-hover:border-mystic-gold/30 transition-all duration-300 flex flex-col h-full bg-mystic-dark/40 shadow-lg">
                              {/* Small card visual preview */}
                              <div className="aspect-[1/1.7] rounded-xl overflow-hidden border border-white/10 group-hover:border-mystic-gold/20 transition-colors duration-300 relative shadow-inner mb-3">
                                <img
                                  src={card.imagePath}
                                  alt={card.name}
                                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors pointer-events-none" />
                              </div>

                              {/* Title */}
                              <h4 className="text-xs md:text-sm font-serif text-gray-300 group-hover:text-mystic-gold transition-colors font-medium truncate text-center w-full px-1">
                                {card.name}
                              </h4>
                              
                              <div className="text-[8px] text-center font-bold uppercase tracking-widest text-mystic-gold/40 group-hover:text-mystic-gold/60 mt-1.5 transition-colors">
                                {card.arcana}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Decors: Golden bottom margin bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CardDictionaryModal;
