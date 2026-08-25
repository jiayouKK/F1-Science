(function (global) {
  const GHS_RED = '#e2231a';

  function diamond(inner) {
    return `<polygon points="24,2.2 45.8,24 24,45.8 2.2,24" fill="#fff" stroke="${GHS_RED}" stroke-width="2.8"/>${inner}`;
  }

  const ICONS = {
    flammable: diamond(`
      <path d="M24 39c-6.2 0-10.5-4.6-10.5-10.4 0-4.2 2.2-7.4 4.6-10.6 1.4 3.2 3.4 4.8 5.6 4.8C23.4 14 27 8.2 30.2 4.5c.6 6.2 5.6 10.8 5.6 17.6 0 8.2-5.2 16.9-11.8 16.9z" fill="#1a1a18"/>
      <path d="M22.5 33c-2.2 0-3.8-1.7-3.8-3.8 0-1.6.8-2.8 1.8-4 .6 1.2 1.4 1.8 2.4 1.8.2-2.6 1.6-4.6 3-6.2.2 2.4 2.2 4.2 2.2 6.6 0 3.2-2.2 5.6-5.6 5.6z" fill="#fff"/>
    `),
    toxic: diamond(`
      <circle cx="24" cy="18" r="7.2" fill="#1a1a18"/>
      <circle cx="21.2" cy="17.2" r="1.7" fill="#fff"/>
      <circle cx="26.8" cy="17.2" r="1.7" fill="#fff"/>
      <path d="M24 20.2 L22.6 23.4 L25.4 23.4 Z" fill="#fff"/>
      <rect x="21.6" y="23.2" width="4.8" height="2.2" rx="0.6" fill="#1a1a18"/>
      <g fill="#1a1a18">
        <rect x="8" y="29.2" width="15" height="3.2" rx="1.4" transform="rotate(32 15.5 30.8)"/>
        <rect x="8" y="29.2" width="15" height="3.2" rx="1.4" transform="rotate(-32 15.5 30.8)"/>
        <rect x="25" y="29.2" width="15" height="3.2" rx="1.4" transform="rotate(32 32.5 30.8)"/>
        <rect x="25" y="29.2" width="15" height="3.2" rx="1.4" transform="rotate(-32 32.5 30.8)"/>
      </g>
    `),
    corrosive: diamond(`
      <path d="M11 10 h10 v4 l-3 1.2 v6" fill="none" stroke="#1a1a18" stroke-width="2" stroke-linejoin="round"/>
      <path d="M14 22 l-2 6" stroke="#1a1a18" stroke-width="1.6"/>
      <path d="M6 29 h14 l-2 5 h-10 z" fill="#1a1a18"/>
      <path d="M28 10 h10 v4 l3 1.2 v5" fill="none" stroke="#1a1a18" stroke-width="2" stroke-linejoin="round"/>
      <path d="M38 21 l3 5" stroke="#1a1a18" stroke-width="1.6"/>
      <path d="M27 28 h16 v3 l-4 6 h-8 z" fill="#1a1a18"/>
      <path d="M31 37 l1.5 4 M36 37 l1.5 4" stroke="#1a1a18" stroke-width="1.4"/>
    `),
    irritant: diamond(`
      <rect x="21.2" y="9" width="5.6" height="20" rx="2.8" fill="#1a1a18"/>
      <circle cx="24" cy="35.2" r="3.1" fill="#1a1a18"/>
    `),
    explosive: diamond(`
      <circle cx="20" cy="28" r="6.2" fill="#1a1a18"/>
      <path d="M20 22 L17 8 M25 23 L37 12 M26 28 L42 27 M25 32 L36 40 M19 34 L13 43 M14 27 L5 24 M15 32 L6 36" stroke="#1a1a18" stroke-width="2" stroke-linecap="round"/>
    `),
    radioactive: `
      <circle cx="24" cy="24" r="21.5" fill="#ffde17" stroke="#1a1a18" stroke-width="1.8"/>
      <circle cx="24" cy="24" r="4.2" fill="#1a1a18"/>
      <path d="M24 24 L16.2 8.4 A18 18 0 0 1 31.8 8.4 Z" fill="#1a1a18"/>
      <path d="M24 24 L39.6 32.6 A18 18 0 0 1 24 41.5 Z" fill="#1a1a18"/>
      <path d="M24 24 L8.4 32.6 A18 18 0 0 1 16.2 8.4 Z" fill="#1a1a18"/>
    `
  };

  function el(html) {
    const t = document.createElement('div');
    t.innerHTML = html.trim();
    return t.firstElementChild;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function shell(title, body) {
    return `<div class="game-box">
      <div class="game-kicker">Mini-game</div>
      <div class="game-title">${title}</div>
      <div class="game-body"></div>
    </div>`;
  }

  function takeaway(text) {
    return `<p class="game-takeaway">${text}</p>`;
  }

  function ghsIcon(kind, size) {
    size = size || 52;
    return `<svg class="ghs-icon" width="${size}" height="${size}" viewBox="0 0 48 48" role="img" aria-hidden="true">${ICONS[kind]}</svg>`;
  }

  function match(mount, opts) {
    const root = el(shell(opts.title));
    const body = root.querySelector('.game-body');
    mount.appendChild(root);
    const items = opts.items.slice();
    let i = 0;
    let score = 0;

    function render() {
      if (i >= items.length) {
        body.innerHTML = `<div class="game-score">Got ${score} / ${items.length}</div>${takeaway(opts.takeaway)}`;
        return;
      }
      const item = items[i];
      const labels = shuffle(opts.choices || items.map(x => x.answer));
      body.innerHTML = `
        <div class="game-meta">Round ${i + 1} / ${items.length}</div>
        <div class="game-prompt">${item.prompt}</div>
        <div class="game-opts"></div>
        <p class="game-fb" hidden></p>
      `;
      const optWrap = body.querySelector('.game-opts');
      const fb = body.querySelector('.game-fb');
      labels.forEach(label => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'game-opt';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          const ok = label === item.answer;
          if (ok) score++;
          fb.hidden = false;
          fb.className = 'game-fb ' + (ok ? 'ok' : 'bad');
          fb.textContent = ok ? 'Correct.' : `Answer: ${item.answer}`;
          optWrap.querySelectorAll('button').forEach(b => { b.disabled = true; });
          btn.classList.add(ok ? 'is-ok' : 'is-bad');
          setTimeout(() => { i++; render(); }, ok ? 550 : 900);
        });
        optWrap.appendChild(btn);
      });
    }
    render();
  }

  function order(mount, opts) {
    const root = el(shell(opts.title));
    const body = root.querySelector('.game-body');
    mount.appendChild(root);
    const correct = opts.items.slice();
    let pool = shuffle(correct);
    let picked = [];

    function render() {
      body.innerHTML = `
        <p class="game-prompt">${opts.prompt || 'Tap in the exam order.'}</p>
        <div class="order-picked"></div>
        <div class="order-pool"></div>
        <div class="game-actions"></div>
        <p class="game-fb" hidden></p>
      `;
      const pickedEl = body.querySelector('.order-picked');
      const poolEl = body.querySelector('.order-pool');
      const actions = body.querySelector('.game-actions');
      const fb = body.querySelector('.game-fb');

      if (!picked.length) {
        pickedEl.innerHTML = '<span class="order-placeholder">Your order appears here</span>';
      } else {
        picked.forEach((name, idx) => {
          const chip = document.createElement('span');
          chip.className = 'order-chip on';
          chip.textContent = `${idx + 1}. ${name}`;
          pickedEl.appendChild(chip);
        });
      }

      pool.forEach(name => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'game-opt';
        btn.textContent = name;
        btn.addEventListener('click', () => {
          picked.push(name);
          pool = pool.filter(n => n !== name);
          render();
        });
        poolEl.appendChild(btn);
      });

      if (picked.length) {
        const undo = document.createElement('button');
        undo.type = 'button';
        undo.className = 'game-opt ghost';
        undo.textContent = 'Undo';
        undo.addEventListener('click', () => {
          pool.push(picked.pop());
          render();
        });
        actions.appendChild(undo);
      }

      if (picked.length === correct.length) {
        const check = document.createElement('button');
        check.type = 'button';
        check.className = 'game-opt primary';
        check.textContent = 'Check';
        check.addEventListener('click', () => {
          const ok = picked.every((n, idx) => n === correct[idx]);
          fb.hidden = false;
          fb.className = 'game-fb ' + (ok ? 'ok' : 'bad');
          fb.textContent = ok ? 'Correct order.' : `Exam order: ${correct.join(' → ')}`;
          if (ok) body.insertAdjacentHTML('beforeend', takeaway(opts.takeaway));
        });
        actions.appendChild(check);
      }
    }
    render();
  }

  function sprint(mount, opts) {
    const root = el(shell(opts.title));
    const body = root.querySelector('.game-body');
    mount.appendChild(root);
    const qs = opts.questions;
    const seconds = opts.seconds || 45;
    let i = 0;
    let score = 0;
    let left = seconds;
    let timerId;

    function finish() {
      clearInterval(timerId);
      body.innerHTML = `<div class="game-score">Got ${score} / ${qs.length} · ${left}s left</div>${takeaway(opts.takeaway)}`;
    }

    function renderQ() {
      if (i >= qs.length) { finish(); return; }
      const q = qs[i];
      body.innerHTML = `
        <div class="game-meta"><span>Q${i + 1} / ${qs.length}</span><span class="game-timer">${left}s</span></div>
        <div class="game-prompt">${q.q}</div>
        <div class="game-opts"></div>
        <p class="game-fb" hidden></p>
      `;
      const fb = body.querySelector('.game-fb');
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'game-opt';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          const ok = idx === q.correct;
          if (ok) score++;
          fb.hidden = false;
          fb.className = 'game-fb ' + (ok ? 'ok' : 'bad');
          fb.textContent = ok ? 'Correct.' : (q.explain || `Answer: ${q.options[q.correct]}`);
          body.querySelectorAll('.game-opt').forEach(b => { b.disabled = true; });
          btn.classList.add(ok ? 'is-ok' : 'is-bad');
          setTimeout(() => { i++; renderQ(); }, 700);
        });
        body.querySelector('.game-opts').appendChild(btn);
      });
    }

    timerId = setInterval(() => {
      left -= 1;
      const t = body.querySelector('.game-timer');
      if (t) t.textContent = left + 's';
      if (left <= 0) finish();
    }, 1000);
    renderQ();
  }

  function meter(mount, opts) {
    const root = el(shell(opts.title || 'Turn the thimble'));
    const body = root.querySelector('.game-body');
    mount.appendChild(root);
    body.innerHTML = `
      <p class="game-prompt">Drag the thimble. Sleeve = last exposed 0.5 mm mark. Thimble = 0.01 mm each.</p>
      <div class="meter-svg"></div>
      <input class="meter-range" type="range" min="0" max="1000" value="388" step="1" aria-label="Micrometer opening">
      <div class="meter-readout"></div>
      ${takeaway(opts.takeaway)}
    `;
    const svgWrap = body.querySelector('.meter-svg');
    const range = body.querySelector('.meter-range');
    const readout = body.querySelector('.meter-readout');

    function draw(hundredths) {
      const total = hundredths / 100;
      const sleeve = Math.floor(total / 0.5) * 0.5;
      const thimble = Math.round((total - sleeve) * 100);
      const sleeveShown = sleeve.toFixed(2);
      readout.innerHTML = `Sleeve <strong>${sleeveShown} mm</strong> + Thimble <strong>${thimble} × 0.01</strong> = <strong>${total.toFixed(2)} mm</strong>`;

      const sleeveEnd = 70 + sleeve * 28;
      const thimbleShift = (thimble / 50) * 10;
      svgWrap.innerHTML = `
        <svg width="100%" viewBox="0 0 420 150" role="img">
          <title>Interactive screw gauge</title>
          <path d="M28 28 C6 75 6 75 28 122" fill="none" stroke="#3d3d3a" stroke-width="14" stroke-linecap="round"/>
          <rect x="28" y="68" width="16" height="14" fill="#6b6a63"/>
          <text x="36" y="62" font-size="9" text-anchor="middle" fill="#6b6a63">Anvil</text>
          <circle cx="54" cy="75" r="8" fill="#f0dcc0" stroke="#c7c5ba"/>
          <rect x="62" y="70" width="48" height="10" fill="#8a8983"/>
          <text x="86" y="62" font-size="9" text-anchor="middle" fill="#6b6a63">Spindle</text>
          <rect x="108" y="58" width="118" height="34" fill="#e8e5da" stroke="#3d3d3a" stroke-width="1.2"/>
          <text x="160" y="52" font-size="9" text-anchor="middle" fill="#6b6a63">Sleeve</text>
          <line x1="118" y1="75" x2="220" y2="75" stroke="#1a1a18" stroke-width="1"/>
          ${[0,1,2,3,4,5].map(n => {
            const x = 120 + n * 16;
            return `<line x1="${x}" y1="75" x2="${x}" y2="86" stroke="#1a1a18" stroke-width="1"/><text x="${x}" y="96" font-size="8" text-anchor="middle">${n}</text>
            <line x1="${x+8}" y1="64" x2="${x+8}" y2="75" stroke="#1a1a18" stroke-width="0.8"/>`;
          }).join('')}
          <rect x="${sleeveEnd}" y="50" width="88" height="50" rx="4" fill="#d3cfc2" stroke="#3d3d3a" stroke-width="1.2"/>
          <text x="${sleeveEnd + 44}" y="44" font-size="9" text-anchor="middle" fill="#6b6a63">Thimble</text>
          ${[0,10,20,30,40,50].map((n, idx) => {
            const y = 58 + ((idx + thimbleShift * 0.15) % 6) * 6;
            return `<line x1="${sleeveEnd}" y1="${y}" x2="${sleeveEnd + 10}" y2="${y}" stroke="#1a1a18" stroke-width="0.7"/>`;
          }).join('')}
          <text x="${sleeveEnd + 18}" y="78" font-size="11" fill="#d43b2e" font-weight="600">${thimble}</text>
          <rect x="${sleeveEnd + 88}" y="58" width="22" height="34" rx="11" fill="#c4c0b3" stroke="#3d3d3a"/>
          <text x="${sleeveEnd + 99}" y="108" font-size="8" text-anchor="middle" fill="#6b6a63">Ratchet</text>
          <rect x="200" y="52" width="10" height="10" fill="#b7b3a6" stroke="#3d3d3a"/>
          <text x="205" y="48" font-size="8" text-anchor="middle" fill="#6b6a63">Lock</text>
        </svg>
      `;
    }

    range.addEventListener('input', () => draw(Number(range.value)));
    draw(Number(range.value));
  }

  function attachProgress() {
    const sections = [...document.querySelectorAll('.section')];
    if (!sections.length) return;
    const bar = document.createElement('div');
    bar.className = 'cram-progress';
    bar.innerHTML = '<span class="cram-progress-fill"></span><span class="cram-progress-text"></span>';
    const wrap = document.querySelector('.wrap');
    wrap.insertBefore(bar, wrap.firstChild);
    const update = () => {
      let idx = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.42) idx = i;
      });
      bar.querySelector('.cram-progress-text').textContent = `第 ${idx + 1} / ${sections.length} 节`;
      bar.querySelector('.cram-progress-fill').style.width = ((idx + 1) / sections.length * 100) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  global.Games = { ghsIcon, match, order, sprint, meter, attachProgress };
})(window);
