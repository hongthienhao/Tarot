import { useState, useEffect, useCallback, useRef } from 'react';
import { getApiBaseURL } from '../api/client';

const HEALTH_URL = `${getApiBaseURL()}/health`;

const WARMUP_TIMEOUT_MS = 90_000; // 90s — buffer for Render Free cold start (~50-60s)
const SHOW_OVERLAY_DELAY_MS = 300; // Only show overlay if backend hasn't replied in 300ms

/**
 * useBackendWarmup
 *
 * Fires a single GET /api/v1/health request on mount to wake up the
 * Render Free backend before the user interacts with the Tarot API.
 *
 * State machine:
 *  'idle'    → request sent, waiting < 300ms (no overlay shown)
 *  'warming' → 300ms elapsed, backend still hasn't replied (overlay shown)
 *  'ready'   → health responded with 2xx
 *  'error'   → timeout or non-2xx response
 *
 * Uses native fetch with:
 *   cache: 'no-store'      — prevent stale cached responses
 *   credentials: 'omit'    — no cookies, avoids CORS preflight for Authorization
 *   No Authorization header — health endpoint is public
 */
const useBackendWarmup = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'warming' | 'ready' | 'error'
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Refs to allow retry() to cancel in-flight timers/requests
  const abortControllerRef = useRef(null);
  const overlayTimerRef = useRef(null);
  const tickIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  // Prevent running on unmounted component
  const isMountedRef = useRef(true);

  const clearTimers = useCallback(() => {
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
      overlayTimerRef.current = null;
    }
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const runWarmup = useCallback(() => {
    if (!isMountedRef.current) return;

    clearTimers();
    setStatus('idle');
    setElapsedSeconds(0);
    setErrorMessage('');
    startTimeRef.current = Date.now();

    // Create new AbortController for this attempt
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // After SHOW_OVERLAY_DELAY_MS, if not yet resolved → show warming overlay
    overlayTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setStatus((prev) => (prev === 'idle' ? 'warming' : prev));

        // Tick elapsed seconds for phase-based messages
        tickIntervalRef.current = setInterval(() => {
          if (!isMountedRef.current) return;
          setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 500);
      }
    }, SHOW_OVERLAY_DELAY_MS);

    // Timeout: abort after 90s
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, WARMUP_TIMEOUT_MS);

    fetch(HEALTH_URL, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'omit',
      // No Authorization header — health endpoint is public
    })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!isMountedRef.current) return;

        if (res.ok) {
          clearTimers();
          setStatus('ready');
        } else {
          throw new Error(`Tín hiệu từ Vũ trụ phản hồi gián đoạn: HTTP ${res.status}`);
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (!isMountedRef.current) return;

        clearTimers();
        const isTimeout = err.name === 'AbortError';
        setStatus('error');
        setErrorMessage(
          isTimeout
            ? 'Cánh cửa Vũ trụ phản hồi chậm hơn dự kiến. Vui lòng kết nối lại.'
            : 'Không thể kết nối với Vũ trụ. Vui lòng kiểm tra mạng và thử lại.'
        );
      });
  }, [clearTimers]);

  // Run once on mount
  useEffect(() => {
    isMountedRef.current = true;
    runWarmup();

    return () => {
      isMountedRef.current = false;
      clearTimers();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // retry() — manual re-trigger after error
  const retry = useCallback(() => {
    runWarmup();
  }, [runWarmup]);

  return { status, elapsedSeconds, errorMessage, retry };
};

export default useBackendWarmup;
