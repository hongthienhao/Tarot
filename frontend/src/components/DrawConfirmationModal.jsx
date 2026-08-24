import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, ArrowRight, ShieldCheck, Shuffle } from 'lucide-react';
import MysticStar from './MysticStar';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const MYSTICAL_PROMPTS = [
  'Bạn có chấp nhận dùng {x} Tinh Tú để kết nối với dòng chảy Vũ trụ và khai mở thông điệp tâm linh?',
  'Bạn có sẵn lòng trao gửi {x} Tinh Tú để lắng nghe lời thì thầm định hướng từ các vì sao?',
  'Để vén bức màn tương lai và đón nhận tuệ giác thiêng liêng, bạn có đồng ý tiêu hao {x} Tinh Tú?',
  'Khởi tạo kết nối năng lượng với Bậc Thầy Tarot, bạn có chấp thuận dùng {x} Tinh Tú cho hành trình này?',
  'Dòng chảy định mệnh đang chuyển động. Bạn có sẵn sàng giải phóng {x} Tinh Tú để thấu thị quẻ bói này?',
  'Một thông điệp sâu sắc sắp được vén màn. Bạn có đồng ý chuyển hóa {x} Tinh Tú thành ánh sáng chỉ đường?',
  'Bạn có chấp nhận hiến dâng {x} Tinh Tú để mở cánh cổng không gian huyền bí và tiếp nhận linh cảm?',
  'Tâm trí đã tĩnh lặng, bạn có chấp thuận dùng {x} Tinh Tú để Vũ trụ hồi đáp câu hỏi của bạn?',
];

const DrawConfirmationModal = ({ isOpen, onClose, spread, onConfirm, isShuffling }) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const quantity = spread?.quantity || 1;
  const currentPoints = user?.starPoints ?? 0;
  const isEnough = !isAuthenticated || currentPoints >= quantity;
  const remainingPoints = Math.max(0, currentPoints - quantity);

  // Random prompt for each open
  const randomPrompt = useMemo(() => {
    const template = MYSTICAL_PROMPTS[Math.floor(Math.random() * MYSTICAL_PROMPTS.length)];
    return template.replace('{x}', quantity);
  }, [spread, isOpen]);

  if (!isOpen || !spread) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isShuffling ? onClose : undefined}
          className="absolute inset-0 bg-mystic-dark/90 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 25 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md bg-mystic-dark/95 border border-mystic-gold/40 rounded-3xl p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.85)] z-10 overflow-hidden text-center space-y-6"
        >
          {/* Top Golden Light Edge */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-600 via-mystic-gold to-yellow-200" />

          {/* Close button */}
          {!isShuffling && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
            >
              <X size={16} />
            </button>
          )}

          {/* Icon & Spread Name */}
          <div className="space-y-3 pt-2">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto w-16 h-16 rounded-2xl bg-mystic-gold/15 border border-mystic-gold/35 flex items-center justify-center text-mystic-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              {spread.icon || <Sparkles className="w-8 h-8" />}
            </motion.div>

            <div>
              <span className="text-[10px] uppercase font-serif font-bold text-mystic-gold/70 tracking-[0.3em]">
                {spread.tagline || 'Trải Bài Tarot'}
              </span>
              <h3 className="text-2xl font-serif font-bold gold-text mt-1">
                {spread.name}
              </h3>
            </div>
          </div>

          {/* Mystical Confirmation Question */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-mystic-gold/10 to-mystic-gold/5 border border-mystic-gold/25 text-center">
            <p className="font-serif text-sm md:text-base text-gray-200 leading-relaxed italic">
              "{randomPrompt}"
            </p>
          </div>

          {/* Balance & Cost Breakdown */}
          {isAuthenticated && (
            <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white/3 border border-white/10 font-serif text-xs">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Hiện Có</span>
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  {currentPoints} <MysticStar className="w-3 h-3" />
                </span>
              </div>

              <div className="flex flex-col items-center border-x border-white/10">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Tiêu Hao</span>
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  -{quantity} <MysticStar className="w-3 h-3" />
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Còn Lại</span>
                <span className={`font-bold flex items-center gap-1 ${isEnough ? 'text-emerald-300' : 'text-red-400'}`}>
                  {remainingPoints} <MysticStar className="w-3 h-3" />
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {!isShuffling && (
              <button
                onClick={onClose}
                className="flex-1 py-3.5 px-4 rounded-2xl border border-white/10 text-gray-300 font-serif text-xs uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
            )}

            {isEnough ? (
              <motion.button
                onClick={onConfirm}
                disabled={isShuffling}
                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.45)' }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-mystic-dark font-serif font-bold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer"
              >
                <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>{isShuffling ? 'Đang Xào Bài...' : 'Đồng Ý'}</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-mystic-gold text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.35)]"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Điểm Danh Thêm ⭐</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DrawConfirmationModal;
