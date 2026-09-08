  /* ===== ستاره‌های سه‌بعدی پرنده ===== */
      const starCanvas = document.getElementById("stars");
      const sctx = starCanvas.getContext("2d");
      let SW, SH;
      function resizeStars() {
        SW = starCanvas.width = innerWidth;
        SH = starCanvas.height = innerHeight;
      }
      resizeStars();
      addEventListener("resize", resizeStars);

      const NUM_STARS = 400;
      const stars = [];
      for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 2000,
          z: Math.random() * 2000,
        });
      }

      function drawStars() {
        sctx.fillStyle = "rgba(0,0,0,0.4)";
        sctx.fillRect(0, 0, SW, SH);
        sctx.save();
        sctx.translate(SW / 2, SH / 2);
        stars.forEach((s) => {
          s.z -= 6;
          if (s.z <= 0) {
            s.x = (Math.random() - 0.5) * 2000;
            s.y = (Math.random() - 0.5) * 2000;
            s.z = 2000;
          }
          const k = 128 / s.z;
          const px = s.x * k + SW / 2 - SW / 2;
          const py = s.y * k;
          const size = Math.max((1 - s.z / 2000) * 3, 0.3);
          sctx.beginPath();
          sctx.arc(px, py, size, 0, Math.PI * 2);
          sctx.fillStyle = `rgba(255,255,255,${1 - s.z / 2000})`;
          sctx.fill();
        });
        sctx.restore();
        requestAnimationFrame(drawStars);
      }
      drawStars();

      /* ===== بارش ماتریکسی ===== */
      const mCanvas = document.getElementById("matrix");
      const mctx = mCanvas.getContext("2d");
      let MW, MH, columns, drops;
      const glyphs = "アカサタナハマヤラワ0123456789ABCDEF";

      function resizeMatrix() {
        MW = mCanvas.width = innerWidth;
        MH = mCanvas.height = innerHeight;
        columns = Math.floor(MW / 16);
        drops = Array(columns).fill(0);
      }
      resizeMatrix();
      addEventListener("resize", resizeMatrix);

      setInterval(() => {
        mctx.fillStyle = "rgba(0,0,0,0.08)";
        mctx.fillRect(0, 0, MW, MH);
        mctx.font = "16px monospace";
        for (let i = 0; i < columns; i++) {
          const char = glyphs[Math.floor(Math.random() * glyphs.length)];
          mctx.fillStyle = Math.random() > 0.975 ? "#c8ffc8" : "#0f0";
          mctx.fillText(char, i * 16, drops[i] * 16);
          if (drops[i] * 16 > MH && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }, 50);

      /* ===== صدای تایپ (WebAudio - بدون فایل!) ===== */
      let audioCtx = null;
      document.addEventListener("click", () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }, { once: false });

      function typeSound() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.value = 800 + Math.random() * 600;
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      }

      function deleteSound() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.value = 300 + Math.random() * 100;
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }

      /* ===== تایپ‌رایتر ===== */
      const txt = document.getElementById("txt");
      const arr = [
        "hi everyone im negar",
        "im best student in the around the world",
        "im the best gerl with my family",
        "also im besti friends all of them",
      ];
      let line = 0;
      let step = 0;
      let deleting = false;

      setInterval(() => {
        const full = arr[line];
        if (!deleting) {
          txt.innerText = full.substring(0, ++step);
          typeSound();
          if (step > full.length + 15) {
            deleting = true;
            // لرزش موقع شروع پاک کردن
            document.body.classList.add("shake");
            setTimeout(() => document.body.classList.remove("shake"), 300);
          }
        } else {
          txt.innerText = full.substring(0, --step);
          deleteSound();
          if (step === 0) {
            deleting = false;
            line = (line + 1) % arr.length;
          }
        }
      }, 70);