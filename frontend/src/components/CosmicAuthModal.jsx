import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, X, Sparkles } from 'lucide-react';
import MysticStar from './MysticStar';

const CosmicAuthModal = ({ isOpen, onClose, type = 'login', message, userName }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLogin = type === 'login';

  return (
    <AnimatePresence>
      <div className="fixed top-24 right-4 sm:right-8 z-[300] max-w-md w-[calc(100vw-2rem)] pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className={`relative p-4 sm:p-5 rounded-2xl backdrop-blur-2xl border shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-hidden ${
            isLogin
              ? 'bg-mystic-dark/95 border-mystic-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.25)]'
              : 'bg-mystic-dark/95 border-purple-400/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
          }`}
        >
          {/* Top glowing bar */}
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
              isLogin
                ? 'from-amber-600 via-mystic-gold to-yellow-200'
                : 'from-indigo-600 via-purple-400 to-pink-300'
            }`}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={14} />
          </button>

          {/* Content Row */}
          <div className="flex items-start gap-3.5 pr-4">
            {/* Animated Icon badge */}
            <div
              className={`p-2.5 rounded-xl border shrink-0 mt-0.5 shadow-md ${
                isLogin
                  ? 'bg-mystic-gold/15 border-mystic-gold/40 text-mystic-gold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'bg-purple-900/30 border-purple-400/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              }`}
            >
              {isLogin ? (
                <MysticStar className="w-5 h-5 text-mystic-gold animate-pulse" />
              ) : (
                <Moon className="w-5 h-5 text-purple-300 animate-pulse" />
              )}
            </div>

            {/* Texts */}
            <div className="space-y-1 text-left flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-serif font-bold uppercase tracking-[0.2em] text-mystic-gold/80">
                  {isLogin ? '✦ KẾT NỐI VŨ TRỤ' : '✦ BẢO LƯU NĂNG LƯỢNG'}
                </span>
              </div>

              <h4 className="text-sm font-serif font-bold text-white truncate">
                {isLogin ? `Chào mừng, ${userName || 'Lữ khách'}!` : 'Hẹn sớm gặp lại bạn!'}
              </h4>

              <p className="font-serif text-xs text-gray-300 leading-relaxed italic line-clamp-2">
                "{message}"
              </p>
            </div>
          </div>

          {/* Auto-dismiss progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4.5, ease: 'linear' }}
            style={{ originX: 0 }}
            className={`absolute inset-x-0 bottom-0 h-0.5 ${
              isLogin ? 'bg-mystic-gold/60' : 'bg-purple-400/60'
            }`}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CosmicAuthModal;
