import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Zap, LayoutGrid, Layers, Columns, Menu as ListIcon, Activity, ChevronLeft, Info, RefreshCw, BookOpen, Hash, BrainCircuit, Star } from 'lucide-react';
import apiClient from '../api/client';
import TarotCard from './TarotCard';
import CardFan from './CardFan';

const spreads = [
  {
    id: 1,
    name: 'Một Lá Bài',
    tagline: 'Nhanh, trực tiếp',
    description: 'Tìm kiếm sự hướng dẫn nhanh chóng cho những vấn đề cụ thể hoặc lấy cảm hứng cho ngày mới.',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-mystic-purple',
    delay: 0.1,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Hai Lá Bài',
    tagline: 'So sánh / Lựa chọn',
    description: 'Phân tích hai khía cạnh của một vấn đề hoặc cân nhắc giữa hai lựa chọn khác nhau.',
    icon: <Columns className="w-8 h-8" />,
    color: 'from-mystic-wine',
    delay: 0.15,
    quantity: 2,
  },
  {
    id: 3,
    name: 'Ba Lá Bài',
    tagline: 'Phổ biến nhất',
    description: 'Khám phá sự kết nối giữa Quá khứ, Hiện tại và Tương lai để có cái nhìn toàn cảnh.',
    icon: <Eye className="w-8 h-8" />,
    color: 'from-mystic-purple',
    delay: 0.2,
    quantity: 3,
  },
  {
    id: 5,
    name: 'Năm Lá Bài',
    tagline: 'Phân tích vấn đề',
    description: 'Phân tích sâu sắc các khía cạnh của một tình huống hoặc mối quan hệ phức tạp.',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-mystic-wine',
    delay: 0.25,
    quantity: 5,
  },
  {
    id: 7,
    name: 'Bảy Lá Bài',
    tagline: 'Mở rộng góc nhìn',
    description: 'Đào sâu vào các yếu tố ảnh hưởng và tìm kiếm giải pháp tối ưu cho vấn đề.',
    icon: <Layers className="w-8 h-8" />,
    color: 'from-mystic-purple',
    delay: 0.3,
    quantity: 7,
  },
  {
    id: 10,
    name: '10 Lá Bài',
    tagline: 'Celtic Cross (Sâu & đầy đủ)',
    description: 'Trải bài kinh điển giúp thấu hiểu toàn diện về vận mệnh và những yếu tố ẩn giấu.',
    icon: <LayoutGrid className="w-8 h-8" />,
    color: 'from-mystic-gold',
    delay: 0.35,
    quantity: 10,
  },
  {
    id: 11,
    name: 'Trải Chuyên Sâu',
    tagline: '>10 lá / Custom',
    description: 'Dành cho những hành trình khám phá tâm linh chuyên sâu hoặc yêu cầu tùy chỉnh đặc biệt.',
    icon: <Activity className="w-8 h-8" />,
    color: 'from-mystic-gold',
    delay: 0.4,
    quantity: 12,
  },
];

