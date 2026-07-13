import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Zap, RefreshCw, X, Flame, Volume2, Pause, Play } from 'lucide-react';
import apiClient from '../api/client';
import useAuthStore from '../store/useAuthStore';

const DailyTarotModal = ({ isOpen, onClose }) => {
  const { isAuthenticated, token } = useAuthStore();
  const [dailyCard, setDailyCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [aiInsight, setAiInsight] = useState('');
  const [isAiStreaming, setIsAiStreaming] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkDailyStreak();
    }
  }, [isOpen]);

  const checkDailyStreak = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const savedLastDrawDate = localStorage.getItem('tarot_daily_last_date');
    const savedStreak = parseInt(localStorage.getItem('tarot_daily_streak') || '0', 10);
    const savedCard = localStorage.getItem('tarot_daily_card');
    const savedInsight = localStorage.getItem('tarot_daily_insight');

    if (savedLastDrawDate === todayStr) {
      setStreak(savedStreak);
      if (savedCard) {
        setDailyCard(JSON.parse(savedCard));
        setIsFlipped(true);
      }
      if (savedInsight) {
        setAiInsight(savedInsight);
      }
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (savedLastDrawDate === yesterdayStr) {
        setStreak(savedStreak);
      } else {
        setStreak(0); // Streak reset if missed
      }
    }
  };

  const handleDrawDailyCard = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/cards/draw', { quantity: 1 });
      const card = response.data.data.cards[0];
      setDailyCard(card);
      setIsFlipped(true);

      const todayStr = new Date().toISOString().slice(0, 10);
      const newStreak = streak + 1;
      setStreak(newStreak);

      localStorage.setItem('tarot_daily_last_date', todayStr);
      localStorage.setItem('tarot_daily_streak', newStreak.toString());
      localStorage.setItem('tarot_daily_card', JSON.stringify(card));

      // Fetch AI daily insight automatically
      fetchDailyAIInsight(card);
    } catch (err) {
      console.error('Lỗi khi rút bài hàng ngày:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailyAIInsight = async (card) => {
    setIsAiStreaming(true);
    setAiInsight('');

    try {
      const url = (apiClient.defaults.baseURL || 'http://localhost:3000/api/v1') + '/cards/ai-reading';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          cards: [card],
          spreadType: 'Lá Bài Trong Ngày (Daily Guidance)',
          message: 'Hãy đưa ra thông điệp truyền cảm hứng cho ngày hôm nay của tôi.',
          persona: 'empathetic_healer',
          isDaily: true
        })
      });

      if (!response.ok) throw new Error('Failed to stream daily insight');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let textAcc = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');
        for (let line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                textAcc += data.text;
                setAiInsight(textAcc);
              }
            } catch (e) {
              // json parse ignore
            }
          }
        }
      }

      localStorage.setItem('tarot_daily_insight', textAcc);
    } catch (err) {
      console.error('Daily AI Insight Error:', err);
    } finally {
      setIsAiStreaming(false);
    }
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window) || !aiInsight) return;
    const synth = window.speechSynthesis;

    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    const cleanText = aiInsight.replace(/#+\s*/g, '').replace(/\*\*/g, '').replace(/>\s*/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    synth.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-mystic-dark/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl glass rounded-3xl border border-mystic-gold/30 bg-mystic-dark/95 p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] z-10 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-mystic-gold/15 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-mystic-gold/15 rounded-2xl text-mystic-gold border border-mystic-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif gold-text font-bold tracking-widest uppercase">
                  Lá Bài Hằng Ngày
                </h3>
                <p className="text-[10px] text-gray-400 font-light">Chiêm nghiệm thông điệp định hướng mỗi ngày</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Streak Counter */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-serif shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>{streak} Ngày Chuỗi</span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body content */}
          {!dailyCard ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 10 }}
                onClick={handleDrawDailyCard}
                className="w-44 h-72 rounded-2xl border-2 border-mystic-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.2)] overflow-hidden cursor-pointer relative group"
              >
                <img src="/assets/cards/card_back.jpeg" className="w-full h-full object-cover" alt="Card back" />
                <div className="absolute inset-0 bg-mystic-gold/10 group-hover:bg-mystic-gold/25 transition-all flex flex-col items-center justify-center p-4">
                  <Sparkles className="w-8 h-8 text-mystic-gold mb-2 animate-pulse" />
                  <span className="text-xs font-serif font-bold gold-text uppercase tracking-widest">
                    Chạm Để Rút Bài
                  </span>
                </div>
              </motion.div>

              <p className="text-xs text-gray-400 font-light max-w-sm">
                Hãy tĩnh tâm hít thở sâu, mở rộng tâm trí và chạm vào lá bài để đón nhận thông điệp ngày mới.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6 bg-mystic-gold/5 p-5 rounded-2xl border border-mystic-gold/20">
                <div className="w-32 h-52 rounded-xl overflow-hidden border-2 border-mystic-gold/40 shadow-xl shrink-0">
                  <img
                    src={dailyCard.image}
                    className={`w-full h-full object-cover ${dailyCard.isReversed ? 'rotate-180' : ''}`}
                    alt={dailyCard.name}
                  />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h4 className="text-xl font-serif gold-text font-bold">{dailyCard.name}</h4>
                    {dailyCard.isReversed && (
                      <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/40">
                        Ngược
                      </span>
                    )}
                  </div>
                  <p className="text-xs italic text-gray-300 font-light leading-relaxed">
                    "{dailyCard.message}"
                  </p>
                </div>
              </div>

              {/* AI Insight section */}
              {aiInsight && (
                <div className="p-5 rounded-2xl border border-mystic-gold/20 bg-mystic-dark/80 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-mystic-gold/15">
                    <span className="text-xs font-serif font-bold gold-text uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-mystic-gold" /> Thông Điệp Định Hướng Ngày Mới
                    </span>
                    <button
                      onClick={handleSpeech}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-serif bg-mystic-gold/15 text-mystic-gold border border-mystic-gold/30 hover:bg-mystic-gold/25 transition-all cursor-pointer"
                    >
                      {speaking ? <Pause size={11} /> : <Volume2 size={11} />}
                      <span>{speaking ? 'Tạm dừng' : 'Đọc giọng nói'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-200 font-light leading-relaxed whitespace-pre-wrap">
                    {aiInsight}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DailyTarotModal;
