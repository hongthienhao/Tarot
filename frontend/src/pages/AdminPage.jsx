import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Shield, Users, Activity, Search, Trash2, LockKeyhole, UnlockKeyhole,
  Plus, Minus, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Loader2, X, AlertCircle,
  ArrowUpDown, ArrowUp, ArrowDown, History, Sparkles, CornerDownRight, Clock,
} from 'lucide-react';
import apiClient from '../api/client';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import MysticStar from '../components/MysticStar';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'users', label: 'Người Dùng', icon: Users },
  { id: 'transactions', label: 'Tinh Tú Log', icon: MysticStar },
];

const TX_TYPE_LABELS = {
  WELCOME_BONUS: '🎁 Chào mừng',
  CHECKIN_REWARD: '📅 Điểm danh',
  ADMIN_GRANT: '⬆️ Admin +',
  ADMIN_DEDUCT: '⬇️ Admin −',
  DRAW_COST: '🃏 Rút bài',
  REFUND: '↩️ Hoàn trả',
};

// ── Toast ──
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    className={`fixed top-24 right-6 z-[350] px-4 py-3 rounded-2xl text-xs font-serif font-bold shadow-2xl flex items-center gap-2.5 backdrop-blur-md border ${
      type === 'success'
        ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
        : 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
    }`}
  >
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 cursor-pointer text-gray-400 hover:text-white"><X size={14} /></button>
  </motion.div>
);

