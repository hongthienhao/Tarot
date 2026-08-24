import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User, Sparkles, History, Calendar, Star, Compass, Hash, Save,
  CheckCircle2, AlertCircle, Loader2, ArrowUpRight, Shield, RefreshCw,
  Search, Eye, Trash2, BookOpen, Layers, Flame, MapPin, ChevronRight,
  TrendingDown, TrendingUp
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import apiClient from '../api/client';
import MysticStar from '../components/MysticStar';
import ZodiacIcon from '../components/ZodiacIcon';
import CosmicMarkdown from '../components/CosmicMarkdown';
import CheckinWidget from '../components/CheckinWidget';
import DailyTarotModal from '../components/DailyTarotModal';
import ProtectedImage from '../components/ProtectedImage';
import {
  getZodiacDetails,
  calculateLifePathNumber,
  LIFE_PATH_MEANINGS
} from '../utils/astrology';

const TABS = [
  { id: 'profile', label: 'Hồ Sơ & Chiêm Tinh', icon: User },
  { id: 'history', label: 'Lịch Sử Trải Bài', icon: History },
  { id: 'stars', label: 'Tinh Tú & Điểm Danh', icon: MysticStar },
];

const TX_TYPE_LABELS = {
  WELCOME_BONUS: '🎁 Chào Mừng',
  CHECKIN_REWARD: '📅 Điểm Danh',
  ADMIN_GRANT: '⬆️ Thưởng Tinh Tú',
  ADMIN_DEDUCT: '⬇️ Khấu Trừ',
  DRAW_COST: '🃏 Rút Bài Tarot',
  REFUND: '↩️ Hoàn Trả',
};

