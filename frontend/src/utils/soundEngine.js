/**
 * Tarot Mystic Sound Engine
 *
 * Powered entirely by the Web Audio API.
 * Features:
 * - Low-latency synthesized Sound Effects (SFX): card flip, riffle shuffle, card select.
 * - 100% offline, zero-network-dependencies, safe from CORS/404 issues.
 *
 * Note: Ambient music (generative synthesizer pad) has been removed.
 * Only SFX functionality is retained.
 */

let audioCtx = null;
let sfxGainNode = null;

// State management
let currentSFXVolume = 0.5;

/**
 * Safely initialize the global AudioContext
 */
export const initAudioContext = () => {
  if (audioCtx) return audioCtx;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    // Setup global SFX gain node (routed directly to destination for crispness)
    sfxGainNode = audioCtx.createGain();
    sfxGainNode.gain.setValueAtTime(currentSFXVolume, audioCtx.currentTime);
    sfxGainNode.connect(audioCtx.destination);

    console.log('Tarot Sound Engine: AudioContext initialized successfully.');
  } catch (error) {
    console.error('Tarot Sound Engine: Failed to initialize AudioContext:', error);
  }

  return audioCtx;
};

/**
 * Set SFX Volume (0.0 to 1.0)
 */
export const setSFXVolume = (vol) => {
  currentSFXVolume = Math.max(0, Math.min(1, vol));
  if (sfxGainNode && audioCtx) {
    sfxGainNode.gain.setTargetAtTime(currentSFXVolume, audioCtx.currentTime, 0.05);
  }
};

/**
 * Create a simple white noise buffer for friction sounds (paper, shuffles)
 */
const getNoiseBuffer = (ctx) => {
  const bufferSize = ctx.sampleRate * 2.0; // 2 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

/**
 * Play a synthesized card flip/reveal SFX
 * Mimics card friction sweep + soft tap landing
 */
export const playFlipSFX = () => {
  const ctx = initAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;

  // 1. Friction swipe (filtered noise sweep)
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = getNoiseBuffer(ctx);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(900, now);
  // Fast frequency sweep down to simulate sliding friction
  noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 0.28);
  noiseFilter.Q.setValueAtTime(1.5, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0, now);
  noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(sfxGainNode);

  // 2. Soft card snap/tap (triangle wave)
  const tapOsc = ctx.createOscillator();
  tapOsc.type = 'triangle';
  tapOsc.frequency.setValueAtTime(120, now + 0.06);
  tapOsc.frequency.exponentialRampToValueAtTime(50, now + 0.16);

  const tapGain = ctx.createGain();
  tapGain.gain.setValueAtTime(0, now);
  tapGain.gain.setValueAtTime(0.5, now + 0.06); // tap starts slightly after friction
  tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  tapOsc.connect(tapGain);
  tapGain.connect(sfxGainNode);

  // Trigger play
  noiseSource.start(now);
  noiseSource.stop(now + 0.3);
  tapOsc.start(now + 0.06);
  tapOsc.stop(now + 0.25);
};

/**
 * Play a synthesized card draw/selection SFX
 * Soft tap + a beautiful, mystical glass chime
 */
export const playDrawSFX = () => {
  const ctx = initAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;

  // 1. Soft click/tap
  const clickOsc = ctx.createOscillator();
  clickOsc.type = 'sine';
  clickOsc.frequency.setValueAtTime(220, now);
  clickOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.3, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  clickOsc.connect(clickGain);
  clickGain.connect(sfxGainNode);

  // 2. Celestial glass chime (FM-like bell sound)
  const chime1 = ctx.createOscillator();
  chime1.type = 'sine';
  chime1.frequency.setValueAtTime(880, now); // A5
  chime1.frequency.exponentialRampToValueAtTime(1320, now + 0.12); // Sweep up to E6

  const chime2 = ctx.createOscillator();
  chime2.type = 'sine';
  chime2.frequency.setValueAtTime(1760, now); // A6 octaves

  const chimeGain = ctx.createGain();
  chimeGain.gain.setValueAtTime(0.0, now);
  chimeGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
  chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  chime1.connect(chimeGain);
  chime2.connect(chimeGain);
  chimeGain.connect(sfxGainNode);

  // Trigger play
  clickOsc.start(now);
  clickOsc.stop(now + 0.1);
  chime1.start(now);
  chime1.stop(now + 0.5);
  chime2.start(now);
  chime2.stop(now + 0.5);
};

/**
 * Play card shuffle/dealing SFX
 * Synthesizes a series of rapid card flips/clicks at randomized intervals
 */
export const playShuffleSFX = () => {
  const ctx = initAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  const numSteps = 14;
  const totalDuration = 1.5; // 1.5 seconds shuffle animation matching overlay

  for (let i = 0; i < numSteps; i++) {
    // Introduce slight rhythmic randomization (riffle acceleration effect)
    const delay = (i / numSteps) * totalDuration + (Math.random() * 0.04 - 0.02);
    const triggerTime = now + Math.max(0, delay);

    // Play mini-friction clip
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = getNoiseBuffer(ctx);

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    // Alternate frequencies to simulate left/right decks riffle
    const baseFreq = i % 2 === 0 ? 800 : 1100;
    noiseFilter.frequency.setValueAtTime(baseFreq, triggerTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(180, triggerTime + 0.08);
    noiseFilter.Q.setValueAtTime(2.0, triggerTime);

    const noiseGain = ctx.createGain();
    // Fade volume out near the end of shuffle
    const volumeFactor = 1.0 - (i / numSteps) * 0.3;
    noiseGain.gain.setValueAtTime(0.0, triggerTime);
    noiseGain.gain.linearRampToValueAtTime(0.18 * volumeFactor, triggerTime + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, triggerTime + 0.08);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(sfxGainNode);

    // Riffle tap click
    const clickOsc = ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(140 + (i % 3) * 20, triggerTime);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.15 * volumeFactor, triggerTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, triggerTime + 0.05);

    clickOsc.connect(clickGain);
    clickGain.connect(sfxGainNode);

    noiseSource.start(triggerTime);
    noiseSource.stop(triggerTime + 0.1);
    clickOsc.start(triggerTime);
    clickOsc.stop(triggerTime + 0.06);
  }
};

/**
 * Unified play sound utility for triggers
 */
export const playSFX = (type) => {
  if (type === 'flip' || type === 'reveal') {
    playFlipSFX();
  } else if (type === 'shuffle') {
    playShuffleSFX();
  } else if (type === 'draw' || type === 'select') {
    playDrawSFX();
  }
};
