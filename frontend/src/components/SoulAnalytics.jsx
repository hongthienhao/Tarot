import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  Swords, 
  Coins, 
  Compass, 
  Star, 
  Layers, 
  Activity, 
  RotateCw, 
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

const SoulAnalytics = ({ readings = [] }) => {
  // ── 1. Calculate Analytics ──
  const stats = useMemo(() => {
    const totalReadings = readings.length;
    let totalCards = 0;
    let reversedCount = 0;
    
    // Suits representation (elements)
    let wandsCount = 0; // Fire
    let cupsCount = 0;  // Water
    let swordsCount = 0; // Air
    let pentaclesCount = 0; // Earth
    let majorCount = 0; // Aether / Fate
    
    // Card frequencies
    const cardFrequencies = {};

    readings.forEach(reading => {
      if (reading.readingCards && Array.isArray(reading.readingCards)) {
        reading.readingCards.forEach(rc => {
          totalCards++;
          if (rc.isReversed) {
            reversedCount++;
          }
          
          const card = rc.card;
          if (card) {
            // Frequency track
            if (!cardFrequencies[card.id]) {
              cardFrequencies[card.id] = {
                card,
                count: 0,
                reversedCount: 0
              };
            }
            cardFrequencies[card.id].count++;
            if (rc.isReversed) {
              cardFrequencies[card.id].reversedCount++;
            }
            
            // Elements
            if (card.arcana === 'MAJOR') {
              majorCount++;
            } else if (card.arcana === 'MINOR') {
              if (card.suit === 'WANDS') wandsCount++;
              else if (card.suit === 'CUPS') cupsCount++;
              else if (card.suit === 'SWORDS') swordsCount++;
              else if (card.suit === 'PENTACLES') pentaclesCount++;
            }
          }
        });
      }
    });

    // Find the most drawn card (Duyên nợ)
    let mostDrawn = null;
    let maxCount = 0;
    Object.values(cardFrequencies).forEach(item => {
      if (item.count > maxCount) {
        maxCount = item.count;
        mostDrawn = item;
      }
    });

    const wandsPercent = totalCards > 0 ? Math.round((wandsCount / totalCards) * 100) : 0;
    const cupsPercent = totalCards > 0 ? Math.round((cupsCount / totalCards) * 100) : 0;
    const swordsPercent = totalCards > 0 ? Math.round((swordsCount / totalCards) * 100) : 0;
    const pentaclesPercent = totalCards > 0 ? Math.round((pentaclesCount / totalCards) * 100) : 0;
    const majorPercent = totalCards > 0 ? Math.round((majorCount / totalCards) * 100) : 0;
    const reversalPercent = totalCards > 0 ? Math.round((reversedCount / totalCards) * 100) : 0;
    const uprightPercent = 100 - reversalPercent;

    return {
      totalReadings,
      totalCards,
      reversedCount,
      reversalPercent,
      uprightPercent,
      elements: {
        fire: { count: wandsCount, percent: wandsPercent },
        water: { count: cupsCount, percent: cupsPercent },
        air: { count: swordsCount, percent: swordsPercent },
        earth: { count: pentaclesCount, percent: pentaclesPercent },
        aether: { count: majorCount, percent: majorPercent }
      },
      mostDrawn
    };
  }, [readings]);

  // ── 2. Determine dominant element & energetic advice ──
  const dominantElement = useMemo(() => {
    if (stats.totalCards === 0) {
      return {
        id: 'EMPTY',
        name: 'Hành Trình Mới',
        icon: <Compass className="w-8 h-8" />,
        color: 'from-mystic-gold/20 to-transparent',
        accentColor: 'text-mystic-gold',
        auraGlow: 'rgba(212, 175, 55, 0.1)',
        title: 'Bản Đồ Năng Lượng Đang Trống',
        guidance: 'Hãy bắt đầu những phiên trải bài đầu tiên của bạn để vũ trụ ghi nhận và phản chiếu dòng chảy năng lượng trong linh hồn bạn qua bản đồ chiêm nghiệm này.'
      };
    }

    const elementsList = [
      { id: 'FIRE', count: stats.elements.fire.count, percent: stats.elements.fire.percent, name: 'Lửa (Hành Động)' },
      { id: 'WATER', count: stats.elements.water.count, percent: stats.elements.water.percent, name: 'Nước (Trực Giác)' },
      { id: 'AIR', count: stats.elements.air.count, percent: stats.elements.air.percent, name: 'Khí (Trí Tuệ)' },
      { id: 'EARTH', count: stats.elements.earth.count, percent: stats.elements.earth.percent, name: 'Đất (Thực Tế)' },
      { id: 'AETHER', count: stats.elements.aether.count, percent: stats.elements.aether.percent, name: 'Vũ Trụ (Số Mệnh)' }
    ];

    // Sort descending
    elementsList.sort((a, b) => b.count - a.count);
    const dominant = elementsList[0];

    const advice = {
      FIRE: {
        icon: <Flame className="w-8 h-8" />,
        color: 'from-red-950/40 via-mystic-wine/30 to-transparent',
        accentColor: 'text-red-400',
        auraGlow: 'rgba(239, 68, 68, 0.15)',
        title: 'Ngọn Lửa Hành Động & Khát Vọng Chi Phối',
        guidance: 'Linh hồn bạn đang được bao bọc bởi ngọn lửa rực cháy của bộ Gậy (Wands). Năng lượng này thôi thúc bạn dấn thân, hành động và thực hiện các ý tưởng đang ấp ủ. Hãy tin tưởng vào ngọn lửa đam mê bên trong, đừng ngần ngại bước ra khỏi vùng an toàn để khẳng định bản thân. Lời khuyên dành cho bạn là hãy tập trung ý chí, dũng cảm đối mặt với thử thách và giữ cho nhiệt huyết luôn bùng cháy.'
      },
      WATER: {
        icon: <Heart className="w-8 h-8" />,
        color: 'from-blue-950/40 via-mystic-purple/30 to-transparent',
        accentColor: 'text-blue-400',
        auraGlow: 'rgba(59, 130, 246, 0.15)',
        title: 'Dòng Chảy Trực Giác & Cảm Xúc Sâu Sắc',
        guidance: 'Trái tim bạn đang ngập tràn tiếng nói của bộ Cốc (Cups) – nguyên tố Nước dịu mát. Trực giác, cảm xúc và các mối quan hệ tình cảm đang là trung tâm năng lượng của bạn lúc này. Đây là khoảng thời gian tuyệt vời để lắng nghe đứa trẻ bên trong, tha thứ cho những tổn thương cũ và mở rộng lòng mình đón nhận yêu thương. Lời khuyên là hãy tin vào cảm xúc đầu tiên của mình, kết nối chân thành với mọi người xung quanh.'
      },
      AIR: {
        icon: <Swords className="w-8 h-8" />,
        color: 'from-emerald-950/40 via-slate-900/40 to-transparent',
        accentColor: 'text-emerald-400',
        auraGlow: 'rgba(52, 211, 153, 0.12)',
        title: 'Luồng Gió Lý Trí & Tư Duy Sắc Bén',
        guidance: 'Bộ Kiếm (Swords) và nguyên tố Khí đang dẫn dắt tư duy của bạn. Bạn đang cần sự sắc bén của lý trí để phân tích hoàn cảnh, giải quyết các mâu thuẫn hoặc đưa ra những quyết định mang tính bước ngoặt. Đôi khi có thể bạn cảm thấy lo âu hoặc suy nghĩ quá nhiều, nhưng hãy nhớ rằng thanh kiếm chỉ phát huy sức mạnh khi tâm trí bạn tĩnh lặng. Lời khuyên là hãy đối diện trực diện với sự thật, giao tiếp rõ ràng và dứt khoát dọn dẹp các chướng ngại.'
      },
      EARTH: {
        icon: <Coins className="w-8 h-8" />,
        color: 'from-amber-950/40 via-mystic-dark/50 to-transparent',
        accentColor: 'text-amber-400',
        auraGlow: 'rgba(245, 158, 11, 0.15)',
        title: 'Sự Vững Chãi Của Đất Mẹ & Thịnh Vượng',
        guidance: 'Bộ Tiền (Pentacles) đang mang lại cho bạn sự vững vàng của nguyên tố Đất. Bạn đang tập trung năng lượng vào các khía cạnh thực tế như sự nghiệp, tài chính, sức khỏe và sự ổn định dài hạn. Đây là thời kỳ của sự kiên nhẫn tích lũy và hiện thực hóa các kế hoạch. Hãy chăm sóc cơ thể của mình tốt hơn và xây dựng những nền móng vững chắc. Lời khuyên từ vũ trụ là hãy kiên trì, làm việc có kế hoạch và trân trọng những giá trị bền vững.'
      },
      AETHER: {
        icon: <Sparkles className="w-8 h-8" />,
        color: 'from-purple-950/40 via-mystic-purple/35 to-transparent',
        accentColor: 'text-fuchsia-400',
        auraGlow: 'rgba(192, 38, 211, 0.18)',
        title: 'Chuyển Dịch Nhân Duyên & Trật Tự Số Mệnh',
        guidance: 'Sự xuất hiện vượt trội của các lá bài Đại Ẩn (Major Arcana) cho thấy bạn đang đứng trước những chu kỳ dịch chuyển vận mệnh vô cùng lớn lao. Đây không chỉ là các biến cố thường nhật, mà là những bài học linh hồn mang tính nghiệp quả, định hình lại con người bạn. Hãy cởi mở đón nhận sự thay đổi, tin tưởng vào sự an bài của vũ trụ và thấu hiểu thông điệp đằng sau mỗi nhân duyên. Lời khuyên là hãy bình tâm chiêm nghiệm, buông bỏ những điều không còn phù hợp và vững vàng bước tiếp trên hành trình thức tỉnh tâm thức.'
      }
    };

    return {
      id: dominant.id,
      name: dominant.name,
      percent: dominant.percent,
      ...advice[dominant.id]
    };
  }, [stats]);

  if (stats.totalReadings === 0) {
    return (
      <div className="text-center py-20 max-w-2xl mx-auto glass border-white/5 rounded-[3rem] p-10">
        <Compass className="w-16 h-16 text-mystic-gold/20 mx-auto mb-6 animate-spin-slow" />
        <h3 className="text-2xl font-serif text-white mb-4">Chưa Thể Thấu Thị Tâm Hồn</h3>
        <p className="text-gray-400 font-light leading-relaxed mb-6">
          Vũ trụ cần lưu trữ ít nhất một phiên trải bài trong biên niên sử của bạn để có thể bắt đầu phân tích tần số rung động và giải mã bản đồ năng lượng.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* ── SECTION 1: HEADER & SOUL METRICS SHARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Total readings */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden flex items-center gap-6"
        >
          <div className="p-4 bg-mystic-gold/10 rounded-2xl border border-mystic-gold/20 text-mystic-gold">
            <Layers size={28} />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Tổng Số Trải Bài</span>
            <span className="text-3xl font-serif font-bold text-white">{stats.totalReadings} <span className="text-sm font-sans font-light text-gray-400">phiên</span></span>
          </div>
          <div className="absolute right-4 bottom-2 opacity-5 text-mystic-gold"><Layers size={80} /></div>
        </motion.div>

        {/* Metric 2: Total cards drawn */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden flex items-center gap-6"
        >
          <div className="p-4 bg-mystic-gold/10 rounded-2xl border border-mystic-gold/20 text-mystic-gold">
            <Activity size={28} />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Số Lá Bài Đã Chiêm Nghiệm</span>
            <span className="text-3xl font-serif font-bold text-white">{stats.totalCards} <span className="text-sm font-sans font-light text-gray-400">lá bài</span></span>
          </div>
          <div className="absolute right-4 bottom-2 opacity-5 text-mystic-gold"><Activity size={80} /></div>
        </motion.div>

        {/* Metric 3: Reversal Balance (Yin Yang) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cân Bằng Âm Dương (Xuôi / Ngược)</span>
            <div className="text-xs text-mystic-gold font-bold">{stats.uprightPercent}% / {stats.reversalPercent}%</div>
          </div>
          
          {/* Progress bar split */}
          <div className="h-3 w-full bg-mystic-dark/60 rounded-full border border-white/5 overflow-hidden flex">
            <div className="h-full bg-gradient-to-r from-mystic-gold to-yellow-500/80 transition-all duration-500" style={{ width: `${stats.uprightPercent}%` }} title="Xuôi (Upright) - Năng lượng bộc lộ" />
            <div className="h-full bg-gradient-to-r from-red-600/70 to-mystic-wine/90 transition-all duration-500" style={{ width: `${stats.reversalPercent}%` }} title="Ngược (Reversed) - Khối năng lượng nội tâm" />
          </div>
          
          <div className="flex justify-between items-center mt-2.5 text-[9px] uppercase tracking-wider text-gray-400">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-mystic-gold" /> Dương (Ngoại Cảnh)</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-mystic-wine" /> Âm (Nội Tâm)</span>
          </div>
        </motion.div>
      </div>

      {/* ── SECTION 2: COSMIC DYNAMIC GUIDANCE (Dominant Element) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dominant Element Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-2 rounded-[2.5rem] border border-white/10 p-8 md:p-12 relative overflow-hidden bg-gradient-to-br ${dominantElement.color}`}
        >
          {/* Subtle Radial Aura Glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[100px] pointer-events-none -z-10 transition-colors duration-1000"
            style={{ backgroundColor: dominantElement.auraGlow }}
          />

          {/* Antique Astrolabe background rotating slowly */}
          <div className="absolute right-0 top-0 bottom-0 w-[50%] opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-[300px] h-[300px] text-white animate-spin-slow">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2,2" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.3" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.3" />
              <polygon points="50,5 53,15 47,15" fill="currentColor" opacity="0.3" />
              <polygon points="50,95 53,85 47,85" fill="currentColor" opacity="0.3" />
              <polygon points="5,50 15,53 15,47" fill="currentColor" opacity="0.3" />
              <polygon points="95,50 85,53 85,47" fill="currentColor" opacity="0.3" />
            </svg>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 bg-white/5 rounded-2xl border border-white/10 ${dominantElement.accentColor} shadow-lg`}>
                {dominantElement.icon}
              </div>
              <div>
                <span className="text-[10px] text-mystic-gold/60 uppercase tracking-[0.3em] font-serif font-bold block mb-1">
                  Đại Nguyên Tố Trội ({dominantElement.percent}%)
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-white font-bold tracking-wider">
                  {dominantElement.title}
                </h3>
              </div>
            </div>

            <p className="text-gray-200 text-sm md:text-base font-light leading-relaxed tracking-wide text-justify">
              {dominantElement.guidance}
            </p>

            <div className="pt-6 border-t border-white/5 flex items-center gap-3">
              <Star className="w-4 h-4 text-mystic-gold animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold">
                Lời khuyên linh hồn từ Bậc Thầy Tarot
              </span>
            </div>
          </div>
        </motion.div>

        {/* 5 Elements Chart Radar Shards */}
        <div className="lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="text-sm font-serif gold-text uppercase tracking-widest mb-2 flex items-center gap-2">
            <Compass size={18} className="animate-spin-slow" />
            <span>Phân Phối Đại Nguyên Tố</span>
          </div>

          {/* WANDS (FIRE) */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4" /> Lửa (Wands)
              </span>
              <span className="text-gray-400 font-bold">{stats.elements.fire.percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-mystic-dark/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${stats.elements.fire.percent}%` }} />
            </div>
          </div>

          {/* CUPS (WATER) */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider">
                <Heart className="w-4 h-4" /> Nước (Cups)
              </span>
              <span className="text-gray-400 font-bold">{stats.elements.water.percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-mystic-dark/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${stats.elements.water.percent}%` }} />
            </div>
          </div>

          {/* SWORDS (AIR) */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
                <Swords className="w-4 h-4" /> Khí (Swords)
              </span>
              <span className="text-gray-400 font-bold">{stats.elements.air.percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-mystic-dark/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${stats.elements.air.percent}%` }} />
            </div>
          </div>

          {/* PENTACLES (EARTH) */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                <Coins className="w-4 h-4" /> Đất (Pentacles)
              </span>
              <span className="text-gray-400 font-bold">{stats.elements.earth.percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-mystic-dark/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full transition-all duration-1000" style={{ width: `${stats.elements.earth.percent}%` }} />
            </div>
          </div>

          {/* MAJOR ARCANA (AETHER) */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-fuchsia-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Số Mệnh (Major Arcana)
              </span>
              <span className="text-gray-400 font-bold">{stats.elements.aether.percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-mystic-dark/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-fuchsia-600 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${stats.elements.aether.percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: MOST DRAWN CARD PROFILE (Duyên Nợ) ── */}
      {stats.mostDrawn && (
        <div className="pt-8 border-t border-mystic-gold/15">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-mystic-gold/10 rounded-xl text-mystic-gold border border-mystic-gold/20 shadow-md">
                <Award size={22} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-serif gold-text tracking-widest uppercase">Lá Bài Duyên Nợ</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Lá Bài Xuất Hiện Nhiều Nhất Trong Hành Trình Của Bạn</p>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="glass p-8 md:p-12 rounded-[2.5rem] border-mystic-gold/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-10 md:gap-16 items-center"
            >
              {/* Card visual showcase */}
              <div className="w-[180px] md:w-[240px] aspect-[1/1.7] rounded-[2rem] overflow-hidden border-4 border-mystic-gold/30 shadow-[0_20px_40px_rgba(0,0,0,0.8)] shrink-0 relative group">
                <img 
                  src={stats.mostDrawn.card.imagePath} 
                  className="w-full h-full object-cover" 
                  alt={stats.mostDrawn.card.name} 
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
              </div>

              {/* Explanatory text */}
              <div className="space-y-6 text-center md:text-left flex-1">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-mystic-gold/10 border border-mystic-gold/25 rounded-full text-mystic-gold text-[9px] uppercase tracking-widest font-bold mb-3 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                    Đã rút {stats.mostDrawn.count} lần
                  </div>
                  <h4 className="text-3xl md:text-4xl font-serif text-white font-bold drop-shadow-md">
                    {stats.mostDrawn.card.name}
                  </h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-mystic-gold/60 uppercase tracking-widest font-bold">Chiêm nghiệm ý nghĩa</span>
                    <p className="text-gray-300 text-sm md:text-base font-light italic leading-relaxed">
                      "{stats.mostDrawn.card.meaningUpright.slice(0, 180)}..."
                    </p>
                  </div>
                  
                  <div className="p-5 bg-mystic-purple/10 border border-white/5 rounded-2xl text-[12px] md:text-sm text-gray-400 font-light leading-relaxed">
                    Sự lặp lại thường xuyên của lá bài này cho thấy vũ trụ đang muốn nhấn mạnh một chủ đề cốt tủy hoặc một bài học linh hồn chưa được hoàn thành trong cuộc sống của bạn. Hãy đặc biệt lưu tâm đến thông điệp này trong những tình huống hiện tại của bạn.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoulAnalytics;
