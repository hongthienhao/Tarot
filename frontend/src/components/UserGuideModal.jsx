import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen } from 'lucide-react';

const UserGuideModal = ({ isOpen, onClose }) => {
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-3xl max-h-[85vh] bg-black/40 border border-mystic-gold/25 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col glass"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto custom-scrollbar flex-1 p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 mb-6">
                  <Sparkles className="w-4 h-4 text-mystic-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-mystic-gold">
                    Hướng dẫn
                  </span>
                </div>
                <h2 className="text-3xl font-serif text-white mb-4">Cách sử dụng Tarot Mystic</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent mx-auto" />
              </div>

              <div className="space-y-8 text-gray-300 font-light text-sm md:text-base leading-relaxed">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-2xl bg-mystic-gold/10 text-mystic-gold mt-1 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-mystic-gold font-serif font-bold text-lg mb-2">1. Chuẩn bị tinh thần</h3>
                    <p>Trước khi trải bài, hãy hít thở sâu, thư giãn và tập trung vào câu hỏi hoặc vấn đề bạn đang quan tâm. Một tinh thần tĩnh lặng sẽ giúp kết nối tốt hơn với năng lượng của các lá bài.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-2xl bg-mystic-gold/10 text-mystic-gold mt-1 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-mystic-gold font-serif font-bold text-lg mb-2">2. Đặt câu hỏi</h3>
                    <p>Hãy đặt câu hỏi rõ ràng, mở (không phải câu hỏi Có/Không) và tập trung vào bản thân hoặc hiện tại/tương lai gần. Ví dụ: "Tôi cần chú ý điều gì trong công việc tuần này?" thay vì "Tôi có trúng số không?".</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-2xl bg-mystic-gold/10 text-mystic-gold mt-1 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-mystic-gold font-serif font-bold text-lg mb-2">3. Rút bài & Chiêm nghiệm</h3>
                    <p>Chọn các lá bài theo trực giác của bạn. Sau khi lật bài, hãy đọc ý nghĩa và kết hợp với hình ảnh trên lá bài, đối chiếu với tình huống thực tế của bạn để tự rút ra thông điệp.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent shrink-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserGuideModal;
