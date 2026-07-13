import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Sparkles, Hash, Star, Check, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import apiClient from '../api/client';
import { calculateZodiacSign, calculateLifePathNumber, getZodiacDetails, LIFE_PATH_MEANINGS } from '../utils/astrology';

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBirthDate(user.birthDate || '');
    }
  }, [user, isOpen]);

  const zodiacDetails = getZodiacDetails(birthDate);
  const previewLifePath = calculateLifePathNumber(birthDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await apiClient.put('/users/profile', { name, birthDate });
      if (response.data?.data?.user) {
        updateUser(response.data.data.user);
        setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
        setTimeout(() => {
          setMessage({ type: '', text: '' });
          onClose();
        }, 1200);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-mystic-dark/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg glass rounded-3xl border border-mystic-gold/30 bg-mystic-dark/95 p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-mystic-gold/15 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-mystic-gold/15 rounded-2xl text-mystic-gold border border-mystic-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Star className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-serif gold-text font-bold tracking-widest">Hồ Sơ Nguyên Khí</h3>
                <p className="text-[10px] text-gray-400 font-light">Cấu hình Chiêm Tinh & Thần Số Học cho AI Tarot</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name Input */}
            <div>
              <label className="block text-xs font-serif text-mystic-gold uppercase tracking-wider mb-2">
                Danh Xưng Cá Nhân
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mystic-gold/50" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên hiển thị của bạn..."
                  className="w-full pl-11 pr-4 py-3 bg-mystic-dark/80 border border-white/15 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-mystic-gold/50 text-sm"
                />
              </div>
            </div>

            {/* Birth Date Picker */}
            <div>
              <label className="block text-xs font-serif text-mystic-gold uppercase tracking-wider mb-2">
                Ngày Sinh Âm / Dương (YYYY-MM-DD)
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mystic-gold/50" />
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-mystic-dark/80 border border-white/15 rounded-2xl text-white focus:outline-none focus:border-mystic-gold/50 text-sm"
                />
              </div>
            </div>

            {/* Real-time Astrology & Numerology Calculation Card */}
            {birthDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl border border-mystic-gold/25 bg-mystic-gold/5 space-y-3 shadow-inner"
              >
                <div className="flex items-center justify-between border-b border-mystic-gold/15 pb-2">
                  <span className="text-xs text-gray-400 font-serif">Cung Hoàng Đạo:</span>
                  <span className="text-xs font-bold text-mystic-gold font-serif flex items-center gap-1">
                    <Sparkles size={12} className="text-mystic-gold animate-spin-slow" />
                    {zodiacDetails ? zodiacDetails.name : 'Không xác định'}
                  </span>
                </div>

                {zodiacDetails && (
                  <div className="grid grid-cols-2 gap-2 text-[11px] py-1 border-b border-mystic-gold/15">
                    <div className="flex items-center gap-1.5 text-amber-200/90 font-serif">
                      <span className="text-xs font-medium text-gray-400">Nguyên tố:</span>
                      <span className="px-2 py-0.5 rounded-full bg-mystic-gold/15 border border-mystic-gold/30 text-mystic-gold font-bold">
                        {zodiacDetails.element}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-200/90 font-serif">
                      <span className="text-xs font-medium text-gray-400">Sao Trị Vì:</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold">
                        {zodiacDetails.rulingPlanet}
                      </span>
                    </div>
                    <div className="col-span-2 text-[10px] italic text-gray-300 font-light mt-1">
                      🌌 <span className="text-mystic-gold/90">{zodiacDetails.vibe}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-serif">Con Số Chủ Đạo (Life Path):</span>
                  <span className="text-xs font-bold text-amber-300 font-serif flex items-center gap-1">
                    <Hash size={12} />
                    {previewLifePath !== null ? `Số ${previewLifePath}` : 'Không xác định'}
                  </span>
                </div>

                {previewLifePath && LIFE_PATH_MEANINGS[previewLifePath] && (
                  <p className="text-[11px] italic text-mystic-gold/80 font-light border-t border-mystic-gold/15 pt-2 mt-1">
                    ✨ {LIFE_PATH_MEANINGS[previewLifePath]}
                  </p>
                )}
              </motion.div>
            )}

            {/* Status Message */}
            {message.text && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {message.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                <span>{message.text}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs font-serif uppercase tracking-wider transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-mystic-gold/20 hover:bg-mystic-gold/30 border border-mystic-gold/40 text-mystic-gold text-xs font-serif font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer disabled:opacity-40"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserProfileModal;
