import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ExternalLink, MessageCircle } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
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
            className="relative w-full max-w-lg bg-black/40 border border-mystic-gold/25 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col glass"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-mystic-gold/10 blur-[50px] pointer-events-none rounded-full" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative p-8 md:p-12 text-center flex flex-col items-center">
              {/* Avatar / Logo Section */}
              <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-mystic-gold rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
                <div className="relative w-28 h-28 rounded-full border-2 border-mystic-gold/40 p-1 flex items-center justify-center bg-mystic-dark">
                  <div className="w-full h-full rounded-full border border-mystic-gold/20 flex items-center justify-center bg-gradient-to-br from-mystic-gold/20 to-transparent overflow-hidden">
                    <MessageCircle className="w-12 h-12 text-mystic-gold" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-mystic-dark border border-mystic-gold rounded-full p-2 text-mystic-gold">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-3xl font-serif text-white mb-3">Kết nối với chúng tôi</h2>
              <p className="text-gray-400 font-light text-sm mb-10 max-w-[280px] leading-relaxed">
                Để nhận được sự hỗ trợ tốt nhất hoặc trao đổi thêm về Tarot, vui lòng liên hệ qua trang Facebook cá nhân.
              </p>

              {/* Action Button */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.facebook.com/honguyenthienhao"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-mystic-gold to-yellow-500 text-mystic-dark font-bold uppercase tracking-wider text-sm shadow-[0_10px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.5)] transition-all"
              >
                <span>Chuyển đến Facebook</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
              
              <button onClick={onClose} className="mt-6 text-xs text-gray-500 hover:text-white transition-colors underline-offset-4 hover:underline">
                Bỏ qua
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
