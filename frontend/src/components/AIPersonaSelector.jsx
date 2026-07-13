import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, Zap, Compass, Check } from 'lucide-react';

export const PERSONAS = [
  {
    id: 'empathetic_healer',
    name: 'Thầy Chữa Lành',
    subtitle: 'Empathetic Healer',
    description: 'Ấm áp, êm dịu, ôm ấp tổn thương tâm hồn & xoa dịu lo âu.',
    icon: HeartHandshake,
    color: 'border-rose-500/40 text-rose-300 bg-rose-500/10'
  },
  {
    id: 'mystic_sage',
    name: 'Nhà Hiền Triết',
    subtitle: 'Mystic Sage',
    description: 'Huyền bí, thấu thị, chứa đựng chiều sâu tiên tri & ẩn dụ cổ đại.',
    icon: Sparkles,
    color: 'border-amber-400/40 text-amber-300 bg-amber-400/10'
  },
  {
    id: 'brutally_honest',
    name: 'Thần Quẻ Bói Thẳng',
    subtitle: 'Brutally Honest',
    description: 'Thẳng thắn, bóc tách thực tế phũ phàng, hành động bứt phá.',
    icon: Zap,
    color: 'border-purple-400/40 text-purple-300 bg-purple-400/10'
  },
  {
    id: 'cosmic_scholar',
    name: 'Học Giả Vũ Trụ',
    subtitle: 'Cosmic Scholar',
    description: 'Uyên bác, phân tích triết học, chiêm tinh & biểu tượng học Jungian.',
    icon: Compass,
    color: 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10'
  }
];

const AIPersonaSelector = ({ selectedPersona, onSelectPersona }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 glass rounded-3xl border border-mystic-gold/20 bg-mystic-dark/40 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-mystic-gold/15">
        <div>
          <h3 className="text-md font-serif font-bold gold-text uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mystic-gold animate-spin-slow" />
            Chọn Cá Tính AI Reader (Oracle Persona)
          </h3>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            Mỗi bậc thầy sở hữu giọng điệu & góc nhìn thấu thị riêng biệt dành cho bạn.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PERSONAS.map(persona => {
          const Icon = persona.icon;
          const isSelected = selectedPersona === persona.id;

          return (
            <motion.div
              key={persona.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPersona(persona.id)}
              className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? `bg-mystic-dark/90 ${persona.color} shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-mystic-gold`
                  : 'bg-mystic-dark/40 border-white/10 hover:border-mystic-gold/30 hover:bg-mystic-dark/60 text-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl border border-white/10 ${persona.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-mystic-gold flex items-center justify-center text-mystic-dark shadow-md">
                      <Check className="w-3.5 h-3.5 font-bold" />
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-serif font-bold text-white tracking-wide">
                  {persona.name}
                </h4>
                <p className="text-[10px] text-mystic-gold/70 font-mono tracking-wider uppercase">
                  {persona.subtitle}
                </p>

                <p className="text-[11px] text-gray-300 font-light leading-relaxed mt-2 line-clamp-3">
                  {persona.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIPersonaSelector;
