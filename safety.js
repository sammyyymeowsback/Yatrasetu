/**
 * YatraSetu — safety.js
 * SOS press-and-hold, geolocation coords display, copy coords, modal.
 */

(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────────────── */
  var sosBtn      = document.getElementById('sos-btn');
  var sosRing     = document.getElementById('sos-ring');
  var statusHint  = document.getElementById('sos-status-hint');
  var coordsDiv   = document.getElementById('coords-display');
  var coordsText  = document.getElementById('coords-text');
  var coordsCopy  = document.getElementById('coords-copy');
  var sosModal    = document.getElementById('sos-modal');
  var modalCoords = document.getElementById('sos-modal-coords');

  if (!sosBtn) return; /* Not on safety page */

  /* ── Geolocation ───────────────────────────────────────────────── */
  var currentCoords = null;

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      function (pos) {
        currentCoords = {
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy
        };
        updateCoordsDisplay(currentCoords);
      },
      function () {
        if (coordsText) coordsText.textContent = '📍 Location access denied';
        if (coordsDiv) coordsDiv.classList.remove('acquiring');
      },
      { enableHighAccuracy: true }
    );
  } else {
    if (coordsText) coordsText.textContent = '📍 Geolocation not available on this device';
  }

  function updateCoordsDisplay(coords) {
    if (!coordsText || !coordsDiv) return;
    var lat = coords.latitude.toFixed(5);
    var lng = coords.longitude.toFixed(5);
    var acc = coords.accuracy ? Math.round(coords.accuracy) + 'm accuracy' : '';
    coordsText.textContent = '📍 ' + lat + ', ' + lng + (acc ? ' · ' + acc : '');
    coordsDiv.classList.remove('acquiring');
    if (coordsCopy) {
      coordsCopy.style.display = 'inline-block';
      coordsCopy.setAttribute('data-coords', lat + ', ' + lng);
    }
  }

  /* ── Copy coordinates ──────────────────────────────────────────── */
  if (coordsCopy) {
    coordsCopy.addEventListener('click', function () {
      var txt = this.getAttribute('data-coords') || coordsText.textContent.replace('📍 ', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(function () {
          coordsCopy.textContent = '✓ Copied';
          setTimeout(function () { coordsCopy.textContent = 'Copy'; }, 2000);
        });
      } else {
        /* Fallback */
        var ta = document.createElement('textarea');
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        coordsCopy.textContent = '✓ Copied';
        setTimeout(function () { coordsCopy.textContent = 'Copy'; }, 2000);
      }
    });
  }

  /* ── Press-and-hold SOS (3 seconds) ───────────────────────────── */
  var HOLD_DURATION = 3000; /* ms */
  var holdStart  = null;
  var holdTimer  = null;
  var rafId      = null;
  var isHolding  = false;

  function startHold(e) {
    if (isHolding) return;
    isHolding  = true;
    holdStart  = performance.now();

    if (statusHint) statusHint.textContent = 'Keep holding…';

    /* Animate the conic ring */
    function updateRing() {
      var elapsed  = performance.now() - holdStart;
      var progress = Math.min(elapsed / HOLD_DURATION, 1);
      var deg      = Math.round(progress * 360);

      if (sosRing) {
        sosRing.style.background =
          'conic-gradient(#C1121F ' + deg + 'deg, rgba(193,18,31,0.15) ' + deg + 'deg)';
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(updateRing);
      } else {
        activateSOS();
      }
    }

    rafId = requestAnimationFrame(updateRing);
  }

  function endHold() {
    if (!isHolding) return;
    isHolding = false;
    clearTimeout(holdTimer);
    cancelAnimationFrame(rafId);

    /* Reset ring */
    if (sosRing) sosRing.style.background = '';
    if (statusHint) statusHint.textContent = 'Press and hold for 3 seconds';
  }

  sosBtn.addEventListener('pointerdown', startHold);
  sosBtn.addEventListener('pointerup',   endHold);
  sosBtn.addEventListener('pointerleave',endHold);
  sosBtn.addEventListener('touchstart',  startHold, { passive: true });
  sosBtn.addEventListener('touchend',    endHold);

  /* ── Activate SOS ──────────────────────────────────────────────── */
  function activateSOS() {
    isHolding = false;
    if (statusHint) statusHint.textContent = 'SOS sent! Call 112 immediately.';
    if (sosRing) sosRing.style.background = 'conic-gradient(#C1121F 360deg, transparent 360deg)';

    var payload = {};
    if (currentCoords) {
      payload.latitude  = currentCoords.latitude;
      payload.longitude = currentCoords.longitude;
      payload.accuracy  = currentCoords.accuracy || null;
    }

    /* Update modal coords immediately */
    if (modalCoords) {
      if (currentCoords) {
        modalCoords.textContent = 'Lat: ' + currentCoords.latitude.toFixed(5) +
          ' · Lng: ' + currentCoords.longitude.toFixed(5) +
          (currentCoords.accuracy ? '\nAccuracy: ~' + Math.round(currentCoords.accuracy) + 'm' : '');
      } else {
        modalCoords.textContent = 'Location not available. Tell operator: I am using the YatraSetu SOS system.';
      }
    }

    /* Open modal */
    if (sosModal) sosModal.classList.add('is-open');

    /* POST to /safety/sos */
    fetch('/safety/sos', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (resp) {
        if (resp.success && resp.data && resp.data.emergency_actions) {
          var actionsEl = document.getElementById('sos-modal-actions');
          if (actionsEl) {
            actionsEl.innerHTML = '';
            resp.data.emergency_actions.forEach(function (action) {
              var li = document.createElement('li');
              li.textContent = action;
              actionsEl.appendChild(li);
            });
          }
        }
      })
      .catch(function () {
        /* SOS modal is already open — offline mode still works */
      });
  }

  /* ── Keyboard accessibility for SOS button ─────────────────────── */
  /* Space/Enter for 3s hold simulation */
  sosBtn.addEventListener('keydown', function (e) {
    if ((e.key === ' ' || e.key === 'Enter') && !isHolding) {
      startHold(e);
    }
  });
  sosBtn.addEventListener('keyup', function (e) {
    if (e.key === ' ' || e.key === 'Enter') endHold();
  });

})();
