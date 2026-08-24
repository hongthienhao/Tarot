import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Background from './components/Background';
import ProtectedRoute from './components/ProtectedRoute';
import AudioController from './components/Layout/AudioController';
import PageLoading from './components/PageLoading';
import CosmicAuthModal from './components/CosmicAuthModal';
import DrawDiagnosticPanel from './components/Diagnostic/DrawDiagnosticPanel';
import useSoundStore, { initAudioContext } from './store/useSoundStore';
import useAuthStore from './store/useAuthStore';

// ─── Lazy-loaded pages (each becomes its own JS chunk) ───────────────────────
const Home                = lazy(() => import('./pages/Home'));
const LoginPage           = lazy(() => import('./pages/LoginPage'));
const TarotPage           = lazy(() => import('./pages/TarotPage'));
const AstrologyPage       = lazy(() => import('./pages/AstrologyPage'));
const CosmicSanctuaryPage = lazy(() => import('./pages/CosmicSanctuaryPage'));
const AboutPage           = lazy(() => import('./pages/AboutPage'));
const CardDictionaryPage  = lazy(() => import('./pages/CardDictionaryPage'));
const ProfilePage         = lazy(() => import('./pages/ProfilePage'));
const HistoryPage         = lazy(() => import('./pages/HistoryPage'));
const AdminPage           = lazy(() => import('./pages/AdminPage'));
// ─────────────────────────────────────────────────────────────────────────────


function App() {
  const initSound = useSoundStore(state => state.initSound);
  const { authNotice, closeAuthNotice, fetchProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Sync latest user profile and role from DB
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [fetchProfile, isAuthenticated]);

  useEffect(() => {
    // Initial sound parameters setup
    initSound();

    // Elegant global gesture listener to resume AudioContext (Autoplay policies)
    const handleGesture = () => {
      initAudioContext();
      // Remove listeners once context is successfully initialized
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    window.addEventListener('keydown', handleGesture);

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [initSound]);

  return (
    <div className="relative min-h-screen text-white selection:bg-mystic-gold selection:text-mystic-dark">
      <Background />
      <Navbar />
      
      <main>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tarot" element={<TarotPage />} />
            <Route path="/astrology" element={<AstrologyPage />} />
            <Route path="/cosmic" element={<CosmicSanctuaryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cards" element={<CardDictionaryPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>

            {/* Admin Route — guard implemented inside AdminPage */}
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      
      {/* Floating global Audio Controller Capsule */}
      <AudioController />

      {/* Global Cosmic Auth Modal */}
      {authNotice && (
        <CosmicAuthModal
          isOpen={authNotice.isOpen}
          onClose={closeAuthNotice}
          type={authNotice.type}
          message={authNotice.message}
          userName={authNotice.userName}
        />
      )}

      {/* Diagnostic Panel — fixed overlay, renders only when DRAW_DIAGNOSTICS=true */}
      <DrawDiagnosticPanel />
    </div>
  );
}

export default App;

