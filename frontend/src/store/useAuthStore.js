import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/client';

const LOGIN_MESSAGES = [
  'Bạn đã kết nối thành công với dòng chảy năng lượng Vũ trụ.',
  'Cánh cổng tâm linh đã mở. Năng lượng các vì sao đang hội tụ và đồng hành cùng bạn.',
  'Tâm thức hòa nhịp cùng Vũ trụ. Chúc bạn một hành trình khai sáng và an yên.',
  'Sợi dây liên kết định mệnh đã được thiết lập. Ánh sáng Tinh Tú soi chiếu bước chân bạn.',
  'Chào mừng bạn đến với Thánh đường Tarot. Tần số linh hồn của bạn đã được tiếp nhận.',
  'Không gian huyền bí chào đón bạn. Hãy lắng nghe thông điệp thiêng liêng từ cội nguồn.',
];

const LOGOUT_MESSAGES = [
  'Đã tạm ngắt kết nối với Vũ trụ. Năng lượng của bạn đã được niêm phong an yên.',
  'Cánh cổng thánh đường tạm khép lại. Chúc bạn luôn giữ vững ánh sáng nội tâm.',
  'Bảo lưu năng lượng Tinh Tú thành công. Hẹn gặp lại bạn trong lần hội tụ tiếp theo.',
  'Tâm trí trở về với thực tại an lành. Bình yên và thông tuệ luôn ở bên bạn.',
  'Hành trình tạm dừng. Ánh sao thiêng sẽ luôn chở che bước đường bạn đi.',
];

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      authNotice: null, // { isOpen: true, type: 'login' | 'logout', message: string, userName?: string }

      googleLogin: async (credential) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/auth/google', { credential });
          const { user } = response.data.data;
          const { token } = response.data;
          const randomMsg = LOGIN_MESSAGES[Math.floor(Math.random() * LOGIN_MESSAGES.length)];

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            authNotice: {
              isOpen: true,
              type: 'login',
              message: randomMsg,
              userName: user.fullName || user.name,
            },
          });
        } catch (error) {
          set({
            error: error.serverMessage || error.response?.data?.message || 'Đăng nhập bằng Google thất bại',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        const randomMsg = LOGOUT_MESSAGES[Math.floor(Math.random() * LOGOUT_MESSAGES.length)];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          authNotice: {
            isOpen: true,
            type: 'logout',
            message: randomMsg,
          },
        });
      },

      closeAuthNotice: () => {
        set({ authNotice: null });
      },

      fetchProfile: async () => {
        const { token, isAuthenticated } = get();
        if (!token || !isAuthenticated) return;
        try {
          const response = await apiClient.get('/users/profile');
          const freshUser = response.data.data.user;
          if (freshUser) {
            set((state) => ({
              user: { ...state.user, ...freshUser },
            }));
          }
        } catch (error) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            get().logout();
          }
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : userData,
        }));
      },

      /**
       * Cập nhật starPoints của user trong store
       * @param {number} newPoints - Số Tinh Tú mới
       */
      updateStarPoints: (newPoints) => {
        set((state) => ({
          user: state.user ? { ...state.user, starPoints: newPoints } : state.user,
        }));
      },

      /**
       * Tăng/giảm starPoints tương đối
       * @param {number} delta - Số Tinh Tú thay đổi (dương = tăng, âm = giảm)
       */
      adjustStarPoints: (delta) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, starPoints: Math.max(0, (state.user.starPoints || 0) + delta) }
            : state.user,
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      // Selectors
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
