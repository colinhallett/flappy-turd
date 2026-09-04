// Procedural Web Audio API sound generator & 8-Bit Retro Chiptune Soundtrack

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initialized = false;
    
    // Music Engine state
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.step = 0;
    this.tempo = 140; // BPM
    this.masterMusicGain = null;
    this.masterSfxGain = null;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      
      // Master Gains
      this.masterMusicGain = this.ctx.createGain();
      this.masterMusicGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
      this.masterMusicGain.connect(this.ctx.destination);

      this.masterSfxGain = this.ctx.createGain();
      this.masterSfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterSfxGain.connect(this.ctx.destination);

      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.masterMusicGain) {
        this.masterMusicGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, now);
      }
      if (this.masterSfxGain) {
        this.masterSfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, now);
      }
    }
    return this.isMuted;
  }

  // --- 8-BIT RETRO CHIPTUNE SOUNDTRACK ENGINE ---
  startMusic() {
    this.init();
    this.resume();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.step = 0;
    this.scheduleNextStep();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  scheduleNextStep() {
    if (!this.isPlayingMusic || !this.ctx) return;

    const stepDuration = (60 / this.tempo) / 4; // 16th note in seconds
    this.playStep(this.step, this.ctx.currentTime);
    this.step = (this.step + 1) % 64; // 4-bar loop (64 sixteenth notes)

    this.musicTimer = setTimeout(() => {
      this.scheduleNextStep();
    }, stepDuration * 1000);
  }

  playStep(step, time) {
    if (this.isMuted || !this.ctx) return;

    const stepDuration = (60 / this.tempo) / 4;

    // Note frequencies
    const C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, B3 = 246.94;
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, B5 = 987.77, C6 = 1046.50;

    // 1. LEAD SQUARE MELODY (Catchy, energetic chiptune hook)
    const melodyPattern = [
      // Bar 1 (C Major / G)
      E5, 0, G5, 0, C6, 0, G5, 0,  E5, 0, D5, E5, G5, 0, E5, 0,
      // Bar 2 (A Minor)
      A5, 0, E5, 0, C6, 0, A5, 0,  B5, 0, A5, G5, E5, 0, D5, 0,
      // Bar 3 (F Major -> G Major)
      F5, 0, A5, 0, C6, 0, D6, 0,  B5, 0, G5, 0, E5, G5, B5, 0,
      // Bar 4 (Turnaround hook)
      C6, 0, G5, 0, E5, 0, D5, 0,  C5, D5, E5, G5, C6, 0, 0, 0
    ];

    const leadNote = melodyPattern[step];
    if (leadNote) {
      this.playSquareNote(leadNote, time, stepDuration * 1.5, 0.22);
    }

    // 2. ARPEGGIO CHORD ENGINE (Classic NES 3-note fast sparkle)
    const chords = [
      [C4, E4, G4], // Bar 1 (0-15): C
      [A3, C4, E4], // Bar 2 (16-31): Am
      [F3, A3, C4], // Bar 3 (32-47): F
      [G3, B3, D4]  // Bar 4 (48-63): G
    ];
    const currentChord = chords[Math.floor(step / 16)];
    const arpNote = currentChord[step % 3];
    if (arpNote) {
      this.playArpNote(arpNote, time, stepDuration * 0.9, 0.10);
    }

    // 3. TRIANGLE BASSLINE (Bouncy, driving bass)
    const bassPattern = [
      // Bar 1
      C3, 0, G3, 0, C3, 0, G3, 0,  C3, 0, E3, 0, G3, 0, G3, 0,
      // Bar 2
      A3, 0, E3, 0, A3, 0, E3, 0,  A3, 0, C4, 0, E3, 0, G3, 0,
      // Bar 3
      F3, 0, C4, 0, F3, 0, C4, 0,  G3, 0, D4, 0, G3, 0, B3, 0,
      // Bar 4
      C3, 0, G3, 0, C3, 0, G3, 0,  G3, 0, G3, 0, C3, 0, 0, 0
    ];
    const bassNote = bassPattern[step];
    if (bassNote) {
      this.playTriangleBass(bassNote, time, stepDuration * 1.8, 0.35);
    }

    // 4. NOISE DRUMS (8-bit kick, snare & hi-hat)
    if (step % 8 === 0) {
      // 8-bit Kick on beat 1 & 3
      this.play8BitKick(time);
    } else if (step % 8 === 4) {
      // 8-bit Snare on beat 2 & 4
      this.play8BitSnare(time);
    } else if (step % 2 === 0) {
      // Hi-hat tick
      this.play8BitHat(time);
    }
  }

  playSquareNote(freq, time, duration, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.setValueAtTime(volume * 0.8, time + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  playArpNote(freq, time, duration, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 2, time); // higher octave shimmer

    // Highpass filter for bright crisp chiptune sparkle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, time);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  playTriangleBass(freq, time, duration, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  play8BitKick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.08);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(time);
    osc.stop(time + 0.08);
  }

  play8BitSnare(time) {
    // Noise buffer for snappy 8-bit snare
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    noise.start(time);
    noise.stop(time + 0.1);
  }

  play8BitHat(time) {
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    noise.start(time);
    noise.stop(time + 0.03);
  }

  // --- SOUND EFFECTS ---

  // Funny fart / flutter flap sound
  playFlap() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    
    // Low frequency oscillator for the comical fart flutter
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    const modOsc = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

    modOsc.type = 'square';
    modOsc.frequency.setValueAtTime(45 + Math.random() * 15, now);
    modGain.gain.setValueAtTime(40, now);

    modOsc.connect(osc.frequency);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterSfxGain);

    modOsc.start(now);
    osc.start(now);
    modOsc.stop(now + 0.12);
    osc.stop(now + 0.12);
  }

  // Golden chime / point score sound
  playScore() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (major arpeggio)
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);

      gain.gain.setValueAtTime(0.3, now + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.22);

      osc.connect(gain);
      gain.connect(this.masterSfxGain);

      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 0.22);
    });
  }

  // Splat collision sound
  playHit() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.2);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterSfxGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.2);
  }

  // Toilet flush death sound
  playFlush() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterSfxGain);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.7);

    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(oscGain);
    oscGain.connect(this.masterSfxGain);

    noise.start(now);
    osc.start(now);
    noise.stop(now + 0.8);
    osc.stop(now + 0.7);
  }

  // Milestone Fanfare
  playFanfare() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const chord = [587.33, 739.99, 880.00, 1174.66]; // D, F#, A, D
    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterSfxGain);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }
}

window.soundCtrl = new SoundController();
