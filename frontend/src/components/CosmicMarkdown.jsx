import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles } from 'lucide-react';

const CosmicMarkdown = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div className={`cosmic-markdown leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h3 className="text-sm sm:text-base font-serif font-bold gold-text uppercase tracking-widest mt-4 mb-2 flex items-center gap-2 border-b border-mystic-gold/20 pb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-mystic-gold shrink-0" />
              <span>{props.children}</span>
            </h3>
          ),
          h2: ({ node, ...props }) => (
            <h4 className="text-xs sm:text-sm font-serif font-bold gold-text uppercase tracking-wider mt-3.5 mb-1.5 flex items-center gap-2 border-b border-mystic-gold/15 pb-1">
              <div className="w-1.5 h-1.5 bg-mystic-gold rotate-45 shrink-0" />
              <span>{props.children}</span>
            </h4>
          ),
          h3: ({ node, ...props }) => (
            <h5 className="text-xs sm:text-sm font-serif font-bold text-mystic-gold tracking-wide mt-3 mb-1 flex items-center gap-2">
              <div className="w-1 h-1 bg-amber-400 rounded-full shrink-0" />
              <span>{props.children}</span>
            </h5>
          ),
          h4: ({ node, ...props }) => (
            <h6 className="text-xs font-serif font-bold text-amber-300 mt-2.5 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-xs sm:text-[13px] font-serif font-light leading-relaxed text-gray-200 mb-2.5 last:mb-0 tracking-wide" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-serif font-bold text-mystic-gold tracking-wide" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="font-serif italic text-amber-200/90" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="my-3 p-3.5 rounded-2xl border-l-2 border-mystic-gold/50 bg-mystic-gold/5 italic text-amber-200/90 font-serif font-light text-xs sm:text-[12.5px] leading-relaxed shadow-sm">
              {props.children}
            </blockquote>
          ),
          ul: ({ node, ...props }) => (
            <ul className="space-y-2 my-2.5 pl-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 my-2.5 pl-2 text-xs sm:text-[13px] text-gray-200 font-serif" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="flex items-start gap-2.5 text-xs sm:text-[13px] text-gray-200 font-serif leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold mt-1.5 shrink-0 shadow-[0_0_5px_rgba(212,175,55,0.8)]" />
              <div className="flex-1">{props.children}</div>
            </li>
          ),
          hr: () => (
            <hr className="my-4 border-t border-mystic-gold/20" />
          ),
          code: ({ node, inline, ...props }) => (
            <code className="px-1.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-amber-300 font-mono text-[11px]" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default CosmicMarkdown;
