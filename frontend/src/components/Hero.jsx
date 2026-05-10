import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Cinematic Lighting Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(74,14,14,0.15)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="inline-block mb-6"
          >
            <span className="text-mystic-gold/60 uppercase tracking-[0.6em] text-[10px] md:text-xs font-semibold border-b border-mystic-gold/20 pb-2">
              Khám phá vũ trụ bên trong bạn
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-10 leading-[0.9] tracking-tight">
            Thấu Hiểu <br />
            <span className="gold-text italic block mt-4">Định Mệnh</span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="text-lg md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-16 leading-relaxed font-accent italic"
          >
            "Nơi những lá bài không chỉ là hình vẽ, mà là tấm gương phản chiếu tiếng nói chân thực nhất của linh hồn bạn."
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-mystic-gold text-mystic-dark font-bold uppercase tracking-[0.2em] text-sm rounded-full transition-all"
            >
              Bắt đầu hành trình
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,175,55,0.05)' }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 border border-mystic-gold/30 text-mystic-gold font-bold uppercase tracking-[0.2em] text-sm rounded-full transition-all"
            >
              Khám phá bí ẩn
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-mystic-gold/50">Cuộn xuống</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="text-mystic-gold w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
