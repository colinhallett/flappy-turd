// Main Game Engine for Flappy Turd

(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const previewCanvas = document.getElementById('previewCanvas');
  const pCtx = previewCanvas.getContext('2d');

  // UI Elements
  const hud = document.getElementById('hud');
  const scoreDisplay = document.getElementById('score-display');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const startHighScore = document.getElementById('start-high-score');
  const finalScore = document.getElementById('final-score');
  const finalBestScore = document.getElementById('final-best-score');
  const medalDisplay = document.getElementById('medal-display');
  const deathQuote = document.getElementById('death-quote');
  const toastBanner = document.getElementById('toast-banner');
  const toastText = document.getElementById('toast-text');
  const btnStart = document.getElementById('btn-start');
  const btnRestart = document.getElementById('btn-restart');
  const btnShare = document.getElementById('btn-share');
  const btnAudio = document.getElementById('btn-audio');
  const audioIcon = document.getElementById('audio-icon');

  // Game Constants
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;
  const GROUND_HEIGHT = 90;
  const GRAVITY = 0.38;
  const JUMP_FORCE = -6.8;
  const PIPE_SPEED = 2.4;
  const PIPE_SPAWN_RATE = 115; // frames between pipes
  const PIPE_GAP = 145;
  const PIPE_WIDTH = 64;

  // Quotes
  const SCORE_QUOTES = [
    "TREMENDOUS!",
    "HUGE FLAP!",
    "NOBODY DOES IT BETTER!",
    "MAKING FLAPPING GREAT AGAIN!",
    "PERFECT FORM! VERY STABLE!",
    "BILLIONS OF POINTS!",
    "THE GREATEST OF ALL TIME!",
    "LOOK AT THAT GOLDEN HAIR!"
  ];

  const DEATH_QUOTES = [
    '"TOTAL RIGGED HOAX! THE PIPES WERE CROOKED!"',
    '"FAKE PIPES! I ACTUALLY WON BY A LOT!"',
    '"WITCH HUNT! DISQUALIFY THAT OBSTACLE!"',
    '"I DEMAND A RECOUNT OF MY SCORE!"',
    '"THE GRAVITY WAS CORRUPT AND UNFAIR!"',
    '"VERY LOW RATINGS FOR THAT PIPE!"',
    '"I WAS FLAPPING PERFECTLY! TOTAL HOAX!"'
  ];

  // Game State
  const STATES = { START: 0, PLAYING: 1, GAMEOVER: 2 };
  let currentState = STATES.START;
  let frameCount = 0;
  let score = 0;
  let highScore = parseInt(localStorage.getItem('flappy_turd_highscore') || '0', 10);
  let groundScroll = 0;
  let bgScroll = 0;
  let toastTimer = null;

  // Player object
  const turd = {
    x: 90,
    y: 250,
    vy: 0,
    radius: 18,
    rotation: 0,
    reset() {
      this.x = 90;
      this.y = 250;
      this.vy = 0;
      this.rotation = 0;
    },
    jump() {
      this.vy = JUMP_FORCE;
      window.soundCtrl.playFlap();
      spawnFartPuff(this.x - 12, this.y + 10);
    },
    update() {
      this.vy += GRAVITY;
      this.y += this.vy;

      // Rotation based on velocity
      if (this.vy < 0) {
        this.rotation = Math.max(-0.45, this.vy * 0.07);
      } else {
        this.rotation = Math.min(1.2, this.vy * 0.08);
      }

      // Ceiling hit
      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.vy = 0;
      }
    }
  };

  // Pipes & Particles Arrays
  let pipes = [];
  let particles = [];

  class Pipe {
    constructor(x) {
      this.x = x;
      this.width = PIPE_WIDTH;
      this.passed = false;
      // Top pipe height
      const minTop = 60;
      const maxTop = GAME_HEIGHT - GROUND_HEIGHT - PIPE_GAP - 60;
      this.topHeight = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
      this.bottomY = this.topHeight + PIPE_GAP;
      this.bottomHeight = GAME_HEIGHT - GROUND_HEIGHT - this.bottomY;
    }

    update() {
      this.x -= PIPE_SPEED;
    }

    draw(ctx) {
      // Draw Top Pipe
      Sprites.drawPipe(ctx, this.x, 0, this.width, this.topHeight, true);
      // Draw Bottom Pipe
      Sprites.drawPipe(ctx, this.x, this.bottomY, this.width, this.bottomHeight, false);
    }

    collides(player) {
      // Circle vs Box collision
      // Top pipe box: (this.x, 0, this.width, this.topHeight)
      if (circleRectOverlap(player.x, player.y, player.radius, this.x, 0, this.width, this.topHeight)) {
        return true;
      }
      // Bottom pipe box: (this.x, this.bottomY, this.width, this.bottomHeight)
      if (circleRectOverlap(player.x, player.y, player.radius, this.x, this.bottomY, this.width, this.bottomHeight)) {
        return true;
      }
      return false;
    }
  }

  function circleRectOverlap(cx, cy, r, rx, ry, rw, rh) {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    const distX = cx - closestX;
    const distY = cy - closestY;
    return (distX * distX + distY * distY) < (r * r);
  }

  // Particle System
  function spawnFartPuff(x, y) {
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: x + (Math.random() * 6 - 3),
        y: y + (Math.random() * 6 - 3),
        vx: -(Math.random() * 2 + 1.5),
        vy: (Math.random() * 2 - 1),
        size: Math.random() * 8 + 6,
        alpha: 0.8,
        color: Math.random() > 0.4 ? "#a0522d" : "#e0a96d",
        type: 'smoke'
      });
    }
  }

  function spawnScoreSparkles(x, y) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        alpha: 1,
        color: ['#ffd700', '#f1c40f', '#fff', '#f39c12'][Math.floor(Math.random() * 4)],
        type: 'sparkle'
      });
    }
  }

  function spawnDeathSplats(x, y) {
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 4,
        alpha: 1,
        color: Math.random() > 0.3 ? '#8d4c1f' : '#f1c40f',
        type: 'splat'
      });
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      if (p.type === 'smoke') {
        p.size += 0.3;
      }

      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles(ctx) {
    ctx.save();
    for (let p of particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Toast quotes
  function showToast(text) {
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = text;
    toastBanner.classList.remove('hidden');
    // Force DOM reflow to restart CSS animation
    void toastBanner.offsetWidth;
    toastTimer = setTimeout(() => {
      toastBanner.classList.add('hidden');
    }, 1200);
  }

  // Medals calculation
  function getMedalInfo(score) {
    if (score >= 50) return { text: "DIAMOND THRONE 💎", className: "medal-diamond" };
    if (score >= 30) return { text: "GOLDEN BIDET 🏆", className: "medal-gold" };
    if (score >= 15) return { text: "SILVER TOILET 🥈", className: "medal-silver" };
    if (score >= 5) return { text: "BRONZE PLUNGER 🥉", className: "medal-bronze" };
    return { text: "NONE 💩", className: "" };
  }

  // Game Flow Controls
  function initGame() {
    startHighScore.textContent = highScore;
    renderPreview();
    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    window.soundCtrl.init();
    currentState = STATES.PLAYING;
    score = 0;
    frameCount = 0;
    pipes = [];
    particles = [];
    turd.reset();
    turd.jump();

    scoreDisplay.textContent = '0';
    hud.classList.remove('hidden');
    startScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
  }

  function gameOver() {
    currentState = STATES.GAMEOVER;
    window.soundCtrl.playHit();
    window.soundCtrl.playFlush();
    spawnDeathSplats(turd.x, turd.y);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('flappy_turd_highscore', highScore.toString());
    }

    // Pick a random death quote
    const randomQuote = DEATH_QUOTES[Math.floor(Math.random() * DEATH_QUOTES.length)];
    deathQuote.textContent = randomQuote;

    finalScore.textContent = score;
    finalBestScore.textContent = highScore;

    const medal = getMedalInfo(score);
    medalDisplay.textContent = medal.text;
    medalDisplay.className = `medal-badge ${medal.className}`;

    hud.classList.add('hidden');
    gameoverScreen.classList.remove('hidden');
  }

  function handleAction() {
    if (currentState === STATES.START) {
      startGame();
    } else if (currentState === STATES.PLAYING) {
      turd.jump();
    }
  }

  // Render animated character on start screen preview card
  let previewFrame = 0;
  function renderPreview() {
    pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewFrame++;
    const bob = Math.sin(previewFrame * 0.08) * 4;
    Sprites.drawTurd(pCtx, previewCanvas.width / 2, previewCanvas.height / 2 + bob, 0, 1.25, previewFrame, false);
    if (currentState === STATES.START) {
      requestAnimationFrame(renderPreview);
    }
  }

  // Main Loop
  function gameLoop() {
    frameCount++;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 1. Draw Background
    const isSunset = (score >= 10 && (score % 20 >= 10));
    Sprites.drawBackground(ctx, GAME_WIDTH, GAME_HEIGHT, bgScroll, isSunset);

    if (currentState === STATES.PLAYING) {
      bgScroll += 0.8;
      groundScroll += PIPE_SPEED;

      // Update Turd
      turd.update();

      // Spawn pipes
      if (frameCount % PIPE_SPAWN_RATE === 0) {
        pipes.push(new Pipe(GAME_WIDTH + 20));
      }

      // Update and draw pipes
      for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.update();
        pipe.draw(ctx);

        // Score detection
        if (!pipe.passed && pipe.x + pipe.width < turd.x) {
          pipe.passed = true;
          score++;
          scoreDisplay.textContent = score;
          scoreDisplay.classList.add('score-bump');
          setTimeout(() => scoreDisplay.classList.remove('score-bump'), 200);

          window.soundCtrl.playScore();
          spawnScoreSparkles(pipe.x + pipe.width, pipe.topHeight + PIPE_GAP / 2);

          // Milestone quotes
          if (score % 5 === 0) {
            const quote = SCORE_QUOTES[Math.floor(Math.random() * SCORE_QUOTES.length)];
            showToast(quote);
            window.soundCtrl.playFanfare();
          }
        }

        // Collision detection
        if (pipe.collides(turd)) {
          gameOver();
          break;
        }

        // Remove offscreen pipes
        if (pipe.x + pipe.width < -20) {
          pipes.splice(i, 1);
        }
      }

      // Ground collision
      if (turd.y + turd.radius >= GAME_HEIGHT - GROUND_HEIGHT) {
        turd.y = GAME_HEIGHT - GROUND_HEIGHT - turd.radius;
        gameOver();
      }

      // Draw Turd
      Sprites.drawTurd(ctx, turd.x, turd.y, turd.rotation, 1, frameCount, false);

    } else if (currentState === STATES.START) {
      groundScroll += 1.2;
      bgScroll += 0.4;
      // Floating animation in center
      const idleY = 240 + Math.sin(frameCount * 0.08) * 12;
      Sprites.drawTurd(ctx, turd.x, idleY, 0, 1, frameCount, false);
    } else if (currentState === STATES.GAMEOVER) {
      // Draw remaining pipes static
      for (let pipe of pipes) {
        pipe.draw(ctx);
      }
      // Draw fallen/splatted turd
      if (turd.y + turd.radius < GAME_HEIGHT - GROUND_HEIGHT) {
        turd.y += 6;
      }
      Sprites.drawTurd(ctx, turd.x, turd.y, Math.PI / 2, 1, frameCount, true);
    }

    // Draw Particles
    updateParticles();
    drawParticles(ctx);

    // Draw Ground
    Sprites.drawGround(ctx, GAME_WIDTH, GAME_HEIGHT, GROUND_HEIGHT, groundScroll);

    requestAnimationFrame(gameLoop);
  }

  // Event Listeners
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      handleAction();
    }
  });

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    handleAction();
  });

  btnStart.addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
  });

  btnRestart.addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
  });

  btnShare.addEventListener('click', (e) => {
    e.stopPropagation();
    const shareText = `I scored ${score} in Flappy Turd with the golden comb-over wig! Can you beat my high score? 💩👑`;
    if (navigator.share) {
      navigator.share({
        title: 'Flappy Turd',
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
        showToast("COPIED TO CLIPBOARD!");
      });
    }
  });

  btnAudio.addEventListener('click', (e) => {
    e.stopPropagation();
    window.soundCtrl.init();
    const muted = window.soundCtrl.toggleMute();
    audioIcon.textContent = muted ? '🔇' : '🔊';
  });

  // Start initialization
  initGame();
})();
