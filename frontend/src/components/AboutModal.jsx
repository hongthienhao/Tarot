import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Compass, Shield, Users } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-black/40 border border-mystic-gold/25 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col glass"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all shadow-md cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Story Panel */}
            <div className="overflow-y-auto custom-scrollbar flex-1 p-8 md:p-16">
              {/* Header Visuals */}
              <div className="text-center mb-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-mystic-gold animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-mystic-gold">TAROT MYSTIC SANCTUARY</span>
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                  Biên Niên Sử <span className="gold-text italic">Mệnh Vận</span>
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent mx-auto mt-6" />
              </div>

              {/* Narrative Contents */}
              <div className="space-y-10 text-gray-300 font-light leading-relaxed text-sm md:text-base tracking-wide selection:bg-mystic-gold selection:text-mystic-dark">
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-mystic-gold first-letter:float-left first-letter:mr-3 first-letter:font-bold">
                  Chào mừng bạn đến với <strong>Tarot Mystic</strong> – thánh đường kỹ thuật số được tạo ra dành riêng cho tiếng nói sâu thẳm của linh hồn bạn. Chúng tôi tin rằng Tarot không phải là công cụ bói toán định sẵn tương lai một cách cứng nhắc, mà là một tấm gương huyền ảo, phản chiếu các khía cạnh năng lượng, trực giác và con đường phát triển tinh thần của mỗi cá nhân.
                </p>

                {/* Legend Section */}
                <div className="border-l-2 border-mystic-gold/35 bg-mystic-gold/5 p-6 rounded-2xl md:p-8 italic shadow-[inset_0_2px_8px_rgba(212,175,55,0.02)]">
                  <h4 className="text-mystic-gold font-serif font-bold text-lg mb-3 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-mystic-gold animate-spin-slow" /> Huyền thoại về "Nhật Ký Linh Hồn"
                  </h4>
                  "Mỗi con người khi bước vào thế giới đều mang theo một chương sách chưa viết của Biên niên sử mệnh vận. Những lá bài ta rút lên trong từng ngảnh rẽ cuộc đời không phải là ngẫu nhiên, mà là sự đồng điệu giữa năng lượng vũ trụ và trực giác tiềm thức. Khi ghi lại những dấu chân của linh hồn vào trang sách này, bạn đang thấu hiểu quá khứ, ôm lấy hiện tại, và định vị tương lai bằng một trí tuệ tỉnh thức."
                </div>

                {/* Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-mystic-gold/15 border border-mystic-gold/25 flex items-center justify-center text-mystic-gold">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-serif font-bold text-md">Bảo Mật & Tôn Trọng</h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Mỗi phiên trải bài và câu chuyện đàm đạo tâm giao cùng Oracle được lưu trữ an toàn trong không gian của riêng bạn. Chúng tôi cam kết bảo vệ sự riêng tư để bạn có thể thỏa sức khám phá tiềm thức của mình.
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-mystic-gold/15 border border-mystic-gold/25 flex items-center justify-center text-mystic-gold">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-serif font-bold text-md">Cộng Đồng Chiêm Tinh</h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Tarot Mystic được xây dựng bởi những người am hiểu chiêm tinh học và công nghệ cao. Sự kết hợp giữa thuật toán giải nghĩa sâu sắc từ Bậc thầy Tarot AI đem lại góc nhìn khách quan và tinh tế nhất.
                    </p>
                  </div>
                </div>

                <p className="text-center pt-8 text-xs text-mystic-gold/60 font-serif uppercase tracking-[0.3em] font-semibold">
                  Chúc bạn có một hành trình đầy tuệ giác và bình yên!
                </p>
              </div>
            </div>
            
            {/* Decors: Golden bottom margin bar */}
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent shrink-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
