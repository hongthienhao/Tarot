import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Zap, LayoutGrid, Layers, Columns, Menu as ListIcon, Activity, ChevronLeft, RefreshCw, BookOpen, Hash, BrainCircuit, Star, Shuffle } from 'lucide-react';
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

// ── Shuffle effect data (pre-computed at module level, no Math.random in render) ──
const RIFFLE_CARDS = Array.from({ length: 20 }, (_, i) => {
  const isLeft = i < 10, idx = i % 10;
  return { id: i, isLeft, stackX: isLeft ? idx*0.4-2 : idx*-0.4+2, stackY: idx*-0.8,
    stackRot: isLeft ? -1+idx*0.1 : 1-idx*0.1, cascadeDelay: 0.35+idx*0.032+(isLeft?0:0.016) };
});
const FAN_CARDS = Array.from({ length: 12 }, (_, i) => {
  const a = (i/12)*2*Math.PI;
  return { id: i, tx: Math.cos(a)*135, ty: Math.sin(a)*135, rot: (i/12)*360, delay: i*0.06 };
});
const OVERHAND_CARDS = Array.from({ length: 18 }, (_, i) => ({
  id: i, delay: i*0.065, stackY: -i*0.7, stackX: i*0.25-2,
}));
const VORTEX_CARDS = Array.from({ length: 16 }, (_, i) => {
  const a = (i/16)*2*Math.PI, r = 55+i*9;
  return { id: i, tx: Math.cos(a)*r, ty: Math.sin(a)*r, rot: 360+i*50, delay: i*0.05 };
});
const EFFECTS = ['riffle','fan','overhand','vortex'];
const CC = 'absolute w-32 h-52 rounded-xl overflow-hidden border border-mystic-gold/40 shadow-2xl';
const CS = { left:0, top:0 };
const CardImg = () => (<><img src="/assets/cards/card_back.jpeg" className="w-full h-full object-cover" alt="" /><div className="absolute inset-0 bg-gradient-to-b from-mystic-gold/5 to-mystic-dark/20" /></>);
const Sparkle = () => (
  <motion.div className="absolute inset-[-24px] rounded-full pointer-events-none" style={{filter:'blur(14px)'}}
    animate={{backgroundColor:['rgba(212,175,55,0)','rgba(212,175,55,0.3)','rgba(212,175,55,0)']}}
    transition={{duration:0.35,delay:1.08,ease:'easeOut'}} />
);

const RiffleEffect = () => (
  <div className="relative pointer-events-none" style={{width:128,height:208}}>
    {RIFFLE_CARDS.map(c => (
      <motion.div key={c.id} className={CC} style={CS}
        initial={{x:c.stackX,y:c.stackY,rotate:c.stackRot,zIndex:c.isLeft?c.id:20-c.id}}
        animate={{
          x:[c.stackX,c.isLeft?-105+c.stackX:105+c.stackX,c.isLeft?-105+c.stackX:105+c.stackX,c.stackX*0.3,0],
          y:[c.stackY,c.stackY-8,c.stackY-8,c.stackY*0.5,0],
          rotate:[c.stackRot,c.isLeft?c.stackRot-8:c.stackRot+8,c.isLeft?c.stackRot-8:c.stackRot+8,c.stackRot*0.4,0],
          zIndex:[c.isLeft?c.id:20-c.id,c.isLeft?c.id:20-c.id,c.id*2,c.id*2,c.id],
        }}
        transition={{duration:1.4,delay:c.cascadeDelay,times:[0,0.22,0.5,0.75,1],ease:[0.25,0.1,0.25,1],zIndex:{duration:0,delay:c.cascadeDelay+0.7}}}
      ><CardImg /></motion.div>
    ))}
    <Sparkle />
  </div>
);

const FanEffect = () => (
  <div className="relative pointer-events-none" style={{width:128,height:208}}>
    {FAN_CARDS.map(c => (
      <motion.div key={c.id} className={CC} style={CS}
        initial={{x:0,y:0,rotate:0,opacity:0.9,scale:1,zIndex:c.id}}
        animate={{
          x:[0,c.tx,c.tx*0.4,0], y:[0,c.ty,c.ty*0.4,0],
          rotate:[0,c.rot,c.rot+180,720], opacity:[0.9,1,0.8,0], scale:[1,0.7,0.9,2],
        }}
        transition={{duration:1.45,delay:c.delay,times:[0,0.35,0.65,1],ease:'easeInOut'}}
      ><CardImg /></motion.div>
    ))}
    <Sparkle />
  </div>
);

