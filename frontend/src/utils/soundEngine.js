/**
 * Tarot Mystic Sound Engine (Healing Polish)
 * 
 * Powered entirely by the Web Audio API. 
 * Features:
 * - Low-latency synthesized Sound Effects (SFX): card flip, riffle shuffle, card select.
 * - Generative Ambient Soundtrack: Infinitely evolving, lowpass-filtered minor-ninth/major-seventh chords.
 * - 100% offline, zero-network-dependencies, safe from CORS/404 issues.
 */

let audioCtx = null;
let musicGainNode = null;
let sfxGainNode = null;
let filterNode = null;

// State management
let isMusicPlaying = false;
let currentMusicVolume = 0.3;
let currentSFXVolume = 0.5;

// Ambient Synthesizer State
let ambientOscillators = [];
let ambientGains = [];
let ambientTimer = null;
let currentChordIndex = 0;

// Chords designed for deep reflection and cosmic wonder (frequencies in Hz)
const AMBIENT_CHORDS = [
  // C minor 9th (C2, G2, Eb3, Bb3, D4)
  [65.41, 98.00, 155.56, 233.08, 293.66],
  // Ab major 7th (Ab2, Eb3, G3, C4, G4)
  [103.83, 155.56, 196.00, 261.63, 392.00],
  // F minor 9th (F2, C3, Ab3, Eb4, G4)
  [87.31, 130.81, 207.65, 311.13, 392.00],
  // G minor 11th (G2, D3, Bb3, F4, A4)
  [98.00, 146.83, 233.08, 349.23, 440.00]
];

/**
 * Safely initialize the global AudioContext
 */
export const initAudioContext = () => {
  if (audioCtx) return audioCtx;
  
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // Create filter for ambient music to keep it dark, warm and celestial
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(320, audioCtx.currentTime);
    filterNode.Q.setValueAtTime(1.0, audioCtx.currentTime);
    filterNode.connect(audioCtx.destination);

    // Setup global music gain node (routed through filter)
    musicGainNode = audioCtx.createGain();
    musicGainNode.gain.setValueAtTime(currentMusicVolume, audioCtx.currentTime);
    musicGainNode.connect(filterNode);

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
 * Set Music Volume (0.0 to 1.0)
 */
export const setMusicVolume = (vol) => {
  currentMusicVolume = Math.max(0, Math.min(1, vol));
  if (musicGainNode && audioCtx) {
    musicGainNode.gain.setTargetAtTime(currentMusicVolume, audioCtx.currentTime, 0.05);
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
 * Synthesize and smoothly fade in notes of a chord
 */
const playAmbientChord = (ctx, frequencies, now, duration) => {
  const attack = 4.5; // Very slow attack (4.5s) to fade notes in organically
  const release = 4.5; // Smooth overlap
  
  // Clear any existing active oscillators
  stopCurrentChord(now);
  
  ambientOscillators = [];
  ambientGains = [];
  
  frequencies.forEach((freq, idx) => {
    // Mix triangle and sine waves for a lush, organ-like cosmic pad
    const osc = ctx.createOscillator();
    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    
    // Add micro-detuning to create natural chorus & width
    const detuneAmount = (Math.random() - 0.5) * 8; // detune by up to 4 cents
    osc.detune.setValueAtTime(detuneAmount, now);
    
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0, now);
    // Smooth attack
    noteGain.gain.linearRampToValueAtTime(0.12, now + attack);
    // Keep sustaining
    noteGain.gain.setValueAtTime(0.12, now + duration - release);
    // Smooth release
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    osc.connect(noteGain);
    noteGain.connect(musicGainNode);
    
    osc.start(now);
    
    ambientOscillators.push(osc);
    ambientGains.push(noteGain);
  });
};

/**
 * Instantly stop all oscillators playing in the chord with a quick release
 */
const stopCurrentChord = (now) => {
  const quickRelease = 1.5;
  
  ambientGains.forEach(gainNode => {
    try {
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + quickRelease);
    } catch (e) {
      // Node might be already disposed
    }
  });
  
  ambientOscillators.forEach(osc => {
    try {
      osc.stop(now + quickRelease + 0.1);
    } catch (e) {
      // Osc might be already stopped
    }
  });

  ambientOscillators = [];
  ambientGains = [];
};

/**
 * Start the Generative Ambient Music Pad
 */
export const startAmbientMusic = () => {
  const ctx = initAudioContext();
  if (!ctx) return;
  
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  console.log('Tarot Sound Engine: Starting generative cosmic ambient music.');
  
  const chordDuration = 12.0; // 12 seconds per chord progression

  const rotateChords = () => {
    if (!isMusicPlaying) return;
    
    const now = ctx.currentTime;
    const chord = AMBIENT_CHORDS[currentChordIndex];
    
    playAmbientChord(ctx, chord, now, chordDuration + 1.0); // 1s overlap
    
    // Move to next chord in progression
    currentChordIndex = (currentChordIndex + 1) % AMBIENT_CHORDS.length;
    
    // Schedule next chord rotate
    ambientTimer = setTimeout(rotateChords, chordDuration * 1000);
  };
  
  rotateChords();
};

/**
 * Stop the Generative Ambient Music Pad
 */
export const stopAmbientMusic = () => {
  if (!isMusicPlaying) return;
  isMusicPlaying = false;
  
  if (ambientTimer) {
    clearTimeout(ambientTimer);
    ambientTimer = null;
  }
  
  if (audioCtx) {
    const now = audioCtx.currentTime;
    stopCurrentChord(now);
  }
  
  console.log('Tarot Sound Engine: Ambient music stopped.');
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
