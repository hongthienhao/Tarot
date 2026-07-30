import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import SpreadSelector from '../components/SpreadSelector';

const TarotPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 mb-8"
      >
        <div className="p-4 rounded-3xl border border-mystic-gold/30 bg-gradient-to-r from-mystic-gold/15 via-mystic-dark/80 to-mystic-gold/15 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between shadow-[0_10px_30px_rgba(212,175,55,0.1)] gap-4">
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

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <SpreadSelector />
      </motion.main>
    </div>
  );
};

export default TarotPage;
