import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MysticStar from './MysticStar';
import useAuthStore from '../store/useAuthStore';

const InsufficientStarsModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGoCheckin = () => {
    onClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-mystic-dark/90 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm bg-mystic-dark border border-rose-500/30 rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] z-10"
        >
          {/* Gradient glow top */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-mystic-gold" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
          >
            <X size={16} />
          </button>

          <div className="p-6 text-center space-y-5">
            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center"
            >
              <MysticStar className="w-8 h-8 text-rose-400" />
            </motion.div>

            {/* Text */}
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-white">Chưa Đủ Tinh Tú</h3>
              <p className="text-sm text-gray-400 leading-relaxed flex items-center justify-center gap-1.5 font-serif">
                <span>Bạn cần ít nhất 1</span>
                <MysticStar className="w-3.5 h-3.5" />
                <span className="text-mystic-gold font-bold">Tinh Tú</span>
                <span>để rút bài.</span>
              </p>
              {user && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25">
                  <MysticStar className="w-3.5 h-3.5" />
                  <span className="text-sm text-amber-300 font-serif font-bold">Hiện có: {user.starPoints ?? 0} Tinh Tú</span>
                </div>
              )}
            </div>

            {/* How to earn */}
            <div className="p-4 rounded-2xl bg-mystic-gold/5 border border-mystic-gold/15 text-left space-y-2 font-serif">
              <p className="text-xs font-bold text-mystic-gold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Cách nhận thêm Tinh Tú
              </p>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Điểm danh Thứ 2 – Thứ 6:</span>
                  </span>
                  <span className="text-amber-300 font-bold flex items-center gap-0.5">+1 <MysticStar className="w-3 h-3" /></span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Điểm danh Thứ 7:</span>
                  </span>
                  <span className="text-amber-300 font-bold flex items-center gap-0.5">+2 <MysticStar className="w-3 h-3" /></span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Điểm danh Chủ Nhật:</span>
                  </span>
                  <span className="text-amber-300 font-bold flex items-center gap-0.5">+3 <MysticStar className="w-3 h-3" /></span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm font-serif hover:bg-white/5 transition-all cursor-pointer"
              >
                Đóng
              </button>
              <motion.button
                onClick={handleGoCheckin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-mystic-gold text-mystic-dark font-serif font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <span>Điểm Danh</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InsufficientStarsModal;
