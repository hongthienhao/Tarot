import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Scale } from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
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
                    Pháp lý
                  </span>
                </div>
                <h2 className="text-3xl font-serif text-white mb-4">Điều khoản dịch vụ</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent mx-auto" />
              </div>

              <div className="space-y-6 text-gray-300 font-light text-sm md:text-base leading-relaxed">
                <p>Bằng việc truy cập và sử dụng Tarot Mystic, bạn đồng ý tuân thủ các điều khoản dưới đây:</p>
                
                <h3 className="text-mystic-gold font-serif font-bold text-lg mt-6">1. Mục đích sử dụng</h3>
                <p>Nội dung trên Tarot Mystic, bao gồm giải mã bài Tarot, bản đồ sao và các tính năng khác, chỉ mang tính chất tham khảo, giải trí và phát triển bản thân. Chúng không thay thế cho bất kỳ lời khuyên chuyên môn nào về y tế, tài chính hay pháp lý.</p>

                <h3 className="text-mystic-gold font-serif font-bold text-lg mt-6">2. Trách nhiệm người dùng</h3>
                <p>Bạn tự chịu trách nhiệm về mọi quyết định và hành động của mình sau khi sử dụng dịch vụ. Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất hay thiệt hại nào phát sinh từ việc sử dụng thông tin trên trang web.</p>

                <h3 className="text-mystic-gold font-serif font-bold text-lg mt-6">3. Bản quyền</h3>
                <p>Toàn bộ nội dung, hình ảnh và thiết kế trên trang web (trừ khi có ghi chú khác) thuộc bản quyền của Tarot Mystic. Vui lòng không sao chép hoặc sử dụng cho mục đích thương mại mà không có sự cho phép.</p>

                <div className="mt-8 p-4 rounded-xl bg-mystic-gold/5 border border-mystic-gold/20 flex gap-4 items-center">
                  <Scale className="w-8 h-8 text-mystic-gold shrink-0" />
                  <p className="text-sm">Chúng tôi có quyền thay đổi điều khoản dịch vụ vào bất kỳ lúc nào mà không cần báo trước.</p>
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

export default TermsModal;
