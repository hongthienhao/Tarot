import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Globe, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative pt-24 pb-12 px-6 overflow-hidden border-t border-mystic-gold/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-mystic-gold/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-mystic-gold" />
            <span className="text-xl font-serif tracking-widest gold-text font-bold uppercase">Tarot Mystic</span>
          </div>
          <p className="text-gray-400 max-w-sm font-light leading-relaxed italic mb-8">
            "Hành trình vạn dặm bắt đầu bằng một bước chân, và hành trình khám phá tâm hồn bắt đầu bằng một lá bài."
          </p>
          <div className="flex gap-6">
            <motion.a whileHover={{ y: -5, color: '#d4af37' }} href="#" className="text-gray-500 transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" />
            </motion.a>
            <motion.a whileHover={{ y: -5, color: '#d4af37' }} href="#" className="text-gray-500 transition-colors flex items-center gap-2">
              <Globe className="w-5 h-5" />
            </motion.a>
            <motion.a whileHover={{ y: -5, color: '#d4af37' }} href="#" className="text-gray-500 transition-colors flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
        
        <div>
          <h4 className="text-mystic-gold uppercase tracking-widest text-sm font-bold mb-6">Liên kết</h4>
          <ul className="space-y-4 text-sm text-gray-400 font-light">
            <li><a href="#" className="hover:text-mystic-gold transition-colors">Trang chủ</a></li>
            <li><a href="#spreads" className="hover:text-mystic-gold transition-colors">Kiểu trải bài</a></li>
            <li><a href="#" className="hover:text-mystic-gold transition-colors">Ý nghĩa bài</a></li>
            <li><a href="#" className="hover:text-mystic-gold transition-colors">Cửa hàng</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-mystic-gold uppercase tracking-widest text-sm font-bold mb-6">Hỗ trợ</h4>
          <ul className="space-y-4 text-sm text-gray-400 font-light">
            <li><a href="#" className="hover:text-mystic-gold transition-colors">Câu hỏi thường gặp</a></li>
            <li><a href="#" className="hover:text-mystic-gold transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-mystic-gold transition-colors">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:text-mystic-gold transition-colors">Liên hệ</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">
          &copy; 2026 Tarot Mystic Space. All Rights Reserved. Crafted for the soul.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