const SpreadSelector = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [mode, setMode] = useState('select'); // 'select', 'drawing', 'reading'
  const [isFetching, setIsFetching] = useState(false);
  const [readingResult, setReadingResult] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  
  // New states for the drawing flow
  const [availableCards, setAvailableCards] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCardIds, setRevealedCardIds] = useState(new Set());
  const [targetQuantity, setTargetQuantity] = useState(0);

  const cardRows = useMemo(() => {
    if (drawnCards.length === 0) return [];
    const total = drawnCards.length;
    
    if (total <= 4) return [drawnCards];
    if (total <= 7) {
      const half = Math.ceil(total / 2);
      return [drawnCards.slice(0, half), drawnCards.slice(half)];
    }
    if (total <= 10) {
      return [drawnCards.slice(0, 3), drawnCards.slice(3, 7), drawnCards.slice(7)];
    }
    const third = Math.ceil(total / 3);
    return [drawnCards.slice(0, third), drawnCards.slice(third, third * 2), drawnCards.slice(third * 2)];
  }, [drawnCards]);

  const handleStartDraw = async (quantity) => {
    try {
      setIsFetching(true);
      setTargetQuantity(quantity);
      setDrawnCards([]);
      setRevealedCardIds(new Set());
      
      const response = await apiClient.post('/cards/draw', { quantity });
      setAvailableCards(response.data.data.cards);
      setReadingResult(response.data.data);
      
      setMode('drawing');
      window.scrollTo({ top: document.getElementById('spreads').offsetTop - 100, behavior: 'smooth' });
      setIsFetching(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      alert('Có lỗi xảy ra khi chuẩn bị bài. Vui lòng kiểm tra backend.');
      setIsFetching(false);
    }
  };

  const handleSelectFromFan = (index) => {
    if (availableCards.length === 0) return;
    
    const nextCard = availableCards[0];
    const newAvailable = availableCards.slice(1);
    
    setDrawnCards([...drawnCards, nextCard]);
    setAvailableCards(newAvailable);
    
    if (newAvailable.length === 0) {
      setTimeout(() => setMode('reading'), 800);
    }
  };

  const handleFlip = (card) => {
    const newRevealed = new Set(revealedCardIds);
    newRevealed.add(card.id);
    setRevealedCardIds(newRevealed);
    setActiveCard(card);
  };

  const handleReset = () => {
    setMode('select');
    setReadingResult(null);
    setActiveCard(null);
    setDrawnCards([]);
    setAvailableCards([]);
    setRevealedCardIds(new Set());
  };

  return (
    <section id="spreads" className="py-32 px-6 relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {mode === 'select' ? (
            <motion.div 
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-16">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-serif mb-6"
                >
                  Chọn <span className="gold-text italic">Hành Trình</span> Của Bạn
                </motion.h2>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 font-light text-lg italic max-w-xl md:text-left text-center"
                  >
                    Mỗi kiểu trải bài là một cánh cổng dẫn vào những tầng lớp khác nhau của trực giác.
                  </motion.p>

                  <div className="flex p-1 bg-mystic-dark/50 border border-mystic-gold/20 rounded-full shrink-0">
                    <button onClick={() => setViewMode('grid')} className={`p-3 rounded-full transition-all ${viewMode === 'grid' ? 'bg-mystic-gold text-mystic-dark' : 'text-mystic-gold/50 hover:text-mystic-gold'}`}>
                      <LayoutGrid size={20} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-3 rounded-full transition-all ${viewMode === 'list' ? 'bg-mystic-gold text-mystic-dark' : 'text-mystic-gold/50 hover:text-mystic-gold'}`}>
                      <ListIcon size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid/List View of Spreads */}
              <div className={viewMode === 'grid' ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-6 max-w-4xl mx-auto"}>
                {spreads.map((spread, i) => (
                  <motion.div
                    key={spread.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: spread.delay }}
                    onClick={() => handleStartDraw(spread.quantity)}
                    className={`group cursor-pointer glass p-8 rounded-[2rem] relative overflow-hidden transition-all duration-500 hover:border-mystic-gold/50 ${viewMode === 'list' ? 'flex items-center gap-10' : ''}`}
                  >
                     <div className={`mb-6 p-4 bg-mystic-dark/50 rounded-2xl w-fit text-mystic-gold ${viewMode === 'list' ? 'mb-0 scale-110' : ''}`}>{spread.icon}</div>
                     <div className="flex-grow">
                        <span className="text-mystic-gold/40 uppercase tracking-[0.3em] text-[10px] font-bold mb-2 block">{spread.tagline}</span>
                        <h3 className="text-2xl font-serif mb-4 gold-text">{spread.name}</h3>
                        <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">{spread.description}</p>
                        <div className="flex items-center gap-3 text-mystic-gold font-bold uppercase tracking-widest text-[10px]">
                          <span>Chọn ngay</span>
                          <div className="h-px w-6 bg-mystic-gold" />
                        </div>
                     </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : mode === 'drawing' ? (
            <motion.div 
              key="drawing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-center"
            >
              <div className="mb-12">
                <h2 className="text-4xl font-serif gold-text mb-4">Hãy Tập Trung...</h2>
                <p className="text-gray-400 italic font-light">
                  Hãy hít thở sâu, tập trung vào câu hỏi của bạn và chọn {targetQuantity} lá bài mà bạn cảm thấy kết nối nhất.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-mystic-gold/10 border border-mystic-gold/20 rounded-full text-mystic-gold text-xs font-bold uppercase tracking-widest">
                  Đã chọn: {drawnCards.length} / {targetQuantity}
                </div>
              </div>

              <CardFan 
                count={22} 
                onSelect={handleSelectFromFan} 
                isDrawing={drawnCards.length >= targetQuantity}
              />

              {/* Bottom list of drawn cards (face down) */}
              <div className="mt-20 flex justify-center gap-4 flex-wrap">
                <AnimatePresence>
                  {drawnCards.map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 50, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="w-24 md:w-40 aspect-[1/1.7] rounded-lg border border-mystic-gold/30 overflow-hidden shadow-lg"
                    >
                      <img src="/assets/cards/card_back.jpeg" className="w-full h-full object-cover" alt="Selected" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-12">
                <button onClick={handleReset} className="flex items-center gap-2 text-mystic-gold/60 hover:text-mystic-gold transition-colors uppercase tracking-widest text-xs font-bold">
                  <ChevronLeft size={16} /> Quay lại
                </button>
                <div className="text-center">
                  <h2 className="text-3xl md:text-5xl font-serif gold-text mb-2">{readingResult?.spreadName}</h2>
                  <p className="text-gray-400 italic text-sm font-light">{readingResult?.description}</p>
                </div>
                <button onClick={() => handleStartDraw(targetQuantity)} className="p-3 border border-mystic-gold/20 rounded-full text-mystic-gold/40 hover:text-mystic-gold transition-all"><RefreshCw size={20} /></button>
              </div>

              <div className="space-y-24">
                {/* Rows of Cards to Flip */}
                <div className="flex flex-col gap-16 items-center">
                  {cardRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap justify-center gap-12 md:gap-20 w-full">
                      {row.map((card, index) => (
                        <div key={card.id} className="flex flex-col items-center gap-4">
                           <div className="flex items-center gap-2 px-3 py-1 bg-mystic-dark/80 border border-mystic-gold/20 rounded-full text-mystic-gold/60 text-[9px] uppercase tracking-[0.2em] font-bold">
                             <Hash size={10} /> <span>Lá bài #{index + (rowIndex * 4) + 1}</span>
                           </div>
                           <TarotCard 
                             card={card} 
                             index={index} 
                             isRevealed={revealedCardIds.has(card.id)}
                             onFlip={handleFlip}
                           />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* AI & Summary Section */}
                <div className="pt-24 border-t border-mystic-gold/10">
                   <div className="grid lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="p-3 bg-mystic-gold/10 rounded-xl text-mystic-gold"><BookOpen size={24} /></div>
                          <h3 className="text-2xl font-serif gold-text uppercase tracking-widest">Thông Điệp Chi Tiết</h3>
                        </div>
                        
                        <div className="space-y-6">
                          {drawnCards.map((card) => (
                            <motion.div
                              key={`meaning-${card.id}`}
                              className={`glass p-10 rounded-[2.5rem] transition-all ${!revealedCardIds.has(card.id) ? 'opacity-30 blur-sm grayscale select-none' : 'opacity-100'}`}
                            >
                              <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
                                <div className="w-full max-w-[85vw] md:w-[450px] aspect-[1/1.7] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 border-mystic-gold/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] shrink-0">
                                  <img src={card.image} className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} alt={card.name} />
                                </div>
                                <div className="pt-6 text-center md:text-left flex-1">
                                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                                    <h4 className="text-4xl font-serif gold-text tracking-wider">
                                      {revealedCardIds.has(card.id) ? card.name : '???'}
                                    </h4>
                                    {card.isReversed && (
                                      <div className="px-5 py-1.5 bg-red-600/20 border border-red-500/50 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                        <span className="text-red-400 text-xs font-bold uppercase tracking-[0.2em]">
                                          Lá bài Ngược
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-gray-200 text-xl md:text-2xl italic font-light leading-relaxed max-w-3xl">
                                    {revealedCardIds.has(card.id) ? card.message : 'Lật lá bài để xem ý nghĩa...'}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* AI Sidebar Placeholder */}
                      <div className="lg:col-span-1">
                        <div className="glass p-8 rounded-3xl border-mystic-gold/30 bg-gradient-to-b from-mystic-gold/5 to-transparent sticky top-32">
                           <div className="flex items-center gap-3 mb-6">
                             <BrainCircuit className="text-mystic-gold animate-pulse" size={28} />
                             <h3 className="text-xl font-serif gold-text">AI Oracle</h3>
                           </div>
                           <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
                             Hệ thống AI đang được tôi luyện để kết nối các lá bài của bạn thành một câu chuyện hoàn chỉnh. 
                           </p>
                           <div className="space-y-4">
                             {[1, 2, 3].map(i => (
                               <div key={i} className="h-4 bg-mystic-gold/10 rounded-full w-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                             ))}
                             <div className="h-4 bg-mystic-gold/10 rounded-full w-2/3 animate-pulse" style={{ animationDelay: '0.8s' }} />
                           </div>
                           <div className="mt-8 pt-8 border-t border-mystic-gold/10 flex items-center justify-between">
                             <span className="text-[10px] text-mystic-gold/40 uppercase tracking-widest font-bold">Status: Training</span>
                             <div className="flex gap-1">
                               <Star size={10} className="text-mystic-gold/20" />
                               <Star size={10} className="text-mystic-gold/20" />
                             </div>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isFetching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-mystic-dark/90 backdrop-blur-md"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-t-2 border-mystic-gold rounded-full animate-spin" />
              <div className="absolute inset-4 border-b-2 border-mystic-gold/40 rounded-full animate-spin-reverse" />
              <Sparkles className="absolute inset-0 m-auto text-mystic-gold" size={32} />
            </div>
            <p className="text-mystic-gold uppercase tracking-[0.4em] text-[10px] animate-pulse">Kết nối với vũ trụ...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SpreadSelector;
