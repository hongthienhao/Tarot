import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import SpreadSelector from '../components/SpreadSelector';
import BackendWarmupOverlay from '../components/BackendWarmupOverlay';
import useBackendWarmup from '../hooks/useBackendWarmup';

const TarotPage = () => {
  const { status, elapsedSeconds, errorMessage, retry } = useBackendWarmup();

  // 'idle'    → request in-flight, < 300ms elapsed — render nothing special (avoid flicker)
  // 'warming' → backend still loading after 300ms — show mystical overlay
  // 'ready'   → backend responded 2xx — show SpreadSelector normally
  // 'error'   → timeout / non-2xx — show error panel with retry
  const showSpreadSelector = status === 'ready';
  const showOverlay = status === 'warming' || status === 'error';

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 relative z-10">
      {/* Page header — always visible regardless of warm-up state */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[1536px] mx-auto px-3.5 sm:px-6 md:px-8 mb-8"
      >
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-mystic-gold/30 bg-gradient-to-r from-mystic-gold/15 via-mystic-dark/80 to-mystic-gold/15 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between shadow-[0_10px_30px_rgba(212,175,55,0.1)] gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-mystic-gold/20 rounded-2xl text-mystic-gold border border-mystic-gold/30">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-mystic-gold font-bold font-serif block mb-1">
                Thánh Đường Lõi
              </span>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wider">
                🔮 KHU VỰC TRẢI BÀI TAROT
              </h1>
            </div>
          </div>
          <div className="text-sm font-serif italic text-gray-400 max-w-sm md:text-right">
            Lắng nghe thông điệp vũ trụ, khai mở những bí ẩn sâu thẳm trong tâm hồn qua từng trải bài thiêng liêng.
          </div>
        </div>
      </motion.div>

      {/* Warm-up overlay — only rendered while status is 'warming' or 'error' */}
      {showOverlay && (
        <BackendWarmupOverlay
          status={status}
          elapsedSeconds={elapsedSeconds}
          errorMessage={errorMessage}
          onRetry={retry}
        />
      )}

      {/* Main content — only rendered when backend is confirmed ready */}
      {showSpreadSelector && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SpreadSelector />
        </motion.main>
      )}
    </div>
  );
};

export default TarotPage;
