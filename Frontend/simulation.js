// ─────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────
function colorMix(hex1, hex2, t) {
  const r1=parseInt(hex1.slice(1,3),16), g1=parseInt(hex1.slice(3,5),16), b1=parseInt(hex1.slice(5,7),16);
  const r2=parseInt(hex2.slice(1,3),16), g2=parseInt(hex2.slice(3,5),16), b2=parseInt(hex2.slice(5,7),16);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

function animateDrop(dropId, fromCy, toCy, color, onComplete) {
  const drop = document.getElementById(dropId);
  if (!drop) { if (onComplete) onComplete(); return; }
  drop.setAttribute('cy', fromCy);
  drop.setAttribute('r', '4.5');
  drop.setAttribute('fill', color);
  drop.setAttribute('opacity', '1');
  let cy = fromCy;
  const speed = 5;
  function step() {
    cy += speed;
    drop.setAttribute('cy', cy);
    if (cy < toCy) {
      requestAnimationFrame(step);
    } else {
      // Splash: shrink and fade
      let r = 4.5, op = 1;
      function splash() {
        r += 1.5; op -= 0.18;
        drop.setAttribute('r', r.toFixed(1));
        drop.setAttribute('opacity', op.toFixed(2));
        if (op > 0) requestAnimationFrame(splash);
        else { drop.setAttribute('opacity', '0'); drop.setAttribute('r', '4.5'); if (onComplete) onComplete(); }
      }
      requestAnimationFrame(splash);
    }
  }
  requestAnimationFrame(step);
}

function updateBurette(liquidId, drops, maxDrops) {
  const bur = document.getElementById(liquidId);
  if (!bur) return;
  const maxH = 90, minH = 2;
  const h = Math.max(minH, maxH - (drops / maxDrops) * (maxH - minH));
  bur.setAttribute('height', h.toFixed(1));
  bur.setAttribute('y', (37 + (maxH - h)).toFixed(1));
}

// ─────────────────────────────────────────
// EXPERIMENT 1 — EDTA Hardness Test
// ─────────────────────────────────────────
let e1Drops = 0;
const E1_MAX = 15;

function addEdtaDrop() {
  if (e1Drops >= E1_MAX) return;
  document.getElementById('e1-btn').disabled = true;

  animateDrop('e1-drop', 166, 212, 'rgba(80,180,255,0.82)', function() {
    e1Drops++;
    document.getElementById('e1-drops').textContent = e1Drops;

    const t = e1Drops / E1_MAX;
    updateBurette('e1-burette-liquid', e1Drops, E1_MAX);

    // Color: wine red → purple → sky blue
    let liqColor;
    if (t < 0.55) {
      liqColor = colorMix('#8b3060', '#6a40a8', t / 0.55);
    } else {
      liqColor = colorMix('#6a40a8', '#40b8e0', (t - 0.55) / 0.45);
    }
    document.getElementById('e1-liquid').setAttribute('fill', liqColor);
    document.getElementById('e1-vol-text').textContent = (e1Drops * 0.5).toFixed(2) + ' mL EDTA added';

    const status = document.getElementById('e1-status');
    if (e1Drops >= E1_MAX) {
      status.style.background = '#c8f0ff';
      status.style.color = '#064878';
      status.textContent = '✓ ENDPOINT REACHED — Sky blue (Ca²⁺/Mg²⁺ fully complexed by EDTA)';
      status.classList.add('endpoint-flash');
      const btn = document.getElementById('e1-btn');
      btn.textContent = '✓ Endpoint reached';
      btn.disabled = true;
    } else if (t > 0.55) {
      status.style.background = '#e8d8f8';
      status.style.color = '#4428a0';
      status.textContent = 'Nearing endpoint — violet-purple shift (few drops remaining)';
      document.getElementById('e1-btn').disabled = false;
    } else {
      status.style.background = '#f0dce8';
      status.style.color = '#701848';
      status.textContent = 'Reacting... wine red fading (Ca²⁺/Mg²⁺ being complexed)';
      document.getElementById('e1-btn').disabled = false;
    }
  });
}

function resetExp1() {
  e1Drops = 0;
  document.getElementById('e1-drops').textContent = '0';
  document.getElementById('e1-liquid').setAttribute('fill', '#8b3060');
  document.getElementById('e1-vol-text').textContent = '0.00 mL EDTA added';
  const bur = document.getElementById('e1-burette-liquid');
  bur.setAttribute('height', '90'); bur.setAttribute('y', '37');
  const status = document.getElementById('e1-status');
  status.style.background = '#f8e8f0'; status.style.color = '#7a1050';
  status.textContent = 'Wine red — EBT complexed with Ca²⁺/Mg²⁺';
  status.classList.remove('endpoint-flash');
  const btn = document.getElementById('e1-btn');
  btn.disabled = false; btn.textContent = '+ Add EDTA drop';
}

// ─────────────────────────────────────────
// EXPERIMENT 2 — Residual Chlorine (DPD)
// ─────────────────────────────────────────
let e2Drops = 0;
const E2_MAX = 5;

function addDpdDrop() {
  if (e2Drops >= E2_MAX) return;
  document.getElementById('e2-btn').disabled = true;

  animateDrop('e2-drop', 164, 214, 'rgba(255,80,130,0.88)', function() {
    e2Drops++;
    document.getElementById('e2-drops').textContent = e2Drops;

    const t = e2Drops / E2_MAX;
    // colorless → pink → deep pink
    const r = Math.round(235 + 20 * t);
    const g = Math.round(245 - 140 * t);
    const b = Math.round(255 - 115 * t);
    const a = 0.12 + 0.72 * t;
    document.getElementById('e2-liquid').setAttribute('fill', `rgba(${r},${g},${b},${a})`);
    document.getElementById('e2-vol-text').textContent = e2Drops + ' drop' + (e2Drops > 1 ? 's' : '') + ' DPD added';

    const status = document.getElementById('e2-status');
    if (e2Drops >= E2_MAX) {
      status.style.background = '#ffe0ea';
      status.style.color = '#980030';
      status.textContent = '✓ HIGH Cl₂ DETECTED — Deep pink (positive result, >1.0 mg/L)';
      document.getElementById('e2-btn').textContent = '✓ Max reagent added';
    } else if (e2Drops >= 3) {
      status.style.background = '#ffd0e0';
      status.style.color = '#b02850';
      status.textContent = 'Medium Cl₂ — pink intensifying (~0.5–1.0 mg/L range)';
      document.getElementById('e2-btn').disabled = false;
    } else if (e2Drops >= 1) {
      status.style.background = '#fff0f5';
      status.style.color = '#c05878';
      status.textContent = 'Trace Cl₂ — faint pink developing (~0.1 mg/L)';
      document.getElementById('e2-btn').disabled = false;
    }
  });
}

function resetExp2() {
  e2Drops = 0;
  document.getElementById('e2-drops').textContent = '0';
  document.getElementById('e2-liquid').setAttribute('fill', 'rgba(230,245,255,0.28)');
  document.getElementById('e2-vol-text').textContent = '0 drops DPD added';
  const status = document.getElementById('e2-status');
  status.style.background = '#eef4ff'; status.style.color = '#3050a0';
  status.textContent = 'Colorless — awaiting DPD reagent';
  const btn = document.getElementById('e2-btn');
  btn.disabled = false; btn.textContent = '+ Add DPD reagent drop';
}

// ─────────────────────────────────────────
// EXPERIMENT 3 — Dichromate Titration (FAS)
// ─────────────────────────────────────────
let e3Drops = 0;
const E3_MAX = 12;

function addDichromateDrop() {
  if (e3Drops >= E3_MAX) return;
  document.getElementById('e3-btn').disabled = true;

  animateDrop('e3-drop', 166, 212, 'rgba(255,100,10,0.88)', function() {
    e3Drops++;
    document.getElementById('e3-drops').textContent = e3Drops;

    const t = e3Drops / E3_MAX;
    updateBurette('e3-burette-liquid', e3Drops, E3_MAX);

    // Color: green (#5a9a50) → blue-green → deep violet (#2a0870)
    let liqColor;
    if (t < 0.65) {
      liqColor = colorMix('#5a9a50', '#2848a8', t / 0.65);
    } else {
      liqColor = colorMix('#2848a8', '#2a0870', (t - 0.65) / 0.35);
    }
    document.getElementById('e3-liquid').setAttribute('fill', liqColor);
    document.getElementById('e3-vol-text').textContent = (e3Drops * 0.42).toFixed(2) + ' mL K₂Cr₂O₇';

    const status = document.getElementById('e3-status');
    if (e3Drops >= E3_MAX) {
      status.style.background = '#e0d0fc';
      status.style.color = '#200860';
      status.textContent = '✓ ENDPOINT REACHED — Deep violet-blue (all Fe²⁺ → Fe³⁺ oxidised)';
      status.classList.add('endpoint-flash2');
      const btn = document.getElementById('e3-btn');
      btn.textContent = '✓ Endpoint reached'; btn.disabled = true;
    } else if (t > 0.65) {
      status.style.background = '#d8d0f4';
      status.style.color = '#2030a8';
      status.textContent = 'Near endpoint — blue-violet forming (DPA indicator shifting)';
      document.getElementById('e3-btn').disabled = false;
    } else {
      status.style.background = '#e0f0e0';
      status.style.color = '#1a4828';
      status.textContent = 'Reacting... green→blue-green (Fe²⁺ being oxidised by Cr₂O₇²⁻)';
      document.getElementById('e3-btn').disabled = false;
    }
  });
}

function resetExp3() {
  e3Drops = 0;
  document.getElementById('e3-drops').textContent = '0';
  document.getElementById('e3-liquid').setAttribute('fill', '#5a9a50');
  document.getElementById('e3-vol-text').textContent = '0.00 mL K₂Cr₂O₇';
  const bur = document.getElementById('e3-burette-liquid');
  bur.setAttribute('height', '90'); bur.setAttribute('y', '37');
  const status = document.getElementById('e3-status');
  status.style.background = '#dff2e0'; status.style.color = '#1a5a28';
  status.textContent = 'Green — Fe²⁺ present (pre-endpoint)';
  status.classList.remove('endpoint-flash2');
  const btn = document.getElementById('e3-btn');
  btn.disabled = false; btn.textContent = '+ Add K₂Cr₂O₇ drop';
}
