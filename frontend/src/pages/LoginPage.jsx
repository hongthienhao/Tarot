import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import useAuthStore from '../store/useAuthStore';

const LoginPage = () => {
  const { googleLogin, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
    } catch (err) {
      // Error is handled by store
    }
  };

  const handleGoogleError = () => {
    useAuthStore.setState({ error: 'Đăng nhập Google thất bại. Vui lòng thử lại.' });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mystic-gold/10 border border-mystic-gold/30 mb-4"
          >
            <Sparkles className="w-8 h-8 text-mystic-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]" />
          </motion.div>
          <h2 className="text-3xl font-playfair font-bold text-mystic-gold mb-2">Chào mừng bạn</h2>
          <p className="text-gray-300">Đăng nhập để khám phá hành trình tâm linh</p>
        </div>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Google Sign-In */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Decorative divider */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent" />
            <span className="text-xs text-gray-400 uppercase tracking-widest">Tiếp tục với</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent" />
          </div>

          {/* Google Button Container */}
          <div className="w-full flex justify-center">
            <div className="google-login-wrapper rounded-xl overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                size="large"
                width="350"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-mystic-gold text-sm"
            >
              <div className="w-4 h-4 border-2 border-mystic-gold/30 border-t-mystic-gold rounded-full animate-spin" />
              <span>Đang xác thực...</span>
            </motion.div>
          )}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-gray-500 leading-relaxed"
        >
          Bằng việc đăng nhập, tài khoản sẽ được tự động tạo<br />
          nếu bạn chưa có tài khoản trước đó.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
