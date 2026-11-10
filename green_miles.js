/**
 * YatraSetu — green_miles.js
 * Visual identity and vector animated growing sacred tree engine for Green Miles.
 * Pure SVG + CSS animation, 60fps GPU-accelerated, 100% offline resilient.
 */

(function () {
  'use strict';

  /**
   * Deterministic client-side calculator for Green Miles telemetry
   */
  function calculateGreenMiles(tripDays, alternativesCount, walkingKm, localExperiences) {
    var days = Math.max(1, parseInt(tripDays, 10) || 3);
    var alts = Math.max(0, parseInt(alternativesCount, 10) || 2);
    var walk = parseFloat(walkingKm) || (days * 5.5);
    var exp = Math.max(1, parseInt(localExperiences, 10) || days);

    var rawMiles = (days * 35) + (alts * 20) + Math.round(walk * 2) + (exp * 15);
    var miles = Math.max(45, rawMiles);
    var co2Saved = Math.round(((days * 7.2) + (alts * 2.5) + (walk * 0.15)) * 10) / 10;

    var stage = 'sprout';
    var tier = 'Bīja (Sprouting Sacred Seed)';
    if (miles >= 135) {
      stage = 'sacred_tree';
      tier = 'Kalpavriksha (Sacred Himalayan Deodar Guardian)';
    } else if (miles >= 90) {
      stage = 'young_tree';
      tier = 'Viṭapa (Sacred Grove Protector)';
    } else if (miles >= 45) {
      stage = 'sapling';
      tier = 'Aṅkura (Young Forest Guardian)';
    }

    return {
      green_miles: miles,
      co2_saved_kg: co2Saved,
      local_experiences_count: exp,
      walking_km: Math.round(walk * 10) / 10,
      tree_stage: stage,
      tree_growth_tier: tier,
      carbon_avoidance_explanation: 'Avoiding highway traffic congestion and embracing ' + walk.toFixed(1) + ' km of walking trails saves ~' + co2Saved + ' kg CO₂ compared to private diesel SUV circuits.'
    };
  }

  /**
   * Generates inline SVG for the Sacred Growing Tree based on the growth stage
   */
  /**
   * Generates inline SVG for the Sacred Growing Tree based on the growth stage
   */
  function renderBodhiLeaf(cx, cy, scale, rot) {
    var s = scale || 1.0;
    var r = rot || 0;
    return (
      '<g transform="translate(' + cx + ',' + cy + ') rotate(' + r + ') scale(' + s + ')" class="bodhi-leaf-group">' +
        '<path d="M0,0 C-10,-5 -22,-18 -18,-32 C-10,-35 0,-20 0,-44 C0,-20 10,-35 18,-32 C22,-18 10,-5 0,0 Z" fill="url(#leafGrad)"/>' +
        '<path d="M0,0 C-1,-15 0,-30 0,-44" stroke="#C5A059" stroke-width="0.8" fill="none" opacity="0.9"/>' +
        '<path d="M-1,-12 Q-6,-16 -12,-18" stroke="#C5A059" stroke-width="0.5" fill="none" opacity="0.6"/>' +
        '<path d="M1,-12 Q6,-16 12,-18" stroke="#C5A059" stroke-width="0.5" fill="none" opacity="0.6"/>' +
        '<path d="M-1,-22 Q-6,-25 -14,-28" stroke="#C5A059" stroke-width="0.5" fill="none" opacity="0.6"/>' +
        '<path d="M1,-22 Q6,-25 14,-28" stroke="#C5A059" stroke-width="0.5" fill="none" opacity="0.6"/>' +
      '</g>'
    );
  }

  var SACRED_DEFS =
    '<defs>' +
      '<radialGradient id="suryaHalo" cx="50%" cy="42%" r="56%">' +
        '<stop offset="0%" stop-color="#C5A059" stop-opacity="0.38"/>' +
        '<stop offset="45%" stop-color="#C5A059" stop-opacity="0.12"/>' +
        '<stop offset="100%" stop-color="#14281D" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="leafGrad" x1="0%" y1="100%" x2="0%" y2="0%">' +
        '<stop offset="0%" stop-color="#123520"/>' +
        '<stop offset="55%" stop-color="#1D603A"/>' +
        '<stop offset="100%" stop-color="#2E8652"/>' +
      '</linearGradient>' +
      '<linearGradient id="leafLustre" x1="0%" y1="100%" x2="0%" y2="0%">' +
        '<stop offset="0%" stop-color="#1D603A"/>' +
        '<stop offset="60%" stop-color="#2E8652"/>' +
        '<stop offset="100%" stop-color="#4CAF74"/>' +
      '</linearGradient>' +
      '<linearGradient id="woodGrad" x1="0%" y1="100%" x2="0%" y2="0%">' +
        '<stop offset="0%" stop-color="#1E120A"/>' +
        '<stop offset="50%" stop-color="#422617"/>' +
        '<stop offset="100%" stop-color="#6B4127"/>' +
      '</linearGradient>' +
      '<linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#F2E3B8"/>' +
        '<stop offset="50%" stop-color="#C5A059"/>' +
        '<stop offset="100%" stop-color="#8F6C29"/>' +
      '</linearGradient>' +
      '<filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">' +
        '<feGaussianBlur stdDeviation="1.5" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
    '</defs>';

  function generateSacredTreeSVG(stage, isAnimated) {
    var animClass = isAnimated ? 'animating' : '';

    if (stage === 'sprout') {
      return (
        '<svg class="sacred-tree-svg ' + animClass + '" viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          SACRED_DEFS +
          '<circle cx="80" cy="80" r="70" fill="none" stroke="#C5A059" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.4"/>' +
          '<ellipse cx="80" cy="142" rx="35" ry="6" fill="#C5A059" opacity="0.15"/>' +
          '<path d="M60,143 C70,139 90,139 100,143 C95,146 65,146 60,143 Z" fill="url(#goldGrad)" opacity="0.75"/>' +
          '<path d="M76,140 C74,135 75,130 78,126 C80,127 80,133 76,140 Z" fill="#6B4127"/>' +
          '<path d="M84,140 C86,135 85,130 82,126 C80,127 80,133 84,140 Z" fill="url(#goldGrad)"/>' +
          '<path class="tree-sprout-stem" d="M80,132 C78,118 82,106 80,90" stroke="url(#leafGrad)" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
          renderBodhiLeaf(80, 92, 0.7, -32) +
          renderBodhiLeaf(80, 92, 0.7, 32) +
          '<circle cx="80" cy="86" r="2.2" fill="#F2E3B8" filter="url(#goldGlow)"/>' +
        '</svg>'
      );
    }

    if (stage === 'sapling') {
      return (
        '<svg class="sacred-tree-svg ' + animClass + '" viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          SACRED_DEFS +
          '<circle cx="80" cy="75" r="54" fill="url(#suryaHalo)"/>' +
          '<circle cx="80" cy="75" r="52" fill="none" stroke="#C5A059" stroke-width="0.6" stroke-dasharray="2 3" opacity="0.35"/>' +
          '<ellipse cx="80" cy="144" rx="42" ry="7" fill="#C5A059" opacity="0.18"/>' +
          '<path d="M54,144 C66,140 94,140 106,144 C100,147 60,147 54,144 Z" fill="url(#goldGrad)" opacity="0.8"/>' +
          '<path class="tree-trunk" d="M80,144 C78,124 79,104 80,78" stroke="url(#woodGrad)" stroke-width="4.5" stroke-linecap="round" fill="none"/>' +
          '<path class="tree-branch" d="M79,112 C68,102 58,94 52,86" stroke="url(#woodGrad)" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
          '<path class="tree-branch" d="M80,102 C92,92 102,84 108,76" stroke="url(#woodGrad)" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
          renderBodhiLeaf(52, 86, 0.65, -45) +
          renderBodhiLeaf(108, 76, 0.65, 45) +
          renderBodhiLeaf(64, 98, 0.55, -25) +
          renderBodhiLeaf(96, 90, 0.55, 25) +
          renderBodhiLeaf(80, 78, 0.75, 0) +
          '<circle cx="80" cy="74" r="2.2" fill="#F2E3B8" filter="url(#goldGlow)"/>' +
        '</svg>'
      );
    }

    if (stage === 'young_tree') {
      return (
        '<svg class="sacred-tree-svg ' + animClass + '" viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
          SACRED_DEFS +
          '<circle cx="80" cy="68" r="62" fill="url(#suryaHalo)"/>' +
          '<circle cx="80" cy="68" r="60" fill="none" stroke="#C5A059" stroke-width="0.7" stroke-dasharray="3 4" opacity="0.4"/>' +
          '<ellipse cx="80" cy="145" rx="50" ry="8" fill="#C5A059" opacity="0.2"/>' +
          '<path d="M48,145 C62,141 98,141 112,145 C105,149 55,149 48,145 Z" fill="url(#goldGrad)" opacity="0.85"/>' +
          '<path d="M72,145 C64,148 54,153 48,155" stroke="url(#woodGrad)" stroke-width="2.2" fill="none"/>' +
          '<path d="M88,145 C96,148 106,153 112,155" stroke="url(#woodGrad)" stroke-width="2.2" fill="none"/>' +
          '<path class="tree-trunk" d="M77,145 C77,118 78,96 80,68 C82,96 83,118 83,145 Z" fill="url(#woodGrad)"/>' +
          '<path class="tree-branch" d="M78,112 C60,98 46,88 36,76" stroke="url(#woodGrad)" stroke-width="3.4" stroke-linecap="round" fill="none"/>' +
          '<path class="tree-branch" d="M82,108 C100,94 114,84 124,72" stroke="url(#woodGrad)" stroke-width="3.4" stroke-linecap="round" fill="none"/>' +
          '<path class="tree-branch" d="M79,88 C64,76 54,64 48,50" stroke="url(#woodGrad)" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
          '<path class="tree-branch" d="M81,85 C96,73 106,61 112,48" stroke="url(#woodGrad)" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
          renderBodhiLeaf(36, 76, 0.6, -50) +
          renderBodhiLeaf(124, 72, 0.6, 50) +
          renderBodhiLeaf(48, 50, 0.65, -30) +
          renderBodhiLeaf(112, 48, 0.65, 30) +
          renderBodhiLeaf(62, 70, 0.55, -15) +
          renderBodhiLeaf(98, 66, 0.55, 15) +
          renderBodhiLeaf(80, 68, 0.8, 0) +
          '<circle cx="80" cy="62" r="2.5" fill="#F2E3B8" filter="url(#goldGlow)"/>' +
          '<circle cx="50" cy="74" r="2" fill="#F2E3B8" opacity="0.9"/>' +
          '<circle cx="110" cy="70" r="2" fill="#F2E3B8" opacity="0.9"/>' +
        '</svg>'
      );
    }

    /* stage === 'sacred_tree' (Majestic Kalpavriksha / Tree of Life) */
    return (
      '<svg class="sacred-tree-svg ' + animClass + '" viewBox="0 0 160 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
        SACRED_DEFS +
        '<!-- Surya Golden Astral Mandala -->' +
        '<circle cx="80" cy="60" r="58" fill="url(#suryaHalo)"/>' +
        '<circle cx="80" cy="60" r="56" fill="none" stroke="#C5A059" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.45"/>' +
        '<circle cx="80" cy="60" r="46" fill="none" stroke="#C5A059" stroke-width="0.5" opacity="0.25"/>' +
        '<line x1="80" y1="2" x2="80" y2="8" stroke="#C5A059" stroke-width="1.2" opacity="0.6"/>' +
        '<line x1="80" y1="112" x2="80" y2="118" stroke="#C5A059" stroke-width="1.2" opacity="0.3"/>' +
        '<line x1="22" y1="60" x2="28" y2="60" stroke="#C5A059" stroke-width="1.2" opacity="0.6"/>' +
        '<line x1="132" y1="60" x2="138" y2="60" stroke="#C5A059" stroke-width="1.2" opacity="0.6"/>' +
        '<!-- Ornate Lotus Pedestal (Padma Plinth) -->' +
        '<ellipse cx="80" cy="146" rx="55" ry="8" fill="#C5A059" opacity="0.25"/>' +
        '<path d="M42,146 C56,140 104,140 118,146 C110,151 50,151 42,146 Z" fill="#14281D" stroke="url(#goldGrad)" stroke-width="1.4"/>' +
        '<path d="M52,146 Q62,142 72,146 Q80,142 88,146 Q98,142 108,146" stroke="#C5A059" stroke-width="0.8" fill="none"/>' +
        '<!-- Ancient Sacred Banyan / Deodar Roots -->' +
        '<path d="M72,146 C60,148 48,154 40,157" stroke="url(#woodGrad)" stroke-width="2.5" fill="none"/>' +
        '<path d="M88,146 C100,148 112,154 120,157" stroke="url(#woodGrad)" stroke-width="2.5" fill="none"/>' +
        '<path d="M76,146 C68,149 62,153 58,156" stroke="url(#woodGrad)" stroke-width="1.6" fill="none"/>' +
        '<path d="M84,146 C92,149 98,153 102,156" stroke="url(#woodGrad)" stroke-width="1.6" fill="none"/>' +
        '<!-- Majestic Entwined Trunk -->' +
        '<path class="tree-trunk-majestic" d="M74,146 C74,112 76,86 80,56 C84,86 86,112 86,146 Z" fill="url(#woodGrad)"/>' +
        '<path d="M78,146 C78,116 79,90 80,58" stroke="#734B32" stroke-width="1.2" fill="none" opacity="0.8"/>' +
        '<path d="M82,146 C82,116 81,90 80,58" stroke="#331C11" stroke-width="1.2" fill="none" opacity="0.8"/>' +
        '<!-- Symmetrical Arching Gateway Boughs (Torana Architecture) -->' +
        '<path class="tree-branch" d="M78,104 C52,90 32,76 22,62" stroke="url(#woodGrad)" stroke-width="4.2" stroke-linecap="round" fill="none"/>' +
        '<path class="tree-branch" d="M82,100 C108,86 128,72 138,58" stroke="url(#woodGrad)" stroke-width="4.2" stroke-linecap="round" fill="none"/>' +
        '<path class="tree-branch" d="M78,82 C56,68 42,54 34,38" stroke="url(#woodGrad)" stroke-width="3.2" stroke-linecap="round" fill="none"/>' +
        '<path class="tree-branch" d="M82,78 C104,64 118,50 126,34" stroke="url(#woodGrad)" stroke-width="3.2" stroke-linecap="round" fill="none"/>' +
        '<path class="tree-branch" d="M79,64 C66,50 56,38 52,24" stroke="url(#woodGrad)" stroke-width="2.4" stroke-linecap="round" fill="none"/>' +
        '<path class="tree-branch" d="M81,62 C94,48 104,36 108,22" stroke="url(#woodGrad)" stroke-width="2.4" stroke-linecap="round" fill="none"/>' +
        '<!-- Tiered Sacred Bodhi Foliage -->' +
        renderBodhiLeaf(80, 22, 0.85, 0) +
        renderBodhiLeaf(70, 32, 0.7, -18) +
        renderBodhiLeaf(90, 30, 0.7, 18) +
        renderBodhiLeaf(44, 48, 0.65, -45) +
        renderBodhiLeaf(116, 44, 0.65, 45) +
        renderBodhiLeaf(22, 62, 0.65, -55) +
        renderBodhiLeaf(138, 58, 0.65, 55) +
        renderBodhiLeaf(34, 38, 0.7, -38) +
        renderBodhiLeaf(126, 34, 0.7, 38) +
        renderBodhiLeaf(52, 24, 0.75, -20) +
        renderBodhiLeaf(108, 22, 0.75, 20) +
        renderBodhiLeaf(80, 56, 0.9, 0) +
        renderBodhiLeaf(66, 44, 0.6, -10) +
        renderBodhiLeaf(94, 42, 0.6, 10) +
        '<!-- Hanging Wish-Fulfilling Golden Amrita Jewels (Kalpavriksha Fruits) -->' +
        '<g class="amrita-droplets">' +
          '<path d="M26,64 C25,67 27,70 26,73 C25,70 24,67 26,64 Z" fill="url(#goldGrad)" stroke="#C5A059" stroke-width="0.4"/>' +
          '<path d="M134,60 C133,63 135,66 134,69 C133,66 132,63 134,60 Z" fill="url(#goldGrad)" stroke="#C5A059" stroke-width="0.4"/>' +
          '<path d="M38,40 C37,43 39,46 38,49 C37,46 36,43 38,40 Z" fill="url(#goldGrad)" stroke="#C5A059" stroke-width="0.4"/>' +
          '<path d="M122,36 C121,39 123,42 122,45 C121,42 120,39 122,36 Z" fill="url(#goldGrad)" stroke="#C5A059" stroke-width="0.4"/>' +
          '<circle cx="80" cy="48" r="2.8" fill="#F2E3B8" filter="url(#goldGlow)"/>' +
        '</g>' +
        '<!-- Ambient Golden Fireflies -->' +
        '<circle cx="76" cy="30" r="1.4" fill="#FFF8E7" class="firefly firefly-1"/>' +
        '<circle cx="48" cy="54" r="1.4" fill="#FFF8E7" class="firefly firefly-2"/>' +
        '<circle cx="112" cy="48" r="1.4" fill="#FFF8E7" class="firefly firefly-3"/>' +
      '</svg>'
    );
  }

  /**
   * Smooth odometer counter rolling up from 0 to target number
   */
  function animateOdometer(element, targetValue, durationMs) {
    if (!element) return;
    var startValue = 0;
    var startTime = null;
    var duration = durationMs || 1500;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* Ease-out cubic curve */
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(startValue + (targetValue - startValue) * ease);
      element.textContent = current;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = targetValue;
      }
    }

    window.requestAnimationFrame(step);
  }

  /**
   * Main rendering function for the Green Miles widget card
   */
  function renderGreenMiles(container, data) {
    if (!container) return;

    var metrics = data || calculateGreenMiles(3, 2, 18, 3);
    var miles = metrics.green_miles || 148;
    var co2 = metrics.co2_saved_kg != null ? metrics.co2_saved_kg : 23;
    var exp = metrics.local_experiences_count != null ? metrics.local_experiences_count : 3;
    var walk = metrics.walking_km != null ? metrics.walking_km : 18;
    var stage = metrics.tree_stage || 'sacred_tree';
    var tier = metrics.tree_growth_tier || 'Kalpavriksha (Sacred Himalayan Deodar Guardian)';
    var note = metrics.carbon_avoidance_explanation || 'Saved vs commercial highway diesel vehicular travel.';

    var cardHtml =
      '<div class="green-miles-card">' +
        '<div class="green-miles-inner">' +
          '<!-- Header Badge -->' +
          '<div class="green-miles-badge">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
            '<span>GREEN MILES · YatraSetu Sustainability Metric</span>' +
          '</div>' +

          '<!-- Main Layout Grid -->' +
          '<div class="green-miles-layout">' +
            '<!-- Column A: Flow Telemetry -->' +
            '<div class="green-miles-telemetry">' +
              '<div class="green-miles-odometer-wrap">' +
                '<span class="green-miles-number" id="gm-odometer-counter">0</span>' +
                '<span class="green-miles-label">Green Miles</span>' +
              '</div>' +

              '<div class="green-miles-divider" aria-hidden="true"></div>' +

              '<div class="green-miles-flow">' +
                '<div class="flow-item flow-start">' +
                  '<span class="flow-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg></span>' +
                  '<span class="flow-text">Your Yatra</span>' +
                '</div>' +
                '<div class="flow-arrow" aria-hidden="true">↓</div>' +

                '<div class="flow-item flow-highlight">' +
                  '<span class="flow-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg></span>' +
                  '<div class="flow-data">' +
                    '<span class="flow-val">' + co2 + ' kg CO₂</span>' +
                    '<span class="flow-sub">Avoided vs highway diesel gridlock</span>' +
                  '</div>' +
                '</div>' +
                '<div class="flow-arrow" aria-hidden="true">↓</div>' +

                '<div class="flow-item flow-highlight">' +
                  '<span class="flow-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>' +
                  '<div class="flow-data">' +
                    '<span class="flow-val">' + exp + ' local experiences</span>' +
                    '<span class="flow-sub">Village homestays &amp; craft guilds</span>' +
                  '</div>' +
                '</div>' +
                '<div class="flow-arrow" aria-hidden="true">↓</div>' +

                '<div class="flow-item flow-highlight">' +
                  '<span class="flow-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></span>' +
                  '<div class="flow-data">' +
                    '<span class="flow-val">' + walk + ' km walking</span>' +
                    '<span class="flow-sub">Heritage paths &amp; nature trails</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<!-- Column B: Animated Sacred Tree (Kalpavriksha) -->' +
            '<div class="green-miles-tree-column">' +
              '<div class="tree-canvas-wrapper" title="' + escapeHtml(tier) + ' · Click to inspect eco telemetry">' +
                generateSacredTreeSVG(stage, true) +
              '</div>' +
              '<div class="tree-tier-caption">' +
                '<span class="tree-tier-pill">' + escapeHtml(tier) + '</span>' +
                '<p class="tree-tier-note">' + escapeHtml(note) + '</p>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<!-- Bottom Attribution Strip -->' +
          '<div style="margin-top:14px;padding-top:10px;border-top:1px solid rgba(197,160,89,0.25);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:11px;color:rgba(250,246,238,0.7);">' +
            '<span>🌱 <strong>YatraSetu Sustainability Metric:</strong> Quantifies carbon avoidance through decentralized footfall routing, heritage walking corridors, and direct community stay retention.</span>' +
            '<span style="color:var(--color-gold);font-weight:600;">SIH Decentralization Standard</span>' +
          '</div>' +
        '</div>' +
      '</div>';

    container.innerHTML = cardHtml;

    /* Animate counter from 0 up to actual Green Miles */
    var counterEl = container.querySelector('#gm-odometer-counter');
    if (counterEl) {
      setTimeout(function () {
        animateOdometer(counterEl, miles, 1800);
      }, 200);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Expose globally for itinerary, dossier, and dashboard */
  window.YatraSetuGreenMiles = {
    render: renderGreenMiles,
    calculate: calculateGreenMiles,
    generateSVG: generateSacredTreeSVG
  };

})();
