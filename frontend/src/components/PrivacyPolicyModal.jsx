import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
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
                <h2 className="text-3xl font-serif text-white mb-4">Chính sách bảo mật</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent mx-auto" />
              </div>

              <div className="space-y-6 text-gray-300 font-light text-sm md:text-base leading-relaxed">
                <p>Cập nhật lần cuối: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></p>
                <p>Chào mừng bạn đến với Tarot Mystic. Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân của bạn.</p>
                
                <h3 className="text-mystic-gold font-serif font-bold text-lg mt-6">1. Thu thập thông tin</h3>
                <p>Chúng tôi có thể thu thập thông tin cơ bản như tên hiển thị, địa chỉ email khi bạn đăng nhập qua các dịch vụ bên thứ ba (như Google) để cá nhân hóa trải nghiệm. Chúng tôi không lưu trữ thông tin nhạy cảm của bạn.</p>

                <h3 className="text-mystic-gold font-serif font-bold text-lg mt-6">2. Sử dụng thông tin</h3>
                <p>Thông tin của bạn chỉ được sử dụng nhằm mục đích cung cấp trải bài, lưu trữ kết quả của bạn (nếu có tính năng này) và cải thiện chất lượng dịch vụ. Chúng tôi sẽ không bán hay chia sẻ dữ liệu của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo.</p>

                <h3 className="text-mystic-gold font-serif font-bold text-lg mt-6">3. Bảo mật dữ liệu</h3>
                <p>Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin của bạn. Tuy nhiên, xin lưu ý rằng không có phương thức truyền tải qua Internet nào là an toàn 100%.</p>

                <div className="mt-8 p-4 rounded-xl bg-mystic-gold/5 border border-mystic-gold/20 flex gap-4 items-center">
                  <ShieldCheck className="w-8 h-8 text-mystic-gold shrink-0" />
                  <p className="text-sm">Trang web này được tạo ra với mục đích giải trí và chiêm nghiệm cá nhân.</p>
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

export default PrivacyPolicyModal;
