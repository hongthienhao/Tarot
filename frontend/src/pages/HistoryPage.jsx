import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Loader, 
  Clock, 
  ChevronRight, 
  Bot, 
  User, 
  Book, 
  ScrollText, 
  Sparkles, 
  X,
  Hash,
  Star,
  Quote,
  Trash2,
  Check,
  ListChecks
} from 'lucide-react';
import apiClient from '../api/client';
import useAuthStore from '../store/useAuthStore';

const HistoryPage = () => {
  const [readings, setReadings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReading, setSelectedReading] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await apiClient.get('/readings');
        setReadings(response.data.data.readings);
        setIsLoading(false);
      } catch (err) {
        setError('Không thể kết nối với thư viện linh hồn. Vui lòng thử lại sau.');
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

  const getShortDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleDeleteReading = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
    
    // Removing window.confirm temporarily to ensure it's not blocking
    console.log('handleDeleteReading triggered for ID:', id);
    
    try {
      await apiClient.delete(`/readings/${id}`);
      setReadings(prev => prev.filter(r => r.id !== id));
      if (selectedReading?.id === id) setSelectedReading(null);
      setNotification('Đã xóa thành công 1 trải bài khỏi Biên niên sử.');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      alert('Không thể xóa bản ghi. Vui lòng thử lại sau.');
    }
  };

  const toggleSelection = (e, id) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === readings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(readings.map(r => r.id)));
    }
  };

  const handleDeleteSelected = async () => {
    console.log('handleDeleteSelected triggered', selectedIds.size);
    if (selectedIds.size === 0) return;
    
    try {
      const idsArray = Array.from(selectedIds);
      console.log('Attempting to delete IDs:', idsArray);
      
      // Using DELETE method with data body (standard REST)
      const response = await apiClient.delete('/readings', { 
        data: { ids: idsArray } 
      });
      
      console.log('Delete response:', response.data);
      
      const deletedReadingsList = response.data.data.deletedReadings || [];
      const names = deletedReadingsList.map(r => r.spreadName || 'Trải bài').slice(0, 3).join(', ');
      const moreText = deletedReadingsList.length > 3 ? ` và ${deletedReadingsList.length - 3} trải bài khác` : '';
      
      setReadings(prev => prev.filter(r => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      
      setNotification(`Đã xóa: ${names}${moreText}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Lỗi khi xóa nhiều bản ghi:', err.response?.data || err.message);
      alert(`Lỗi khi xóa: ${err.response?.data?.message || err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Sparkles className="w-12 h-12 text-mystic-gold" />
        </motion.div>
        <p className="text-mystic-gold/60 font-serif tracking-widest animate-pulse">ĐANG MỞ CUỐN BIÊN NIÊN SỬ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-mystic-gold/10 border border-mystic-gold/20">
                <Star className="w-4 h-4 text-mystic-gold" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-mystic-gold">Bibliotheca Fati</span>
              </div>
              
              {readings.length > 0 && (
                <button
                  onClick={() => {
                    setIsSelectionMode(!isSelectionMode);
                    setSelectedIds(new Set());
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${
                    isSelectionMode 
                      ? 'bg-mystic-gold text-mystic-dark border-mystic-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <ListChecks className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                    {isSelectionMode ? 'Hủy chọn' : 'Chọn nhiều'}
                  </span>
                </button>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold gold-text mb-6 drop-shadow-2xl">
              Chronicles of <span className="italic">Fate</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              Mỗi trang sách là một dấu ấn của linh hồn, ghi lại những thông điệp mà vũ trụ đã gửi gắm đến bạn qua những lá bài.
            </p>
          </motion.div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200%] bg-mystic-purple/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-6 rounded-2xl mb-8 text-center glass">
            {error}
          </div>
        )}

        {!error && readings.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass border-white/5 p-20 rounded-[3rem] text-center max-w-3xl mx-auto"
          >
            <ScrollText className="w-20 h-20 text-white/10 mx-auto mb-8" />
            <h3 className="text-3xl font-serif text-white mb-4">Trang Sách Trống</h3>
            <p className="text-gray-400 font-light text-lg mb-10">Bạn chưa bắt đầu viết nên chương đầu tiên trong biên niên sử của mình.</p>
            <button className="px-10 py-4 bg-mystic-gold rounded-full text-mystic-dark font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105 active:scale-95">
              Bắt đầu trải bài ngay
            </button>
          </motion.div>
        )}

        {/* Grid View of Readings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {readings.map((reading, index) => (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={(e) => {
                if (isSelectionMode) {
                  toggleSelection(e, reading.id);
                } else {
                  setSelectedReading(reading);
                }
              }}
              className="group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-mystic-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
              
              <div className={`glass p-8 rounded-[2rem] border-white/5 transition-all duration-500 h-full flex flex-col relative z-10 ${
                isSelectionMode && selectedIds.has(reading.id) 
                  ? 'border-mystic-gold/50 bg-mystic-gold/5 shadow-[0_0_30px_rgba(212,175,55,0.1)]' 
                  : 'group-hover:border-mystic-gold/30'
              }`}>
                {/* Checkbox (Selection Mode) or Delete Button (Normal Mode) */}
                {isSelectionMode ? (
                  <div
                    onClick={(e) => toggleSelection(e, reading.id)}
                    className={`absolute top-6 right-6 z-30 p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                      selectedIds.has(reading.id)
                        ? 'bg-mystic-gold border-mystic-gold text-mystic-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-mystic-dark/60 border-white/20 text-transparent hover:border-mystic-gold/50'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleDeleteReading(e, reading.id)}
                    className="absolute top-6 right-6 z-30 p-2 rounded-full bg-mystic-dark/40 border border-white/10 text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                    title="Xóa bản ghi"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                {/* Card Header: Date & Badge */}
                <div className="flex justify-between items-start mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-mystic-dark/60 border border-white/10 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-mystic-gold/60 font-bold uppercase">{getShortDate(reading.createdAt).split(' ')[1]}</span>
                    <span className="text-lg font-serif text-white leading-none">{getShortDate(reading.createdAt).split(' ')[0]}</span>
                  </div>
                  <div className="flex gap-2 pr-10">
                    <div className="px-3 py-1 rounded-full bg-mystic-purple/10 border border-mystic-purple/20 text-[8px] font-bold uppercase tracking-widest text-mystic-gold/80">
                      {reading.readingCards.length} Cards
                    </div>
                  </div>
                </div>

                {/* Card Content: Title & Icons */}
                <h3 className="text-xl font-serif text-white mb-4 group-hover:text-mystic-gold transition-colors">
                  {reading.spreadName || `Trải bài ${reading.readingCards.length} lá`}
                </h3>
                
                {/* Visual Preview of cards */}
                <div className="flex -space-x-4 mb-8">
                  {reading.readingCards.slice(0, 5).map((rc, idx) => (
                    <div 
                      key={rc.id} 
                      className="w-10 h-14 rounded-md border border-mystic-gold/20 overflow-hidden shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      <img src={rc.card.imagePath} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                  {reading.readingCards.length > 5 && (
                    <div className="w-10 h-14 rounded-md bg-mystic-dark/80 border border-white/10 flex items-center justify-center text-[10px] text-mystic-gold">
                      +{reading.readingCards.length - 5}
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium tracking-wider">
                      {new Date(reading.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-mystic-gold/40 group-hover:text-mystic-gold group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Reading Detail Modal */}
      <AnimatePresence>
        {selectedReading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReading(null)}
              className="absolute inset-0 bg-mystic-dark/95 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-black/40 border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col glass"
            >
              {/* Modal Close */}
              <button 
                onClick={() => setSelectedReading(null)}
                className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="overflow-y-auto custom-scrollbar flex-1">
                <div className="p-8 md:p-16">
                  {/* Modal Header */}
                  <div className="text-center mb-20">
                    <div className="flex items-center justify-center gap-4 text-mystic-gold/60 uppercase tracking-[0.4em] text-[10px] font-bold mb-6">
                      <div className="h-px w-8 bg-mystic-gold/20" />
                      <span>{formatDate(selectedReading.createdAt)}</span>
                      <div className="h-px w-8 bg-mystic-gold/20" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
                      {selectedReading.spreadName || "Biên Niên Sử Mệnh Vận"}
                    </h2>
                    {selectedReading.userQuestion && (
                      <div className="max-w-2xl mx-auto italic text-gray-400 text-lg md:text-xl font-light">
                        "{selectedReading.userQuestion}"
                      </div>
                    )}
                  </div>

                  {/* Cards Row */}
                  <div className="mb-24 overflow-x-auto pb-10 no-scrollbar">
                    <div className="flex justify-center gap-8 md:gap-12 min-w-max px-8">
                      {selectedReading.readingCards.map((rc, idx) => (
                        <motion.div 
                          key={rc.id}
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                          className="flex flex-col items-center gap-6"
                        >
                          <div className="text-[10px] font-bold text-mystic-gold/40 flex items-center gap-2">
                             <Hash className="w-3 h-3" /> Position {rc.position}
                          </div>
                          <div className="w-[180px] md:w-[240px] aspect-[1/1.7] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-2 border-mystic-gold/20 shadow-2xl relative group">
                            <img 
                              src={rc.card.imagePath} 
                              alt={rc.card.name} 
                              className={`w-full h-full object-cover ${rc.isReversed ? 'rotate-180' : ''}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                              <span className="text-white font-serif text-lg">{rc.card.name}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <h4 className="text-white font-serif text-xl mb-1">{rc.card.name}</h4>
                            <span className="text-[10px] text-mystic-gold font-bold uppercase tracking-widest">
                              {rc.isReversed ? 'Reversed (Ngược)' : 'Upright (Xuôi)'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Interpretation Content */}
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                      <div className="w-14 h-14 rounded-2xl bg-mystic-gold/10 border border-mystic-gold/20 flex items-center justify-center text-mystic-gold">
                        <Quote className="w-7 h-7" />
                      </div>
                      <h3 className="text-3xl font-serif gold-text">Thông Điệp Chữa Lành</h3>
                    </div>

                    <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/5 relative">
                      <div className="absolute -top-6 -right-6">
                        <Sparkles className="w-12 h-12 text-mystic-gold/20" />
                      </div>
                      
                      <div className="prose prose-invert prose-gold max-w-none">
                        {selectedReading.interpretation ? (
                          <div className="text-lg md:text-xl text-gray-300 leading-relaxed font-light whitespace-pre-wrap selection:bg-mystic-gold selection:text-mystic-dark">
                            {selectedReading.interpretation.replace(/\*\*/g, '')}
                          </div>
                        ) : (
                          <div className="text-gray-500 italic text-center py-20">
                            Hồ sơ lưu trữ này không chứa nội dung giải luận chi tiết.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Chat History if exists in notes */}
                    {selectedReading.notes && (
                      <div className="mt-20">
                        <div className="flex items-center gap-4 mb-10">
                           <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                             <ScrollText className="w-5 h-5" />
                           </div>
                           <h4 className="text-xl font-serif text-white/60">Đối Thoại Thêm</h4>
                        </div>
                        <div className="space-y-4">
                          {selectedReading.notes.split('\n\n---\n\n').map((chunk, idx) => {
                            const isUser = chunk.startsWith('**Bạn**:');
                            const text = chunk.replace(/^\*\*(Bạn|Bậc thầy Tarot)\*\*:\s*/, '');
                            return (
                              <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl max-w-[80%] ${isUser ? 'bg-mystic-gold/10 border-mystic-gold/20 border text-mystic-gold' : 'bg-white/5 border-white/10 border text-gray-400'}`}>
                                  <div className="text-[9px] font-bold mb-1 uppercase tracking-widest opacity-50">
                                    {isUser ? 'Bạn' : 'Bậc Thầy'}
                                  </div>
                                  <p className="text-sm font-light">{text.replace(/\*\*/g, '')}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Modal Footer Decor */}
              <div className="h-2 w-full bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl bg-mystic-dark border border-mystic-gold/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="w-8 h-8 rounded-full bg-mystic-gold/20 flex items-center justify-center text-mystic-gold">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-mystic-gold font-serif text-sm">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Bottom Bar */}
      <AnimatePresence>
        {isSelectionMode && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] p-0"
          >
            <div className="glass px-8 py-4 rounded-full border border-white/10 flex items-center gap-8 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">Đã chọn:</span>
                <span className="text-mystic-gold font-bold text-xl">{selectedIds.size}</span>
              </div>
              
              <div className="w-px h-8 bg-white/10" />
              
              <button
                onClick={toggleSelectAll}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {selectedIds.size === readings.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
              
              <button
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedIds.size > 0
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Xóa các mục đã chọn
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPage;
