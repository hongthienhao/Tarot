import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Background from './components/Background';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import AudioController from './components/Layout/AudioController';
import useSoundStore, { initAudioContext } from './store/useSoundStore';

function App() {
  const initSound = useSoundStore(state => state.initSound);

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/history" element={<HistoryPage />} />
          </Route>
        </Routes>
      </main>

      <Footer />
      
      {/* Floating global Audio Controller Capsule */}
      <AudioController />
    </div>
  );
}

export default App;

