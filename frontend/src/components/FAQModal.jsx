import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, HelpCircle } from 'lucide-react';

const FAQModal = ({ isOpen, onClose }) => {
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
                    Hỗ trợ
                  </span>
                </div>
                <h2 className="text-3xl font-serif text-white mb-4">Câu hỏi thường gặp</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent mx-auto" />
              </div>

              <div className="space-y-6 text-gray-300 font-light text-sm md:text-base leading-relaxed">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-mystic-gold font-serif font-bold text-lg mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Trải bài Tarot có chính xác không?
                  </h3>
                  <p>Tarot không phải là công cụ bói toán để phán quyết tương lai một cách chắc chắn. Tarot hoạt động như một chiếc gương phản chiếu năng lượng hiện tại và tiềm thức của bạn, giúp bạn nhìn nhận vấn đề đa chiều hơn.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-mystic-gold font-serif font-bold text-lg mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Tôi nên đặt câu hỏi như thế nào?
                  </h3>
                  <p>Hãy đặt câu hỏi mở (bắt đầu bằng Cái gì, Như thế nào, Tại sao) thay vì câu hỏi Có/Không. Ví dụ: "Làm thế nào để tôi cải thiện mối quan hệ này?" thay vì "Tôi và người ấy có quay lại không?".</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-mystic-gold font-serif font-bold text-lg mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Bao lâu thì nên trải bài một lần?
                  </h3>
                  <p>Không có quy tắc cứng nhắc, nhưng bạn không nên hỏi đi hỏi lại cùng một vấn đề trong thời gian ngắn (ví dụ: vài ngày) trừ khi hoàn cảnh có sự thay đổi lớn. Hãy cho các năng lượng có thời gian dịch chuyển.</p>
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

export default FAQModal;
