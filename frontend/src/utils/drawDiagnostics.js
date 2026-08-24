/**
 * drawDiagnostics.js — Draw Flow Diagnostic Engine
 *
 * Bật/tắt bằng DRAW_DIAGNOSTICS.
 * Khi false: zero overhead, không log, không persist.
 * Khi true: full logging + sessionStorage persistence + global error capture.
 *
 * DIAGNOSTIC ONLY — không thay đổi bất kỳ logic ứng dụng nào.
 */

// ─── Toggle duy nhất ────────────────────────────────────────────────────────
export const DRAW_DIAGNOSTICS = true;
// ───────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mystic_tarot_draw_diagnostics';
const MAX_EVENTS   = 200; // giới hạn để tránh localStorage quá lớn

// In-memory log (mảng object)
let _log = [];
// Trạng thái flow hiện tại
let _flowState = 'IDLE';
// Subscribers để React component re-render khi log thay đổi
const _subscribers = new Set();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const _ts = () => {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0')).join(':')
    + '.' + String(d.getMilliseconds()).padStart(3, '0');
};

const _memSnapshot = () => {
  try {
    const m = performance?.memory;
    if (!m) return null;
    return {
      usedMB:  +(m.usedJSHeapSize  / 1048576).toFixed(1),
      totalMB: +(m.totalJSHeapSize / 1048576).toFixed(1),
      limitMB: +(m.jsHeapSizeLimit  / 1048576).toFixed(1),
    };
  } catch (_) { return null; }
};

const _notify = () => {
  _subscribers.forEach(fn => { try { fn(); } catch (_) {} });
};

const _persist = () => {
  try {
    const payload = JSON.stringify({ flowState: _flowState, log: _log });
    sessionStorage.setItem(STORAGE_KEY, payload);
  } catch (_) {
    // sessionStorage full or blocked — silently ignore
  }
};

// ─── API công khai ────────────────────────────────────────────────────────────

/** Đăng ký callback re-render khi log thay đổi */
export const subscribe = (fn) => {
  _subscribers.add(fn);
  return () => _subscribers.delete(fn);
};

/** Trả về snapshot hiện tại (bất biến) */
export const getSnapshot = () => ({
  flowState: _flowState,
  log: _log,
});

/** Ghi một event vào log */
export const logDrawEvent = (event, extra = {}) => {
  if (!DRAW_DIAGNOSTICS) return;

  const entry = {
    ts: _ts(),
    event,
    flowState: _flowState,
    mem: _memSnapshot(),
    ...extra,
  };

  _log = [..._log.slice(-(MAX_EVENTS - 1)), entry];
  _persist();
  _notify();

  // Console mirror — dễ grep với prefix
  const extraStr = Object.keys(extra).length
    ? ' ' + JSON.stringify(extra)
    : '';
  console.log(`[DRAW-DIAG] [${entry.ts}] [${_flowState}] ${event}${extraStr}`);
};

/** Ghi snapshot memory tại một mốc cụ thể */
export const logMemorySnapshot = (label) => {
  if (!DRAW_DIAGNOSTICS) return;
  const mem = _memSnapshot();
  if (mem) {
    logDrawEvent('MEMORY_SNAPSHOT', { label, ...mem });
  } else {
    logDrawEvent('PERFORMANCE_MEMORY_UNAVAILABLE', { label });
  }
};

/** Cập nhật flow state (tự động log FLOW_STATE_CHANGE) */
export const setFlowState = (state) => {
  if (!DRAW_DIAGNOSTICS) return;
  _flowState = state;
  logDrawEvent('FLOW_STATE_CHANGE', { newState: state });
};

/** Xóa log (không reset flow state) */
export const clearLog = () => {
  if (!DRAW_DIAGNOSTICS) return;
  _log = [];
  _persist();
  _notify();
};

/** Trả về toàn bộ log dạng plain text để copy */
export const getLogText = () => {
  const header = `=== MYSTIC TAROT DRAW DIAGNOSTICS ===\nUA: ${navigator.userAgent}\nTime: ${new Date().toISOString()}\nFlowState: ${_flowState}\nEvents: ${_log.length}\n${'='.repeat(40)}\n`;
  const lines = _log.map(e => {
    const mem = e.mem ? ` heap:${e.mem.usedMB}/${e.mem.limitMB}MB` : '';
    const extra = Object.entries(e)
      .filter(([k]) => !['ts','event','flowState','mem'].includes(k))
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ');
    return `[${e.ts}][${e.flowState}] ${e.event}${mem}${extra ? ' | '+extra : ''}`;
  }).join('\n');
  return header + lines;
};

/** Đọc lại log từ session trước (nếu có) */
export const loadPreviousSession = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
};

