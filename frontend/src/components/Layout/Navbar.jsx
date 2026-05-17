import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, LogOut, History, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import CardDictionaryModal from '../CardDictionaryModal';
import AboutModal from '../AboutModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Modals visibility states
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Trang Chủ', href: '/' },
    { name: 'Kiểu Trải Bài', href: '/#spreads' },
    { name: 'Ý Nghĩa Bài', href: '/#' },
    { name: 'Về Chúng Tôi', href: '/#' },
  ];

  // Custom click handler to capture hash routes, open modals, or smooth scroll
  const handleNavLinkClick = (e, link) => {
    if (link.name === 'Ý Nghĩa Bài') {
      e.preventDefault();
      setIsDictionaryOpen(true);
      setIsMobileMenuOpen(false);
    } else if (link.name === 'Về Chúng Tôi') {
      e.preventDefault();
      setIsAboutOpen(true);
      setIsMobileMenuOpen(false);
    } else if (link.href.startsWith('/#')) {
      const targetId = link.href.split('#')[1];
      
      // If we are already on home page
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
      } else {
        // If on another page, navigate home first, then scroll
        e.preventDefault();
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
        setIsMobileMenuOpen(false);
      }
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4 bg-mystic-dark/85 backdrop-blur-md border-b border-mystic-gold/10' : 'py-8 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-mystic-gold group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-mystic-gold/20 blur-lg rounded-full group-hover:bg-mystic-gold/40 transition-all" />
            </div>
            <span className="text-2xl font-serif tracking-widest gold-text font-bold">TAROT MYSTIC</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm uppercase tracking-[0.2em] text-gray-300 hover:text-mystic-gold transition-colors relative group cursor-pointer"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-mystic-gold transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
            
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-mystic-gold/40 text-mystic-gold text-xs uppercase tracking-widest rounded-full hover:bg-mystic-gold/10 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[100px]">{user?.name}</span>
                </motion.button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-mystic-dark border border-mystic-gold/20 rounded-xl overflow-hidden shadow-2xl z-30"
                    >
                      <Link
                        to="/history"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-mystic-gold transition-colors"
                      >
                        <History className="w-4 h-4" />
                        Lịch sử trải bài
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors border-t border-white/5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 border border-mystic-gold/40 text-mystic-gold text-xs uppercase tracking-widest rounded-sm hover:bg-mystic-gold/10 transition-all cursor-pointer"
                >
                  Đăng Nhập
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden text-mystic-gold flex items-center z-50">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 cursor-pointer">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar Navigation Drawer --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark tint backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-[140] md:hidden backdrop-blur-sm"
            />
            {/* Sliding menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[300px] bg-mystic-dark/95 backdrop-blur-2xl border-l border-mystic-gold/20 z-[145] p-8 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif gold-text font-bold tracking-widest text-xl uppercase">Sanctuary Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-mystic-gold cursor-pointer p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links list */}
              <div className="flex flex-col gap-6 mb-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link)}
                    className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300 hover:text-mystic-gold transition-colors py-3 border-b border-white/5 cursor-pointer block"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Action Buttons panel */}
              <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 text-mystic-gold border border-mystic-gold/20 rounded-2xl bg-mystic-gold/5">
                      <User className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-semibold truncate">{user?.name}</span>
                    </div>
                    <Link
                      to="/history"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 bg-white/5 text-gray-300 hover:text-mystic-gold rounded-xl transition-colors text-sm font-medium border border-white/5"
                    >
                      <History className="w-4.5 h-4.5 shrink-0" />
                      Lịch sử trải bài
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-colors text-sm font-medium border border-red-500/20 cursor-pointer"
                    >
                      <LogOut className="w-4.5 h-4.5 shrink-0" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-4 bg-mystic-gold text-mystic-dark font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg cursor-pointer">
                      Đăng Nhập
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Card Meanings & About Modals --- */}
      <CardDictionaryModal isOpen={isDictionaryOpen} onClose={() => setIsDictionaryOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Navbar;
