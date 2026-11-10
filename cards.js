/**
 * YatraSetu — cards.js
 * Universal Royal Indian Playing Card Interactivity & 3D Flip Engine.
 * Supports tactile flip on tap/click, staggered deck cascade, accessible keyboard controls,
 * anti-drag/selection protection, and smart click routing.
 */

(function () {
  'use strict';

  /**
   * Flip a single ganjifa playing card with debounce protection.
   * @param {HTMLElement} card - The .ganjifa-card element
   */
  window.flipCard = function (card) {
    if (!card) return;
    if (!card.classList.contains('ganjifa-card')) {
      card = card.closest('.ganjifa-card');
    }
    if (!card) return;

    // Debounce to prevent double-toggle on rapid taps or simultaneous event bubbling
    var now = Date.now();
    if (card._lastFlipTime && (now - card._lastFlipTime < 350)) {
      return;
    }
    card._lastFlipTime = now;

    var wasFlipped = card.classList.contains('is-flipped');
    var willBeFlipped = !wasFlipped;
    card.classList.toggle('is-flipped', willBeFlipped);

    // Update ARIA attributes
    card.setAttribute('aria-expanded', willBeFlipped ? 'true' : 'false');
    var currentAria = card.getAttribute('aria-label') || '';
    if (currentAria) {
      card.setAttribute(
        'aria-label',
        currentAria
          .replace(/\. Tap to flip\.$/, '')
          .replace(/\. Tap to flip back\.$/, '')
          .replace(/\. Click to flip\.$/, '')
          .replace(/\. Click to flip back\.$/, '')
          .replace(/\. Click to reveal\.$/, '') +
          (willBeFlipped ? '. Tap to flip back.' : '. Tap to flip.')
      );
    }
  };

  /**
   * Bulk reveal or conceal all cards in a deck with a staggered cascade wave.
   * @param {string} [deckSelector] - Selector for deck container, default '.ganjifa-deck'
   * @param {boolean} [forceState] - True to reveal all, false to hide all, undefined to toggle
   */
  window.flipAllCards = function (deckSelector, forceState) {
    var selector = deckSelector || '.ganjifa-deck';
    var deck = document.querySelector(selector);
    if (!deck) return;

    var cards = deck.querySelectorAll('.ganjifa-card');
    if (!cards.length) return;

    if (forceState === undefined) {
      // Determine if at least one card is unflipped
      var anyUnflipped = Array.prototype.some.call(cards, function (c) {
        return !c.classList.contains('is-flipped');
      });
      forceState = anyUnflipped;
    }

    cards.forEach(function (card, idx) {
      setTimeout(function () {
        var isCurrentlyFlipped = card.classList.contains('is-flipped');
        if (isCurrentlyFlipped !== forceState) {
          card._lastFlipTime = 0; // Bypass debounce for programmatically triggered cascade
          window.flipCard(card);
        }
      }, idx * 90);
    });

    // Update toggle button text if present
    var toggleBtn = document.getElementById('btn-deck-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = forceState
        ? '<span style="margin-right:6px;">↺</span> Conceal Deck'
        : '<img src="/static/img/logo_surya_seal.svg?v=15" width="13" height="13" style="display:inline-block;vertical-align:middle;margin-right:6px;" alt=""> Reveal All Cards';
    }
  };

  /**
   * Global click/tap delegation handler for all playing cards.
   */
  function handleDeckClick(e) {
    var card = e.target.closest('.ganjifa-card');
    if (!card) return;

    // Check if clicked element or parent is an interactive button or link
    var actionEl = e.target.closest('a, button, input, select, textarea');

    if (actionEl) {
      // Explicit Flip Back button ("↺ Flip")
      if (actionEl.classList.contains('card-flip-back-btn') || actionEl.closest('.card-flip-back-btn')) {
        e.preventDefault();
        e.stopPropagation();
        window.flipCard(card);
        return;
      }
      // For any destination action link or button (e.g. Details, Plan), allow natural navigation!
      return;
    }

    // If card is already flipped (front destination face is showing):
    if (card.classList.contains('is-flipped')) {
      // If user tapped destination photo or title, follow its details link
      var titleOrPhoto = e.target.closest('.card-front-img-wrap, .card-front-name');
      if (titleOrPhoto) {
        var detailsLink = card.querySelector('.card-action-group a.btn-outline, a[href*="/destination/"], a[href*="discover"]');
        if (detailsLink && detailsLink.getAttribute('href')) {
          e.preventDefault();
          window.location.href = detailsLink.getAttribute('href');
          return;
        }
      }

      // If tapping elsewhere on the front face (card body, background), flip it back!
      e.preventDefault();
      window.flipCard(card);
      return;
    }

    // If card is on back face (royal playing card SVG art):
    // Tapping or clicking ANYWHERE on the card flips it to reveal destination!
    e.preventDefault();
    window.flipCard(card);
  }

  /**
   * Keyboard accessibility: Enter or Space flips the card.
   */
  function handleDeckKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest('.ganjifa-card');
    if (!card) return;

    // If focus is currently inside an active button/link, don't hijack Enter
    var activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'a' || activeTag === 'button') return;

    e.preventDefault();
    window.flipCard(card);
  }

  /**
   * Prevent browser text selection / drag behavior on cards.
   */
  function preventCardDragAndSelect(e) {
    var card = e.target.closest('.ganjifa-card');
    if (card) {
      if (e.type === 'dragstart') {
        e.preventDefault();
      }
      if (e.type === 'selectstart' && !e.target.closest('input, textarea')) {
        e.preventDefault();
      }
    }
  }

  /**
   * Floating Gold Dust Particle System for Royal Playing Card Decks.
   * Renders gentle, shimmering royal golden dust motes around cards.
   * Auto-pauses off-screen via IntersectionObserver for 60fps zero-cost performance.
   */
  function initGoldDust(decks) {
    if (!decks || !decks.length) return;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var GOLD_PALETTES = [
      [255, 215, 0],   // Royal Pure Gold
      [223, 183, 108], // Antique Sandstone Gold
      [255, 235, 175], // Champagne Gold
      [240, 195, 80]   // Warm Amber Gold
    ];

    decks.forEach(function (deck) {
      if (deck.querySelector('.deck-gold-dust-canvas')) return;

      var canvas = document.createElement('canvas');
      canvas.className = 'deck-gold-dust-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      deck.insertBefore(canvas, deck.firstChild);

      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var width = 0;
      var height = 0;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var particles = [];
      var animId = null;
      var isVisible = false;

      function resize() {
        var rect = deck.getBoundingClientRect();
        width = Math.max(rect.width + 40, 300);
        height = Math.max(rect.height + 60, 400);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }

      var count = window.innerWidth < 640 ? 16 : 30;
      resize();

      for (var i = 0; i < count; i++) {
        var hue = GOLD_PALETTES[Math.floor(Math.random() * GOLD_PALETTES.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.8 + Math.random() * 2.2,
          vy: 0.22 + Math.random() * 0.55,
          swayAmp: 12 + Math.random() * 24,
          swaySpeed: 0.012 + Math.random() * 0.022,
          angle: Math.random() * Math.PI * 2,
          baseAlpha: 0.25 + Math.random() * 0.5,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.025 + Math.random() * 0.045,
          hue: hue
        });
      }

      function render() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, width, height);

        for (var j = 0; j < particles.length; j++) {
          var p = particles[j];
          var alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.twinkle));
          var px = p.x + Math.sin(p.angle) * p.swayAmp;
          var py = p.y;

          var grad = ctx.createRadialGradient(px, py, 0, px, py, p.radius * 2.5);
          grad.addColorStop(0, 'rgba(' + p.hue[0] + ',' + p.hue[1] + ',' + p.hue[2] + ',' + alpha.toFixed(3) + ')');
          grad.addColorStop(0.5, 'rgba(' + p.hue[0] + ',' + p.hue[1] + ',' + p.hue[2] + ',' + (alpha * 0.4).toFixed(3) + ')');
          grad.addColorStop(1, 'rgba(' + p.hue[0] + ',' + p.hue[1] + ',' + p.hue[2] + ',0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();

          p.y -= p.vy;
          p.angle += p.swaySpeed;
          p.twinkle += p.twinkleSpeed;

          if (p.y < -20) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
        }

        animId = requestAnimationFrame(render);
      }

      // IntersectionObserver for lazy execution
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!isVisible) {
                isVisible = true;
                animId = requestAnimationFrame(render);
              }
            } else {
              isVisible = false;
              if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
              }
            }
          });
        }, { rootMargin: '60px 0px 60px 0px' });
        obs.observe(deck);
      } else {
        isVisible = true;
        animId = requestAnimationFrame(render);
      }

      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
      }, { passive: true });
    });
  }

  /**
   * Subtle ambient spotlight tracking across deck & individual cards.
   */
  function initSpotlight(decks) {
    if (!decks || !decks.length) return;

    decks.forEach(function (deck) {
      deck.addEventListener('mousemove', function (e) {
        var rect = deck.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        deck.style.setProperty('--deck-spot-x', x.toFixed(1) + '%');
        deck.style.setProperty('--deck-spot-y', y.toFixed(1) + '%');
      }, { passive: true });

      deck.addEventListener('mouseleave', function () {
        deck.style.setProperty('--deck-spot-x', '50%');
        deck.style.setProperty('--deck-spot-y', '45%');
      }, { passive: true });

      var cards = deck.querySelectorAll('.ganjifa-card');
      cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var cx = e.clientX - rect.left;
          var cy = e.clientY - rect.top;
          card.style.setProperty('--card-spot-x', cx.toFixed(1) + 'px');
          card.style.setProperty('--card-spot-y', cy.toFixed(1) + 'px');
        }, { passive: true });
      });
    });
  }

  /**
   * Staggered entrance cascade and gentle card breathing activation.
   */
  function initEntranceAndBreathing(decks) {
    if (!decks || !decks.length) return;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    decks.forEach(function (deck) {
      var cards = deck.querySelectorAll('.ganjifa-card');
      if (!cards.length) return;

      function activateBreathing() {
        cards.forEach(function (card) {
          card.classList.add('is-breathing');
        });
      }

      function revealDeck() {
        if (deck.classList.contains('deck-revealed')) return;
        deck.classList.add('deck-revealed');

        if (prefersReduced) {
          return;
        }

        // Activate breathing after entrance sequence settles
        var maxEntranceTime = 800 + (cards.length * 90);
        setTimeout(activateBreathing, maxEntranceTime);
      }

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              revealDeck();
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        observer.observe(deck);
      } else {
        revealDeck();
      }
    });
  }

  function init() {
    // Attach delegated click/tap listener to document
    document.addEventListener('click', handleDeckClick);
    document.addEventListener('keydown', handleDeckKeydown);

    // Attach drag & text selection preventers
    document.addEventListener('dragstart', preventCardDragAndSelect);
    document.addEventListener('selectstart', preventCardDragAndSelect);

    // Initialize all cards with accessibility attributes
    var allCards = document.querySelectorAll('.ganjifa-card');
    allCards.forEach(function (card) {
      if (!card.getAttribute('role')) card.setAttribute('role', 'button');
      if (!card.getAttribute('tabindex')) card.setAttribute('tabindex', '0');
      card.setAttribute('aria-expanded', card.classList.contains('is-flipped') ? 'true' : 'false');
    });

    // Initialize visual & physics card features
    var decks = document.querySelectorAll('.ganjifa-deck');
    if (decks.length) {
      initEntranceAndBreathing(decks);
      initSpotlight(decks);
      initGoldDust(decks);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
