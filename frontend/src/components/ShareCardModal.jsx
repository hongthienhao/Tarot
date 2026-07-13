import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

const ShareCardModal = ({ isOpen, onClose, drawnCards = [], spreadName = 'Trải bài Tarot', userQuestion = '' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardCanvasRef = useRef(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 1000);
      grad.addColorStop(0, '#120720');
      grad.addColorStop(0.5, '#1a0b2e');
      grad.addColorStop(1, '#0c0516');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 1000);

      // Gold Outer Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 940);
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 720, 920);

      // Header Brand
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 28px serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ TAROT MYSTIC SPACE ✨', 400, 90);

      ctx.fillStyle = '#e5e7eb';
      ctx.font = 'bold 22px serif';
      ctx.fillText(spreadName.toUpperCase(), 400, 135);

      if (userQuestion) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = 'italic 16px sans-serif';
        ctx.fillText(`"${userQuestion}"`, 400, 175);
      }

      // Draw Drawn Cards summary
      const cardsToDraw = (drawnCards || []).slice(0, 5);
      const cardWidth = 110;
      const cardHeight = 180;
      const gap = 20;
      const totalWidth = cardsToDraw.length * cardWidth + (cardsToDraw.length - 1) * gap;
      const startX = (800 - totalWidth) / 2;
      const startY = 240;

      cardsToDraw.forEach((c, idx) => {
        const x = startX + idx * (cardWidth + gap);
        ctx.fillStyle = '#26123d';
        ctx.fillRect(x, startY, cardWidth, cardHeight);
        ctx.strokeStyle = '#d4af37';
        ctx.strokeRect(x, startY, cardWidth, cardHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px serif';
        const name = c?.name || c?.card?.name || `Card ${idx + 1}`;
        ctx.fillText(name.slice(0, 14), x + cardWidth / 2, startY + cardHeight / 2);

        if (c?.isReversed) {
          ctx.fillStyle = '#f87171';
          ctx.font = '10px sans-serif';
          ctx.fillText('(Ngược)', x + cardWidth / 2, startY + cardHeight / 2 + 20);
        }
      });

      // Footer message
      ctx.fillStyle = '#d4af37';
      ctx.font = '14px serif';
      ctx.fillText('Chiêm nghiệm vận mệnh & Khai mở trực giác', 400, 920);

      const link = document.createElement('a');
      link.download = `tarot-reading-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Lỗi khi tải ảnh thẻ bài:', e);
    } finally {
      setIsGenerating(false);
    }
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
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-lg glass rounded-3xl border border-mystic-gold/30 bg-mystic-dark/95 p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-mystic-gold/15 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-mystic-gold/15 rounded-2xl text-mystic-gold border border-mystic-gold/20">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif gold-text font-bold tracking-widest uppercase">
                  Chia Sẻ Kết Quả Rút Bài
                </h3>
                <p className="text-[10px] text-gray-400 font-light">Tải thẻ ảnh định dạng đẹp mắt lên Mạng xã hội</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Social Card Preview Frame */}
          <div className="p-6 rounded-2xl border-2 border-mystic-gold/30 bg-gradient-to-b from-mystic-purple/60 via-mystic-dark to-mystic-dark flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative overflow-hidden">
            <Sparkles className="w-6 h-6 text-mystic-gold animate-spin-slow" />
            <h4 className="text-xl font-serif gold-text font-bold tracking-widest">{spreadName}</h4>
            {userQuestion && <p className="text-xs italic text-gray-300">"{userQuestion}"</p>}

            <div className="flex flex-wrap justify-center gap-3 py-2">
              {(drawnCards || []).map((c, idx) => (
                <div key={idx} className="px-3 py-1.5 rounded-xl border border-mystic-gold/30 bg-mystic-gold/10 text-mystic-gold text-xs font-serif font-bold">
                  {c?.name || c?.card?.name || `Lá bài #${idx + 1}`} {c?.isReversed ? '↺' : ''}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-mystic-gold/60 uppercase tracking-[0.2em] font-bold font-serif pt-2 border-t border-mystic-gold/15 w-full">
              ✨ TAROT MYSTIC SPACE ✨
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-4 pt-6">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-mystic-gold/30 bg-mystic-gold/10 hover:bg-mystic-gold/20 text-mystic-gold text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span>{copied ? 'Đã sao chép!' : 'Sao Chép Link'}</span>
            </button>

            <button
              onClick={handleDownloadCard}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-mystic-gold text-mystic-dark hover:bg-amber-300 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer disabled:opacity-40"
            >
              <Download size={14} />
              <span>{isGenerating ? 'Đang Tạo Ảnh...' : 'Tải Ảnh Về'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareCardModal;
