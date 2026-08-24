import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, WifiOff } from 'lucide-react';

/**
 * Phased mystical messages shown during backend warm-up.
 * Each phase is displayed based on elapsed seconds since the request started.
 */
const PHASES = [
  { maxSeconds: 5,  primary: '✦ Đang lắng nghe những tín hiệu từ vũ trụ...',     secondary: null },
  { maxSeconds: 15, primary: '✦ Những lá bài đang tìm đến bạn...',               secondary: null },
  { maxSeconds: 30, primary: '✦ Các vì sao đang hội tụ...',                       secondary: null },
  { maxSeconds: 45, primary: '✦ Vũ trụ đang chuẩn bị thông điệp dành cho bạn...', secondary: null },
  { maxSeconds: Infinity, primary: '✦ Chỉ một chút nữa thôi...',                 secondary: 'Thông điệp đang tìm đường đến bạn.' },
];

const getPhase = (elapsedSeconds) =>
  PHASES.find((p) => elapsedSeconds < p.maxSeconds) ?? PHASES[PHASES.length - 1];

/**
 * BackendWarmupOverlay
 *
 * Shown when `status === 'warming'` (backend not yet ready).
 * Shown as error panel when `status === 'error'`.
 * Invisible when `status === 'idle'` or `'ready'`.
 *
 * Props:
 *  status         — 'idle' | 'warming' | 'ready' | 'error'
 *  elapsedSeconds — seconds since warm-up request started
 *  errorMessage   — human-readable error string
 *  onRetry        — callback to re-trigger warm-up
 */
const BackendWarmupOverlay = ({ status, elapsedSeconds, errorMessage, onRetry }) => {
  const isVisible = status === 'warming' || status === 'error';
  const phase = getPhase(elapsedSeconds);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="warmup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-[60vh] py-24 px-6 relative"
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {status === 'warming' && (
            <>
              {/* Mystical spinner */}
              <div className="relative w-24 h-24 mb-10">
                <motion.div
                  className="absolute inset-0 border-t-2 border-mystic-gold rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-3 border-b-2 border-mystic-gold/40 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="text-mystic-gold" size={28} />
                </motion.div>
              </div>

              {/* Phased mystical message */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase.primary}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-lg"
                >
                  <p
                    className="gold-text text-xl md:text-2xl font-serif font-bold tracking-wider mb-3"
                    style={{ fontStyle: 'italic' }}
                  >
                    {phase.primary}
                  </p>
                  {phase.secondary && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-mystic-gold/50 text-sm font-serif italic tracking-widest"
                    >
                      {phase.secondary}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Subtle hint */}
              <motion.p
                className="mt-10 text-gray-600 text-xs uppercase tracking-[0.35em] font-bold"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Đang kết nối tín hiệu với Vũ trụ...
              </motion.p>
            </>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center max-w-md gap-6"
            >
              {/* Error icon */}
              <div className="p-5 rounded-full bg-red-500/10 border border-red-500/30">
                <WifiOff className="text-red-400" size={32} />
              </div>

              <div>
                <h3 className="text-xl font-serif text-mystic-gold mb-2 tracking-wider">
                  Tín hiệu từ Vũ trụ bị gián đoạn
                </h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {errorMessage || 'Tín hiệu từ Vũ trụ chưa phản hồi. Dòng chảy năng lượng đang khởi động hoặc kết nối gặp gián đoạn.'}
                </p>
              </div>

              {/* Retry button */}
              <motion.button
                onClick={onRetry}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-sm text-mystic-dark"
                style={{ background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)' }}
              >
                <RefreshCw size={16} />
                <span>Thử lại</span>
              </motion.button>

              <p className="text-gray-600 text-xs italic tracking-wider">
                Dòng chảy Vũ trụ đang khởi động, vui lòng chờ trong giây phút.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackendWarmupOverlay;
