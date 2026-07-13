import React from 'react';
import Hero from '../components/Hero';
import ZodiacDailySection from '../components/ZodiacDailySection';
import SpreadSelector from '../components/SpreadSelector';

const Home = () => {
  return (
    <>
      <Hero />
      <ZodiacDailySection />
      <SpreadSelector />
    </>
  );
};

export default Home;
