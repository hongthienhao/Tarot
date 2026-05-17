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
      
      {/* Elegantly styled Vietnamese Disclaimer Section */}
      <div className="max-w-4xl mx-auto mb-12 p-6 md:p-8 glass border border-mystic-gold/15 rounded-3xl relative overflow-hidden bg-gradient-to-br from-mystic-purple/20 via-mystic-dark/40 to-transparent shadow-[0_15px_35px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-mystic-gold/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          <div className="p-3 bg-mystic-gold/10 rounded-2xl text-mystic-gold border border-mystic-gold/20 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <h5 className="text-[11px] font-serif uppercase tracking-[0.25em] gold-text font-bold mb-2">
              Tuyên Bố Miễn Trừ Trách Nhiệm
            </h5>
            <p className="text-[11px] md:text-xs text-gray-400 font-light leading-relaxed tracking-wide italic">
              Trải bài Tarot tại <span className="text-mystic-gold/80 font-medium">Tarot Mystic</span> chỉ mang tính chất tham khảo, chiêm nghiệm và định hướng tinh thần. Chúng tôi không đưa ra các quyết định thay thế cho tư vấn pháp lý, y tế, tài chính hoặc tâm lý chuyên nghiệp. Hãy luôn tin tưởng vào trực giác và ý chí tự do của chính bạn trên hành trình cuộc đời.
            </p>
          </div>
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

