import React, { useState, useEffect, useReducer, useRef } from 'react';
import {
  DRAW_DIAGNOSTICS,
  subscribe,
  getSnapshot,
  clearLog,
  getLogText,
  loadPreviousSession,
} from '../../utils/drawDiagnostics';

/**
 * DrawDiagnosticPanel
 *
 * - Chỉ render khi DRAW_DIAGNOSTICS === true
 * - Zero animation, zero blur, zero Framer Motion
 * - Cực nhẹ: không setInterval, không RAF, không scroll listener
 * - Persist log qua sessionStorage để đọc sau khi reload
 */

// ─── Styles thuần JS — không dùng Tailwind để không phụ thuộc vào CSS load ──
const S = {
  // Panel full
  panel: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    backgroundColor: 'rgba(0,0,0,0.96)',
    color: '#d4af37',
    fontFamily: 'monospace',
    fontSize: '11px',
    lineHeight: '1.5',
    maxHeight: '55vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 12px rgba(0,0,0,0.8)',
    userSelect: 'text',
    WebkitUserSelect: 'text',
  },
  // Header bar
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 8px',
    backgroundColor: '#1a0a00',
    borderBottom: '1px solid #d4af3744',
    flexShrink: 0,
    gap: 6,
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: '#d4af37',
    textTransform: 'uppercase',
  },
  btnRow: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  },
  btn: {
    padding: '2px 7px',
    fontSize: '9px',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    border: '1px solid #d4af3766',
    backgroundColor: 'transparent',
    color: '#d4af37',
    borderRadius: 3,
    cursor: 'pointer',
    fontFamily: 'monospace',
    WebkitTapHighlightColor: 'transparent',
  },
  btnCopied: {
    color: '#4ade80',
    borderColor: '#4ade8066',
  },
  // Meta row
  meta: {
    display: 'flex',
    gap: 12,
    padding: '3px 8px',
    fontSize: '10px',
    borderBottom: '1px solid #ffffff11',
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  metaLabel: { color: '#888', marginRight: 3 },
  metaValue: { color: '#d4af37', fontWeight: 'bold' },
  // Prev session banner
  prevBanner: {
    padding: '2px 8px',
    backgroundColor: '#2a1500',
    borderBottom: '1px solid #d4af3733',
    fontSize: '10px',
    color: '#f59e0b',
    flexShrink: 0,
  },
  // Log area
  logArea: {
    overflowY: 'auto',
    flex: 1,
    padding: '4px 6px',
    WebkitOverflowScrolling: 'touch',
  },
  logEntry: {
    display: 'flex',
    gap: 6,
    padding: '1px 0',
    borderBottom: '1px solid #ffffff08',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  logTs: { color: '#666', whiteSpace: 'nowrap', flexShrink: 0 },
  logState: { color: '#888', whiteSpace: 'nowrap', flexShrink: 0 },
  logEvent: { color: '#d4af37', fontWeight: 'bold', flexShrink: 0 },
  logEventError: { color: '#f87171', fontWeight: 'bold', flexShrink: 0 },
  logExtra: { color: '#aaa', wordBreak: 'break-all' },
  // Minimized bar
  miniBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    backgroundColor: 'rgba(0,0,0,0.92)',
    borderBottom: '1px solid #d4af3733',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px 8px',
    fontFamily: 'monospace',
    fontSize: '10px',
    color: '#d4af37',
  },
};

// ─── Tên events được coi là lỗi (highlight đỏ) ───────────────────────────────
const ERROR_EVENTS = new Set([
  'DRAW_FLOW_ERROR', 'IMAGE_LOAD_ERROR', 'IMAGE_BITMAP_ERROR',
  'JS_ERROR', 'UNHANDLED_REJECTION',
]);

// ─── Helper: format extra fields của một entry ───────────────────────────────
const formatExtra = (entry) => {
  const skip = new Set(['ts', 'event', 'flowState', 'mem']);
  const parts = Object.entries(entry)
    .filter(([k]) => !skip.has(k))
    .map(([k, v]) => `${k}:${typeof v === 'object' ? JSON.stringify(v) : v}`);
  const memStr = entry.mem ? `heap:${entry.mem.usedMB}/${entry.mem.limitMB}MB` : '';
  return [...parts, memStr].filter(Boolean).join(' ');
};