const OverhandEffect = () => (
  <div className="relative pointer-events-none" style={{width:128,height:208}}>
    {OVERHAND_CARDS.map(c => (
      <motion.div key={c.id} className={CC} style={CS}
        initial={{x:c.stackX,y:c.stackY,rotate:0,opacity:0.9,zIndex:18-c.id}}
        animate={{
          x:[c.stackX,c.stackX,110+c.id*0.7,0],
          y:[c.stackY,c.stackY-70,-c.id*0.5,0],
          rotate:[0,-10,6,0], opacity:[0.9,1,1,0.9],
          zIndex:[18-c.id,18-c.id,c.id+20,c.id],
        }}
        transition={{duration:1.4,delay:c.delay,times:[0,0.28,0.65,1],ease:[0.25,0.46,0.45,0.94],zIndex:{duration:0,delay:c.delay+0.38}}}
      ><CardImg /></motion.div>
    ))}
    <Sparkle />
  </div>
);

const VortexEffect = () => (
  <div className="relative pointer-events-none" style={{width:128,height:208}}>
    {VORTEX_CARDS.map(c => (
      <motion.div key={c.id} className={CC} style={CS}
        initial={{x:0,y:0,rotate:0,opacity:0.9,scale:1,zIndex:c.id}}
        animate={{
          x:[0,c.tx*0.5,c.tx,c.tx*0.2,0], y:[0,c.ty*0.5,c.ty,c.ty*0.2,0],
          rotate:[0,c.rot*0.4,c.rot,c.rot*1.6,c.rot*2.2],
          opacity:[0.9,1,0.85,0.4,0], scale:[1,1.1,0.8,0.5,1.8],
        }}
        transition={{duration:1.45,delay:c.delay,times:[0,0.25,0.5,0.75,1],ease:[0.25,0.1,0.25,1]}}
      ><CardImg /></motion.div>
    ))}
    <Sparkle />
  </div>
);

