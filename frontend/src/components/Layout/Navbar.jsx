import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, LogOut, History, User, Home, Compass, Layers, BookOpen, Scroll, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import MysticStar from '../MysticStar';
import useScrollLock from '../../hooks/useScrollLock';

const ScrollLockWrapper = () => {
  useScrollLock(true);
  return null;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Trang Chủ', href: '/', icon: Home },
    { name: 'Tarot', href: '/tarot', icon: Sparkles },
    { name: 'Chiêm Tinh', href: '/astrology', icon: Compass },
    { name: 'Bản Đồ', href: '/cosmic', icon: Layers },
    { name: 'Ý Nghĩa Bài', href: '/cards', icon: BookOpen },
    { name: 'Hồ Sơ', href: '/profile', icon: User, requiresAuth: true },
    { name: 'Về Chúng Tôi', href: '/about', icon: Scroll },
  ];

  const visibleNavLinks = navLinks.filter(l => !l.requiresAuth || isAuthenticated);

  // Check if a nav link is active based on current route
  const isLinkActive = (link) => {
    if (link.href === '/') return location.pathname === '/';
    return location.pathname.startsWith(link.href);
  };

  // Custom click handler for navigation
  const handleNavLinkClick = (e, link) => {
    if (link.href.startsWith('/#')) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
    } else {
      setIsMobileMenuOpen(false);
      navigate(link.href);
      e.preventDefault();
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4 bg-mystic-dark/85 backdrop-blur-md border-b border-mystic-gold/10' : 'py-8 bg-transparent'
        }`}
      >
        <div className="max-w-[1536px] mx-auto px-3.5 sm:px-6 md:px-8 flex justify-between items-center gap-4">
          {/* Region 1: Left Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="relative shrink-0">
                <Sparkles className="w-8 h-8 text-mystic-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 bg-mystic-gold/20 blur-lg rounded-full group-hover:bg-mystic-gold/40 transition-all" />
              </div>
              <span className="text-xl xl:text-2xl font-serif tracking-widest gold-text font-bold whitespace-nowrap">TAROT MYSTIC</span>
            </Link>
          </div>

          {/* Region 2: Center Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-2.5 lg:gap-5 xl:gap-7 flex-1 px-3">
            {visibleNavLinks.map((link, i) => {
              const active = isLinkActive(link);
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`text-xs lg:text-sm uppercase tracking-[0.1em] lg:tracking-[0.15em] transition-colors relative group cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 ${
                    active
                      ? 'text-mystic-gold font-semibold'
                      : 'text-gray-300 hover:text-mystic-gold'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-mystic-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.6)] group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.9)] transition-all" />
                  <span>{link.name}</span>
                  <span className={`absolute -bottom-2 left-0 h-px bg-mystic-gold transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </motion.a>
              );
            })}
          </div>

          {/* Region 3: Right Action Area (Profile / Login) */}
          <div className="hidden md:flex items-center justify-end shrink-0">
            {isAuthenticated ? (
              <div className="relative shrink-0" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-mystic-gold/40 text-mystic-gold text-xs uppercase tracking-widest rounded-full hover:bg-mystic-gold/10 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 border border-mystic-gold/40" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-4 h-4 text-mystic-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.6)] shrink-0" />
                  )}
                  <span className="truncate max-w-[100px]">{user?.fullName || user?.name}</span>
                  {/* ⭐ Tinh Tú Badge */}
                  {user?.starPoints !== undefined && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-serif font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                      <MysticStar className="w-3.5 h-3.5" />
                      <span>{user.starPoints}</span>
                    </span>
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-60 bg-mystic-dark border border-mystic-gold/30 rounded-2xl overflow-hidden shadow-2xl z-30"
                    >
                      {/* 1. Hồ Sơ & Hành Trình (Hợp nhất Hồ sơ & Lịch sử) */}
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-gray-300 hover:bg-mystic-gold/10 hover:text-mystic-gold transition-colors text-left cursor-pointer"
                      >
                        <User className="w-4 h-4 text-mystic-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                        <span>Hồ Sơ & Hành Trình</span>
                      </Link>

                      {/* 3. Tinh Tú & Điểm danh */}
                      <Link
                        to="/profile?tab=stars"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 text-sm text-gray-300 hover:bg-mystic-gold/10 hover:text-mystic-gold transition-colors border-t border-white/5"
                      >
                        <div className="flex items-center gap-2.5">
                          <MysticStar className="w-4 h-4 text-amber-300" />
                          <span className="text-amber-300 font-serif font-bold text-xs sm:text-sm">{user?.starPoints ?? 0} Tinh Tú</span>
                        </div>
                        <span className="text-xs font-serif text-mystic-gold underline underline-offset-2 font-medium">
                          Điểm danh
                        </span>
                      </Link>

                      {/* 🛡️ Admin Panel (chỉ hiện với Admin) */}
                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 transition-colors border-t border-white/5"
                        >
                          <Shield className="w-4 h-4 text-purple-400" />
                          <span>Quản trị Admin</span>
                        </Link>
                      )}

                      {/* Đăng xuất */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-300 hover:bg-rose-500/10 transition-colors border-t border-white/5 cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
                >
                  Đăng Nhập
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-mystic-gold hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Drawer Menu --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop — no backdrop-blur: causes iOS Safari rendering bug with overflow-x:hidden */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 z-40 md:hidden"
              style={{ touchAction: 'none' }}
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-mystic-dark border-l border-mystic-gold/20 p-6 z-50 flex flex-col justify-between overflow-y-auto md:hidden shadow-2xl"
              style={{ WebkitOverflowScrolling: 'touch', willChange: 'transform' }}
            >
              {/* Keep scroll locked until this motion div completely unmounts (after exit animation) */}
              <ScrollLockWrapper />
              
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-mystic-gold" />
                  <span className="text-lg font-serif tracking-widest gold-text font-bold">TAROT MYSTIC</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links list */}
              <div className="flex flex-col gap-3 my-6">
                {visibleNavLinks.map((link) => {
                  const active = isLinkActive(link);
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavLinkClick(e, link)}
                      className={`text-sm font-semibold uppercase tracking-[0.15em] transition-colors py-2.5 border-b border-white/5 cursor-pointer flex items-center gap-3 ${
                        active
                          ? 'text-mystic-gold border-b-mystic-gold/30'
                          : 'text-gray-300 hover:text-mystic-gold'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-mystic-gold" />
                      <span>{link.name}</span>
                    </a>
                  );
                })}
              </div>

              {/* Action Buttons panel */}
              <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 text-mystic-gold border border-mystic-gold/20 rounded-2xl bg-mystic-gold/5"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 border border-mystic-gold/40" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-5 h-5 text-mystic-gold shrink-0" />
                      )}
                      <span className="text-sm font-semibold truncate">{user?.fullName || user?.name}</span>
                      <span className="ml-auto text-xs text-amber-300 font-bold">{user?.starPoints ?? 0} ⭐</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-mystic-gold/10 text-mystic-gold rounded-xl transition-colors text-sm font-medium border border-mystic-gold/20"
                    >
                      <User className="w-4.5 h-4.5 text-mystic-gold shrink-0" />
                      <span>Hồ Sơ & Hành Trình</span>
                    </Link>

                    <Link
                      to="/profile?tab=stars"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-white/5 text-amber-300 hover:text-amber-200 rounded-xl transition-colors text-sm font-medium border border-white/5"
                    >
                      <MysticStar className="w-4.5 h-4.5 text-amber-300 shrink-0" />
                      <span>Tinh Tú & Điểm danh</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 rounded-xl transition-colors text-sm font-medium border border-rose-500/20 cursor-pointer"
                    >
                      <LogOut className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-mystic-dark font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-mystic-dark" />
                      <span>Đăng Nhập</span>
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
