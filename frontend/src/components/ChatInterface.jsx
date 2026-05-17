import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageSquare,
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  Save,
  Check,
  Copy
} from 'lucide-react';

/**
 * ChatInterface Component
 * 
 * A premium, highly aesthetic chat component for Tarot Oracle readings.
 * Features:
 * - Fluid message fade-in and slide-up transitions
 * - Dynamic cosmic "AI thinking" mandala animation
 * - Smart dynamic suggestion chips based on drawn cards
 * - Auto-scroll on new message token stream
 * - Responsive collapsible panel mode to balance layout with card imagery
 * - Golden glassmorphism borders and custom scrollbars
 */
const ChatInterface = ({
  chatHistory = [],
  aiStatus = 'idle', // 'idle' | 'loading' | 'streaming' | 'done' | 'error'
  chatInput = '',
  setChatInput,
  onSendMessage,
  drawnCards = [],
  statusText = '',
  autoSavedText = 'Đã tự động lưu',
  isHistoryMode = false
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const handleCopySpread = () => {
    if (!drawnCards || drawnCards.length === 0) return;
    
    const formattedList = drawnCards.map((c, i) => {
      const name = c?.name || c?.card?.name || `Lá bài #${i + 1}`;
      const isReversed = c?.isReversed;
      const orientation = isReversed ? 'Ngược (Reversed)' : 'Xuôi (Upright)';
      return `${i + 1}. ${name} - ${orientation}`;
    }).join('\n');

    const copyText = `Trải bài Tarot của tôi:\n${formattedList}`;
    
    navigator.clipboard.writeText(copyText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Lỗi khi sao chép trải bài:', err);
      });
  };

  // Auto scroll logic on new streaming/message events
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, aiStatus]);

  // Generate dynamic suggestion chips based on drawn cards
  const suggestionChips = React.useMemo(() => {
    const cardNames = (drawnCards || [])
      .map(c => c?.name || c?.card?.name || '')
      .filter(Boolean);

    const hasReversed = (drawnCards || []).some(c => c?.isReversed);

    if (cardNames.length === 0) {
      return [
        { text: 'Hãy giải bài tổng quan giúp tôi.', icon: <Compass className="w-3.5 h-3.5" /> },
        { text: 'Tôi nên rút ra bài học gì lúc này?', icon: <HelpCircle className="w-3.5 h-3.5" /> },
        { text: 'Lưu ý gì về năng lượng của tôi hiện tại?', icon: <Sparkles className="w-3.5 h-3.5" /> }
      ];
    }

    const suggestions = [];

    if (cardNames.length === 1) {
      suggestions.push({
        text: `Ý nghĩa sâu sắc của lá ${cardNames[0]} là gì?`,
        icon: <HelpCircle className="w-3.5 h-3.5" />
      });
      suggestions.push({
        text: `Lá ${cardNames[0]} có lời khuyên gì cho hành động sắp tới của tôi?`,
        icon: <Compass className="w-3.5 h-3.5" />
      });
    } else {
      // Multiple cards
      suggestions.push({
        text: `Sự kết nối tinh thần giữa các lá bài ${cardNames.slice(0, 2).join(' và ')} là gì?`,
        icon: <Layers className="w-3.5 h-3.5" />
      });
      suggestions.push({
        text: 'Tổng quan bức tranh năng lượng của trải bài này?',
        icon: <Compass className="w-3.5 h-3.5" />
      });
    }

    if (hasReversed) {
      suggestions.push({
        text: 'Lá bài ngược trong trải bài này cảnh báo tôi điều gì?',
        icon: <Sparkles className="w-3.5 h-3.5" />
      });
    } else {
      suggestions.push({
        text: 'Lá bài nào mang năng lượng chủ đạo định hướng cho tôi?',
        icon: <BrainCircuit className="w-3.5 h-3.5" />
      });
    }

    return suggestions.slice(0, 3);
  }, [drawnCards]);

  const handleSuggestionClick = (text) => {
    onSendMessage(text);
    setShowSuggestions(false);
  };

  const handleSend = () => {
    if (chatInput.trim() && aiStatus !== 'streaming') {
      onSendMessage(chatInput);
      setChatInput('');
    }
  };

  // Cosmic thinking animation
  const CosmicThinkingMandala = () => (
    <div className="flex items-center gap-3 bg-mystic-dark/60 border border-mystic-gold/20 px-4 py-2.5 rounded-2xl">
      <div className="relative w-7 h-7 flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div 
          className="absolute inset-0 border border-dashed border-mystic-gold rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner pulsing circle */}
        <motion.div 
          className="w-3 h-3 bg-mystic-gold rounded-full flex items-center justify-center shadow-[0_0_10px_#d4af37]"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Spark particles */}
        <motion.div 
          className="absolute -top-1 w-1 h-1 bg-mystic-gold rounded-full"
          animate={{ y: [-2, -8], opacity: [1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div 
          className="absolute -bottom-1 w-1 h-1 bg-mystic-gold rounded-full"
          animate={{ y: [2, 8], opacity: [1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <span className="text-[10px] text-mystic-gold uppercase tracking-[0.25em] font-serif font-bold animate-pulse-slow">
        Oracle đang suy ngẫm...
      </span>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized State */
          <motion.div
            key="minimized"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={() => setIsMinimized(false)}
            className="cursor-pointer glass p-4 rounded-2xl border-mystic-gold/30 hover:border-mystic-gold/60 bg-gradient-to-r from-mystic-gold/10 via-transparent to-transparent flex items-center justify-between transition-all duration-300 shadow-2xl group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mystic-gold/20 rounded-xl text-mystic-gold group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-serif gold-text font-bold tracking-wider">Soul Oracle</h4>
                <p className="text-[9px] text-gray-400 font-light mt-0.5">Nhấp để tiếp tục trò chuyện tâm giao</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {aiStatus === 'streaming' && (
                <div className="flex gap-1 mr-2">
                  <span className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div className="p-1.5 bg-white/5 rounded-lg text-white/40 group-hover:text-white transition-colors">
                <Maximize2 size={14} />
              </div>
            </div>
          </motion.div>
        ) : (
          /* Maximized (Full Chat) State */
          <motion.div
            key="maximized"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass rounded-3xl border-mystic-gold/35 bg-gradient-to-b from-mystic-gold/5 via-mystic-dark/30 to-mystic-dark/60 flex flex-col h-full shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-mystic-gold/15 flex items-center justify-between shrink-0 bg-mystic-dark/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-mystic-gold/15 rounded-xl text-mystic-gold border border-mystic-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-md font-serif gold-text tracking-widest font-bold">Soul Oracle</h3>
                  <p className="text-[9px] text-gray-400 font-light mt-0.5 tracking-wider">
                    {isHistoryMode ? 'Đàm đạo chiêm tinh về Biên niên sử' : 'Chiêm nghiệm sâu sắc cùng Vũ trụ'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {drawnCards && drawnCards.length > 0 && (
                  <button
                    onClick={handleCopySpread}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-mystic-gold/10 hover:bg-mystic-gold/20 border border-mystic-gold/30 rounded-xl text-mystic-gold text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.05)] cursor-pointer"
                    title="Sao chép danh sách trải bài gồm xuôi và ngược"
                  >
                    {copied ? (
                      <>
                        <Check size={11} className="text-green-400" />
                        <span className="text-green-400">Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all cursor-pointer"
                  title="Thu nhỏ khung chat"
                >
                  <Minimize2 size={14} />
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 min-h-[220px]"
            >
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-mystic-gold/5 border border-mystic-gold/20 flex items-center justify-center text-mystic-gold/40 animate-pulse-slow">
                    <MessageSquare size={28} />
                  </div>
                  <p className="text-gray-300 text-sm font-light leading-relaxed max-w-xs">
                    Vũ trụ đã gửi gắm thông điệp trong những lá bài. Hãy bắt đầu cuộc trò chuyện tâm giao để thấu tỏ.
                  </p>
                  {!isHistoryMode && (
                    <button 
                      onClick={() => onSendMessage('Hãy giải luận tổng quan các lá bài này giúp tôi.')}
                      className="px-6 py-3 bg-mystic-gold/15 hover:bg-mystic-gold/25 border border-mystic-gold/30 rounded-xl text-mystic-gold font-serif text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.05)] cursor-pointer"
                    >
                      Bắt đầu Giải Bài
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((msg, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-4 md:p-5 rounded-[1.8rem] max-w-[90%] shadow-2xl relative transition-all border ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-mystic-gold/20 via-mystic-gold/5 to-transparent border-mystic-gold/30 rounded-tr-none text-mystic-gold' 
                          : 'bg-mystic-dark/50 border-white/5 rounded-tl-none text-gray-200'
                      }`}>
                        <div className="text-[9px] font-bold mb-1.5 uppercase tracking-[0.2em] opacity-40">
                          {msg.role === 'user' ? 'Bạn' : 'Bậc Thầy'}
                        </div>
                        <div className="prose prose-invert max-w-none text-sm font-light leading-relaxed whitespace-pre-wrap selection:bg-mystic-gold selection:text-mystic-dark">
                          {msg.text.replace(/\*\*/g, '')}
                          {msg.role === 'ai' && idx === chatHistory.length - 1 && aiStatus === 'streaming' && (
                            <motion.span 
                              className="inline-block w-2 h-2 ml-2 bg-mystic-gold shadow-[0_0_8px_rgba(212,175,55,0.9)] align-middle"
                              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8], rotate: [0, 90, 180] }} 
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {aiStatus === 'loading' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center"
                    >
                      <CosmicThinkingMandala />
                    </motion.div>
                  )}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions Block */}
            {showSuggestions && chatHistory.length > 0 && aiStatus === 'idle' && (
              <div className="px-6 pb-2 shrink-0">
                <div className="flex flex-wrap gap-2">
                  {suggestionChips.map((chip, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleSuggestionClick(chip.text)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 175, 55, 0.15)' }}
                      className="flex items-center gap-2 px-3.5 py-2 bg-mystic-gold/5 border border-mystic-gold/15 rounded-full text-mystic-gold/80 hover:text-mystic-gold text-[10px] font-medium tracking-wide transition-all shadow-sm cursor-pointer"
                    >
                      {chip.icon}
                      <span>{chip.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* User Input Form */}
            <div className="p-5 border-t border-mystic-gold/10 bg-mystic-dark/50 shrink-0">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Hỏi tiếp linh tính từ trải bài của bạn..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  disabled={aiStatus === 'streaming' || aiStatus === 'loading'}
                  className="w-full pl-5 pr-14 py-4 bg-mystic-dark/80 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-mystic-gold/45 focus:bg-mystic-dark/95 transition-all text-sm font-light shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={aiStatus === 'streaming' || aiStatus === 'loading' || !chatInput.trim()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-mystic-gold/10 text-mystic-gold/50 hover:text-mystic-gold disabled:opacity-20 hover:bg-mystic-gold/20 transition-all cursor-pointer shadow-md"
                  title="Gửi câu hỏi"
                >
                  <Send size={15} />
                </button>
              </div>

              {/* Status and Saved Info Footer */}
              <div className="mt-3 flex items-center justify-between text-[9px] text-mystic-gold/40 uppercase tracking-widest font-bold font-serif">
                <span>
                  {statusText || `Status: ${aiStatus === 'streaming' ? 'THINKING' : aiStatus === 'loading' ? 'COMMUNING' : chatHistory.length > 0 ? 'READY' : 'WAITING'}`}
                </span>
                
                {chatHistory.length > 0 && aiStatus === 'idle' && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-mystic-gold/60 font-bold tracking-wider flex items-center gap-1.5"
                  >
                    <Check size={11} className="text-mystic-gold animate-pulse" />
                    {autoSavedText}
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;