const DealingOverlay = ({ visible }) => {
  const effectRef = useRef(null);
  if (visible && !effectRef.current) effectRef.current = EFFECTS[Math.floor(Math.random()*EFFECTS.length)];
  if (!visible) effectRef.current = null;
  const eff = effectRef.current;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,transition:{duration:0.4}}}
          transition={{duration:0.25}}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-mystic-dark/95 backdrop-blur-md"
          style={{cursor:'none',userSelect:'none'}}
          onPointerDown={e=>{e.stopPropagation();e.preventDefault();}}
          onPointerMove={e=>{e.stopPropagation();e.preventDefault();}}
          onClick={e=>{e.stopPropagation();e.preventDefault();}}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div animate={{scale:[1,1.35,1],opacity:[0.15,0.45,0.15]}} transition={{duration:1.5,repeat:Infinity,ease:'easeInOut'}}
              className="w-80 h-80 bg-mystic-gold/20 rounded-full blur-[100px]" />
          </div>
          {eff==='riffle'   && <RiffleEffect />}
          {eff==='fan'      && <FanEffect />}
          {eff==='overhand' && <OverhandEffect />}
          {eff==='vortex'   && <VortexEffect />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const SpreadSelector = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [mode, setMode] = useState('select'); // 'select', 'confirm', 'drawing', 'reading'
  const [isFetching, setIsFetching] = useState(false);
  const [readingResult, setReadingResult] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [pendingSpread, setPendingSpread] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Drawing flow states
  const [availableCards, setAvailableCards] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCardIds, setRevealedCardIds] = useState(new Set());
  const [targetQuantity, setTargetQuantity] = useState(0);
  const [selectedFanIndices, setSelectedFanIndices] = useState(new Set());

  // Refs for scroll targets
  const drawnTrayRef = useRef(null);
  const sectionRef = useRef(null);

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

  const handleSelectSpread = (spread) => {
    setPendingSpread(spread);
    setMode('confirm');
  };

  const handleConfirmShuffle = async () => {
    setIsShuffling(true);
    document.body.classList.add('cursor-dealing');
    try {
      const [response] = await Promise.all([
        apiClient.post('/cards/draw', { quantity: pendingSpread.quantity }),
        new Promise(r => setTimeout(r, 1500)),
      ]);
      setTargetQuantity(pendingSpread.quantity);
      setDrawnCards([]);
      setRevealedCardIds(new Set());
      setAvailableCards(response.data.data.cards);
      setReadingResult(response.data.data);
      setMode('drawing');
      window.scrollTo({ top: document.getElementById('spreads').offsetTop - 100, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching cards:', error);
      alert('Có lỗi xảy ra. Vui lòng kiểm tra backend.');
    } finally {
      document.body.classList.remove('cursor-dealing');
      setIsShuffling(false);
    }
  };

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
    
    // Phase 3: track which fan position was selected so FanCard can animate exit
    setSelectedFanIndices(prev => new Set([...prev, index]));
    setDrawnCards(prev => [...prev, nextCard]);
    setAvailableCards(newAvailable);
    
    // Always scroll tray into view so user can see the newly picked card
    requestAnimationFrame(() => {
      drawnTrayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    if (newAvailable.length === 0) {
      // Give scroll time to settle (300ms), then wait for gold-exit animation (700ms)
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      setTimeout(() => setMode('reading'), 1100);
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
    setPendingSpread(null);
    setSelectedFanIndices(new Set());
  };

  return (
    <section id="spreads" ref={sectionRef} className="py-32 px-6 relative min-h-screen">
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
                    onClick={() => handleSelectSpread(spread)}
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
          ) : mode === 'confirm' ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-10"
            >
              <div className="w-full">
                <button onClick={() => setMode('select')} className="flex items-center gap-2 text-mystic-gold/60 hover:text-mystic-gold transition-colors uppercase tracking-widest text-xs font-bold">
                  <ChevronLeft size={16} /> Thay đổi
                </button>
              </div>
              <motion.div className="p-6 bg-mystic-gold/10 rounded-3xl text-mystic-gold border border-mystic-gold/20"
                animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }}
              >
                {pendingSpread?.icon}
              </motion.div>
              <div className="text-center">
                <p className="text-mystic-gold/60 uppercase tracking-[0.4em] text-[10px] mb-2">{pendingSpread?.tagline}</p>
                <h2 className="text-4xl md:text-5xl font-serif gold-text mb-4">{pendingSpread?.name}</h2>
                <p className="text-gray-400 font-light max-w-md mx-auto">{pendingSpread?.description}</p>
              </div>
              <motion.button
                onClick={handleConfirmShuffle}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="btn-shuffle relative flex items-center gap-3 px-14 py-5 text-mystic-dark font-serif text-xl font-bold tracking-widest uppercase rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)' }}
              >
                <motion.div className="absolute inset-0 bg-white/20" animate={{ opacity: [0, 0.4, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                <Shuffle size={22} />
                <span className="relative">Xào Bài</span>
              </motion.button>
              <p className="text-mystic-gold/30 text-xs italic tracking-widest">Hãy tập trung vào câu hỏi của bạn trước khi xào bài</p>
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
                <motion.div
                  key={drawnCards.length}
                  initial={{ scale: 1.35, backgroundColor: 'rgba(212,175,55,0.25)' }}
                  animate={{ scale: 1, backgroundColor: 'rgba(212,175,55,0.08)' }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-mystic-gold/20 rounded-full text-mystic-gold text-xs font-bold uppercase tracking-widest"
                >
                  Đã chọn: {drawnCards.length} / {targetQuantity}
                </motion.div>
              </div>

              <CardFan 
                count={78} 
                onSelect={handleSelectFromFan} 
                isDrawing={drawnCards.length >= targetQuantity}
                selectedIndices={selectedFanIndices}
              />

              {/* Bottom list of drawn cards - Phase 2 enhanced */}
              <div
                ref={drawnTrayRef}
                id="drawn-tray"
                className="mt-12 scroll-mt-24 flex flex-col items-center gap-6"
              >
                {/* Tray label */}
                {drawnCards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-px w-12 bg-mystic-gold/30" />
                    <span className="text-mystic-gold/50 uppercase tracking-[0.3em] text-[10px] font-bold">
                      Khay bài — {drawnCards.length} / {targetQuantity}
                    </span>
                    <div className="h-px w-12 bg-mystic-gold/30" />
                  </motion.div>
                )}

                <div className="flex justify-center gap-4 flex-wrap">
                  <AnimatePresence>
                    {drawnCards.map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 80, scale: 0.4, rotateY: 90 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        className={`w-24 md:w-40 aspect-[1/1.7] rounded-lg overflow-hidden shadow-lg relative border border-mystic-gold/30 ${
                          i === drawnCards.length - 1 ? 'slot-glow-enter' : ''
                        }`}
                      >
                        {i === drawnCards.length - 1 && (
                          <motion.div
                            className="absolute inset-0 bg-mystic-gold/30 z-10 pointer-events-none rounded-lg"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 1.2 }}
                          />
                        )}
                        <img src="/assets/cards/card_back.jpeg" className="w-full h-full object-cover" alt="Selected" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
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
                           <div className="w-[160px] md:w-[260px]">
                             <TarotCard 
                               card={card} 
                               index={index} 
                               isRevealed={revealedCardIds.has(card.id)}
                               onFlip={handleFlip}
                             />
                           </div>
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
                                <div className="w-full max-w-[85vw] md:w-[336px] aspect-[1/1.7] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 border-mystic-gold/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] shrink-0">
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
      
      {/* Dealing Animation Overlay */}
      <DealingOverlay visible={isShuffling} />

      {/* Loading Overlay (for refresh) */}
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
