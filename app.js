/**
 * YatraSetu — app.js
 * Homepage interactions.
 * Cinematic entrance sequence removed.
 */

(function () {
  'use strict';

  /* Ensure body is not scroll-locked */
  document.body.classList.remove('scroll-locked');

  /* Reveal hero section above-the-fold content immediately */
  function revealHero() {
    var heroReveals = document.querySelectorAll('.hero-section .reveal-on-scroll');
    heroReveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* Safe stub if any external script calls window._replayEntrance */
  window._replayEntrance = function () {};

  /* Ganjifa card flip (fallback if cards.js not loaded) */
  if (typeof window.flipCard !== 'function') {
    window.flipCard = function (card) {
      if (!card) return;
      card.classList.toggle('is-flipped');
    };
  }

  /* Run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealHero);
  } else {
    revealHero();
  }
})();

