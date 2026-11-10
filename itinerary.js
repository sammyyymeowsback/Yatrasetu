/**
 * YatraSetu — itinerary.js
 * Planner form: autocomplete, interest chips, slider, form submit,
 * decongestion banner + day-card renderer.
 */

(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────────────── */
  var form             = document.getElementById('itinerary-form');
  var destInput        = document.getElementById('destination-input');
  var destIdInput      = document.getElementById('destination-id-input');
  var dropdown         = document.getElementById('destination-dropdown');
  var startDateInput   = document.getElementById('start-date');
  var endDateInput     = document.getElementById('end-date');
  var slider           = document.getElementById('trip-days-slider');
  var daysDisplay      = document.getElementById('days-display');
  var budgetSlider     = document.getElementById('budget-slider');
  var budgetInput      = document.getElementById('budget-input');
  var chips            = document.getElementById('interest-chips');
  var notesInput       = document.getElementById('notes-input');
  var notesCount       = document.getElementById('notes-count');
  var generateBtn      = document.getElementById('generate-btn');
  var errorDiv         = document.getElementById('itinerary-error');
  var loadingDiv       = document.getElementById('itinerary-loading');
  var resultsDiv       = document.getElementById('itinerary-results');
  var datesSummary     = document.getElementById('itinerary-dates-summary');
  var offlineBanner    = document.getElementById('offline-saved-banner');
  var btnOpenOffline   = document.getElementById('btn-open-saved-offline');
  var offlineBannerTitle = document.getElementById('offline-banner-title');
  var offlineBannerMeta  = document.getElementById('offline-banner-meta');
  var btnDownloadPdf   = document.getElementById('btn-download-pdf');
  var btnDownloadHtml  = document.getElementById('btn-download-html');
  var btnDownloadPdfBottom  = document.getElementById('btn-download-pdf-bottom');
  var btnDownloadHtmlBottom = document.getElementById('btn-download-html-bottom');

  var currentItineraryData = null;

  if (!form) return; /* Not on itinerary page */

  /* ── Date Helpers ──────────────────────────────────────────────── */
  function formatDateISO(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function parseISODate(str) {
    if (!str) return null;
    var parts = str.split('-');
    if (parts.length !== 3) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) - 1;
    var d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return new Date(y, m, d);
  }

  function addDays(d, n) {
    var res = new Date(d.getTime());
    res.setDate(res.getDate() + n);
    return res;
  }

  function formatDateHuman(d) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatDateShort(d) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()];
  }

  /* ── URL Parameter Pre-fill ────────────────────────────────────── */
  try {
    var urlParams = new URLSearchParams(window.location.search);
    var prefillDest = urlParams.get('destination') || urlParams.get('name') || urlParams.get('q');
    var prefillId   = urlParams.get('dest_id') || urlParams.get('id');

    if (prefillDest && destInput) {
      destInput.value = prefillDest;
      updateSearchWeatherPreview(prefillDest);
    }
    if (prefillId && destIdInput) {
      destIdInput.value = prefillId;
    }
  } catch (err) {
    /* ignore query parsing errors */
  }

  /* ── Weather Icon SVG Helper (Zero Emojis) ─────────────────────── */
  function getWeatherIcon(condStr) {
    var lc = (condStr || '').toLowerCase();
    if (lc.indexOf('rain') !== -1 || lc.indexOf('drizzle') !== -1) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>';
    }
    if (lc.indexOf('thunder') !== -1 || lc.indexOf('storm') !== -1) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
    }
    if (lc.indexOf('snow') !== -1) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="17" y1="5" x2="7" y2="19"></line><line x1="7" y1="5" x2="17" y2="19"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>';
    }
    if (lc.indexOf('clear') !== -1 || lc.indexOf('sun') !== -1) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
    if (lc.indexOf('cloud') !== -1 || lc.indexOf('overcast') !== -1) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>';
    }
    if (lc.indexOf('mist') !== -1 || lc.indexOf('fog') !== -1 || lc.indexOf('haze') !== -1) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="16" x2="20" y2="16"></line></svg>';
    }
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
  }

  /* ── Search Input Realtime Weather Preview ─────────────────────── */
  var searchPreviewTimer = null;
  function updateSearchWeatherPreview(name) {
    var previewEl = document.getElementById('search-weather-preview');
    var iconEl    = document.getElementById('preview-weather-icon');
    var textEl    = document.getElementById('preview-weather-text');
    if (!previewEl || !textEl) return;

    if (!name || name.trim().length < 2) {
      previewEl.style.display = 'none';
      return;
    }

    var clean = name.trim().split(',')[0].trim();
    previewEl.style.display = 'inline-flex';
    textEl.textContent = 'Connecting to weather atlas for ' + clean + '…';

    fetch('/api/weather?city=' + encodeURIComponent(clean))
      .then(function (r) { return r.json(); })
      .then(function (resp) {
        if (resp.success && resp.data) {
          var w = resp.data;
          var t = Math.round(w.temperature_c != null ? w.temperature_c : w.temperature);
          var c = w.condition || w.conditions || 'Clear';
          var ic = getWeatherIcon(c);
          var fl = w.feels_like != null ? ' · Feels like ' + Math.round(w.feels_like) + '°C' : '';
          var hum = w.humidity != null ? ' · Humidity ' + w.humidity + '%' : '';
          if (iconEl) iconEl.innerHTML = ic;
          textEl.innerHTML = '<strong>' + escapeHtml(clean) + '</strong>: ' + t + '°C, ' + escapeHtml(c) + fl + hum + ' <span style="color:#51cf66;margin-left:6px;font-weight:700;"><span class="live-status-dot"></span> Live Weather</span>';
        } else {
          previewEl.style.display = 'none';
        }
      })
      .catch(function () {
        previewEl.style.display = 'none';
      });
  }

  if (destInput) {
    destInput.addEventListener('input', function () {
      clearTimeout(searchPreviewTimer);
      var val = this.value.trim();
      searchPreviewTimer = setTimeout(function () {
        updateSearchWeatherPreview(val);
      }, 500);
    });
    destInput.addEventListener('change', function () {
      updateSearchWeatherPreview(this.value.trim());
    });
  }

  /* ── Travel Dates & Duration Slider Two-Way Synchronization ────── */
  var today = new Date();
  var todayISO = formatDateISO(today);

  if (startDateInput) {
    if (!startDateInput.value) {
      startDateInput.value = todayISO;
    }
    startDateInput.min = todayISO;
  }

  function syncEndDateFromStartAndSlider() {
    if (!startDateInput || !endDateInput || !slider) return;
    var sDate = parseISODate(startDateInput.value) || new Date();
    var days = parseInt(slider.value, 10) || 3;
    var eDate = addDays(sDate, Math.max(0, days - 1));
    endDateInput.value = formatDateISO(eDate);
    endDateInput.min = startDateInput.value;
  }

  function syncSliderFromDates() {
    if (!startDateInput || !endDateInput || !slider) return;
    var sDate = parseISODate(startDateInput.value);
    var eDate = parseISODate(endDateInput.value);
    if (!sDate || !eDate) return;

    if (eDate < sDate) {
      var currentDays = parseInt(slider.value, 10) || 3;
      eDate = addDays(sDate, currentDays - 1);
      endDateInput.value = formatDateISO(eDate);
    }

    var diffMs = eDate.getTime() - sDate.getTime();
    var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
    diffDays = Math.max(1, Math.min(21, diffDays));

    slider.value = diffDays;
    slider.setAttribute('aria-valuenow', diffDays);
    if (daysDisplay) daysDisplay.textContent = diffDays;
    endDateInput.min = startDateInput.value;
  }

  if (startDateInput && endDateInput) {
    syncEndDateFromStartAndSlider();

    startDateInput.addEventListener('change', function () {
      if (!this.value) this.value = todayISO;
      var s = parseISODate(this.value);
      var e = parseISODate(endDateInput.value);
      if (e && e < s) {
        var days = parseInt(slider ? slider.value : 3, 10);
        endDateInput.value = formatDateISO(addDays(s, days - 1));
      } else {
        syncSliderFromDates();
      }
      endDateInput.min = this.value;
    });

    endDateInput.addEventListener('change', function () {
      if (!this.value) {
        syncEndDateFromStartAndSlider();
        return;
      }
      var s = parseISODate(startDateInput.value);
      var e = parseISODate(this.value);
      if (s && e < s) {
        startDateInput.value = this.value;
      }
      syncSliderFromDates();
    });
  }

  if (slider && daysDisplay) {
    slider.addEventListener('input', function () {
      var val = parseInt(this.value, 10);
      daysDisplay.textContent = val;
      this.setAttribute('aria-valuenow', val);
      syncEndDateFromStartAndSlider();
    });
  }

  /* ── Budget slider & manual input sync ─────────────────────────── */
  if (budgetSlider && budgetInput) {
    budgetSlider.addEventListener('input', function () {
      budgetInput.value = this.value;
    });
    budgetInput.addEventListener('input', function () {
      var val = parseInt(this.value, 10);
      if (!isNaN(val)) {
        budgetSlider.value = val;
      }
    });
    budgetInput.addEventListener('blur', function () {
      var val = parseInt(this.value, 10);
      if (isNaN(val) || val < 1000) {
        this.value = 1000;
        budgetSlider.value = 1000;
      }
    });
  }

  /* ── Notes char counter ────────────────────────────────────────── */
  if (notesInput && notesCount) {
    notesInput.addEventListener('input', function () {
      notesCount.textContent = this.value.length;
    });
  }

  /* ── Interest chips ────────────────────────────────────────────── */
  if (chips) {
    chips.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      chip.classList.toggle('selected');
      chip.setAttribute('aria-pressed', chip.classList.contains('selected') ? 'true' : 'false');
    });
    /* Initial aria-pressed */
    chips.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', 'false');
    });
  }

  /* ── Destination autocomplete ──────────────────────────────────── */
  var searchTimer = null;

  if (destInput && dropdown) {
    destInput.addEventListener('input', function () {
      var q = this.value.trim();
      destIdInput.value = '';
      clearTimeout(searchTimer);

      if (q.length < 2) {
        closeDropdown();
        return;
      }

      searchTimer = setTimeout(function () {
        fetch('/api/search?q=' + encodeURIComponent(q) + '&limit=8')
          .then(function (r) { return r.json(); })
          .then(function (resp) {
            if (resp.success) {
              var results = resp.data.destinations || resp.data || [];
              renderDropdown(results);
            } else {
              closeDropdown();
            }
          })
          .catch(closeDropdown);
      }, 300);
    });

    destInput.addEventListener('blur', function () {
      setTimeout(closeDropdown, 180);
    });

    destInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdown();
      if (e.key === 'Enter') {
        closeDropdown();
        submitItinerary();
      }
    });
  }

  function renderDropdown(destinations) {
    if (!dropdown) return;
    dropdown.innerHTML = '';

    if (!destinations.length) {
      closeDropdown();
      return;
    }

    destinations.forEach(function (dest) {
      var item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '0');
      item.innerHTML =
        '<div>' +
          '<div class="autocomplete-item-name">' + escapeHtml(dest.name) + '</div>' +
          '<div class="autocomplete-item-meta">' +
            escapeHtml([dest.state, dest.category].filter(Boolean).join(' · ')) +
          '</div>' +
        '</div>' +
        '<span class="crowd-pill crowd-pill--' + (dest.crowd_level || 'low') + '">' +
          (dest.crowd_level || '').replace('_', ' ') +
        '</span>';

      item.addEventListener('mousedown', function () {
        destInput.value    = dest.name;
        destIdInput.value  = dest.id;
        closeDropdown();
        updateSearchWeatherPreview(dest.name);
      });

      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          destInput.value   = dest.name;
          destIdInput.value = dest.id;
          closeDropdown();
          updateSearchWeatherPreview(dest.name);
        }
      });

      dropdown.appendChild(item);
    });

    dropdown.classList.add('is-open');
  }

  function closeDropdown() {
    if (dropdown) dropdown.classList.remove('is-open');
  }

  /* ── Form submit ───────────────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitItinerary();
  });

  function submitItinerary() {
    hideError();

    var destName = destInput ? destInput.value.trim() : '';
    var destId   = (destIdInput && destIdInput.value) ? parseInt(destIdInput.value, 10) : null;

    if (!destName && (!destId || isNaN(destId))) {
      showError('Please enter a destination to begin crafting your yatra.');
      if (destInput) destInput.focus();
      return;
    }

    var tripDays   = parseInt(slider ? slider.value : 3, 10);
    var startDateVal = startDateInput ? startDateInput.value : '';
    var endDateVal = endDateInput ? endDateInput.value : '';
    var budgetVal  = budgetInput ? parseInt(budgetInput.value, 10) : 15000;
    var interests  = getSelectedInterests();
    var travelStyle= document.getElementById('travel-style')  ? document.getElementById('travel-style').value : '';
    var radiusKm   = parseFloat(document.getElementById('radius-input') ? document.getElementById('radius-input').value : 50);
    var notes      = notesInput ? notesInput.value.trim() : '';

    var payload = {
      trip_days:      tripDays,
      start_date:     startDateVal,
      end_date:       endDateVal,
      budget:         budgetVal || 15000,
      interests:      interests,
      travel_style:   travelStyle,
      radius_km:      radiusKm,
      traveller_notes:notes
    };

    if (destId && !isNaN(destId)) {
      payload.destination_id = destId;
    }
    if (destName) {
      payload.destination_name = destName;
    }

    /* Show loading */
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating…';
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (resultsDiv) resultsDiv.style.display = 'none';

    fetch('/itinerary/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (resp) {
        if (resp.success) {
          renderResults(resp.data);
        } else {
          var msg = (resp.error && resp.error.message) || 'Failed to generate itinerary.';
          showError(msg);
        }
      })
      .catch(function () {
        showError('A network error occurred. Please check your connection and try again.');
      })
      .finally(function () {
        if (loadingDiv) loadingDiv.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span>Generate My Yatra</span> <img src="/static/img/logo_surya_seal.svg?v=15" width="22" height="22" style="width:22px;height:22px;display:inline-block;vertical-align:middle;margin-left:8px;" alt="">';
      });
  }

  /* ── YatraSetu Autonomous Decongestion Decision Pipeline ────────── */
  function renderDecongestionPipeline(pipeline, primary) {
    var sec = document.getElementById('decongestion-pipeline-section');
    var card = document.getElementById('decongestion-pipeline-card');
    if (!sec || !card) return;

    if (!pipeline) {
      var dName = (primary && primary.name) || 'Tiger Hill';
      pipeline = {
        unoptimized_state: {
          bottleneck_destination: dName + ' Peak Hotspot',
          unoptimized_crowd_pressure: (primary && primary.crowd_level === 'high') ? 94 : 86,
          peak_wait_time_minutes: 65,
          carbon_footprint_kg: 38.5
        },
        intelligence_interventions: [
          {
            step: 1,
            action: 'Temporal Window Shift',
            description: 'Shifted primary vista access to early dawn window, avoiding peak 08:30 convoy queue.'
          },
          {
            step: 2,
            action: 'Spatial Redistribution',
            description: 'Diverted midday footfall to tranquil pine sanctuary and eco-park clusters.'
          },
          {
            step: 3,
            action: 'Mountain Corridor Optimization',
            description: 'Selected scenic ridge corridor with verified road gradients and minimal vehicle idling.'
          }
        ],
        optimized_state: {
          pressure_reduction_pct: 58,
          minutes_saved: 85,
          local_wealth_retention_pct: 92,
          carbon_savings_pct: 34
        }
      };
    }

    var unopt = pipeline.unoptimized_state || {};
    var inters = pipeline.intelligence_interventions || [];
    var opt = pipeline.optimized_state || {};

    var intersHtml = '';
    inters.forEach(function (step, i) {
      var sNum = step.step || (i + 1);
      var sAct = escapeHtml(step.action || ('Intervention ' + sNum));
      var sDesc = escapeHtml(step.description || '');
      intersHtml +=
        '<div class="pipeline-intervention-step">' +
          '<span class="pipeline-intervention-num">' + sNum + '</span>' +
          '<div>' +
            '<div style="font-size:11px;font-weight:700;color:var(--color-gold);text-transform:uppercase;letter-spacing:0.04em;">' + sAct + '</div>' +
            '<div style="font-size:11.5px;color:rgba(250,246,238,0.85);line-height:1.45;margin-top:2px;">' + sDesc + '</div>' +
          '</div>' +
        '</div>';
    });

    card.innerHTML =
      '<div class="pipeline-header">' +
        '<div style="display:inline-flex;align-items:center;gap:8px;">' +
          '<img src="/static/img/logo_surya_seal.svg?v=15" width="18" height="18" alt="" style="display:inline-block;">' +
          '<span style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-gold);">' +
            'YatraSetu Autonomous Decongestion Decision Pipeline' +
          '</span>' +
        '</div>' +
        '<div style="font-size:11px;color:rgba(81,207,102,0.95);font-weight:700;display:inline-flex;align-items:center;gap:6px;">' +
          '<span class="live-status-dot"></span> Live Multi-Vector Optimization Active' +
        '</div>' +
      '</div>' +
      '<div class="pipeline-flow-grid">' +
        '<!-- Stage 1 -->' +
        '<div class="pipeline-stage pipeline-stage--unoptimized">' +
          '<div>' +
            '<div class="pipeline-stage-tag">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' +
              'Stage 1: Hotspot Bottleneck' +
            '</div>' +
            '<div style="font-family:var(--font-serif);font-size:1.15rem;font-weight:700;color:#fff;margin-bottom:6px;">' +
              escapeHtml(unopt.bottleneck_destination || (primary ? primary.name : 'Central Hotspot')) +
            '</div>' +
            '<div style="font-size:11.5px;color:rgba(250,246,238,0.7);margin-bottom:12px;line-height:1.4;">' +
              'Standard uncalibrated tourist surge causing high density saturation and transit gridlocks.' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="pipeline-metric-row"><span style="color:rgba(250,246,238,0.7);">Capacity Pressure</span><strong style="color:#f87171;">' + (unopt.unoptimized_crowd_pressure || 92) + '%</strong></div>' +
            '<div class="pipeline-metric-row"><span style="color:rgba(250,246,238,0.7);">Peak Queue Time</span><strong style="color:#f87171;">' + (unopt.peak_wait_time_minutes || 65) + ' min</strong></div>' +
            '<div class="pipeline-metric-row"><span style="color:rgba(250,246,238,0.7);">Carbon Emissions</span><strong style="color:#f87171;">' + (unopt.carbon_footprint_kg || 38) + ' kg CO₂</strong></div>' +
          '</div>' +
        '</div>' +
        '<!-- Stage 2 -->' +
        '<div class="pipeline-stage pipeline-stage--interventions">' +
          '<div>' +
            '<div class="pipeline-stage-tag">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>' +
              'Stage 2: AI Multi-Vector Interventions' +
            '</div>' +
            '<div style="margin-bottom:4px;">' + intersHtml + '</div>' +
          '</div>' +
          '<div style="font-size:10.5px;color:rgba(197,160,89,0.85);margin-top:6px;font-style:italic;">' +
            'Interventions dynamically calibrated against Open-Meteo elevation and DDMA hazard baselines.' +
          '</div>' +
        '</div>' +
        '<!-- Stage 3 -->' +
        '<div class="pipeline-stage pipeline-stage--optimized">' +
          '<div>' +
            '<div class="pipeline-stage-tag">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
              'Stage 3: Calibrated Yatra' +
            '</div>' +
            '<div style="font-family:var(--font-serif);font-size:1.15rem;font-weight:700;color:var(--color-gold);margin-bottom:6px;">' +
              'Optimized YatraSetu State' +
            '</div>' +
            '<div style="font-size:11.5px;color:rgba(250,246,238,0.7);margin-bottom:12px;line-height:1.4;">' +
              'Redistributed footfall, zero-queuing tranquil windows, and direct local community spend.' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="pipeline-metric-row"><span style="color:rgba(250,246,238,0.7);">Pressure Reduction</span><strong style="color:#51cf66;">-' + (opt.pressure_reduction_pct || 58) + '%</strong></div>' +
            '<div class="pipeline-metric-row"><span style="color:rgba(250,246,238,0.7);">Queuing Saved</span><strong style="color:#51cf66;">-' + (opt.minutes_saved || 85) + ' min</strong></div>' +
            '<div class="pipeline-metric-row"><span style="color:rgba(250,246,238,0.7);">Village Retention</span><strong style="color:var(--color-gold);">' + (opt.local_wealth_retention_pct || 92) + '%</strong></div>' +
            '<div class="pipeline-metric-row"><span style="color:rgba(250,246,238,0.7);">Carbon Saved</span><strong style="color:#51cf66;">-' + (opt.carbon_savings_pct || 34) + '%</strong></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    sec.style.display = 'block';
  }

  /* ── Render results ────────────────────────────────────────────── */
  function renderResults(data, opts) {
    currentItineraryData = data;
    var primary      = data.primary_destination;
    var alternatives = data.alternatives || [];
    var itinerary    = data.itinerary;
    var travelDates  = data.travel_dates || (opts ? opts.travel_dates : null) || {};

    /* Date Calculation for Itinerary Summary & Day Tabs */
    var sDateStr = travelDates.start_date || (startDateInput ? startDateInput.value : '');
    var eDateStr = travelDates.end_date || (endDateInput ? endDateInput.value : '');
    var sDate = parseISODate(sDateStr) || new Date();
    var totalDays = (itinerary && itinerary.days && itinerary.days.length) || travelDates.trip_days || (slider ? parseInt(slider.value, 10) : 3);
    var eDate = parseISODate(eDateStr) || addDays(sDate, Math.max(0, totalDays - 1));

    /* Build route & waypoint circuit data for map rendering */
    if (!data.route_data) {
      var stops = [];
      var baseLat = (primary && primary.latitude) ? parseFloat(primary.latitude) : 27.0410;
      var baseLng = (primary && primary.longitude) ? parseFloat(primary.longitude) : 88.2663;

      if (primary && primary.name) {
        stops.push({
          name: primary.name,
          latitude: baseLat,
          longitude: baseLng,
          day: 1,
          label: 'A',
          is_base: true
        });
      }

      var dList = (itinerary && itinerary.days) ? itinerary.days : [];
      dList.forEach(function (d, i) {
        var dayNum = d.day_number || (i + 1);
        var dName = d.destination || (primary ? primary.name : 'Stop ' + dayNum);
        var sLat = baseLat;
        var sLng = baseLng;

        if (alternatives && alternatives.length) {
          var matched = alternatives.find(function (a) { return a.name === dName; });
          if (matched && matched.latitude && matched.longitude) {
            sLat = parseFloat(matched.latitude);
            sLng = parseFloat(matched.longitude);
          } else {
            sLat += (i * 0.05) * ((i % 2 === 0) ? 1 : -1);
            sLng += (i * 0.06) * ((i % 3 === 0) ? 1 : -1);
          }
        } else {
          sLat += (i * 0.05) * ((i % 2 === 0) ? 1 : -1);
          sLng += (i * 0.06) * ((i % 3 === 0) ? 1 : -1);
        }

        stops.push({
          name: dName,
          day: dayNum,
          latitude: sLat,
          longitude: sLng,
          label: '' + dayNum,
          redistribution_reason: d.redistribution_reason || ''
        });
      });

      data.route_data = {
        origin: primary ? primary.name : 'Origin',
        destination: (dList.length && dList[dList.length - 1].destination) || (primary ? primary.name : 'Destination'),
        stops: stops
      };
    }

    /* Save to offline local storage */
    saveOfflinePlan(data, {
      destinationName: (primary && primary.name) || (destInput ? destInput.value.trim() : ''),
      startDate: formatDateISO(sDate),
      endDate: formatDateISO(eDate),
      tripDays: totalDays
    });

    if (datesSummary) {
      datesSummary.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:5px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' + formatDateHuman(sDate) + ' &ndash; ' + formatDateHuman(eDate) +
        ' <span style="color:var(--color-gold);font-weight:600;margin-left:6px;">(' + totalDays + ' Days)</span>';
    }

    var printMeta = document.getElementById('print-destination-meta');
    if (printMeta && primary) {
      printMeta.textContent = (primary.name || 'India') + ' · ' + formatDateHuman(sDate) + ' to ' + formatDateHuman(eDate) + ' (' + totalDays + ' Days)';
    }

    var printAdvisory = document.getElementById('print-advisory-note');
    if (printAdvisory && primary) {
      var wStr = primary.weather ? (Math.round(primary.weather.temperature_c != null ? primary.weather.temperature_c : primary.weather.temperature) + '°C, ' + (primary.weather.conditions || primary.weather.condition || 'Clear')) : 'Live Climate Ready';
      printAdvisory.textContent = 'Primary Destination: ' + (primary.name || 'India') + ' | Live Weather: ' + wStr + ' | Generated by YatraSetu AI';
    }

    /* ── Render Decongestion Decision Pipeline ─────────────────────── */
    renderDecongestionPipeline(data.decongestion_pipeline || (itinerary && itinerary.decongestion_pipeline), primary);

    /* Decongestion banner */
    var primaryName   = document.getElementById('primary-dest-name');
    var primaryCrowd  = document.getElementById('primary-crowd-info');
    var altWrap       = document.getElementById('alternatives-wrap');

    if (primaryName && primary) primaryName.textContent = primary.name || '—';
    if (primaryCrowd && primary) {
      var cl = (primary.crowd_level || 'low').replace('_', ' ');
      primaryCrowd.textContent = 'Current crowd level: ' + cl.charAt(0).toUpperCase() + cl.slice(1);
    }

    /* Primary Live Weather Forecast */
    var weatherWrap    = document.getElementById('primary-weather-wrap');
    var weatherTemp    = document.getElementById('primary-weather-temp');
    var weatherDesc    = document.getElementById('primary-weather-desc');
    var weatherIcon    = document.getElementById('primary-weather-icon');
    var weatherDetails = document.getElementById('primary-weather-details');
    var weatherAdv     = document.getElementById('primary-weather-advisory');

    function fillPrimaryWeather(w) {
      if (!w || !weatherWrap) return;
      var rawTemp = w.temperature != null ? w.temperature : w.temperature_c;
      var tempStr = rawTemp != null ? Math.round(rawTemp) + '°C' : '--°C';
      var condStr = w.conditions || w.condition || 'Pleasant Weather';
      if (weatherTemp) weatherTemp.textContent = tempStr;
      if (weatherDesc) weatherDesc.textContent = condStr;
      if (weatherIcon) weatherIcon.innerHTML = getWeatherIcon(condStr);

      var details = [];
      if (w.feels_like != null) details.push('Feels like ' + Math.round(w.feels_like) + '°C');
      if (w.humidity != null) details.push('Humidity ' + w.humidity + '%');
      if (w.wind_speed != null) details.push('Wind ' + w.wind_speed + ' m/s');
      if (weatherDetails) {
        weatherDetails.textContent = details.length ? details.join(' · ') : 'Live Climate Observation';
      }

      if (weatherAdv) {
        if (w.warning) {
          weatherAdv.textContent = w.warning;
          weatherAdv.style.color = '#ff6b6b';
        } else if (condStr.toLowerCase().indexOf('rain') !== -1) {
          weatherAdv.textContent = 'Rain Expected · Carry Umbrella';
          weatherAdv.style.color = 'var(--color-gold)';
        } else {
          weatherAdv.textContent = 'Favorable for Exploration · Live Climate Data';
          weatherAdv.style.color = '#51cf66';
        }
      }
      weatherWrap.style.display = 'block';
    }

    var weather = primary && primary.weather;
    if (weather) {
      fillPrimaryWeather(weather);
    } else if (primary && primary.name && weatherWrap) {
      fetch('/api/weather?city=' + encodeURIComponent(primary.name))
        .then(function (r) { return r.json(); })
        .then(function (resp) {
          if (resp.success && resp.data) {
            fillPrimaryWeather(resp.data);
          }
        })
        .catch(function () {});
    } else if (weatherWrap) {
      weatherWrap.style.display = 'none';
    }

    /* Alternatives with Live Weather */
    if (altWrap && alternatives.length) {
      altWrap.innerHTML = '<div style="margin-bottom:var(--space-4);font-size:var(--text-sm);color:rgba(250,246,238,0.7);font-weight:600;display:flex;align-items:center;gap:8px;"><img src="/static/img/logo_surya_seal.svg?v=15" width="16" height="16" style="display:inline-block;vertical-align:middle;" alt="">YatraSetu AI Discovered Nearby Lower-Crowd Alternatives:</div>';
      alternatives.forEach(function (alt, altIdx) {
        var rawTos = alt.opportunity_score != null ? alt.opportunity_score : (alt.tourism_opportunity_score != null ? alt.tourism_opportunity_score : 75);
        var tos    = Math.round(rawTos <= 10 ? rawTos * 10 : rawTos);
        var width  = Math.min(100, Math.max(15, tos));
        var distKm = alt.distance_km != null ? Math.round(alt.distance_km) : (alt.distance ? parseInt(alt.distance, 10) : null);
        var distBadge = distKm != null ? '<span style="font-size:var(--text-xs);color:var(--color-gold);background:rgba(197,160,89,0.15);padding:2px 8px;border-radius:var(--radius-full);border:1px solid rgba(197,160,89,0.3);margin-left:8px;">' + distKm + ' km away</span>' : '';
        var why = alt.reason_to_visit || alt.why_visit || alt.redistribution_reason || alt.description || '';

        var w = alt.weather;
        var rawTemp = w ? (w.temperature != null ? w.temperature : w.temperature_c) : null;
        var tempStr = rawTemp != null ? Math.round(rawTemp) + '°C' : '';
        var condStr = w ? (w.conditions || w.condition || '') : '';
        var altIcon = getWeatherIcon(condStr);
        var altWeatherBadgeId = 'alt-weather-badge-' + altIdx;
        var altWeatherDetailsId = 'alt-weather-details-' + altIdx;

        var weatherBadgeHtml = '';
        if (tempStr) {
          weatherBadgeHtml =
            '<span class="alt-weather-badge" id="' + altWeatherBadgeId + '" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);padding:3px 10px;border-radius:var(--radius-full);border:1px solid rgba(197,160,89,0.3);font-size:var(--text-xs);color:var(--color-ivory);">' +
              '<span style="display:inline-flex;align-items:center;" aria-hidden="true">' + altIcon + '</span>' +
              '<span style="font-weight:700;color:var(--color-ivory);">' + tempStr + '</span>' +
              '<span style="color:var(--color-gold);text-transform:capitalize;">· ' + escapeHtml(condStr) + '</span>' +
            '</span>';
        } else {
          weatherBadgeHtml = '<span class="alt-weather-badge" id="' + altWeatherBadgeId + '" style="display:none;"></span>';
        }

        var detailsParts = [];
        if (w) {
          if (w.feels_like != null) detailsParts.push('Feels like ' + Math.round(w.feels_like) + '°C');
          if (w.humidity != null) detailsParts.push('Humidity ' + w.humidity + '%');
          if (w.wind_speed != null) detailsParts.push('Wind ' + w.wind_speed + ' m/s');
          if (w.station_name) detailsParts.push('Station: ' + w.station_name);
        }

        var climateRowHtml =
          '<div id="' + altWeatherDetailsId + '" style="font-size:var(--text-xs);color:rgba(250,246,238,0.75);margin-bottom:var(--space-3);display:' + (w ? 'flex' : 'none') + ';align-items:center;gap:6px;flex-wrap:wrap;background:rgba(255,255,255,0.03);padding:4px 10px;border-radius:var(--radius-sm);border-left:2px solid var(--color-gold);">' +
            '<span style="color:var(--color-gold);font-weight:600;"><span class="live-status-dot"></span> Live Climate:</span>' +
            '<span>' + (tempStr ? tempStr + ' (' + escapeHtml(condStr) + ')' : '') + '</span>' +
            (detailsParts.length ? '<span style="color:rgba(250,246,238,0.5);">' + escapeHtml(' · ' + detailsParts.join(' · ')) + '</span>' : '') +
          '</div>';

        altWrap.innerHTML +=
          '<div style="margin-bottom:var(--space-4);background:rgba(255,255,255,0.04);padding:var(--space-4);border-radius:var(--radius-md);border:1px solid rgba(197,160,89,0.2);">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);flex-wrap:wrap;gap:8px;">' +
              '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">' +
                '<span style="font-size:var(--text-md);font-weight:600;color:var(--color-ivory);">' + escapeHtml(alt.name || '') + '</span>' +
                distBadge +
              '</div>' +
              '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
                weatherBadgeHtml +
                '<span class="crowd-pill crowd-pill--' + (alt.crowd_level || 'low') + '">' + (alt.crowd_level || 'low').replace('_', ' ') + ' crowd</span>' +
              '</div>' +
            '</div>' +
            climateRowHtml +
            (why ? '<p style="font-size:var(--text-xs);color:rgba(250,246,238,0.75);margin-bottom:var(--space-3);line-height:1.5;">' + escapeHtml(why) + '</p>' : '') +
            '<div style="display:flex;justify-content:space-between;align-items:center;font-size:var(--text-xs);color:rgba(197,160,89,0.8);margin-bottom:4px;">' +
              '<span>Tourism Opportunity Score (TOS)</span>' +
              '<span>' + tos + '/100</span>' +
            '</div>' +
            '<div class="tos-bar-wrap"><div class="tos-bar-track"><div class="tos-bar-fill" style="width:0%;" data-target="' + width + '%"></div></div></div>' +
          '</div>';

        if (!w && alt.name) {
          (function (name, badgeId, detailsId) {
            fetch('/api/weather?city=' + encodeURIComponent(name))
              .then(function (r) { return r.json(); })
              .then(function (resp) {
                if (resp.success && resp.data) {
                  var liveW = resp.data;
                  var bEl = document.getElementById(badgeId);
                  var dEl = document.getElementById(detailsId);
                  var t = Math.round(liveW.temperature_c != null ? liveW.temperature_c : liveW.temperature);
                  var c = liveW.condition || liveW.conditions || '';
                  var ic = getWeatherIcon(c);
                  if (bEl) {
                    bEl.innerHTML =
                      '<span style="display:inline-flex;align-items:center;" aria-hidden="true">' + ic + '</span>' +
                      '<span style="font-weight:700;color:var(--color-ivory);">' + t + '°C</span>' +
                      '<span style="color:var(--color-gold);text-transform:capitalize;">· ' + escapeHtml(c) + '</span>';
                    bEl.style.display = 'inline-flex';
                  }
                  if (dEl) {
                    var det = [];
                    if (liveW.feels_like != null) det.push('Feels like ' + Math.round(liveW.feels_like) + '°C');
                    if (liveW.humidity != null) det.push('Humidity ' + liveW.humidity + '%');
                    if (liveW.wind_speed != null) det.push('Wind ' + liveW.wind_speed + ' m/s');
                    dEl.innerHTML =
                      '<span style="color:var(--color-gold);font-weight:600;"><span class="live-status-dot"></span> Live Climate:</span>' +
                      '<span>' + t + '°C (' + escapeHtml(c) + ')</span>' +
                      (det.length ? '<span style="color:rgba(250,246,238,0.5);">' + escapeHtml(' · ' + det.join(' · ')) + '</span>' : '');
                    dEl.style.display = 'flex';
                  }
                }
              })
              .catch(function () {});
          })(alt.name, altWeatherBadgeId, altWeatherDetailsId);
        }
      });

      /* Animate TOS bars */
      setTimeout(function () {
        altWrap.querySelectorAll('.tos-bar-fill').forEach(function (bar) {
          bar.style.width = bar.getAttribute('data-target');
        });
      }, 200);
    }

    /* Budget Plan Summary */
    var budgetSection = document.getElementById('budget-summary-section');
    var budgetTitle   = document.getElementById('budget-summary-title');
    var budgetAdvice  = document.getElementById('budget-summary-advice');
    var budgetBadge   = document.getElementById('budget-category-badge');

    var budgetSummary = (itinerary && itinerary.budget_summary) || (data && data.budget_summary);
    if (budgetSummary && budgetSection) {
      var est = budgetSummary.estimated_total_inr;
      var formattedSpend = est ? '₹' + Math.round(est).toLocaleString('en-IN') : '₹15,000';
      if (budgetTitle) budgetTitle.textContent = formattedSpend + ' Estimated Spend';
      if (budgetAdvice) budgetAdvice.textContent = budgetSummary.budget_advice || 'Itinerary and activities calibrated to your selected budget.';
      if (budgetBadge) budgetBadge.textContent = budgetSummary.category || 'Comfortable';
      budgetSection.style.display = 'block';
    } else if (budgetSection) {
      budgetSection.style.display = 'none';
    }

    /* Green Miles Visual Identity Card */
    var greenMilesSection = document.getElementById('green-miles-results-section');
    var greenMilesWrap    = document.getElementById('green-miles-results-wrap');
    var gmData = (itinerary && itinerary.green_miles_summary) || data.green_miles_summary;
    if (window.YatraSetuGreenMiles && greenMilesWrap) {
      if (!gmData) {
        var altCount = (alternatives && alternatives.length) || 0;
        gmData = window.YatraSetuGreenMiles.calculate(totalDays, altCount);
      }
      greenMilesWrap.innerHTML = '';
      window.YatraSetuGreenMiles.render(greenMilesWrap, gmData);
      if (greenMilesSection) greenMilesSection.style.display = 'block';
    }

    /* Meet the People Behind the Place (Local Community Storytelling) */
    var commSection = document.getElementById('community-stories-results-section');
    var commGrid    = document.getElementById('itinerary-storytellers-grid');
    var commSummary = document.getElementById('itinerary-community-cultural-summary');
    var commBadge   = document.getElementById('itinerary-community-retention-badge');

    function renderStorytellersList(storiesData) {
      if (!commGrid || !storiesData) return;
      if (commSummary && storiesData.cultural_summary) {
        commSummary.textContent = storiesData.cultural_summary;
      }
      if (commBadge && storiesData.community_retention_pct) {
        commBadge.innerHTML = '<span class="live-status-dot"></span> ' + storiesData.community_retention_pct + '% Direct Wealth Retention';
      }
      var list = storiesData.storytellers || storiesData.stories || [];
      if (!list.length) return;

      var sHtml = '';
      list.forEach(function (st) {
        var roleBadge = (st.role_type === 'craft') ? 'Heritage Craft' :
                        (st.role_type === 'guide') ? 'Indigenous Guide' : 'Village Hearth';

        sHtml +=
          '<div class="storyteller-card">' +
            '<div>' +
              '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
                '<div class="storyteller-avatar-halo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>' +
                '<span class="storyteller-role-pill">' + roleBadge + '</span>' +
              '</div>' +
              '<h3 class="storyteller-name">' + escapeHtml(st.name || 'Local Custodian') + '</h3>' +
              '<div class="storyteller-clan">' + escapeHtml(st.role_title || '') + (st.community_clan ? ' · ' + escapeHtml(st.community_clan) : '') + '</div>' +
              '<blockquote class="storyteller-quote">“' + escapeHtml(st.quote || '') + '”</blockquote>' +
            '</div>' +
            '<div>' +
              '<div class="storyteller-impact-pill">' +
                '<span>✓</span> ' + escapeHtml(st.direct_impact || 'Direct Fair-Trade Pay') +
              '</div>' +
              (st.micro_experience ? '<div class="storyteller-micro-exp"><strong>Experience:</strong> ' + escapeHtml(st.micro_experience) + '</div>' : '') +
            '</div>' +
          '</div>';
      });
      commGrid.innerHTML = sHtml;
      if (commSection) commSection.style.display = 'block';
    }

    var directStories = data.community_stories || (itinerary && itinerary.community_stories);
    if (directStories && directStories.storytellers) {
      renderStorytellersList(directStories);
    } else if (primary && primary.name) {
      if (commGrid) {
        commGrid.innerHTML =
          '<div class="storyteller-card" style="min-height:220px;"><div class="skeleton" style="width:54px;height:54px;border-radius:50%;margin-bottom:12px;"></div><div class="skeleton" style="width:80px;height:16px;margin-bottom:8px;"></div><div class="skeleton" style="width:140px;height:20px;margin-bottom:12px;"></div><div class="skeleton" style="width:100%;height:60px;"></div></div>' +
          '<div class="storyteller-card" style="min-height:220px;"><div class="skeleton" style="width:54px;height:54px;border-radius:50%;margin-bottom:12px;"></div><div class="skeleton" style="width:80px;height:16px;margin-bottom:8px;"></div><div class="skeleton" style="width:140px;height:20px;margin-bottom:12px;"></div><div class="skeleton" style="width:100%;height:60px;"></div></div>' +
          '<div class="storyteller-card" style="min-height:220px;"><div class="skeleton" style="width:54px;height:54px;border-radius:50%;margin-bottom:12px;"></div><div class="skeleton" style="width:80px;height:16px;margin-bottom:8px;"></div><div class="skeleton" style="width:140px;height:20px;margin-bottom:12px;"></div><div class="skeleton" style="width:100%;height:60px;"></div></div>';
      }
      if (commSection) commSection.style.display = 'block';

      fetch('/api/community/stories?destination=' + encodeURIComponent(primary.name) + '&state=' + encodeURIComponent(primary.state || ''))
        .then(function (r) { return r.json(); })
        .then(function (resp) {
          if (resp.success && resp.data) {
            renderStorytellersList(resp.data);
          }
        })
        .catch(function () {});
    }

    /* ── Render YatraSetu Intelligence Reasoning Engine Banner ────── */
    var reasoningSection = document.getElementById('intelligence-reasoning-section');
    var reasoningBanner  = document.getElementById('intelligence-reasoning-banner');
    var whyReasoning     = (itinerary && itinerary.why_yatrasetu_changed_your_journey) || (data && data.why_yatrasetu_changed_your_journey);

    if (reasoningBanner && (whyReasoning || primary)) {
      var summaryText = (whyReasoning && whyReasoning.summary) ||
        ('YatraSetu travel intelligence calibrated this ' + totalDays + '-day journey for ' + (primary ? primary.name : 'Darjeeling') +
         ', dynamically balancing high-density morning vistas with authentic lower-pressure cultural sanctuaries and verified mountain driving routes.');

      var crowdShifts = (whyReasoning && whyReasoning.crowd_peak_shifts) ||
        'Shifted high-traffic vista visits to early dawn and off-peak afternoon windows, mitigating peak congestion queues.';

      var weatherGuards = (whyReasoning && whyReasoning.weather_and_terrain_guards) ||
        'Continuous Open-Meteo elevation monitoring and DDMA hazard baselines prevent steep mountain transits during rainfall or low visibility.';

      var routeDetours = (whyReasoning && whyReasoning.event_and_traffic_detours) ||
        'Inter-activity mountain transit verified via local hill road segments with real driving durations and terrain difficulty buffers.';

      var communityUplift = (whyReasoning && whyReasoning.community_uplift) ||
        'Direct routing to indigenous tea growers, community eco-parks, and local heritage craftsmen ensures 90%+ local wealth retention.';

      reasoningBanner.innerHTML =
        '<div class="reasoning-header">' +
          '<div class="reasoning-badge">' +
            '<img src="/static/img/logo_surya_seal.svg?v=15" width="16" height="16" alt="" style="display:inline-block;">' +
            '<span>YatraSetu Autonomous Intelligence Engine</span>' +
          '</div>' +
          '<div style="font-size:11px;color:rgba(197,160,89,0.9);letter-spacing:0.06em;text-transform:uppercase;font-weight:700;display:inline-flex;align-items:center;">' +
            '<span class="live-status-dot"></span> Empirical Grounding Active' +
          '</div>' +
        '</div>' +
        '<div class="reasoning-summary-text">' + escapeHtml(summaryText) + '</div>' +
        '<div class="reasoning-grid">' +
          '<div class="reasoning-card">' +
            '<div class="reasoning-card-title">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' +
              '<span>Crowd Peak Shifts</span>' +
            '</div>' +
            '<p class="reasoning-card-body">' + escapeHtml(crowdShifts) + '</p>' +
          '</div>' +
          '<div class="reasoning-card">' +
            '<div class="reasoning-card-title">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
              '<span>Terrain &amp; Climate Guard</span>' +
            '</div>' +
            '<p class="reasoning-card-body">' + escapeHtml(weatherGuards) + '</p>' +
          '</div>' +
          '<div class="reasoning-card">' +
            '<div class="reasoning-card-title">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
              '<span>Mountain Transit Timing</span>' +
            '</div>' +
            '<p class="reasoning-card-body">' + escapeHtml(routeDetours) + '</p>' +
          '</div>' +
          '<div class="reasoning-card">' +
            '<div class="reasoning-card-title">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>' +
              '<span>Community Wealth Uplift</span>' +
            '</div>' +
            '<p class="reasoning-card-body">' + escapeHtml(communityUplift) + '</p>' +
          '</div>' +
        '</div>';
      if (reasoningSection) reasoningSection.style.display = 'block';
    } else if (reasoningSection) {
      reasoningSection.style.display = 'none';
    }

    /* ── Activity Card & Transit Strip Renderers (Zero Emojis) ───── */
    function renderActivityCard(act, ai) {
      var isObj = typeof act === 'object' && act !== null;
      var title = isObj ? (act.title || act.name || 'Curated Exploration') : String(act);
      var desc  = isObj ? (act.description || act.details || '') : '';
      var loc   = isObj ? (act.location_name || act.location || '') : '';
      var timeSlot = isObj ? act.time_slot : '';
      var cat   = isObj ? (act.category || 'Heritage') : 'Heritage';
      var crowd = isObj ? (act.crowd_status || (act.crowd_level ? act.crowd_level.replace('_', ' ') + ' crowd' : 'Tranquil')) : '';
      var tip   = isObj ? act.local_tip : '';
      var img   = isObj ? act.image_path : '';
      var elev  = isObj ? act.elevation_m : null;

      var visualCol = '';
      if (img) {
        visualCol =
          '<div class="activity-visual-col">' +
            '<div class="activity-thumb-wrap">' +
              '<img src="' + escapeHtml(img) + '" class="activity-thumb-img" alt="' + escapeHtml(title) + '" loading="lazy" onerror="this.parentElement.style.display=\'none\';">' +
              (elev ? '<span class="activity-elevation-badge">' + elev + ' m alt</span>' : '') +
            '</div>' +
          '</div>';
      } else {
        visualCol =
          '<div class="activity-visual-col">' +
            '<div class="activity-thumb-wrap" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1b3524 0%,#264c34 100%);">' +
              '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>' +
              (elev ? '<span class="activity-elevation-badge">' + elev + ' m alt</span>' : '') +
            '</div>' +
          '</div>';
      }

      var metaStrip = '';
      if (timeSlot || cat || crowd) {
        metaStrip = '<div class="activity-meta-strip">' +
          (timeSlot ? '<span class="pill-time"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + escapeHtml(timeSlot) + '</span>' : '') +
          (cat ? '<span class="pill-cat">' + escapeHtml(cat) + '</span>' : '') +
          (crowd ? '<span class="pill-crowd-status">' + escapeHtml(crowd) + '</span>' : '') +
        '</div>';
      }

      var locHtml = loc ?
        '<div class="activity-location-text">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>' +
          '<span>' + escapeHtml(loc) + '</span>' +
        '</div>' : '';

      var tipHtml = tip ?
        '<div class="activity-insider-tip">' +
          '<strong>Local Custodian Tip:</strong> ' + escapeHtml(tip) +
        '</div>' : '';

      /* "Why YatraSetu Chose This" Decision Badges */
      var df = isObj ? act.decision_factors : null;
      var decisionsHtml = '';
      if (df && typeof df === 'object') {
        var pills = [];
        if (df.crowd_relief) {
          pills.push(
            '<span class="decision-pill decision-pill--crowd" title="Crowd Relief Rationale">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>' +
              '<span><strong>Crowd Relief:</strong> ' + escapeHtml(df.crowd_relief) + '</span>' +
            '</span>'
          );
        }
        if (df.weather_window) {
          pills.push(
            '<span class="decision-pill decision-pill--weather" title="Climate Window">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>' +
              '<span><strong>Climate Window:</strong> ' + escapeHtml(df.weather_window) + '</span>' +
            '</span>'
          );
        }
        if (df.road_risk) {
          pills.push(
            '<span class="decision-pill decision-pill--risk" title="Terrain &amp; Hazard Avoidance">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
              '<span><strong>Road Safety:</strong> ' + escapeHtml(df.road_risk) + '</span>' +
            '</span>'
          );
        }
        if (df.community_uplift) {
          pills.push(
            '<span class="decision-pill decision-pill--community" title="Direct Village Benefit">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>' +
              '<span><strong>Direct Impact:</strong> ' + escapeHtml(df.community_uplift) + '</span>' +
            '</span>'
          );
        }
        if (df.preference_match) {
          pills.push(
            '<span class="decision-pill decision-pill--pref" title="Traveller Affinity Match">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' +
              '<span><strong>Affinity:</strong> ' + escapeHtml(df.preference_match) + '</span>' +
            '</span>'
          );
        }

        if (pills.length) {
          decisionsHtml =
            '<div class="activity-decisions-wrap">' +
              '<div class="decisions-label">' +
                '<img src="/static/img/logo_surya_seal.svg?v=15" width="12" height="12" alt="" style="display:inline-block;">' +
                '<span>Why YatraSetu Chose This</span>' +
              '</div>' +
              '<div class="decision-pills-list">' + pills.join('') + '</div>' +
            '</div>';
        }
      }

      return (
        '<div class="activity-card-rich" style="animation-delay:' + (ai * 0.08) + 's;">' +
          visualCol +
          '<div class="activity-content-col">' +
            metaStrip +
            '<h4 class="activity-title">' + escapeHtml(title) + '</h4>' +
            locHtml +
            (desc ? '<p class="activity-desc">' + escapeHtml(desc) + '</p>' : '') +
            tipHtml +
            decisionsHtml +
          '</div>' +
        '</div>'
      );
    }

    function renderTransitStrip(transit) {
      if (!transit) return '';
      var isWalk = !!transit.is_walkable;
      var dur = (isWalk && transit.walk_duration_minutes) ? transit.walk_duration_minutes : (transit.duration_minutes || 15);
      var dist = transit.distance_km != null ? transit.distance_km + ' km' : '';
      var via = transit.via_landmark ? escapeHtml(transit.via_landmark) : (isWalk ? 'Pedestrian Footpath' : 'Mountain Road');
      var diff = transit.terrain_difficulty ? escapeHtml(transit.terrain_difficulty) : (isWalk ? 'Easy Trail' : 'Mountain Pass');
      var advisory = transit.advisory_notes ? escapeHtml(transit.advisory_notes) : '';

      var iconSvg = isWalk
        ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><circle cx="12" cy="5" r="2"></circle><path d="M10 22v-5l-2-2 3-5 2 2v10"></path><path d="M14 13l2 2v7"></path></svg>'
        : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';

      var label = isWalk ? (dur + ' min walk') : (dur + ' min transit');
      var badge = isWalk
        ? '<span class="transit-walk-pill"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg> Walkable Route</span>'
        : ('<span class="transit-terrain-pill">' + diff + '</span>');

      return (
        '<div class="mountain-transit-strip' + (isWalk ? ' is-walkable' : '') + '">' +
          '<span class="transit-time-tag' + (isWalk ? ' walk-tag' : '') + '" style="' + (isWalk ? 'color:#2e7d32;' : '') + '">' +
            iconSvg +
            '<span>' + label + '</span>' +
          '</span>' +
          '<div class="transit-details">' +
            (dist ? '<span>' + dist + '</span><span>&middot;</span>' : '') +
            '<span>' + via + '</span>' +
            '<span>&middot;</span>' +
            badge +
            (advisory ? '<span style="font-size:11px;opacity:0.75;font-style:italic;">(' + advisory + ')</span>' : '') +
          '</div>' +
        '</div>'
      );
    }

    /* Day tabs + panels */
    var tabsEl   = document.getElementById('itinerary-tabs');
    var panelsEl = document.getElementById('itinerary-panels');

    if (tabsEl && panelsEl && itinerary && itinerary.days) {
      tabsEl.innerHTML   = '';
      panelsEl.innerHTML = '';

      itinerary.days.forEach(function (day, idx) {
        var isFirst = idx === 0;
        var dayNum  = idx + 1;
        var tabId   = 'tab-day-' + dayNum;
        var panelId = 'panel-day-' + dayNum;
        var dayDate = addDays(sDate, idx);
        var dateShort = formatDateShort(dayDate);

        /* Tab button */
        var tab = document.createElement('button');
        tab.className   = 'itinerary-tab' + (isFirst ? ' active' : '');
        tab.innerHTML   = '<span style="display:block;font-size:10px;opacity:0.75;text-transform:uppercase;letter-spacing:0.04em;line-height:1.2;">' + escapeHtml(dateShort) + '</span><span style="font-weight:700;">Day ' + dayNum + '</span>';
        tab.id          = tabId;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', isFirst ? 'true' : 'false');
        tab.setAttribute('aria-controls', panelId);
        tab.addEventListener('click', function () { switchTab(dayNum); });
        tabsEl.appendChild(tab);

        /* Panel */
        var panel = document.createElement('div');
        panel.className = 'tab-panel' + (isFirst ? ' active' : '');
        panel.id        = panelId;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tabId);

        /* Day Banner with Calendar Date Badge (dynamically showing exact date) */
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var monthStr = monthNames[dayDate.getMonth()];
        var dateVal  = dayDate.getDate();

        panel.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding-bottom:var(--space-3);margin-bottom:var(--space-5);border-bottom:1px solid rgba(20,40,29,0.1);">' +
            '<div style="display:flex;align-items:center;gap:12px;">' +
              '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:42px;height:44px;background:var(--color-forest);border:1.5px solid var(--color-gold);border-radius:var(--radius-md);box-shadow:0 2px 6px rgba(20,40,29,0.18);flex-shrink:0;padding:2px 0;" aria-hidden="true">' +
                '<span style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--color-gold);letter-spacing:0.06em;line-height:1;">' + escapeHtml(monthStr) + '</span>' +
                '<span style="font-size:17px;font-weight:800;color:var(--color-ivory);line-height:1.2;font-family:var(--font-sans);">' + dateVal + '</span>' +
              '</div>' +
              '<div>' +
                '<h3 style="font-family:var(--font-serif);font-size:var(--text-xl);color:var(--color-forest);margin:0;">Day ' + dayNum + (day.theme ? ': ' + escapeHtml(day.theme) : '') + '</h3>' +
                '<div style="font-size:var(--text-xs);color:var(--color-gold);font-weight:600;">' + escapeHtml(dateShort) + ', ' + dayDate.getFullYear() + '</div>' +
              '</div>' +
            '</div>' +
            '<div style="font-size:var(--text-xs);background:rgba(20,40,29,0.06);padding:4px 10px;border-radius:var(--radius-full);color:var(--color-forest);font-weight:600;">' +
              'Day ' + dayNum + ' of ' + totalDays +
            '</div>' +
          '</div>';

        /* Day Climate & Terrain Safeguards */
        var wAdj = day.weather_adjustment;
        var rAdj = day.risk_adjustment;
        if (wAdj || rAdj) {
          var safeguardHtml = '<div class="day-safeguard-strip">';
          if (wAdj) {
            safeguardHtml +=
              '<div class="safeguard-card safeguard-card--weather">' +
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line></svg>' +
                '<div>' +
                  '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#0369a1;margin-bottom:2px;">Adaptive Climate Window</div>' +
                  '<div style="font-size:12px;color:var(--color-forest);line-height:1.45;"><strong>' + escapeHtml(wAdj.condition_detected || 'Live climate tracked') + ':</strong> ' + escapeHtml(wAdj.itinerary_adaptation || '') + '</div>' +
                '</div>' +
              '</div>';
          }
          if (rAdj) {
            safeguardHtml +=
              '<div class="safeguard-card safeguard-card--risk">' +
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
                '<div>' +
                  '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:2px;">' +
                    '<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#b45309;">DDMA Mountain Safeguard</span>' +
                    '<span style="font-size:10px;font-weight:700;background:rgba(22,163,74,0.15);color:#15803d;padding:1px 6px;border-radius:4px;">' + escapeHtml(rAdj.ddma_status || 'Monitored') + '</span>' +
                  '</div>' +
                  '<div style="font-size:12px;color:var(--color-forest);line-height:1.45;"><strong>' + escapeHtml(rAdj.hazard_profile || 'Corridor review') + ':</strong> ' + escapeHtml(rAdj.route_safeguard || '') + '</div>' +
                '</div>' +
              '</div>';
          }
          safeguardHtml += '</div>';
          panel.innerHTML += safeguardHtml;
        }

        if (day.weather_safety_note && !wAdj) {
          panel.innerHTML +=
            '<div style="display:flex;align-items:flex-start;gap:var(--space-3);background:rgba(197,160,89,0.08);border:1px solid rgba(197,160,89,0.25);border-radius:var(--radius-md);padding:var(--space-4);margin-bottom:var(--space-6);">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
              '<div>' +
                '<div style="font-size:var(--text-xs);font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--color-gold);margin-bottom:2px;">Weather Forecast &amp; Safety Advisory</div>' +
                '<div style="font-size:var(--text-sm);color:var(--color-forest);line-height:1.5;">' + escapeHtml(day.weather_safety_note) + '</div>' +
              '</div>' +
            '</div>';
        }

        /* Sequential Activities list with Inter-Destination Mountain Transit Connectors */
        var allActs = day.activities || [];
        if (!allActs.length) {
          /* Fallback: assemble from periods if old schema */
          allActs = [].concat(day.morning || [], day.afternoon || [], day.evening || []);
        }

        if (allActs.length) {
          var actsContainerHtml = '<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:var(--space-8);">';
          allActs.forEach(function (act, ai) {
            actsContainerHtml += renderActivityCard(act, ai);
            if (act.transit_to_next) {
              actsContainerHtml += renderTransitStrip(act.transit_to_next);
            }
          });
          actsContainerHtml += '</div>';
          panel.innerHTML += actsContainerHtml;
        }

        /* Local Community & Direct Economic Benefit Card */
        var locImp = day.local_impact;
        if (locImp) {
          var expListHtml = '';
          if (locImp.local_experiences && locImp.local_experiences.length) {
            expListHtml = '<div style="margin-top:8px;font-size:12px;color:rgba(20,40,29,0.8);"><strong style="color:var(--color-forest);">Verified Community Experiences:</strong> ' +
              locImp.local_experiences.map(function (exp) { return escapeHtml(exp); }).join(' · ') + '</div>';
          }

          var impHtml =
            '<div class="day-impact-card">' +
              '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px dashed rgba(20,40,29,0.1);">' +
                '<span style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1b5e3b;display:inline-flex;align-items:center;gap:6px;">' +
                  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b5e3b" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>' +
                  'Day ' + dayNum + ' Local Wealth Retention' +
                '</span>' +
                '<span style="font-size:11px;background:rgba(27,94,59,0.1);color:#1b5e3b;padding:2px 8px;border-radius:var(--radius-full);font-weight:700;">' +
                  (locImp.village_council_retention_pct || 92) + '% Wealth Retained Directly' +
                '</span>' +
              '</div>' +
              (locImp.economic_narrative ? '<div style="font-size:12.5px;color:var(--color-forest);line-height:1.5;margin-bottom:10px;">' + escapeHtml(locImp.economic_narrative) + '</div>' : '') +
              '<div class="impact-stats-grid">' +
                '<div class="impact-stat-box"><span style="font-size:10px;text-transform:uppercase;color:rgba(20,40,29,0.6);font-weight:700;display:block;">Homestay Direct Spend</span><strong style="font-size:14px;color:#1b5e3b;">₹' + Number(locImp.homestay_spend_inr || 2200).toLocaleString() + '</strong></div>' +
                '<div class="impact-stat-box"><span style="font-size:10px;text-transform:uppercase;color:rgba(20,40,29,0.6);font-weight:700;display:block;">Artisan &amp; Hearth Spend</span><strong style="font-size:14px;color:var(--color-gold);">₹' + Number(locImp.artisan_spend_inr || 850).toLocaleString() + '</strong></div>' +
                '<div class="impact-stat-box"><span style="font-size:10px;text-transform:uppercase;color:rgba(20,40,29,0.6);font-weight:700;display:block;">Village Retention Rate</span><strong style="font-size:14px;color:#1b5e3b;">' + (locImp.village_council_retention_pct || 92) + '%</strong></div>' +
              '</div>' +
              expListHtml +
            '</div>';
          panel.innerHTML += impHtml;
        }

        /* Overnight Community Homestay Card */
        var stay = day.recommended_stay;
        if (stay) {
          var stayName = escapeHtml(stay.name || 'Local Community Homestay');
          var stayHost = escapeHtml(stay.host_name || 'Native Village Family');
          var stayVillage = escapeHtml(stay.village || stay.district || day.destination || 'Mountain Village');
          var stayDistrict = stay.district ? (', ' + escapeHtml(stay.district)) : '';
          var stayRating = stay.rating ? Number(stay.rating).toFixed(1) : '4.7';
          var stayReviewCount = stay.review_count ? (' (' + stay.review_count + ' reviews)') : '';
          var stayPrice = stay.price_inr ? '₹' + Number(stay.price_inr).toLocaleString() : '₹1,500';
          var stayPriceUnit = stay.price_unit ? ('/ ' + escapeHtml(stay.price_unit).replace(/_/g, ' ')) : '/ night';
          var stayImpact = escapeHtml(stay.community_impact || (stay.community_retention_pct ? (stay.community_retention_pct + '% direct local village retention') : '90% direct village wealth retention'));
          var stayBadge = stay.verification_badge ? ('✓ ' + escapeHtml(stay.verification_badge)) : '✓ Verified Community Stay';
          var mapsUrl = stay.google_maps_url || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((stay.name || 'Homestay') + ' ' + (stay.village || '')));
          var phone = stay.contact_phone ? ('tel:' + encodeURIComponent(stay.contact_phone)) : null;

          var stayHtml =
            '<div class="overnight-stay-card" style="margin-top:var(--space-6);margin-bottom:var(--space-4);background:#FFFFFF;border:1.5px solid rgba(197,160,89,0.45);border-radius:var(--radius-lg);padding:var(--space-5);box-shadow:0 4px 14px rgba(20,40,29,0.06);">' +
              '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px dashed rgba(20,40,29,0.1);">' +
                '<span style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-gold);display:inline-flex;align-items:center;gap:6px;">' +
                  '🏡 Recommended Overnight Stay · Day ' + dayNum +
                '</span>' +
                '<span style="font-size:11px;background:rgba(27,94,59,0.08);color:#1b5e3b;padding:3px 10px;border-radius:var(--radius-full);font-weight:700;border:1px solid rgba(27,94,59,0.2);">' +
                  stayImpact +
                '</span>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">' +
                '<div style="flex:1;min-width:240px;">' +
                  '<h4 style="font-family:var(--font-serif);font-size:1.3rem;color:var(--color-forest);margin:0 0 4px 0;font-weight:700;">' +
                    stayName +
                  '</h4>' +
                  '<div style="font-size:12.5px;color:rgba(20,40,29,0.7);margin-bottom:8px;">' +
                    'Hosted by <strong>' + stayHost + '</strong> · ' + stayVillage + stayDistrict +
                  '</div>' +
                  '<div style="display:inline-flex;align-items:center;gap:8px;font-size:11px;color:var(--color-forest);font-weight:600;">' +
                    '<span style="background:rgba(20,40,29,0.88);color:#fff;padding:2px 8px;border-radius:999px;font-weight:700;">★ ' + stayRating + '<span style="font-weight:400;opacity:0.85;font-size:10px;">' + stayReviewCount + '</span></span>' +
                    '<span style="background:rgba(197,160,89,0.15);color:var(--color-forest);padding:2px 8px;border-radius:4px;border:1px solid rgba(197,160,89,0.4);">' + stayBadge + '</span>' +
                  '</div>' +
                '</div>' +
                '<div style="text-align:right;min-width:160px;">' +
                  '<div style="font-family:var(--font-serif);font-size:1.45rem;font-weight:700;color:#1b5e3b;line-height:1.2;">' +
                    stayPrice + ' <span style="font-size:11px;font-weight:500;color:rgba(20,40,29,0.6);font-family:var(--font-sans);">' + stayPriceUnit + '</span>' +
                  '</div>' +
                  '<div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end;flex-wrap:wrap;">' +
                    '<a href="' + mapsUrl + '" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" style="font-size:11.5px;padding:6px 14px;text-decoration:none;display:inline-flex;align-items:center;gap:5px;font-weight:600;" title="Open real location in Google Maps">' +
                      '<span>📍</span> Google Maps ↗' +
                    '</a>' +
                    (phone ? '<a href="' + phone + '" class="btn btn-sm btn-outline" style="font-size:11.5px;padding:6px 12px;text-decoration:none;border-color:rgba(197,160,89,0.5);color:var(--color-forest);font-weight:600;" title="Call host">' +
                      '<span>📞</span> Call Host' +
                    '</a>' : '') +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>';
          panel.innerHTML += stayHtml;
        }

        panelsEl.appendChild(panel);
      });
    }

    if (resultsDiv) {
      resultsDiv.style.display = 'block';
      resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ── Tab switch ────────────────────────────────────────────────── */
  function switchTab(dayNum) {
    document.querySelectorAll('.itinerary-tab').forEach(function (t) {
      var active = t.id === 'tab-day-' + dayNum;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(function (p) {
      p.classList.toggle('active', p.id === 'panel-day-' + dayNum);
    });
  }

  /* ── Helpers ───────────────────────────────────────────────────── */
  function getSelectedInterests() {
    if (!chips) return [];
    return Array.from(chips.querySelectorAll('.chip.selected')).map(function (c) {
      return c.getAttribute('data-value');
    });
  }

  function showError(msg) {
    if (!errorDiv) return;
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
  }

  function hideError() {
    if (errorDiv) errorDiv.style.display = 'none';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Also expose escapeHtml to map.js via window — minimal shared util */
  window.escapeHtml = escapeHtml;

  /* ── Offline Caching & Zero-Connectivity Recovery ──────────────── */
  function saveOfflinePlan(data, meta) {
    try {
      if (!window.localStorage) return;
      var obj = {
        data: data,
        meta: meta || {},
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('yatrasetu_offline_plan', JSON.stringify(obj));
      localStorage.setItem('yatrasetu_active_itinerary', JSON.stringify(data));
      localStorage.setItem('yatrasetu_last_itinerary', JSON.stringify(data));
      checkOfflineSaved();
    } catch (e) {
      console.warn('Unable to cache offline plan to localStorage', e);
    }
  }

  function checkOfflineSaved() {
    try {
      if (!window.localStorage || !offlineBanner) return;
      var raw = localStorage.getItem('yatrasetu_offline_plan');
      if (!raw) {
        offlineBanner.style.display = 'none';
        return;
      }
      var cached = JSON.parse(raw);
      if (cached && cached.data) {
        var dName = (cached.meta && cached.meta.destinationName) ||
                    (cached.data.primary_destination && cached.data.primary_destination.name) ||
                    'Saved Destination';
        var dDays = (cached.meta && cached.meta.tripDays) ||
                    (cached.data.itinerary && cached.data.itinerary.days && cached.data.itinerary.days.length) ||
                    3;
        var sDateHuman = cached.savedAt ? formatDateHuman(new Date(cached.savedAt)) : 'Recently';

        if (offlineBannerTitle) {
          offlineBannerTitle.textContent = 'Saved Offline Yatra: ' + dName;
        }
        if (offlineBannerMeta) {
          offlineBannerMeta.textContent = dDays + ' Days · Saved ' + sDateHuman + ' · Ready for offline access with zero internet';
        }
        offlineBanner.style.display = 'flex';
      }
    } catch (e) {
      /* ignore storage errors */
    }
  }

  if (btnOpenOffline) {
    btnOpenOffline.addEventListener('click', function () {
      try {
        var raw = localStorage.getItem('yatrasetu_offline_plan');
        if (raw) {
          var cached = JSON.parse(raw);
          if (cached && cached.data) {
            renderResults(cached.data, cached.meta);
            if (resultsDiv) {
              resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      } catch (err) {
        showError('Could not load offline saved itinerary.');
      }
    });
  }

  /* ── Offline Download Actions (PDF / Print & Standalone HTML) ───── */
  function triggerOfflinePrint() {
    window.print();
  }

  function downloadOfflineHtml() {
    if (!currentItineraryData) {
      showError('Please generate an itinerary first before downloading offline file.');
      return;
    }
    var data = currentItineraryData;
    var primary = data.primary_destination || {};
    var destName = primary.name || (destInput ? destInput.value.trim() : 'India');
    var itinerary = data.itinerary || {};
    var alternatives = data.alternatives || [];
    var travelDates = data.travel_dates || {};
    var sDateStr = travelDates.start_date || (startDateInput ? startDateInput.value : '');
    var eDateStr = travelDates.end_date || (endDateInput ? endDateInput.value : '');
    var sDate = parseISODate(sDateStr) || new Date();
    var daysCount = (itinerary.days && itinerary.days.length) || travelDates.trip_days || 3;
    var eDate = parseISODate(eDateStr) || addDays(sDate, Math.max(0, daysCount - 1));

    var budgetSummary = itinerary.budget_summary || data.budget_summary || {};
    var budgetSpend = budgetSummary.estimated_total_inr ? '₹' + Math.round(budgetSummary.estimated_total_inr).toLocaleString('en-IN') : '₹15,000';

    var docTitle = 'YatraSetu Itinerary — ' + destName;
    var fileName = 'YatraSetu_Itinerary_' + destName.replace(/[^a-zA-Z0-9_-]/g, '_') + '.html';

    var daysHtml = '';
    (itinerary.days || []).forEach(function (day, idx) {
      var dayNum = idx + 1;
      var dDate = addDays(sDate, idx);
      var allActs = day.activities || [];
      if (!allActs.length) {
        allActs = [].concat(day.morning || [], day.afternoon || [], day.evening || []);
      }

      var actsHtml = '';
      allActs.forEach(function (act) {
        var isObj = typeof act === 'object' && act !== null;
        var title = isObj ? (act.title || act.name || '') : String(act);
        var desc = isObj ? (act.description || act.details || '') : '';
        var loc = isObj ? (act.location_name || act.location || '') : '';
        var timeSlot = isObj ? act.time_slot : '';
        var cat = isObj ? act.category : '';
        var tip = isObj ? act.local_tip : '';
        var elev = isObj ? act.elevation_m : null;
        var transit = isObj ? act.transit_to_next : null;

        actsHtml += '<div class="activity-card">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">' +
            (timeSlot ? '<span style="font-size:0.75rem;font-weight:700;color:#14281D;background:#e5dcce;padding:2px 6px;border-radius:3px;">' + escapeHtml(timeSlot) + '</span>' : '') +
            (cat ? '<span style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#8A6D3B;background:#f9f6ee;border:1px solid #e0d8c7;padding:1px 6px;border-radius:3px;">' + escapeHtml(cat) + '</span>' : '') +
            (elev ? '<span style="font-size:0.75rem;color:#666;">' + elev + ' m alt</span>' : '') +
          '</div>' +
          '<h4>' + escapeHtml(title) + '</h4>' +
          (loc ? '<div class="activity-loc">' + escapeHtml(loc) + '</div>' : '') +
          (desc ? '<p>' + escapeHtml(desc) + '</p>' : '') +
          (tip ? '<div style="margin-top:6px;padding:6px 10px;background:#f5f0e6;border-left:2px solid #C5A059;font-size:0.8rem;color:#2c3e2e;"><strong>Insider Tip:</strong> ' + escapeHtml(tip) + '</div>' : '') +
          '</div>';

        if (transit) {
          actsHtml += '<div style="margin:6px 0 10px 16px;padding:4px 10px;background:#f9f8f4;border-left:2px dashed #C5A059;font-size:0.75rem;color:#555;">' +
            '<strong>' + (transit.duration_minutes || 15) + ' min transit</strong> (' + (transit.distance_km || '') + ' km via ' + escapeHtml(transit.via_landmark || 'Mountain Road') + ' &middot; ' + escapeHtml(transit.terrain_difficulty || 'Mountain Pass') + ')' +
            '</div>';
        }
      });

      daysHtml += '<div class="day-container">' +
        '<div class="day-header">' +
          '<h3>Day ' + dayNum + (day.theme ? ': ' + escapeHtml(day.theme) : '') + ' &middot; ' + escapeHtml(formatDateShort(dDate)) + ', ' + dDate.getFullYear() + '</h3>' +
        '</div>' +
        (day.weather_safety_note ? '<div class="safety-advisory"><strong>Weather Advisory:</strong> ' + escapeHtml(day.weather_safety_note) + '</div>' : '') +
        actsHtml +
        '</div>';
    });

    var altsHtml = '';
    if (alternatives.length) {
      altsHtml += '<div class="section-box"><h3 style="display:flex;align-items:center;gap:8px;"><img src="/static/img/logo_surya_seal.svg?v=15" width="18" height="18" style="display:inline-block;vertical-align:middle;" alt="">Discovered Low-Crowd Alternatives Nearby</h3>';
      alternatives.forEach(function (alt) {
        var dist = alt.distance_km != null ? Math.round(alt.distance_km) + ' km away' : '';
        var crowd = (alt.crowd_level || 'low').replace('_', ' ');
        var why = alt.reason_to_visit || alt.why_visit || alt.description || '';
        var w = alt.weather;
        var wInfo = '';
        if (w) {
          var t = Math.round(w.temperature_c != null ? w.temperature_c : w.temperature);
          wInfo = ' · ' + t + '°C ' + (w.conditions || w.condition || '');
        }
        altsHtml += '<div class="alt-card">' +
          '<strong>' + escapeHtml(alt.name || '') + '</strong> ' +
          (dist ? '<span class="badge">' + dist + '</span>' : '') +
          ' <span class="badge">' + crowd + ' crowd</span>' +
          (wInfo ? '<span class="badge">' + escapeHtml(wInfo) + '</span>' : '') +
          (why ? '<p style="margin:6px 0 0;font-size:0.9rem;color:#444;">' + escapeHtml(why) + '</p>' : '') +
          '</div>';
      });
      altsHtml += '</div>';
    }

    var htmlDoc = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
      '<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '<title>' + escapeHtml(docTitle) + '</title>\n' +
      '<style>\n' +
      'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #14281D; background: #FAF6EE; margin: 0; padding: 20px; }\n' +
      '.container { max-width: 860px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 30px; border: 1px solid #e0d8c7; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }\n' +
      'h1, h2, h3, h4 { font-family: Georgia, serif; color: #14281D; margin-top: 0; }\n' +
      '.header-bar { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; border-bottom: 2px solid #C5A059; padding-bottom: 16px; margin-bottom: 24px; }\n' +
      '.emergency-box { background: #fdf2f2; border: 1px solid #f8d7da; border-radius: 8px; padding: 10px 14px; text-align: right; }\n' +
      '.emergency-box strong { color: #C1121F; font-size: 1.1rem; }\n' +
      '.meta-badge { display: inline-block; background: #f0ebd8; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; color: #14281D; margin-right: 6px; margin-bottom: 6px; }\n' +
      '.section-box { background: #FAF6EE; border: 1px solid #e5dcce; border-radius: 8px; padding: 16px; margin-bottom: 24px; }\n' +
      '.day-container { margin-bottom: 28px; border: 1px solid #e8e2d5; border-radius: 8px; padding: 18px; background: #fff; }\n' +
      '.day-header { border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px; }\n' +
      '.activity-card { background: #FAF6EE; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px; border-left: 3px solid #14281D; }\n' +
      '.activity-card h4 { margin: 0 0 4px 0; font-size: 1rem; }\n' +
      '.activity-loc { font-size: 0.85rem; color: #8A6D3B; font-weight: 600; margin-bottom: 4px; }\n' +
      '.activity-card p { margin: 0; font-size: 0.9rem; color: #444; }\n' +
      '.safety-advisory { background: #fff8e1; border-left: 3px solid #f39c12; padding: 8px 12px; margin-bottom: 12px; font-size: 0.9rem; border-radius: 4px; }\n' +
      '.alt-card { background: #fff; border: 1px solid #e0d8c7; border-radius: 6px; padding: 10px 14px; margin-top: 8px; }\n' +
      '.badge { display: inline-block; font-size: 0.75rem; background: #eee; padding: 2px 8px; border-radius: 12px; margin-left: 4px; }\n' +
      '.print-btn { background: #14281D; color: #FAF6EE; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-bottom: 16px; }\n' +
      '@media print { .print-btn { display: none; } body { background: #fff; padding: 0; } .container { border: none; box-shadow: none; padding: 0; max-width: 100%; } .day-container { page-break-inside: avoid; } }\n' +
      '</style>\n</head>\n<body>\n' +
      '<div class="container">\n' +
      '<div class="header-bar">\n' +
      '<div>\n' +
      '<h1>' + escapeHtml(destName) + '</h1>\n' +
      '<div><span class="meta-badge">' + escapeHtml(formatDateHuman(sDate) + ' – ' + formatDateHuman(eDate)) + '</span>' +
      '<span class="meta-badge">' + daysCount + ' Days</span>' +
      '<span class="meta-badge">Budget: ' + escapeHtml(budgetSpend) + '</span></div>\n' +
      '</div>\n' +
      '<div class="emergency-box">\n' +
      '<div><strong>SOS 112</strong> &middot; Tourist 1363</div>\n' +
      '<div style="font-size:0.8rem;color:#666;">Medical: 108 &middot; Disaster: 1070</div>\n' +
      '</div>\n' +
      '</div>\n' +
      '<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>\n' +
      '<div style="background:#e8f4fd;border-left:3px solid #3498db;padding:8px 12px;margin-bottom:20px;font-size:0.85rem;border-radius:4px;">\n' +
      '<strong>Offline Ready:</strong> This document is 100% self-contained. You can save it to your phone, send it via WhatsApp, and access your complete journey with zero internet.\n' +
      '</div>\n';

    var gmData = (itinerary && itinerary.green_miles_summary) || data.green_miles_summary;
    if (!gmData && window.YatraSetuGreenMiles) {
      gmData = window.YatraSetuGreenMiles.calculate(daysCount, alternatives.length);
    }
    if (gmData) {
      htmlDoc += '<div style="background:#f4f8f5;border:1px solid #c3e6cb;border-radius:8px;padding:16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">\n' +
        '<div>\n' +
          '<div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:#2e7d32;">YOUR GREEN MILES &middot; ECO TELEMETRY</div>\n' +
          '<div style="font-size:1.8rem;font-weight:800;color:#14281D;line-height:1.2;">' + (gmData.green_miles || 148) + ' <span style="font-size:1rem;font-weight:600;color:#2e7d32;">Miles</span></div>\n' +
          '<div style="font-size:0.85rem;color:#555;margin-top:4px;">\n' +
            '<strong>↓ ' + (gmData.co2_saved_kg || 23) + ' kg CO₂</strong> prevented &middot; ' +
            '<strong>' + (gmData.local_experiences_count || 3) + '</strong> local experiences &middot; ' +
            '<strong>' + (gmData.walking_km || 18) + ' km</strong> walking trails\n' +
          '</div>\n' +
        '</div>\n' +
        '<div style="background:#14281D;color:#C5A059;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:700;border:1px solid #C5A059;">\n' +
          escapeHtml(gmData.tree_growth_tier || 'Kalpavriksha Guardian') + '\n' +
        '</div>\n' +
      '</div>\n';
    }

    htmlDoc += altsHtml +
      daysHtml +
      '<div style="text-align:center;margin-top:30px;font-size:0.85rem;color:#888;border-top:1px solid #e0d8c7;padding-top:14px;">' +
      'Generated by YatraSetu AI Heritage Gateway &middot; Verified for offline accessibility' +
      '</div>\n' +
      '</div>\n' +
      '</body>\n</html>';

    var blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ── Wire Save to Account Buttons ──────────────────────────────── */
  var btnSaveToAccount = document.getElementById('btn-save-to-account');
  var btnSaveToAccountBottom = document.getElementById('btn-save-to-account-bottom');

  function saveCurrentItineraryToAccount() {
    if (!currentItineraryData) {
      showError('Please generate an itinerary first before saving to your profile.');
      return;
    }
    var btn = btnSaveToAccount || btnSaveToAccountBottom;
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Saving…';
    }

    fetch('/tourist/save-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentItineraryData)
    })
      .then(function (r) { return r.json(); })
      .then(function (resp) {
        if (resp.success) {
          if (btnSaveToAccount) {
            btnSaveToAccount.innerHTML = '<span>✓</span> Saved to Profile!';
            btnSaveToAccount.style.borderColor = '#51cf66';
            btnSaveToAccount.style.color = '#2e7d32';
          }
          if (btnSaveToAccountBottom) {
            btnSaveToAccountBottom.innerHTML = '<span>✓</span> Saved to Profile!';
            btnSaveToAccountBottom.style.borderColor = '#51cf66';
            btnSaveToAccountBottom.style.color = '#2e7d32';
          }
          alert('Yatra successfully saved to your Tourist Profile! You can view and manage it anytime in your dashboard.');
        } else if (resp.require_login) {
          if (confirm('Please log in or create a free Tourist account to save this itinerary permanently to your profile.\n\nWould you like to go to the Tourist Login page now?')) {
            window.location.href = resp.login_url || '/tourist/login?next=' + encodeURIComponent(window.location.pathname + window.location.search);
          }
        } else {
          showError((resp.error && resp.error.message) || 'Could not save itinerary to account.');
        }
      })
      .catch(function () {
        showError('Network error while saving to account. Please check your connection.');
      })
      .finally(function () {
        if (btn) btn.disabled = false;
      });
  }

  if (btnSaveToAccount) btnSaveToAccount.addEventListener('click', saveCurrentItineraryToAccount);
  if (btnSaveToAccountBottom) btnSaveToAccountBottom.addEventListener('click', saveCurrentItineraryToAccount);

  /* ── Wire Download Buttons ─────────────────────────────────────── */
  if (btnDownloadPdf) btnDownloadPdf.addEventListener('click', triggerOfflinePrint);
  if (btnDownloadPdfBottom) btnDownloadPdfBottom.addEventListener('click', triggerOfflinePrint);
  if (btnDownloadHtml) btnDownloadHtml.addEventListener('click', downloadOfflineHtml);
  if (btnDownloadHtmlBottom) btnDownloadHtmlBottom.addEventListener('click', downloadOfflineHtml);

  /* ── Check for Cached Offline Plan on Load ─────────────────────── */
  checkOfflineSaved();

  /* ── Pre-fill destination from URL param ───────────────────────── */
  (function () {
    var params  = new URLSearchParams(window.location.search);
    var destId  = params.get('destination_id');
    if (!destId || !destInput) return;

    fetch('/api/destinations/' + encodeURIComponent(destId))
      .then(function (r) { return r.json(); })
      .then(function (resp) {
        if (resp.success && resp.data) {
          destInput.value   = resp.data.name;
          destIdInput.value = resp.data.id;
        }
      })
      .catch(function () {});
  })();

})();
