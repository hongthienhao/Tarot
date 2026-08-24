import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, X, LogIn, Gift, Calendar, History, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MysticStar from './MysticStar';

const AuthRequiredModal = ({ isOpen, onClose, customMessage }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 25 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#171226] via-[#0d0a17] to-[#08060f] border border-mystic-gold/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 overflow-hidden space-y-6 text-center"
        >
          {/* Top golden border beam */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-600 via-mystic-gold to-yellow-200" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Cosmic Portal Icon */}
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-purple-500/30 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-mystic-dark border border-mystic-gold/50 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              <Lock className="w-7 h-7 text-mystic-gold" />
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold gold-text tracking-wide">
              Kết Nối Dòng Chảy Vũ Trụ
            </h3>
            <p className="text-xs sm:text-sm font-serif text-gray-300 leading-relaxed px-2">
              {customMessage || 'Bạn cần đăng nhập để khởi tạo liên kết tâm linh, rút bài Tarot và giải mã thông điệp số mệnh.'}
            </p>
          </div>

          {/* Benefits Box */}
          <div className="p-3.5 rounded-2xl bg-white/3 border border-white/8 space-y-2.5 text-left font-serif">
            <div className="flex items-center gap-2.5 text-xs text-amber-200/90">
              <Gift size={14} className="text-mystic-gold shrink-0" />
              <span>Tặng ngay <strong>50 Tinh Tú</strong> trải nghiệm khi đăng nhập</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-amber-200/90">
              <Calendar size={14} className="text-mystic-gold shrink-0" />
              <span>Điểm danh hàng ngày nhận Tinh Tú miễn phí</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-amber-200/90">
              <History size={14} className="text-mystic-gold shrink-0" />
              <span>Lưu lại toàn bộ lịch sử trải bài và luận giải AI</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleGoToLogin}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-mystic-dark font-serif font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <LogIn size={16} />
              <span>Đăng Nhập Ngay</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-serif text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Để sau, tôi muốn xem tiếp
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthRequiredModal;
