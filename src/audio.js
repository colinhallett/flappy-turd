// Procedural Web Audio API sound generator & 8-Bit Retro Chiptune Soundtrack

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.unlocked = false;
    
    // Music Engine state
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.step = 0;
    this.tempo = 145; // Energetic arcade BPM
    this.masterMusicGain = null;
    this.masterSfxGain = null;
  }

  // Robust AudioContext initialization with iOS / Mobile unlocking
  init() {
    if (!this.ctx) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        
        // Master Music Gain
        this.masterMusicGain = this.ctx.createGain();
        this.masterMusicGain.gain.value = this.isMuted ? 0 : 0.4;
        this.masterMusicGain.connect(this.ctx.destination);

        // Master SFX Gain
        this.masterSfxGain = this.ctx.createGain();
        this.masterSfxGain.gain.value = this.isMuted ? 0 : 0.7;
        this.masterSfxGain.connect(this.ctx.destination);
      } catch (e) {
        console.warn("Web Audio API not supported", e);
      }
    }

    this.unlockAudio();
  }

  unlockAudio() {
    if (!this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.unlocked) {
      // Play 1-frame silent buffer to force unlock iOS Safari / WebKit audio hardware
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
        this.unlocked = true;
      } catch (e) {}
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.masterMusicGain) {
        this.masterMusicGain.gain.value = this.isMuted ? 0 : 0.4;
      }
      if (this.masterSfxGain) {
        this.masterSfxGain.gain.value = this.isMuted ? 0 : 0.7;
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
    this.runMusicLoop();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  runMusicLoop() {
    if (!this.isPlayingMusic || !this.ctx) return;

    const stepDuration = (60 / this.tempo) / 4; // 16th note in seconds
    const now = this.ctx.currentTime;
    
    this.playStep(this.step, now);
    this.step = (this.step + 1) % 64; // 64-step loop (4 bars of 16th notes)

    this.musicTimer = setTimeout(() => {
      this.runMusicLoop();
    }, stepDuration * 1000);
  }

  playStep(step, time) {
    if (this.isMuted || !this.ctx) return;

    const stepDuration = (60 / this.tempo) / 4;

    // Frequencies
    const C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, B3 = 246.94;
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, B5 = 987.77;
    const C6 = 1046.50, D6 = 1174.66, E6 = 1318.51;

    // 1. LEAD SQUARE MELODY (Catchy, iconic arcade theme)
    const melodyPattern = [
      // Bar 1: C Major Hook
      E5, 0, G5, 0, C6, 0, G5, 0,   E5, 0, D5, E5, G5, 0, E5, 0,
      // Bar 2: A Minor Hook
      A5, 0, E5, 0, C6, 0, A5, 0,   B5, 0, A5, G5, E5, 0, D5, 0,
      // Bar 3: F Major -> G Major
      F5, 0, A5, 0, C6, 0, D6, 0,   B5, 0, G5, 0,  E5, G5, B5, 0,
      // Bar 4: Climax & Turnaround
      C6, 0, G5, 0, E5, 0, D5, 0,   C5, D5, E5, G5, C6, 0, 0, 0
    ];

    const leadFreq = melodyPattern[step];
    if (leadFreq) {
      this.playSquareLead(leadFreq, time, stepDuration * 1.6, 0.35);
    }

    // 2. RETRO ARPEGGIO CHORD ENGINE (Fast NES shimmer)
    const chords = [
      [C4, E4, G4], // C
      [A3, C4, E4], // Am
      [F3, A3, C4], // F
      [G3, B3, D4]  // G
    ];
    const currentChord = chords[Math.floor(step / 16)];
    const arpFreq = currentChord[step % 3];
    if (arpFreq) {
      this.playArp(arpFreq, time, stepDuration * 0.9, 0.18);
    }

    // 3. BOUNCY BASSLINE (Square / Triangle blend)
    const bassPattern = [
      // Bar 1 (C)
      C3, 0, G3, 0, C3, 0, G3, 0,   C3, 0, E3, 0, G3, 0, G3, 0,
      // Bar 2 (Am)
      A3, 0, E3, 0, A3, 0, E3, 0,   A3, 0, C4, 0, E3, 0, G3, 0,
      // Bar 3 (F -> G)
      F3, 0, C4, 0, F3, 0, C4, 0,   G3, 0, D4, 0, G3, 0, B3, 0,
      // Bar 4 (C Turnaround)
      C3, 0, G3, 0, C3, 0, G3, 0,   G3, 0, G3, 0, C3, 0, 0, 0
    ];
    const bassFreq = bassPattern[step];
    if (bassFreq) {
      this.playBass(bassFreq, time, stepDuration * 1.7, 0.5);
    }

    // 4. RETRO DRUMS
    if (step % 8 === 0) {
      this.playKick(time);
    } else if (step % 8 === 4) {
      this.playSnare(time);
    } else if (step % 2 === 0) {
      this.playHat(time);
    }
  }

  playSquareLead(freq, time, duration, volume) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(volume * 0.7, time + duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  playArp(freq, time, duration, volume) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 2, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, time);

      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  playBass(freq, time, duration, volume) {
    try {
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
    } catch (e) {}
  }

  playKick(time) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.09);

      gain.gain.setValueAtTime(0.6, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      osc.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + 0.09);
    } catch (e) {}
  }

  playSnare(time) {
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain);

      noise.start(time);
      noise.stop(time + 0.1);
    } catch (e) {}
  }

  playHat(time) {
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain);

      noise.start(time);
      noise.stop(time + 0.03);
    } catch (e) {}
  }

  // --- SOUND EFFECTS ---

  // Funny fart / flutter flap sound
  playFlap() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    try {
      const now = this.ctx.currentTime;
      
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

      gain.gain.setValueAtTime(0.6, now);
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
    } catch (e) {}
  }

  // Golden chime / point score sound
  playScore() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (major arpeggio)
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        gain.gain.setValueAtTime(0.4, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.22);

        osc.connect(gain);
        gain.connect(this.masterSfxGain);

        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 0.22);
      });
    } catch (e) {}
  }

  // Splat collision sound
  playHit() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    try {
      const now = this.ctx.currentTime;
      
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
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
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterSfxGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.2);
    } catch (e) {}
  }

  // Toilet flush death sound
  playFlush() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    try {
      const now = this.ctx.currentTime;
      
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.8);
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
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterSfxGain);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.7);

      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

      osc.connect(oscGain);
      oscGain.connect(this.masterSfxGain);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.8);
      osc.stop(now + 0.7);
    } catch (e) {}
  }

  // Milestone Fanfare
  playFanfare() {
    if (this.isMuted || !this.ctx) return;
    this.resume();

    try {
      const now = this.ctx.currentTime;
      const chord = [587.33, 739.99, 880.00, 1174.66]; // D, F#, A, D
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.masterSfxGain);

        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch (e) {}
  }
}

window.soundCtrl = new SoundController();