const ProfilePage = () => {
  const { user, isAuthenticated, updateUser, fetchProfile } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTab = searchParams.get('tab') || 'profile';
  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // State: Profile form
  const [fullName, setFullName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('MALE');
  const [city, setCity] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // State: Readings history
  const [readings, setReadings] = useState([]);
  const [isReadingsLoading, setIsReadingsLoading] = useState(false);
  const [readingSearch, setReadingSearch] = useState('');
  const [selectedReading, setSelectedReading] = useState(null);

  // State: Star transactions
  const [transactions, setTransactions] = useState([]);
  const [isTxLoading, setIsTxLoading] = useState(false);

  // State: Daily Tarot modal trigger from stars tab
  const [isDailyTarotOpen, setIsDailyTarotOpen] = useState(false);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.name || '');
      setGender(user.gender || 'MALE');
      setCity(user.city || '');
      if (user.birthDate) {
        const [y, m, d] = user.birthDate.split('-');
        setYear(y || '');
        setMonth(m ? String(parseInt(m)) : '');
        setDay(d ? String(parseInt(d)) : '');
      }
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Computed Astrology & Numerology
  const computedBirthDate = useMemo(() => {
    if (year && month && day) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return user?.birthDate || '';
  }, [year, month, day, user]);

  const zodiacDetails = useMemo(() => {
    return getZodiacDetails(computedBirthDate);
  }, [computedBirthDate]);

  const lifePathNumber = useMemo(() => {
    return calculateLifePathNumber(computedBirthDate);
  }, [computedBirthDate]);

  const lifePathInfo = useMemo(() => {
    if (!lifePathNumber) return null;
    return LIFE_PATH_MEANINGS[lifePathNumber] || null;
  }, [lifePathNumber]);

  // Fetch Reading History
  const fetchReadings = useCallback(async () => {
    setIsReadingsLoading(true);
    try {
      const res = await apiClient.get('/readings');
      setReadings(res.data.data.readings || []);
    } catch (e) {
      console.error('Failed to load readings:', e);
    } finally {
      setIsReadingsLoading(false);
    }
  }, []);

  // Fetch Star Transactions
  const fetchMyTransactions = useCallback(async () => {
    setIsTxLoading(true);
    try {
      const res = await apiClient.get('/users/transactions');
      setTransactions(res.data.data.transactions || []);
    } catch (e) {
      console.error('Failed to load transactions:', e);
    } finally {
      setIsTxLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (currentTab === 'history') fetchReadings();
      if (currentTab === 'stars') fetchMyTransactions();
    }
  }, [currentTab, isAuthenticated, fetchReadings, fetchMyTransactions]);

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await apiClient.put('/users/profile', {
        fullName,
        gender,
        city,
        birthDate: computedBirthDate || null,
      });
      if (res.data?.data?.user) {
        updateUser(res.data.data.user);
        showToast('Đã lưu thông tin hồ sơ và đồng bộ Chiêm Tinh!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Có lỗi xảy ra khi lưu hồ sơ.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered readings
  const filteredReadings = useMemo(() => {
    if (!readingSearch.trim()) return readings;
    const q = readingSearch.toLowerCase();
    return readings.filter(
      (r) =>
        (r.spreadName && r.spreadName.toLowerCase().includes(q)) ||
        (r.userQuestion && r.userQuestion.toLowerCase().includes(q)) ||
        (r.interpretation && r.interpretation.toLowerCase().includes(q))
    );
  }, [readings, readingSearch]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 px-3.5 sm:px-6 md:px-8 max-w-[1536px] mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-24 right-6 z-[350] px-4 py-3 rounded-2xl text-xs font-serif font-bold shadow-2xl flex items-center gap-2.5 backdrop-blur-md border ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HERO IDENTITY CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-mystic-gold/30 bg-gradient-to-br from-white/4 via-mystic-dark/90 to-mystic-dark/95 p-6 md:p-8 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden mb-8"
      >
        {/* Ambient Top Glow */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-600 via-mystic-gold to-yellow-200" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
          {/* Avatar with gold ring */}
          <div className="relative shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-mystic-gold/60 shadow-[0_0_25px_rgba(212,175,55,0.35)]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-600/20 border-2 border-mystic-gold/60 flex items-center justify-center text-mystic-gold text-3xl font-serif font-bold shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-mystic-dark border border-mystic-gold text-mystic-gold shadow-md">
              <Sparkles size={14} className="animate-spin-reverse" />
            </div>
          </div>

          {/* User Basic Info & Badges */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                {user?.fullName || user?.name || 'Lữ Khách Vũ Trụ'}
              </h1>
              {user?.role === 'ADMIN' ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  Admin
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400">
                  Lữ Khách
                </span>
              )}
            </div>

            <p className="text-xs font-serif text-gray-400">{user?.email}</p>

            {/* Cosmic Pill Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {/* Star Points */}
              <button
                onClick={() => setActiveTab('stars')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 font-serif font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-105 transition-all cursor-pointer"
              >
                <MysticStar className="w-3.5 h-3.5" />
                <span>{user?.starPoints ?? 0} Tinh Tú</span>
              </button>

              {/* Zodiac Badge */}
              {zodiacDetails && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-mystic-gold/10 border border-mystic-gold/30 text-mystic-gold font-serif text-xs hover:scale-105 transition-all cursor-pointer"
                >
                  <ZodiacIcon sign={zodiacDetails.name.split(' ')[0]} className="w-3.5 h-3.5" />
                  <span>{zodiacDetails.name}</span>
                </button>
              )}

              {/* Life Path Badge */}
              {lifePathNumber && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-serif text-xs hover:scale-105 transition-all cursor-pointer"
                >
                  <Hash size={13} />
                  <span>Số Chủ Đạo {lifePathNumber}</span>
                </button>
              )}

              {/* Joined Date */}
              {user?.createdAt && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-serif text-xs">
                  <Calendar size={13} />
                  <span>Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. NAVIGATION TABS ── */}
      <div className="flex gap-2 mb-8 border-b border-white/10 pb-0 overflow-x-auto custom-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3.5 text-xs md:text-sm font-serif font-bold border-b-2 transition-all cursor-pointer -mb-px whitespace-nowrap tracking-wider uppercase ${
                isActive
                  ? 'border-mystic-gold text-mystic-gold bg-mystic-gold/5 rounded-t-2xl shadow-[inset_0_2px_10px_rgba(212,175,55,0.1)]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-mystic-gold" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. TAB CONTENT ── */}

      {/* ── TAB 1: HỒ SƠ & CHIÊM TINH ── */}
      {currentTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Edit Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/2 backdrop-blur-md shadow-xl space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
                <User className="w-5 h-5 text-mystic-gold" />
                <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                  Thông Tin Lữ Khách
                </h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Email (Readonly) */}
                <div>
                  <label className="text-xs font-serif text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">
                    Email Tài Khoản
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-white/3 border border-white/5 rounded-xl text-gray-400 font-serif text-sm cursor-not-allowed"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-xs font-serif text-gray-300 uppercase tracking-wider block mb-1.5 font-bold">
                    Tên Hiển Thị (Họ & Tên)
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên hiển thị của bạn..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-serif text-sm outline-none focus:border-mystic-gold transition-colors"
                  />
                </div>

                {/* Birthdate (Day / Month / Year) */}
                <div>
                  <label className="text-xs font-serif text-gray-300 uppercase tracking-wider block mb-1.5 font-bold">
                    Ngày Sinh (Dùng tính Cung Hoàng Đạo & Thần Số Học)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder="Ngày (1-31)"
                      min="1"
                      max="31"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-serif text-sm outline-none focus:border-mystic-gold text-center"
                    />
                    <input
                      type="number"
                      placeholder="Tháng (1-12)"
                      min="1"
                      max="12"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-serif text-sm outline-none focus:border-mystic-gold text-center"
                    />
                    <input
                      type="number"
                      placeholder="Năm (ví dụ: 2000)"
                      min="1900"
                      max="2099"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-serif text-sm outline-none focus:border-mystic-gold text-center"
                    />
                  </div>
                </div>

                {/* Gender & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-serif text-gray-300 uppercase tracking-wider block mb-1.5 font-bold">
                      Giới Tính
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 bg-[#110d1c] border border-white/10 rounded-xl text-white font-serif text-sm outline-none focus:border-mystic-gold"
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác / Khám phá</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-serif text-gray-300 uppercase tracking-wider block mb-1.5 font-bold">
                      Tỉnh / Thành Phố
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: TP. Hồ Chí Minh, Hà Nội..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-serif text-sm outline-none focus:border-mystic-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-40"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                    <span>{isSaving ? 'Đang Lưu Hồ Sơ...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Live Astrology & Numerology Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Zodiac Card */}
            <div className="p-6 rounded-3xl border border-mystic-gold/30 bg-gradient-to-b from-mystic-gold/10 via-mystic-dark to-mystic-dark/95 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-mystic-gold/15">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-mystic-gold" />
                  <h3 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
                    Cung Hoàng Đạo
                  </h3>
                </div>
                <Link to="/astrology" className="text-[11px] font-serif text-mystic-gold/80 hover:text-mystic-gold flex items-center gap-1">
                  <span>Chi tiết</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>

              {zodiacDetails ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-mystic-gold/20 border border-mystic-gold/40 flex items-center justify-center text-mystic-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      <ZodiacIcon sign={zodiacDetails.name.split(' ')[0]} className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold gold-text text-base">{zodiacDetails.name}</h4>
                      <p className="text-xs text-gray-400 font-serif">{zodiacDetails.dateRange}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-serif pt-1">
                    <div className="p-2.5 rounded-xl bg-white/3 border border-white/8">
                      <span className="text-gray-400 text-[10px] uppercase block">Nguyên Tố</span>
                      <strong className="text-amber-200">{zodiacDetails.element}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/3 border border-white/8">
                      <span className="text-gray-400 text-[10px] uppercase block">Hành Tinh Bảo Hộ</span>
                      <strong className="text-amber-200">{zodiacDetails.rulingPlanet}</strong>
                    </div>
                  </div>

                  <p className="text-xs font-serif italic text-gray-300 leading-relaxed bg-white/2 p-3 rounded-xl border border-white/5">
                    "{zodiacDetails.vibe}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 font-serif text-xs space-y-1">
                  <p>Vui lòng cập nhật Ngày Sinh để mở khóa Chiêm Tinh Hoàng Đạo của bạn.</p>
                </div>
              )}
            </div>

            {/* Numerology Card */}
            <div className="p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 via-mystic-dark to-mystic-dark/95 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/15">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
                    Thần Số Học
                  </h3>
                </div>
                <Link to="/cosmic" className="text-[11px] font-serif text-indigo-300 hover:text-indigo-200 flex items-center gap-1">
                  <span>Bản đồ</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>

              {lifePathNumber && lifePathInfo ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-serif font-bold text-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      {lifePathNumber}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-indigo-200 text-base">{lifePathInfo.title}</h4>
                      <p className="text-xs text-gray-400 font-serif">Con số chủ đạo đường đời</p>
                    </div>
                  </div>

                  <p className="text-xs font-serif text-gray-300 leading-relaxed bg-white/2 p-3 rounded-xl border border-white/5">
                    {lifePathInfo.summary}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 font-serif text-xs">
                  <p>Cập nhật Ngày Sinh để tính Con Số Đường Đời Thần Số Học.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: LỊCH SỬ TRẢI BÀI ── */}
      {currentTab === 'history' && (
        <div className="space-y-6">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={readingSearch}
                onChange={(e) => setReadingSearch(e.target.value)}
                placeholder="Tìm theo câu hỏi hoặc tên trải bài..."
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-serif text-white outline-none focus:border-mystic-gold transition-colors"
              />
            </div>

            <Link
              to="/tarot"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-mystic-dark font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-md"
            >
              <Sparkles size={14} />
              <span>Rút Trải Bài Mới</span>
            </Link>
          </div>

          {/* Readings List */}
          {isReadingsLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 text-mystic-gold animate-spin mx-auto" />
            </div>
          ) : filteredReadings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReadings.map((reading) => (
                <motion.div
                  key={reading.id}
                  onClick={() => setSelectedReading(reading)}
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-3xl border border-white/10 bg-white/2 hover:border-mystic-gold/40 hover:bg-white/4 transition-all cursor-pointer space-y-3.5 shadow-lg relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-mystic-gold/15 text-mystic-gold border border-mystic-gold/30">
                      {reading.spreadName || 'Trải bài Tarot'}
                    </span>
                    <span className="text-[11px] font-serif text-gray-400">
                      {new Date(reading.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  {reading.userQuestion && (
                    <p className="text-xs font-serif text-amber-200/90 font-medium truncate">
                      ❓ {reading.userQuestion}
                    </p>
                  )}

                  {/* Mini Cards Preview */}
                  {reading.readingCards && reading.readingCards.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {reading.readingCards.map((rc, idx) => (
                        <div key={rc.id || idx} className="shrink-0 text-center">
                          <div className="w-12 h-20 rounded-lg overflow-hidden border border-mystic-gold/40 shadow-sm">
                            <ProtectedImage
                              src={rc.card?.imagePath || rc.card?.image}
                              alt=""
                              className={`w-full h-full object-cover ${rc.isReversed ? 'rotate-180' : ''}`}
                            />
                          </div>
                          <p className="text-[9px] font-serif text-gray-400 truncate max-w-[48px] mt-0.5">
                            {rc.card?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-gray-400">
                    <span className="text-[11px] font-serif group-hover:text-mystic-gold transition-colors">
                      Xem phân tích chi tiết →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 p-8 rounded-3xl border border-white/10 bg-white/2 space-y-3">
              <BookOpen className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="font-serif text-sm text-gray-400">Bạn chưa có phiên trải bài Tarot nào.</p>
              <Link
                to="/tarot"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-mystic-gold/15 text-mystic-gold font-serif text-xs uppercase tracking-wider hover:bg-mystic-gold/25 transition-all"
              >
                <Sparkles size={14} />
                <span>Khám phá các tụ bài ngay</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: TINH TÚ & ĐIỂM DANH ── */}
      {currentTab === 'stars' && (
        <div className="space-y-8">
          {/* Top Balance & Checkin Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Balance Card */}
            <div className="md:col-span-5 p-6 md:p-8 rounded-3xl border border-mystic-gold/40 bg-gradient-to-br from-amber-500/15 via-mystic-dark to-mystic-dark/95 shadow-[0_15px_50px_rgba(212,175,55,0.2)] text-center space-y-4 flex flex-col justify-center">
              <p className="text-xs font-serif uppercase tracking-widest text-amber-200/80">
                Số Dư Tinh Tú Hiện Tại
              </p>
              <div className="flex items-center justify-center gap-3">
                <MysticStar className="w-10 h-10 text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]" />
                <span className="text-4xl md:text-5xl font-serif font-bold gold-text">
                  {user?.starPoints ?? 0}
                </span>
              </div>
              <p className="text-xs font-serif text-gray-400 leading-relaxed px-4">
                Dùng Tinh Tú để rút các trải bài chuyên sâu và mở khóa thông điệp số mệnh từ Bậc Thầy Tarot.
              </p>
              <div className="pt-2">
                <Link
                  to="/tarot"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-mystic-dark font-serif font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-md transition-all"
                >
                  <Sparkles size={14} />
                  <span>Dùng Tinh Tú Rút Bài</span>
                </Link>
              </div>
            </div>

            {/* Check-in Widget embedded */}
            <div className="md:col-span-7">
              <CheckinWidget
                onCheckinSuccess={fetchProfile}
                onOpenDailyTarot={() => setIsDailyTarotOpen(true)}
              />
            </div>
          </div>

          {/* Star Transactions Log Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-mystic-gold" />
                <h3 className="font-serif font-bold text-white text-base tracking-wide">
                  Lịch Sử Biến Động Tinh Tú Của Bạn
                </h3>
              </div>
              <button
                onClick={fetchMyTransactions}
                className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                title="Làm mới"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {isTxLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-6 h-6 text-mystic-gold animate-spin mx-auto" />
              </div>
            ) : transactions.length > 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/2 overflow-hidden shadow-xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left font-serif text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Loại Giao Dịch</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Lý Do / Chi Tiết</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Biến Động</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Thời Gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, idx) => (
                        <tr key={tx.id || idx} className={`border-t border-white/5 ${idx % 2 === 0 ? 'bg-white/1' : 'bg-transparent'}`}>
                          <td className="px-5 py-3.5">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-gray-300">
                              {TX_TYPE_LABELS[tx.type] || tx.type}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-300 truncate max-w-[220px]">
                            {tx.reason || 'Biến động Tinh Tú'}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              tx.amount > 0
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            }`}>
                              <span>{tx.amount > 0 ? `+${tx.amount}` : tx.amount}</span>
                              <MysticStar className="w-3 h-3" />
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-400">
                            {new Date(tx.createdAt).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500 font-serif text-xs italic">
                Chưa có lịch sử giao dịch Tinh Tú nào.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Reading Detail Modal */}
      <AnimatePresence>
        {selectedReading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReading(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-mystic-dark border border-mystic-gold/40 rounded-3xl p-6 md:p-8 overflow-y-auto custom-scrollbar z-10 space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-mystic-gold/20">
                <div>
                  <span className="text-[10px] uppercase font-bold text-mystic-gold tracking-widest block">
                    Chi Tiết Trải Bài
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {selectedReading.spreadName || 'Trải bài Tarot'}
                  </h3>
                  <p className="text-xs text-gray-400 font-serif mt-0.5">
                    {new Date(selectedReading.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReading(null)}
                  className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {selectedReading.userQuestion && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs font-serif">
                  <strong className="block text-[11px] uppercase tracking-wider text-amber-300 mb-1">
                    Câu hỏi của bạn:
                  </strong>
                  "{selectedReading.userQuestion}"
                </div>
              )}

              {/* Cards Grid */}
              {selectedReading.readingCards && selectedReading.readingCards.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-serif font-bold gold-text uppercase tracking-wider">
                    Các Lá Bài Đã Rút
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedReading.readingCards.map((rc) => (
                      <div key={rc.id} className="p-3 rounded-2xl bg-white/3 border border-white/8 text-center space-y-2">
                        <div className="w-20 h-32 mx-auto rounded-xl overflow-hidden border border-mystic-gold/40 shadow-md">
                          <ProtectedImage
                            src={rc.card?.imagePath || rc.card?.image}
                            alt=""
                            className={`w-full h-full object-cover ${rc.isReversed ? 'rotate-180' : ''}`}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white font-serif truncate">{rc.card?.name}</p>
                          <span className={`text-[10px] font-serif ${rc.isReversed ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {rc.isReversed ? 'Ngược (Reversed)' : 'Xuôi (Upright)'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interpretation */}
              {selectedReading.interpretation && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-serif font-bold gold-text uppercase tracking-wider">
                    Lời Luận Giải Từ Vũ Trụ & AI
                  </h4>
                  <div className="p-5 rounded-2xl bg-white/2 border border-white/8">
                    <CosmicMarkdown content={selectedReading.interpretation} />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Daily Tarot Modal Trigger */}
      <DailyTarotModal
        isOpen={isDailyTarotOpen}
        onClose={() => {
          setIsDailyTarotOpen(false);
          fetchProfile();
          fetchMyTransactions();
        }}
      />
    </div>
  );
};

export default ProfilePage;