// ─── Component chính ──────────────────────────────────────────────────────────
const DrawDiagnosticPanelInner = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [minimized, setMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prevSession, setPrevSession] = useState(null);
  const logEndRef = useRef(null);
  const logAreaRef = useRef(null);
  const isAtBottomRef = useRef(true);

  // Đăng ký re-render khi log thay đổi
  useEffect(() => {
    const unsub = subscribe(forceUpdate);
    return unsub;
  }, []);

  // Đọc session trước khi mount
  useEffect(() => {
    const prev = loadPreviousSession();
    if (prev && prev.log && prev.log.length > 0) {
      // Chỉ set nếu session trước khác session hiện tại (có APP_SESSION_START mới)
      setPrevSession(prev);
    }
  }, []);

  // Auto-scroll xuống cuối khi có event mới, nhưng chỉ nếu đang ở dưới cùng
  const { log } = getSnapshot();
  useEffect(() => {
    if (isAtBottomRef.current && logAreaRef.current) {
      logAreaRef.current.scrollTop = logAreaRef.current.scrollHeight;
    }
  }, [log.length]);

  const handleScroll = () => {
    const el = logAreaRef.current;
    if (!el) return;
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
  };

  const handleCopy = async () => {
    const text = getLogText();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback cho Safari iOS cũ
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('[DRAW-DIAG] Copy failed:', e);
    }
  };

  const handleCopyPrev = async () => {
    if (!prevSession) return;
    const lines = (prevSession.log || []).map(e => {
      const extra = formatExtra(e);
      return `[${e.ts}][${e.flowState}] ${e.event}${extra ? ' | ' + extra : ''}`;
    }).join('\n');
    const text = `=== PREVIOUS SESSION ===\n${lines}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const { flowState } = getSnapshot();
  const errorCount = log.filter(e => ERROR_EVENTS.has(e.event)).length;

  // ── Minimized state ──────────────────────────────────────────────────────
  if (minimized) {
    return (
      <div style={S.miniBar}>
        <span style={S.title}>
          ◉ DRAW DIAG · {flowState} · {log.length} events
          {errorCount > 0 && <span style={{ color: '#f87171' }}> · {errorCount} ERR</span>}
        </span>
        <button style={S.btn} onClick={() => setMinimized(false)}>OPEN</button>
      </div>
    );
  }

  // ── Full panel ──────────────────────────────────────────────────────────
  return (
    <div style={S.panel} aria-label="Draw Diagnostic Panel">
      {/* Header */}
      <div style={S.header}>
        <span style={S.title}>◉ DRAW DIAGNOSTIC</span>
        <div style={S.btnRow}>
          <button
            style={{ ...S.btn, ...(copied ? S.btnCopied : {}) }}
            onClick={handleCopy}
          >
            {copied ? 'COPIED ✓' : 'COPY LOGS'}
          </button>
          <button style={S.btn} onClick={clearLog}>CLEAR</button>
          <button style={S.btn} onClick={() => setMinimized(true)}>MIN</button>
        </div>
      </div>

      {/* Meta row */}
      <div style={S.meta}>
        <span>
          <span style={S.metaLabel}>State:</span>
          <span style={S.metaValue}>{flowState}</span>
        </span>
        <span>
          <span style={S.metaLabel}>Events:</span>
          <span style={S.metaValue}>{log.length}</span>
        </span>
        {errorCount > 0 && (
          <span>
            <span style={{ ...S.metaLabel, color: '#f87171' }}>Errors:</span>
            <span style={{ ...S.metaValue, color: '#f87171' }}>{errorCount}</span>
          </span>
        )}
      </div>

      {/* Previous session banner */}
      {prevSession && prevSession.log && prevSession.log.length > 0 && (
        <div style={S.prevBanner}>
          ⚠ PREVIOUS SESSION LOGS AVAILABLE ({prevSession.log.length} events, state: {prevSession.flowState})
          {' '}
          <button
            style={{ ...S.btn, marginLeft: 6, color: '#f59e0b', borderColor: '#f59e0b66' }}
            onClick={handleCopyPrev}
          >
            {copied ? 'COPIED ✓' : 'COPY PREV'}
          </button>
        </div>
      )}

      {/* Log entries */}
      <div
        style={S.logArea}
        ref={logAreaRef}
        onScroll={handleScroll}
      >
        {log.length === 0 ? (
          <div style={{ color: '#555', padding: '6px 0' }}>
            Chưa có events. Bắt đầu draw flow để xem log.
          </div>
        ) : (
          log.map((entry, i) => {
            const isError = ERROR_EVENTS.has(entry.event);
            const extra = formatExtra(entry);
            return (
              <div key={i} style={S.logEntry}>
                <span style={S.logTs}>[{entry.ts}]</span>
                <span style={S.logState}>[{entry.flowState}]</span>
                <span style={isError ? S.logEventError : S.logEvent}>
                  {entry.event}
                </span>
                {extra && <span style={S.logExtra}>{extra}</span>}
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

// ─── Error Boundary bảo vệ — panel không crash app ──────────────────────────
class DiagPanelBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false, error: null };
  }

  static getDerivedStateFromError(err) {
    return { crashed: true, error: err };
  }

  componentDidCatch(err, info) {
    console.error('[DRAW-DIAG] Panel itself crashed:', err, info);
  }

  render() {
    if (this.state.crashed) {
      // Panel fallback — tối giản, không dùng bất kỳ lib nào
      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999,
          backgroundColor: '#1a0000', color: '#f87171',
          fontFamily: 'monospace', fontSize: '10px', padding: '4px 8px',
          borderBottom: '1px solid #f8717133',
        }}>
          [DRAW-DIAG] Panel crashed: {String(this.state.error?.message || this.state.error)}
          {' | State: '}{getSnapshot().flowState}
          {' | Events: '}{getSnapshot().log.length}
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Export final ─────────────────────────────────────────────────────────────
const DrawDiagnosticPanel = () => {
  if (!DRAW_DIAGNOSTICS) return null;
  return (
    <DiagPanelBoundary>
      <DrawDiagnosticPanelInner />
    </DiagPanelBoundary>
  );
};

export default DrawDiagnosticPanel;
