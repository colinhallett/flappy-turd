// Procedural Vector Sprite & Background Renderer for Flappy Turd

const Sprites = {
  // Draw the Flappy Turd character
  drawTurd(ctx, x, y, rotation = 0, scale = 1, frame = 0, isDead = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    // Subtle breathing / bobbing
    const hairWiggle = Math.sin(frame * 0.2) * 3;
    const flapBounce = Math.cos(frame * 0.3) * 2;

    // 1. POOP BODY (Layered swirls)
    // Bottom coil
    ctx.fillStyle = "#6d3916";
    ctx.beginPath();
    ctx.ellipse(0, 12, 22, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#401c06";
    ctx.stroke();

    // Middle coil
    ctx.fillStyle = "#7e421a";
    ctx.beginPath();
    ctx.ellipse(0, 0, 19, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Top swirl
    ctx.fillStyle = "#8d4c1f";
    ctx.beginPath();
    ctx.ellipse(2, -10, 14, 9, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Swirl tip
    ctx.fillStyle = "#8d4c1f";
    ctx.beginPath();
    ctx.moveTo(7, -15);
    ctx.quadraticCurveTo(15, -22, 9, -27);
    ctx.quadraticCurveTo(2, -22, -1, -16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shiny specular highlights on poop
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.ellipse(-8, 9, 7, 3, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-7, -1, 6, 2.5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 2. RED POWER TIE
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(-1, 8);
    ctx.lineTo(5, 8);
    ctx.lineTo(8, 26 + flapBounce);
    ctx.lineTo(2, 30 + flapBounce);
    ctx.lineTo(-4, 26 + flapBounce);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#962d22";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Collar
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-5, 7);
    ctx.lineTo(0, 11);
    ctx.lineTo(5, 7);
    ctx.lineTo(2, 5);
    ctx.lineTo(-2, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. EYES & EXPRESSION
    if (isDead) {
      // X eyes
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      // Left eye X
      ctx.beginPath();
      ctx.moveTo(3, -5); ctx.lineTo(11, 3);
      ctx.moveTo(11, -5); ctx.lineTo(3, 3);
      ctx.stroke();
      // Right eye X
      ctx.beginPath();
      ctx.moveTo(13, -5); ctx.lineTo(21, 3);
      ctx.moveTo(21, -5); ctx.lineTo(13, 3);
      ctx.stroke();

      // Open shocked O mouth
      ctx.fillStyle = "#2c0e00";
      ctx.beginPath();
      ctx.arc(12, 10, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#401c06";
      ctx.stroke();
    } else {
      // Big lively eyes
      // Left Eye
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(6, -2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#331200";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Right Eye
      ctx.beginPath();
      ctx.arc(16, -2, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pupils (looking forward/cocky)
      ctx.fillStyle = "#1e3799"; // Patriotic blue eyes
      ctx.beginPath();
      ctx.arc(8, -2, 3, 0, Math.PI * 2);
      ctx.arc(18, -2, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Pupil highlights
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(7, -3, 1.2, 0, Math.PI * 2);
      ctx.arc(17, -3, 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Golden raised eyebrows
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(2, -9);
      ctx.lineTo(10, -7);
      ctx.moveTo(14, -7);
      ctx.lineTo(21, -8);
      ctx.stroke();

      // Smirking confident mouth
      ctx.strokeStyle = "#3b1704";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(6, 7);
      ctx.quadraticCurveTo(12, 11, 18, 6);
      ctx.stroke();

      // Rosy tan/bronzer cheek
      ctx.fillStyle = "rgba(230, 126, 34, 0.45)";
      ctx.beginPath();
      ctx.ellipse(3, 3, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. SIGNATURE BLOND / GOLDEN COMBOVER WIG
    // Hair base / shadow
    ctx.fillStyle = "#d4ac0d";
    ctx.beginPath();
    ctx.moveTo(-12, -10);
    ctx.quadraticCurveTo(-8, -32 + hairWiggle, 16, -24 + hairWiggle);
    ctx.quadraticCurveTo(28, -20, 24, -8);
    ctx.quadraticCurveTo(15, -12, 0, -10);
    ctx.closePath();
    ctx.fill();

    // Main golden hair volume (swooping forward)
    const hairGrad = ctx.createLinearGradient(-15, -35, 25, -10);
    hairGrad.addColorStop(0, "#ffeaa7");
    hairGrad.addColorStop(0.4, "#f1c40f");
    hairGrad.addColorStop(0.8, "#f39c12");
    hairGrad.addColorStop(1, "#d68910");

    ctx.fillStyle = hairGrad;
    ctx.beginPath();
    // Back swoop
    ctx.moveTo(-16, -8);
    ctx.bezierCurveTo(-20, -26 + hairWiggle, -6, -36 + hairWiggle, 14, -30 + hairWiggle);
    // Front billow (iconic sweep)
    ctx.bezierCurveTo(32, -26 + hairWiggle, 30, -14, 22, -8);
    ctx.bezierCurveTo(14, -14, 2, -12, -4, -11);
    ctx.closePath();
    ctx.fill();

    // Hair outline
    ctx.strokeStyle = "#b7950b";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Detailed strands / highlights
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-10, -20 + hairWiggle);
    ctx.bezierCurveTo(0, -32 + hairWiggle, 15, -28 + hairWiggle, 26, -18);
    ctx.moveTo(-6, -14);
    ctx.bezierCurveTo(4, -24 + hairWiggle, 18, -22 + hairWiggle, 24, -12);
    ctx.stroke();

    // Additional hair strand texture
    ctx.strokeStyle = "#e67e22";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-12, -14);
    ctx.bezierCurveTo(-2, -28 + hairWiggle, 12, -25 + hairWiggle, 20, -15);
    ctx.stroke();

    // 5. TINY FLAPPING WINGS (or little cartoon hand)
    ctx.fillStyle = "#8d4c1f";
    ctx.beginPath();
    const wingAngle = Math.sin(frame * 0.6) * 12;
    ctx.ellipse(-14, 2 + wingAngle * 0.3, 7, 4, -0.4 + (wingAngle * 0.05), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#401c06";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  },

  // Draw Golden Tower / Luxury Pipe Obstacle
  drawPipe(ctx, x, y, width, height, isTop = false) {
    ctx.save();

    // Gold gradient for pipe body
    const goldGrad = ctx.createLinearGradient(x, 0, x + width, 0);
    goldGrad.addColorStop(0, "#996515");
    goldGrad.addColorStop(0.2, "#f1c40f");
    goldGrad.addColorStop(0.5, "#fff2a1");
    goldGrad.addColorStop(0.8, "#f39c12");
    goldGrad.addColorStop(1, "#7d4900");

    // Pipe stem
    ctx.fillStyle = goldGrad;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "#573500";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x, y, width, height);

    // Decorative vertical gold fluting
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width * 0.35, y);
    ctx.lineTo(x + width * 0.35, y + height);
    ctx.moveTo(x + width * 0.5, y);
    ctx.lineTo(x + width * 0.5, y + height);
    ctx.stroke();

    // Pipe Cap / Crown Lip
    const capHeight = 28;
    const capOverhang = 6;
    const capX = x - capOverhang;
    const capWidth = width + capOverhang * 2;
    const capY = isTop ? (y + height - capHeight) : y;

    const capGrad = ctx.createLinearGradient(capX, 0, capX + capWidth, 0);
    capGrad.addColorStop(0, "#b78727");
    capGrad.addColorStop(0.3, "#fce881");
    capGrad.addColorStop(0.6, "#ffd700");
    capGrad.addColorStop(1, "#6b4403");

    ctx.fillStyle = capGrad;
    ctx.fillRect(capX, capY, capWidth, capHeight);
    ctx.strokeStyle = "#4d3000";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(capX, capY, capWidth, capHeight);

    // Embossed "TRUMP" / "GOLD" style crest line on cap
    ctx.fillStyle = "#874b00";
    ctx.fillRect(capX + 4, capY + capHeight / 2 - 2, capWidth - 8, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(capX + 6, capY + capHeight / 2 - 1, capWidth - 12, 2);

    ctx.restore();
  },

  // Draw Background with Luxury City Skyline & Golden Clouds
  drawBackground(ctx, width, height, bgScroll, isSunset = false) {
    ctx.save();

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (isSunset) {
      skyGrad.addColorStop(0, "#2c1654");
      skyGrad.addColorStop(0.4, "#8e44ad");
      skyGrad.addColorStop(0.7, "#d35400");
      skyGrad.addColorStop(1, "#f39c12");
    } else {
      skyGrad.addColorStop(0, "#2980b9");
      skyGrad.addColorStop(0.4, "#6dd5fa");
      skyGrad.addColorStop(0.8, "#bbf2f6");
      skyGrad.addColorStop(1, "#f8c291");
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Far Skyline / Golden Skyscraper Silhouettes (Parallax slow)
    const farScroll = (bgScroll * 0.2) % 300;
    ctx.fillStyle = isSunset ? "rgba(44, 22, 84, 0.4)" : "rgba(100, 150, 200, 0.35)";
    for (let i = -1; i < 4; i++) {
      const baseX = i * 160 - farScroll;
      // Tall tower
      ctx.fillRect(baseX, height - 260, 45, 180);
      ctx.fillRect(baseX + 45, height - 220, 35, 140);
      ctx.fillRect(baseX + 80, height - 300, 50, 220);
      // Spire
      ctx.beginPath();
      ctx.moveTo(baseX + 105, height - 330);
      ctx.lineTo(baseX + 100, height - 300);
      ctx.lineTo(baseX + 110, height - 300);
      ctx.fill();
    }

    // 3. Near Skyline with lit windows (Parallax medium)
    const nearScroll = (bgScroll * 0.5) % 240;
    ctx.fillStyle = isSunset ? "#1b1429" : "#2c3e50";
    for (let i = -1; i < 4; i++) {
      const baseX = i * 140 - nearScroll;
      ctx.fillRect(baseX, height - 190, 55, 120);
      ctx.fillRect(baseX + 60, height - 230, 40, 160);
      ctx.fillRect(baseX + 105, height - 170, 30, 100);

      // Windows
      ctx.fillStyle = "#f1c40f";
      for (let wY = height - 180; wY < height - 80; wY += 16) {
        ctx.fillRect(baseX + 8, wY, 6, 8);
        ctx.fillRect(baseX + 22, wY, 6, 8);
        ctx.fillRect(baseX + 36, wY, 6, 8);
      }
      ctx.fillStyle = isSunset ? "#1b1429" : "#2c3e50";
    }

    // 4. Clouds (Fluffy golden/white clouds)
    const cloudScroll = (bgScroll * 0.35) % 350;
    ctx.fillStyle = isSunset ? "rgba(255, 200, 150, 0.5)" : "rgba(255, 255, 255, 0.75)";
    for (let i = -1; i < 3; i++) {
      const cx = i * 180 - cloudScroll;
      this.drawCloud(ctx, cx, 80, 0.8);
      this.drawCloud(ctx, cx + 90, 140, 0.6);
    }

    ctx.restore();
  },

  drawCloud(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(18, -8, 24, 0, Math.PI * 2);
    ctx.arc(38, 0, 18, 0, Math.PI * 2);
    ctx.arc(18, 10, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  // Draw Ground / Luxury Marble Plinth
  drawGround(ctx, width, height, groundHeight, groundScroll) {
    ctx.save();
    const gY = height - groundHeight;

    // Ground base
    ctx.fillStyle = "#d35400";
    ctx.fillRect(0, gY, width, groundHeight);

    // Top gold rim
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(0, gY, width, 12);
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(0, gY, width, 4);

    // Diagonal warning / luxury chevrons
    const patternWidth = 24;
    const offset = groundScroll % patternWidth;
    ctx.fillStyle = "#b54200";
    for (let x = -patternWidth; x < width + patternWidth; x += patternWidth) {
      ctx.beginPath();
      ctx.moveTo(x - offset, gY + 12);
      ctx.lineTo(x + 12 - offset, gY + 12);
      ctx.lineTo(x - offset, gY + groundHeight);
      ctx.lineTo(x - 12 - offset, gY + groundHeight);
      ctx.fill();
    }

    // Border line
    ctx.strokeStyle = "#4a1c02";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, gY);
    ctx.lineTo(width, gY);
    ctx.stroke();

    ctx.restore();
  }
};

window.Sprites = Sprites;
