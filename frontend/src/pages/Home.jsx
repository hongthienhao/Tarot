import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Compass, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

const Home = () => {
  const features = [
    {
      id: 'tarot',
      title: 'Thánh Đường Tarot',
      desc: 'Lắng nghe thông điệp qua các bộ quẻ bài thiêng liêng. Giao tiếp với các Reader AI chuyên nghiệp.',
      icon: Eye,
      link: '/tarot',
      colors: {
        border: 'hover:border-mystic-gold/40',
        bgHover: 'group-hover:bg-mystic-gold/5',
        iconBg: 'bg-mystic-gold/10 border-mystic-gold/30 text-mystic-gold',
        text: 'text-mystic-gold'
      }
    },
    {
      id: 'astrology',
      title: 'Chiêm Tinh & Thần Số',
      desc: 'Khám phá năng lượng các vì sao, giải mã tử vi hàng ngày và thấu hiểu hồ sơ linh hồn của bạn.',
      icon: Star,
      link: '/astrology',
      colors: {
        border: 'hover:border-purple-500/40',
        bgHover: 'group-hover:bg-purple-500/5',
        iconBg: 'bg-purple-500/10 border-purple-500/30 text-purple-500',
        text: 'text-purple-500'
      }
    },
    {
      id: 'cosmic',
      title: 'Bản Đồ Nguyên Khí',
      desc: 'Dạo bước trong không gian vũ trụ đa chiều, nơi mọi năng lượng hội tụ và giao thoa.',
      icon: Compass,
      link: '/cosmic',
      colors: {
        border: 'hover:border-blue-500/40',
        bgHover: 'group-hover:bg-blue-500/5',
        iconBg: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
        text: 'text-blue-500'
      }
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Entrance Section */}
      <Hero />

      {/* Feature Navigation Sections */}
      <main className="relative z-10 bg-mystic-dark/50 backdrop-blur-3xl py-24 border-t border-mystic-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-mystic-gold animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-mystic-gold font-serif font-bold">
                Khám Phá Phân Khu
              </span>
              <Sparkles className="w-5 h-5 text-mystic-gold animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Các Cổng Không Gian
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Hãy chọn cho mình một cánh cổng để bước vào hành trình thấu hiểu bản thân. Mỗi phân khu được thiết kế riêng biệt để mang lại trải nghiệm chuyên sâu và tĩnh tại nhất.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Link to={feature.link} className="block group h-full">
                  <div className={`h-full p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-md transition-all duration-500 relative overflow-hidden ${feature.colors.border}`}>
                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.colors.bgHover}`} />
                    
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border group-hover:scale-110 transition-transform duration-500 ${feature.colors.iconBg}`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    
                    <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-mystic-gold transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 font-light leading-relaxed mb-8">
                      {feature.desc}
                    </p>
                    
                    <div className={`flex items-center gap-2 text-sm font-serif font-bold uppercase tracking-wider ${feature.colors.text}`}>
                      <span>Tiến vào</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
