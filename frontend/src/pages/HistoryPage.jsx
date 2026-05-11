import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader, Clock, ChevronDown, ChevronUp, Bot, User } from 'lucide-react';
import apiClient from '../api/client';
import useAuthStore from '../store/useAuthStore';
import TarotCard from '../components/TarotCard';

const HistoryPage = () => {
  const [readings, setReadings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await apiClient.get('/readings');
        setReadings(response.data.data.readings);
        setIsLoading(false);
      } catch (err) {
        setError('Không thể tải lịch sử trải bài. Vui lòng thử lại sau.');
        setIsLoading(false);
      }
    };

    fetchReadings();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const parseNotes = (notes) => {
    if (!notes) return [];
    return notes.split('\n\n---\n\n').map(chunk => {
      const isUser = chunk.startsWith('**Bạn**:');
      let text = chunk.replace(/^\*\*(Bạn|Bậc thầy Tarot)\*\*:\s*/, '');
      text = text.replace(/\*\*/g, ''); // Remove all ** markers
      return { role: isUser ? 'user' : 'ai', text };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative z-10">
        <Loader className="w-12 h-12 text-mystic-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-mystic-gold mb-4 drop-shadow-lg">
            Cánh Cửa Định Danh
          </h1>
          <p className="text-lg text-gray-300 font-light">
            Hành trình tâm linh và những lời giải đáp đã được lưu giữ
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8 text-center">
            {error}
          </div>
        )}

        {!error && readings.length === 0 && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-12 rounded-2xl text-center">
            <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-playfair text-white mb-2">Chưa có trải bài nào</h3>
            <p className="text-gray-400">Bạn chưa thực hiện bất kỳ trải bài nào. Hãy quay lại trang chủ và trải nghiệm ngay!</p>
          </div>
        )}

        <div className="space-y-6">
          {readings.map((reading) => (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleExpand(reading.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-mystic-purple/20 flex items-center justify-center border border-mystic-purple/50">
                    <Calendar className="w-6 h-6 text-mystic-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair text-white font-medium">
                      Trải bài {reading.readingCards.length} lá
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" /> {formatDate(reading.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  {expandedId === reading.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Content */}
              <AnimatePresence>
                {expandedId === reading.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-6">
                      {/* Cards Display */}
                      <div className="mb-8">
                        <h4 className="text-lg font-playfair text-mystic-gold mb-6 border-b border-white/10 pb-2">
                          Các Lá Bài Đã Rút
                        </h4>
                        <div className="flex flex-wrap gap-6 justify-center">
                          {reading.readingCards.map((rc, index) => (
                            <div key={rc.id} className="flex flex-col items-center">
                              <div className="w-32 aspect-[1/1.7] mb-3 rounded-2xl overflow-hidden border-2 border-mystic-gold/40 shadow-xl">
                                <img 
                                  src={rc.card.imagePath} 
                                  alt={rc.card.name} 
                                  className={`w-full h-full object-cover ${rc.isReversed ? 'rotate-180' : ''}`}
                                />
                              </div>
                              <p className="text-sm text-center font-medium text-white max-w-[120px]">
                                {rc.card.name} <br/>
                                <span className="text-xs text-mystic-gold/60">{rc.isReversed ? '(Ngược)' : '(Xuôi)'}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Story/Chat Display */}
                      {reading.notes && (
                        <div>
                          <h4 className="text-lg font-playfair text-mystic-gold mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
                            <Bot className="w-5 h-5" /> Thông Điệp Từ Vũ Trụ
                          </h4>
                          <div className="bg-black/20 rounded-xl p-6 space-y-4">
                            {parseNotes(reading.notes).map((msg, idx) => (
                              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl max-w-[90%] ${msg.role === 'user' ? 'bg-mystic-gold/10 border-mystic-gold/30 border rounded-tr-sm text-mystic-gold' : 'bg-mystic-dark/60 border-mystic-gold/10 border rounded-tl-sm text-gray-300'}`}>
                                  <div className="text-[10px] font-bold mb-2 opacity-60 uppercase tracking-widest">
                                    {msg.role === 'user' ? 'Bạn' : 'Bậc Thầy Tarot'}
                                  </div>
                                  <div className="text-sm font-light leading-relaxed whitespace-pre-wrap">
                                    {msg.text}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
