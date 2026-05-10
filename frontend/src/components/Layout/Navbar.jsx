import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang Chủ', href: '#' },
    { name: 'Kiểu Trải Bài', href: '#spreads' },
    { name: 'Ý Nghĩa Bài', href: '#' },
    { name: 'Về Chúng Tôi', href: '#' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 bg-mystic-dark/80 backdrop-blur-md border-b border-mystic-gold/10' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <Sparkles className="w-8 h-8 text-mystic-gold group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute inset-0 bg-mystic-gold/20 blur-lg rounded-full group-hover:bg-mystic-gold/40 transition-all" />
          </div>
          <span className="text-2xl font-serif tracking-widest gold-text font-bold">TAROT MYSTIC</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm uppercase tracking-[0.2em] text-gray-300 hover:text-mystic-gold transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-mystic-gold transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border border-mystic-gold/40 text-mystic-gold text-xs uppercase tracking-widest rounded-sm hover:bg-mystic-gold/10 transition-all"
          >
            Đăng Nhập
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden text-mystic-gold">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