// ── Confirmation Modal ──
const ConfirmActionModal = ({ isOpen, onClose, title, message, targetInfo, confirmText = 'Xác Nhận', type = 'danger', onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={!isLoading ? onClose : undefined}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 25 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md bg-mystic-dark/95 border border-mystic-gold/40 rounded-3xl p-6 md:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.9)] z-10 overflow-hidden space-y-5 text-center"
        >
          {/* Top Bar Glow */}
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
              type === 'danger' ? 'from-rose-600 via-rose-400 to-amber-500' : 'from-amber-600 via-mystic-gold to-yellow-200'
            }`}
          />

          {/* Close button */}
          {!isLoading && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          )}

          {/* Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
            <AlertCircle className="w-7 h-7 animate-pulse" />
          </div>

          {/* Title & Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">
              {title}
            </h3>
            {targetInfo && (
              <div className="py-1 px-3 rounded-lg bg-white/5 border border-white/10 text-xs font-serif text-amber-200 inline-block max-w-full truncate">
                {targetInfo}
              </div>
            )}
            <p className="text-xs font-serif text-gray-300 leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {!isLoading && (
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-gray-300 font-serif text-xs uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
            )}

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-2.5 px-4 rounded-xl font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                type === 'danger'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-mystic-dark hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ── AdminPage ──
const AdminPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [toast, setToast] = useState(null);

  // Dashboard
  const [stats, setStats] = useState(null);

  // Users
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [userSortKey, setUserSortKey] = useState('status'); // 'role', 'status', 'bannedAt', 'starPoints'
  const [userSortOrder, setUserSortOrder] = useState('desc'); // 'asc', 'desc'
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustMode, setAdjustMode] = useState('add'); // 'add' | 'deduct'
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    targetInfo: '',
    confirmText: 'Xác Nhận',
    type: 'danger',
    onConfirm: () => {},
    isLoading: false,
  });

  // Transactions & Summaries (Mindmap Tree)
  const [txViewMode, setTxViewMode] = useState('summaries'); // 'summaries' (3 columns Mindmap) | 'logs' (full logs)
  const [starSummaries, setStarSummaries] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState(new Set()); // Set of expanded user IDs for mindmap breakdown
  const [starSortKey, setStarSortKey] = useState('email'); // 'email', 'totalDeducted', 'totalAdded'
  const [starSortOrder, setStarSortOrder] = useState('asc'); // 'asc', 'desc'
  const [starSearch, setStarSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotal, setTxTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // Guard
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ──
  const fetchStats = useCallback(async () => {
    try {
      const res = await apiClient.get('/admin/stats');
      setStats(res.data.data);
    } catch (e) { showToast('Lỗi tải thống kê', 'error'); }
  }, []);

  const fetchUsers = useCallback(async (page = 1, search = '') => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
      setUsers(res.data.data.users || []);
      setUserTotal(res.data.data.pagination.total);
    } catch (e) { showToast('Lỗi tải danh sách user', 'error'); }
    finally { setIsLoading(false); }
  }, []);

  const fetchStarSummaries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/star-summaries');
      setStarSummaries(res.data.data.summaries || []);
    } catch (e) {
      showToast('Lỗi tải thống kê Tinh Tú', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/admin/transactions?page=${page}`);
      setTransactions(res.data.data.transactions);
      setTxTotal(res.data.data.pagination.total);
    } catch (e) { showToast('Lỗi tải giao dịch', 'error'); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'users') fetchUsers(userPage, userSearch);
    if (activeTab === 'transactions') {
      fetchStarSummaries();
      fetchTransactions(txPage);
    }
  }, [activeTab]);

  // ── User Sorting (Role, Status, BannedAt, StarPoints) ──
  const sortedUsers = useMemo(() => {
    const list = [...users];
    list.sort((a, b) => {
      // Always put ADMIN at top unless explicitly sorting numbers
      if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
      if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;

      if (userSortKey === 'status') {
        const valA = a.isBanned ? 1 : 0;
        const valB = b.isBanned ? 1 : 0;
        const diff = valA - valB;
        return userSortOrder === 'desc' ? -diff : diff; // desc = Bị Khóa first
      }

      if (userSortKey === 'bannedAt') {
        const timeA = a.bannedAt ? new Date(a.bannedAt).getTime() : 0;
        const timeB = b.bannedAt ? new Date(b.bannedAt).getTime() : 0;
        const diff = timeA - timeB;
        return userSortOrder === 'desc' ? -diff : diff;
      }

      if (userSortKey === 'starPoints') {
        const diff = a.starPoints - b.starPoints;
        return userSortOrder === 'desc' ? -diff : diff;
      }

      return 0;
    });
    return list;
  }, [users, userSortKey, userSortOrder]);

  const handleToggleUserSort = (key) => {
    if (userSortKey === key) {
      setUserSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortKey(key);
      setUserSortOrder('desc');
    }
  };

  // ── Toggle Expand User Mindmap Branch ──
  const toggleExpandUser = (userId) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  // ── Sorted and Filtered Star Summaries ──
  const filteredAndSortedSummaries = useMemo(() => {
    let list = [...starSummaries];

    // Filter by search
    if (starSearch.trim()) {
      const q = starSearch.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (starSortKey === 'email') {
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
        if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
        const res = a.email.localeCompare(b.email);
        return starSortOrder === 'asc' ? res : -res;
      }
      if (starSortKey === 'totalDeducted') {
        const res = a.totalDeducted - b.totalDeducted;
        return starSortOrder === 'asc' ? res : -res;
      }
      if (starSortKey === 'totalAdded') {
        const res = a.totalAdded - b.totalAdded;
        return starSortOrder === 'asc' ? res : -res;
      }
      return 0;
    });

    return list;
  }, [starSummaries, starSearch, starSortKey, starSortOrder]);

  const handleToggleSort = (key) => {
    if (starSortKey === key) {
      setStarSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setStarSortKey(key);
      setStarSortOrder('desc');
    }
  };

  // ── Confirm Actions ──
  const triggerBanConfirm = (targetUser) => {
    const isBanning = !targetUser.isBanned;
    setConfirmModal({
      isOpen: true,
      title: isBanning ? 'Xác Nhận Khóa Tài Khoản' : 'Xác Nhận Mở Khóa Tài Khoản',
      targetInfo: `${targetUser.fullName || targetUser.name || 'Người dùng'} (${targetUser.email})`,
      message: isBanning
        ? 'Tài khoản này sẽ bị khóa và chặn toàn bộ quyền truy cập, không thể rút bài hoặc nhận Tinh Tú.'
        : 'Tài khoản sẽ được mở khóa và khôi phục toàn bộ quyền truy cập hệ thống.',
      confirmText: isBanning ? 'Khóa Tài Khoản' : 'Mở Khóa',
      type: isBanning ? 'danger' : 'warning',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await apiClient.patch(`/admin/users/${targetUser.id}/ban`);
          showToast(isBanning ? 'Đã khóa tài khoản thành công' : 'Đã mở khóa tài khoản thành công');
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
          fetchUsers(userPage, userSearch);
        } catch (e) {
          showToast(e.serverMessage || 'Lỗi khi thao tác tài khoản', 'error');
          setConfirmModal((prev) => ({ ...prev, isLoading: false }));
        }
      },
      isLoading: false,
    });
  };

  const triggerDeleteConfirm = (targetUser) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác Nhận Xóa Vĩnh Viễn Tài Khoản',
      targetInfo: `${targetUser.fullName || targetUser.name || 'Người dùng'} (${targetUser.email})`,
      message: 'Hành động này sẽ xóa toàn bộ dữ liệu lịch sử trải bài, Tinh Tú và thông tin người dùng. Không thể hoàn tác!',
      confirmText: 'Xóa Vĩnh Viễn',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await apiClient.delete(`/admin/users/${targetUser.id}`);
          showToast('Đã xóa tài khoản thành công');
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
          fetchUsers(userPage, userSearch);
        } catch (e) {
          showToast(e.serverMessage || 'Lỗi khi xóa tài khoản', 'error');
          setConfirmModal((prev) => ({ ...prev, isLoading: false }));
        }
      },
      isLoading: false,
    });
  };

  const handleAdjustStars = async () => {
    const rawVal = Math.abs(parseInt(adjustAmount));
    if (!adjustTarget || isNaN(rawVal) || rawVal === 0) return;
    const amount = adjustMode === 'deduct' ? -rawVal : rawVal;
    setIsAdjusting(true);
    try {
      await apiClient.patch(`/admin/users/${adjustTarget.id}/stars`, { amount, reason: adjustReason });
      showToast(`${amount > 0 ? '+' : ''}${amount} Tinh Tú cho ${adjustTarget.email}`);
      setAdjustTarget(null);
      setAdjustAmount('');
      setAdjustReason('');
      fetchUsers(userPage, userSearch);
      fetchStarSummaries();
    } catch (e) {
      showToast(e.serverMessage || 'Lỗi khi điều chỉnh Tinh Tú', 'error');
    } finally {
      setIsAdjusting(false);
    }
  };

  // ── Chart Data ──
  const chartData = stats ? [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Mới hôm nay', value: stats.newUsersToday },
    { name: 'Readings', value: stats.totalReadings },
    { name: 'Bị Khóa', value: stats.blacklistCount },
  ] : [];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 px-3.5 sm:px-6 md:px-8 max-w-[1536px] mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Confirmation Action Modal */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        targetInfo={confirmModal.targetInfo}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        isLoading={confirmModal.isLoading}
      />

      {/* Adjust Stars Modal with 2 clear + / - modes */}
      <AnimatePresence>
        {adjustTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setAdjustTarget(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-mystic-dark border border-mystic-gold/40 rounded-3xl p-6 md:p-8 w-full max-w-md z-10 space-y-5 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-center">
              
              {/* Close button */}
              <button onClick={() => setAdjustTarget(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>

              <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <MysticStar className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif font-bold gold-text text-xl">Điều Chỉnh Tinh Tú</h3>
                <p className="text-xs font-serif text-gray-400 mt-1">Tài khoản: <strong className="text-white">{adjustTarget.email}</strong></p>
                <p className="text-xs font-serif text-amber-300/80 mt-0.5">Số dư hiện tại: <strong>{adjustTarget.starPoints} Tinh Tú</strong></p>
              </div>

              {/* 2 Clear Action Mode Buttons (+ Cộng / - Trừ) */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setAdjustMode('add')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-serif text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    adjustMode === 'add'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/50'
                      : 'text-gray-400 hover:text-emerald-300'
                  }`}
                >
                  <Plus size={16} />
                  <span>+ Cộng Tinh Tú</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustMode('deduct')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-serif text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    adjustMode === 'deduct'
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-rose-400/50'
                      : 'text-gray-400 hover:text-rose-300'
                  }`}
                >
                  <Minus size={16} />
                  <span>- Trừ Tinh Tú</span>
                </button>
              </div>

              {/* Amount Input with Quick Presets */}
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-[11px] font-serif text-gray-400 uppercase tracking-wider block mb-1">
                    Số lượng Tinh Tú muốn {adjustMode === 'add' ? 'cộng thêm' : 'khấu trừ'}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-sm ${adjustMode === 'add' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {adjustMode === 'add' ? '+' : '-'}
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Nhập số điểm (ví dụ: 10, 50, 100)"
                      value={adjustAmount}
                      onChange={e => setAdjustAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-serif text-sm outline-none focus:border-mystic-gold"
                    />
                  </div>

                  {/* Quick preset buttons */}
                  <div className="flex gap-2 mt-2">
                    {[10, 20, 50, 100].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAdjustAmount(String(val))}
                        className={`flex-1 py-1 rounded-lg border text-xs font-serif font-bold transition-all cursor-pointer ${
                          adjustMode === 'add'
                            ? 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                            : 'border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                        }`}
                      >
                        {adjustMode === 'add' ? `+${val}` : `-${val}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-serif text-gray-400 uppercase tracking-wider block mb-1">Lý do điều chỉnh (tùy chọn)</label>
                  <input
                    type="text"
                    placeholder={adjustMode === 'add' ? 'Ví dụ: Thưởng sự kiện, bù lỗi...' : 'Ví dụ: Thu hồi điểm không hợp lệ...'}
                    value={adjustReason}
                    onChange={e => setAdjustReason(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-serif text-sm outline-none focus:border-mystic-gold"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isAdjusting}
                  onClick={() => setAdjustTarget(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-serif text-xs uppercase tracking-widest hover:bg-white/5 cursor-pointer disabled:opacity-40"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="button"
                  onClick={handleAdjustStars}
                  disabled={isAdjusting || !adjustAmount || parseInt(adjustAmount) <= 0}
                  className={`flex-1 py-3 rounded-xl font-serif font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                    adjustMode === 'add'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:brightness-110'
                      : 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:brightness-110'
                  }`}
                >
                  {isAdjusting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{adjustMode === 'add' ? 'Đang Cộng...' : 'Đang Trừ...'}</span>
                    </>
                  ) : (
                    <span>
                      {adjustMode === 'add'
                        ? `+ Cộng ${adjustAmount || '0'} Tinh Tú`
                        : `- Trừ ${adjustAmount || '0'} Tinh Tú`}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Quản Trị Hệ Thống</h1>
          <p className="text-xs font-serif text-gray-400">Bảng điều khiển quản lý người dùng, Tinh Tú và kiểm soát truy cập</p>
        </div>
        <span className="ml-auto hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-serif font-bold">
          <span>Admin: {user?.email}</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/10 pb-0 overflow-x-auto custom-scrollbar">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-serif font-bold border-b-2 transition-all cursor-pointer -mb-px whitespace-nowrap tracking-wider uppercase ${
                activeTab === tab.id
                  ? 'border-mystic-gold text-mystic-gold bg-mystic-gold/5 rounded-t-xl'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}>
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── DASHBOARD ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {stats ? (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Tổng Users', value: stats.totalUsers, color: 'text-mystic-gold' },
                  { label: 'Mới Hôm Nay', value: stats.newUsersToday, color: 'text-emerald-400' },
                  { label: 'Tổng Tinh Tú Hệ Thống', value: stats.totalStarPointsInSystem, color: 'text-amber-300' },
                  { label: 'Tài Khoản Bị Khóa', value: stats.blacklistCount, color: 'text-rose-400' },
                ].map(card => (
                  <div key={card.label} className="p-5 rounded-3xl border border-white/10 bg-white/3 backdrop-blur-md">
                    <p className="text-xs font-serif text-gray-400 mb-1 tracking-wider uppercase">{card.label}</p>
                    <p className={`text-3xl font-serif font-bold ${card.color}`}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/3 backdrop-blur-md">
                <h3 className="text-sm font-serif font-bold text-gray-300 mb-4 tracking-wider uppercase">Thống Kê Tổng Quan</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'serif' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'serif' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d0b0f', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 16, color: '#fff', fontFamily: 'serif' }} />
                    <Bar dataKey="value" fill="rgba(212,175,55,0.75)" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : <div className="text-center py-12"><Loader2 className="w-8 h-8 text-mystic-gold animate-spin mx-auto" /></div>}
        </div>
      )}

      {/* ── USERS (WITH STATUS SORT & BANNED DATE COLUMN) ── */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          {/* Search */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter') { setUserPage(1); fetchUsers(1, userSearch); }}}
                placeholder="Tìm theo email hoặc tên người dùng..."
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-serif text-white outline-none focus:border-mystic-gold/50" />
            </div>
            <button onClick={() => { setUserPage(1); fetchUsers(1, userSearch); }}
              className="px-6 py-3 bg-mystic-gold/20 border border-mystic-gold/40 rounded-2xl text-mystic-gold font-serif font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-mystic-gold/30 transition-all">
              Tìm Kiếm
            </button>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="text-center py-16"><Loader2 className="w-8 h-8 text-mystic-gold animate-spin mx-auto" /></div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/2 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left font-serif text-sm">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Người Dùng</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Vai Trò</th>
                      
                      {/* Tinh Tú */}
                      <th
                        onClick={() => handleToggleUserSort('starPoints')}
                        className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-300 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Tinh Tú</span>
                          {userSortKey === 'starPoints' ? (
                            userSortOrder === 'asc' ? <ArrowUp size={13} className="text-amber-300" /> : <ArrowDown size={13} className="text-amber-300" />
                          ) : (
                            <ArrowUpDown size={12} className="text-gray-500" />
                          )}
                        </div>
                      </th>

                      {/* Trạng Thái (Sortable) */}
                      <th
                        onClick={() => handleToggleUserSort('status')}
                        className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-rose-300 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Trạng Thái</span>
                          {userSortKey === 'status' ? (
                            userSortOrder === 'desc' ? <ArrowDown size={13} className="text-rose-400" /> : <ArrowUp size={13} className="text-rose-400" />
                          ) : (
                            <ArrowUpDown size={12} className="text-gray-500" />
                          )}
                        </div>
                      </th>

                      {/* Ngày Bị Block (Sortable) */}
                      <th
                        onClick={() => handleToggleUserSort('bannedAt')}
                        className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-rose-300 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Ngày Bị Block</span>
                          {userSortKey === 'bannedAt' ? (
                            userSortOrder === 'desc' ? <ArrowDown size={13} className="text-rose-400" /> : <ArrowUp size={13} className="text-rose-400" />
                          ) : (
                            <ArrowUpDown size={12} className="text-gray-500" />
                          )}
                        </div>
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Thao Tác Quản Trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((u, i) => (
                      <tr key={u.id} className={`border-t border-white/5 ${i%2===0?'bg-white/1':'bg-transparent'} hover:bg-white/5 transition-colors`}>
                        {/* User Email & Avatar */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {u.avatar ? (
                              <img src={u.avatar} className="w-8 h-8 rounded-full object-cover border border-mystic-gold/30" referrerPolicy="no-referrer" alt="" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-mystic-gold/15 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold text-xs font-bold">
                                {(u.fullName || u.email || 'U')[0].toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-[180px]">{u.fullName || u.name || 'Lữ Khách'}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[180px]">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                              : 'bg-white/5 border border-white/10 text-gray-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        {/* Star Points */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
                            <MysticStar className="w-3.5 h-3.5" />
                            <span>{u.starPoints}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                            u.isBanned
                              ? 'bg-red-500/15 border border-red-500/35 text-red-300'
                              : 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.isBanned ? 'bg-red-400' : 'bg-emerald-400'}`} />
                            <span>{u.isBanned ? 'Bị Khóa' : 'Hoạt Động'}</span>
                          </span>
                        </td>

                        {/* Ngày Bị Block */}
                        <td className="px-4 py-4 text-xs font-serif">
                          {u.isBanned && u.bannedAt ? (
                            <span className="text-rose-300/90 font-medium">
                              {new Date(u.bannedAt).toLocaleString('vi-VN')}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">—</span>
                          )}
                        </td>

                        {/* Action Buttons with clear text + icon (Left aligned) */}
                        <td className="px-5 py-4 text-left">
                          <div className="flex items-center justify-start gap-2 flex-wrap">
                            {/* Chỉnh Điểm */}
                            <button
                              onClick={() => setAdjustTarget(u)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all cursor-pointer shadow-sm"
                            >
                              <MysticStar className="w-3 h-3" />
                              <span>Chỉnh Tinh Tú</span>
                            </button>

                            {/* Khóa / Mở Khóa (Chỉ hiện với tài khoản User, ẩn hoàn toàn với ADMIN) */}
                            {u.role !== 'ADMIN' && (
                              <button
                                onClick={() => triggerBanConfirm(u)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
                                  u.isBanned
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                                }`}
                              >
                                {u.isBanned ? <UnlockKeyhole className="w-3 h-3" /> : <LockKeyhole className="w-3 h-3" />}
                                <span>{u.isBanned ? 'Mở Khóa' : 'Khóa TK'}</span>
                              </button>
                            )}

                            {/* Xóa Tài Khoản */}
                            {u.role !== 'ADMIN' && (
                              <button
                                onClick={() => triggerDeleteConfirm(u)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer shadow-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Xóa</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs font-serif text-gray-400 pt-2">
            <span>Tổng cộng: <strong className="text-white">{userTotal}</strong> người dùng</span>
            <div className="flex items-center gap-2">
              <button disabled={userPage === 1} onClick={() => { const p = userPage-1; setUserPage(p); fetchUsers(p, userSearch); }}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 cursor-pointer hover:bg-white/10">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-bold text-white">Trang {userPage}</span>
              <button disabled={users.length < 20} onClick={() => { const p = userPage+1; setUserPage(p); fetchUsers(p, userSearch); }}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 cursor-pointer hover:bg-white/10">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TRANSACTIONS / STAR LOG (MINDMAP ACCORDION) ── */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Header Controls: Search, Sort & View Mode Switch */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* View Mode Switch */}
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
              <button
                onClick={() => setTxViewMode('summaries')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  txViewMode === 'summaries'
                    ? 'bg-mystic-gold text-mystic-dark shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>Mindmap Theo Người Dùng (3 Cột)</span>
              </button>
              <button
                onClick={() => setTxViewMode('logs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  txViewMode === 'logs'
                    ? 'bg-mystic-gold text-mystic-dark shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <History size={14} />
                <span>Chi Tiết Toàn Bộ Giao Dịch</span>
              </button>
            </div>

            {/* Search Input */}
            {txViewMode === 'summaries' && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={starSearch}
                  onChange={(e) => setStarSearch(e.target.value)}
                  placeholder="Lọc nhanh theo email hoặc tên..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-serif text-white outline-none focus:border-mystic-gold/50"
                />
              </div>
            )}
          </div>

          {/* 3-COLUMN MINDMAP TABLE: THEO NGƯỜI DÙNG */}
          {txViewMode === 'summaries' ? (
            isLoading ? (
              <div className="text-center py-16"><Loader2 className="w-8 h-8 text-mystic-gold animate-spin mx-auto" /></div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/2 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left font-serif text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        {/* Cột 1: Email người dùng */}
                        <th
                          onClick={() => handleToggleSort('email')}
                          className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-mystic-gold transition-colors select-none"
                        >
                          <div className="flex items-center gap-2">
                            <span>Email Người Dùng</span>
                            {starSortKey === 'email' ? (
                              starSortOrder === 'asc' ? <ArrowUp size={14} className="text-mystic-gold" /> : <ArrowDown size={14} className="text-mystic-gold" />
                            ) : (
                              <ArrowUpDown size={13} className="text-gray-500" />
                            )}
                          </div>
                        </th>

                        {/* Cột 2: Tinh Tú Bị Trừ */}
                        <th
                          onClick={() => handleToggleSort('totalDeducted')}
                          className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-rose-400 transition-colors select-none"
                        >
                          <div className="flex items-center gap-2">
                            <span>Tinh Tú Bị Trừ</span>
                            {starSortKey === 'totalDeducted' ? (
                              starSortOrder === 'asc' ? <ArrowUp size={14} className="text-rose-400" /> : <ArrowDown size={14} className="text-rose-400" />
                            ) : (
                              <ArrowUpDown size={13} className="text-gray-500" />
                            )}
                          </div>
                        </th>

                        {/* Cột 3: Tinh Tú Được Cộng */}
                        <th
                          onClick={() => handleToggleSort('totalAdded')}
                          className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-emerald-400 transition-colors select-none"
                        >
                          <div className="flex items-center gap-2">
                            <span>Tinh Tú Được Cộng</span>
                            {starSortKey === 'totalAdded' ? (
                              starSortOrder === 'asc' ? <ArrowUp size={14} className="text-emerald-400" /> : <ArrowDown size={14} className="text-emerald-400" />
                            ) : (
                              <ArrowUpDown size={13} className="text-gray-500" />
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedSummaries.map((item, i) => {
                        const isExpanded = expandedUsers.has(item.userId);
                        return (
                          <React.Fragment key={item.userId}>
                            {/* Main Row: Click to expand / collapse mindmap */}
                            <tr
                              onClick={() => toggleExpandUser(item.userId)}
                              className={`border-t border-white/5 ${
                                isExpanded ? 'bg-mystic-gold/10' : (i % 2 === 0 ? 'bg-white/1' : 'bg-transparent')
                              } hover:bg-mystic-gold/15 transition-all cursor-pointer select-none`}
                            >
                              {/* Cột 1: Email & Tên & Expand Arrow */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {/* Expand Chevron */}
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-1 rounded-lg bg-white/5 text-mystic-gold"
                                  >
                                    <ChevronRight size={16} />
                                  </motion.div>

                                  {item.avatar ? (
                                    <img src={item.avatar} className="w-8 h-8 rounded-full object-cover border border-mystic-gold/30" referrerPolicy="no-referrer" alt="" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-mystic-gold/15 border border-mystic-gold/30 flex items-center justify-center text-mystic-gold text-xs font-bold">
                                      {(item.fullName || item.email || 'U')[0].toUpperCase()}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-white truncate max-w-[220px]">{item.email}</p>
                                      {item.role === 'ADMIN' && (
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-500/20 border border-purple-500/40 text-purple-300">
                                          Admin
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-400 truncate max-w-[220px]">
                                      {item.fullName} · <span className="text-mystic-gold/70">{item.transactionCount} giao dịch</span>
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Cột 2: Tinh Tú Bị Trừ */}
                              <td className="px-6 py-4 text-left">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 font-bold text-sm shadow-sm">
                                  <span>-{item.totalDeducted}</span>
                                  <MysticStar className="w-3.5 h-3.5 text-rose-400" />
                                </div>
                              </td>

                              {/* Cột 3: Tinh Tú Được Cộng */}
                              <td className="px-6 py-4 text-left">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-bold text-sm shadow-sm">
                                  <span>+{item.totalAdded}</span>
                                  <MysticStar className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                              </td>
                            </tr>

                            {/* Mindmap Detailed Tree Branch (Expanded Accordion) */}
                            {isExpanded && (
                              <tr className="bg-mystic-dark/90 border-t border-mystic-gold/20">
                                <td colSpan={3} className="px-8 py-5">
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3"
                                  >
                                    <div className="flex items-center gap-2 text-xs font-serif font-bold text-mystic-gold uppercase tracking-wider">
                                      <CornerDownRight size={14} className="text-mystic-gold" />
                                      <span>Nhánh Chi Tiết Lịch Sử Tinh Tú Của: {item.email}</span>
                                      <span className="ml-auto text-gray-400 font-normal">
                                        Số dư hiện tại: <strong className="text-amber-300">{item.currentPoints} ⭐</strong>
                                      </span>
                                    </div>

                                    {/* Tree branches */}
                                    <div className="border-l-2 border-mystic-gold/30 pl-4 sm:pl-6 ml-2 space-y-2.5">
                                      {item.transactions && item.transactions.length > 0 ? (
                                        item.transactions.map((tx) => (
                                          <div
                                            key={tx.id}
                                            className="relative flex items-center justify-between p-3 rounded-2xl bg-white/3 border border-white/5 hover:border-mystic-gold/30 transition-all"
                                          >
                                            {/* Branch node dot */}
                                            <div className="absolute -left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-mystic-gold ring-4 ring-mystic-dark" />

                                            {/* Transaction details */}
                                            <div className="flex items-center gap-3 min-w-0 pr-4">
                                              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 shrink-0">
                                                {TX_TYPE_LABELS[tx.type] || tx.type}
                                              </span>
                                              <div className="min-w-0">
                                                <p className="text-xs text-white font-medium truncate">{tx.reason || 'Giao dịch Tinh Tú'}</p>
                                                <p className="text-[11px] text-gray-400 font-sans">
                                                  {new Date(tx.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                              </div>
                                            </div>

                                            {/* Amount Badge */}
                                            <div
                                              className={`shrink-0 flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg ${
                                                tx.amount > 0
                                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                              }`}
                                            >
                                              <span>{tx.amount > 0 ? `+${tx.amount}` : tx.amount}</span>
                                              <MysticStar className="w-3 h-3" />
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-xs text-gray-500 italic py-2">Chưa có lịch sử biến động Tinh Tú nào cho tài khoản này.</p>
                                      )}

                                      {/* Bottom Collapse Button */}
                                      <div className="pt-3 pb-1 flex items-center justify-between border-t border-white/5 mt-3">
                                        <span className="text-[11px] text-gray-500 font-serif">
                                          Tổng cộng: {item.transactions?.length || 0} bản ghi
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpandUser(item.userId);
                                          }}
                                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-mystic-gold/40 text-xs font-serif text-gray-300 hover:text-mystic-gold transition-all cursor-pointer shadow-sm hover:bg-white/10"
                                        >
                                          <ChevronUp size={14} />
                                          <span>Thu Gọn Nhánh</span>
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredAndSortedSummaries.length === 0 && (
                  <p className="text-center py-10 text-gray-500 font-serif text-sm">Không tìm thấy người dùng phù hợp</p>
                )}
              </div>
            )
          ) : (
            /* CHI TIẾT TOÀN BỘ GIAO DỊCH (LOGS VIEW) */
            isLoading ? (
              <div className="text-center py-16"><Loader2 className="w-8 h-8 text-mystic-gold animate-spin mx-auto" /></div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/2 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left font-serif text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Người Dùng</th>
                        <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Loại Giao Dịch</th>
                        <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Số Tinh Tú</th>
                        <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Lý Do</th>
                        <th className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Thời Gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, i) => (
                        <tr key={tx.id} className={`border-t border-white/5 ${i%2===0?'bg-white/1':'bg-transparent'}`}>
                          <td className="px-5 py-4 text-gray-300 text-xs font-medium">{tx.user?.email}</td>
                          <td className="px-4 py-4">
                            <span className="text-xs font-bold">{TX_TYPE_LABELS[tx.type] || tx.type}</span>
                          </td>
                          <td className={`px-4 py-4 font-bold flex items-center gap-1 ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            <span>{tx.amount > 0 ? '+' : ''}{tx.amount}</span>
                            <MysticStar className="w-3 h-3" />
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-xs truncate max-w-[220px]">{tx.reason || '—'}</td>
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            {new Date(tx.createdAt).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between text-xs font-serif text-gray-400 p-4 border-t border-white/10">
                  <span>Tổng cộng: <strong className="text-white">{txTotal}</strong> giao dịch</span>
                  <div className="flex items-center gap-2">
                    <button disabled={txPage===1} onClick={() => { const p=txPage-1; setTxPage(p); fetchTransactions(p); }}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 cursor-pointer hover:bg-white/10">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-bold text-white">Trang {txPage}</span>
                    <button disabled={transactions.length<30} onClick={() => { const p=txPage+1; setTxPage(p); fetchTransactions(p); }}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 cursor-pointer hover:bg-white/10">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
