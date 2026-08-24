import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Sparkles, Flame, Loader2 } from 'lucide-react';
import MysticStar from './MysticStar';
import apiClient from '../api/client';
import useAuthStore from '../store/useAuthStore';

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DEFAULT_REWARDS = [1, 1, 1, 1, 1, 2, 3];

const CheckinWidget = ({ onCheckinSuccess, onOpenDailyTarot }) => {
  const { isAuthenticated, updateStarPoints } = useAuthStore();
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [toast, setToast] = useState(null);

  // Client-side fallback calculation to immediately display all 7 days without delay
  const defaultWeekProgress = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = CN, 1 = T2
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    return DAY_LABELS.map((label, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateStr = d.toISOString().slice(0, 10);
      const dayIndex = idx === 6 ? 0 : idx + 1;
      const isToday = dayIndex === dayOfWeek;
      return {
        dayIndex,
        dayLabel: label,
        date: dateStr,
        reward: DEFAULT_REWARDS[idx],
        checked: false,
        isToday,
      };
    });
  }, []);

  const fetchStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await apiClient.get('/checkin/status');
      setStatus(res.data.data);
    } catch (err) {
      console.error('Lỗi lấy trạng thái check-in:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleCheckin = async (e) => {
    e?.stopPropagation?.();
    if (isChecking || status?.checkedInToday) {
      if (status?.checkedInToday && onOpenDailyTarot) {
        onOpenDailyTarot();
      }
      return;
    }

    setIsChecking(true);
    try {
      const res = await apiClient.post('/checkin');
      const { reward, newStarPoints } = res.data.data;

      updateStarPoints(newStarPoints);
      setToast({ type: 'success', message: `+${reward} Tinh Tú! Năng lượng vũ trụ đã hội tụ thành công!` });
      
      onCheckinSuccess?.({ reward, newStarPoints });
      await fetchStatus();
    } catch (err) {
      if (err.code === 'ALREADY_CHECKED_IN') {
        setToast({ type: 'info', message: 'Hôm nay bạn đã đón nhận Tinh Tú rồi!' });
        fetchStatus();
      } else {
        setToast({ type: 'error', message: 'Tín hiệu điểm danh bị gián đoạn. Vui lòng thử lại.' });
      }
    } finally {
      setIsChecking(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  // Determine active display data
  const weekProgress = status?.weekProgress || defaultWeekProgress;
  const todayReward = status?.todayReward || (new Date().getDay() === 0 ? 3 : new Date().getDay() === 6 ? 2 : 1);
  const checkedInToday = status?.checkedInToday || false;
  const totalThisWeek = status?.totalThisWeek || 0;

  return (
    <div className="relative p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-mystic-gold/35 bg-mystic-dark/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-center w-full max-w-2xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-mystic-gold/15 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-mystic-gold/15 border border-mystic-gold/30 shadow-[0_0_12px_rgba(212,175,55,0.3)]">
            <MysticStar className="w-5 h-5 text-mystic-gold animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="font-serif font-bold text-sm md:text-base tracking-[0.2em] uppercase gold-text flex items-center gap-2">
              <span>Dãy Điểm Danh Tinh Tú</span>
            </h3>
            <p className="text-xs font-serif text-gray-400 font-light tracking-wider flex items-center gap-1.5 mt-0.5">
              <span>T2–T6: +1</span>
              <MysticStar className="w-3 h-3" />
              <span>• T7: +2</span>
              <MysticStar className="w-3 h-3" />
              <span>• CN: +3</span>
              <MysticStar className="w-3 h-3" />
            </p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <MysticStar className="w-3.5 h-3.5" />
            <span className="font-serif font-bold text-xs sm:text-sm text-amber-200 tracking-wider">
              {totalThisWeek} / 10 Tinh Tú Tuần Này
            </span>
          </div>
        )}
      </div>

      {/* Week Progress Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2.5">
        {weekProgress.map((day, i) => {
          const isToday = status ? day.date === status.todayDate : day.isToday;
          const isFuture = status ? day.date > status.todayDate : false;
          return (
            <motion.div
              key={day.date || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative flex flex-col items-center justify-between p-1 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all ${
                day.checked
                  ? 'border-amber-400/60 bg-gradient-to-b from-amber-500/20 to-amber-900/20 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : isToday
                  ? 'border-mystic-gold bg-mystic-gold/15 shadow-[0_0_20px_rgba(212,175,55,0.4)] ring-1 ring-mystic-gold/60 scale-[1.03]'
                  : isFuture
                  ? 'border-white/10 bg-white/3 opacity-50'
                  : 'border-white/10 bg-white/5 opacity-70'
              }`}
            >
              {/* Today Badge */}
              {isToday && (
                <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-mystic-gold text-mystic-dark text-[10px] font-serif font-extrabold uppercase tracking-widest shadow-sm">
                  Hôm nay
                </span>
              )}

              {/* Day label */}
              <span className={`font-serif font-bold text-xs sm:text-sm uppercase tracking-wider ${
                isToday ? 'gold-text drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : day.checked ? 'text-amber-300' : 'text-gray-300'
              }`}>
                {DAY_LABELS[i]}
              </span>

              {/* Icon Indicator */}
              <div className="my-1.5">
                {day.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-amber-300 fill-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                ) : (
                  <Circle className={`w-5 h-5 ${isToday ? 'text-mystic-gold animate-pulse' : 'text-gray-500'}`} />
                )}
              </div>

              {/* Star Reward with MysticStar */}
              <span className={`font-serif font-bold text-xs tracking-tight flex items-center gap-1 ${
                day.checked ? 'text-amber-200' : isToday ? 'text-mystic-gold' : 'text-gray-400'
              }`}>
                <span>+{day.reward}</span>
                <MysticStar className="w-3 h-3" />
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        {/* Main Checkin / Daily Tarot Button */}
        {isAuthenticated ? (
          <motion.button
            onClick={checkedInToday ? onOpenDailyTarot : handleCheckin}
            disabled={isChecking}
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(212,175,55,0.4)' }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 w-full py-3 px-5 rounded-2xl font-serif font-bold text-xs sm:text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              checkedInToday
                ? 'bg-gradient-to-r from-amber-500/20 via-mystic-gold/25 to-amber-500/20 text-amber-200 border border-mystic-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:border-mystic-gold'
                : 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-mystic-dark border border-mystic-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]'
            }`}
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin text-mystic-dark" />
            ) : checkedInToday ? (
              <>
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Mở Lá Bài Hàng Ngày</span>
              </>
            ) : (
              <>
                <MysticStar className="w-4 h-4 text-mystic-dark fill-mystic-dark" />
                <span>Điểm Danh Ngay</span>
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            onClick={onOpenDailyTarot}
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(212,175,55,0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 w-full py-3 px-5 rounded-2xl font-serif font-bold text-xs sm:text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-mystic-dark border border-mystic-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
          >
            <MysticStar className="w-4 h-4 text-mystic-dark fill-mystic-dark" />
            <span>Rút Bài Hằng Ngày Miễn Phí</span>
          </motion.button>
        )}

        {/* Daily Tarot Secondary Button (when not checked in yet) */}
        {isAuthenticated && onOpenDailyTarot && !checkedInToday && (
          <motion.button
            onClick={onOpenDailyTarot}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl border border-mystic-gold/40 text-mystic-gold bg-mystic-gold/10 font-serif font-bold text-xs sm:text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]"
          >
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Xem Lá Bài Hằng Ngày</span>
          </motion.button>
        )}
      </div>

      {/* Floating toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`absolute top-3 right-3 px-4 py-2.5 rounded-2xl text-xs font-serif font-bold shadow-2xl z-20 backdrop-blur-md border flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-amber-500/90 text-mystic-dark border-amber-300'
                : toast.type === 'error'
                ? 'bg-red-900/90 text-white border-red-500'
                : 'bg-indigo-900/90 text-amber-200 border-mystic-gold/50'
            }`}
          >
            <MysticStar className="w-4 h-4" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckinWidget;
