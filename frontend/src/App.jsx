import React from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Hero from './components/Hero';
import SpreadSelector from './components/SpreadSelector';
import Background from './components/Background';

function App() {
  return (
    <div className="relative min-h-screen text-white selection:bg-mystic-gold selection:text-mystic-dark">
      <Background />
      <Navbar />
      
      <main>
        <Hero />
        <SpreadSelector />
      </main>

      <Footer />
    </div>
  );
}

export default App;
