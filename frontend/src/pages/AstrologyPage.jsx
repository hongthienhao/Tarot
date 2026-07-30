import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ZodiacDailySection from '../components/ZodiacDailySection';

const AstrologyPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 mb-8"
      >
        <div className="p-4 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-mystic-dark/80 to-purple-950/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between shadow-[0_10px_30px_rgba(168,85,247,0.1)] gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-300 border border-purple-500/30">
              <Star className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-purple-300 font-bold font-serif block mb-1">
                Năng Lượng Các Vì Sao
              </span>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wider">
                ✨ CHIÊM TINH & THẦN SỐ HỌC
              </h1>
            </div>
          </div>

          <Link
            to="/cosmic"
            className="px-6 py-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-sm font-serif font-bold transition-all flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
          >
            <span>Mở Bản Đồ Khám Phá Vũ Trụ</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <ZodiacDailySection />
      </motion.main>
    </div>
  );
};

export default AstrologyPage;