/** Cài đặt global listeners — gọi một lần trong main.jsx */
export const installDrawDiagnostics = () => {
  if (!DRAW_DIAGNOSTICS) return;

  // Expose helpers ra window để dùng từ DevTools
  window.__drawDiag = {
    dump: () => { console.log(getLogText()); return getLogText(); },
    state: () => getSnapshot(),
    clear: clearLog,
  };

  // JS runtime errors
  const prevOnError = window.onerror;
  window.onerror = (msg, src, line, col, err) => {
    logDrawEvent('DRAW_FLOW_ERROR', {
      type: 'JS_ERROR',
      message: String(msg).slice(0, 300),
      source: src ? src.split('/').slice(-2).join('/') : undefined,
      line, col,
      stack: err?.stack?.slice(0, 500),
    });
    if (typeof prevOnError === 'function') return prevOnError(msg, src, line, col, err);
    return false;
  };

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (ev) => {
    const r = ev.reason;
    logDrawEvent('DRAW_FLOW_ERROR', {
      type: 'UNHANDLED_REJECTION',
      message: r instanceof Error ? String(r.message).slice(0, 300) : String(r).slice(0, 300),
      stack: r instanceof Error ? r.stack?.slice(0, 500) : undefined,
    });
  });

  // Page lifecycle — phát hiện Safari kill / BFCache
  document.addEventListener('visibilitychange', () => {
    logDrawEvent(document.visibilityState === 'hidden' ? 'PAGE_HIDE' : 'PAGE_SHOW', {
      visibilityState: document.visibilityState,
    });
  });

  window.addEventListener('pagehide', (ev) => {
    logDrawEvent('PAGE_HIDE', { persisted: ev.persisted });
    _persist(); // flush cuối cùng trước khi process bị kill
  });

  window.addEventListener('pageshow', (ev) => {
    logDrawEvent('PAGE_SHOW', { persisted: ev.persisted });
  });

  window.addEventListener('beforeunload', () => {
    logDrawEvent('PAGE_BEFORE_UNLOAD', {});
    _persist();
  });

  // Session start marker
  logDrawEvent('APP_SESSION_START', {
    ua: navigator.userAgent.slice(0, 100),
    screen: `${screen.width}x${screen.height}@${devicePixelRatio}dpr`,
    memory: navigator.deviceMemory ?? 'unknown',
    cores: navigator.hardwareConcurrency ?? 'unknown',
  });
};

// ─── Event name constants ─────────────────────────────────────────────────────
export const DE = {
  DRAW_FLOW_START:          'DRAW_FLOW_START',
  SPREAD_SELECTED:          'SPREAD_SELECTED',
  SHUFFLE_START:            'SHUFFLE_START',
  SHUFFLE_ANIMATION_MOUNT:  'SHUFFLE_ANIMATION_MOUNT',
  SHUFFLE_COMPLETE:         'SHUFFLE_COMPLETE',
  ASTROLABE_MOUNT:          'ASTROLABE_MOUNT',
  ASTROLABE_UNMOUNT:        'ASTROLABE_UNMOUNT',
  ASTROLABE_CARD_COUNT:     'ASTROLABE_CARD_COUNT',
  CARDS_RENDER_START:       'CARDS_RENDER_START',
  CARDS_RENDER_COMPLETE:    'CARDS_RENDER_COMPLETE',
  IMAGE_LOAD_START:         'IMAGE_LOAD_START',
  IMAGE_LOAD_SUCCESS:       'IMAGE_LOAD_SUCCESS',
  IMAGE_LOAD_ERROR:         'IMAGE_LOAD_ERROR',
  IMAGE_BITMAP_START:       'IMAGE_BITMAP_START',
  IMAGE_BITMAP_SUCCESS:     'IMAGE_BITMAP_SUCCESS',
  IMAGE_BITMAP_ERROR:       'IMAGE_BITMAP_ERROR',
  CANVAS_RENDER:            'CANVAS_RENDER',
  CARD_SELECT_START:        'CARD_SELECT_START',
  CARD_SELECTED:            'CARD_SELECTED',
  CARD_CONFIRM:             'CARD_CONFIRM',
  READING_NAVIGATION_START: 'READING_NAVIGATION_START',
  READING_MOUNT:            'READING_MOUNT',
  READING_UNMOUNT:          'READING_UNMOUNT',
  DRAW_FLOW_ERROR:          'DRAW_FLOW_ERROR',
  PAGE_HIDE:                'PAGE_HIDE',
  PAGE_SHOW:                'PAGE_SHOW',
  PAGE_BEFORE_UNLOAD:       'PAGE_BEFORE_UNLOAD',
  PERFORMANCE_MEMORY_UNAVAILABLE: 'PERFORMANCE_MEMORY_UNAVAILABLE',
};
