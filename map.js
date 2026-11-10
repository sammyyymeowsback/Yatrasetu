/**
 * YatraSetu — Interactive Map & Live Driving Router
 * Powered by Google Maps Platform (Maps JavaScript API, Places API New, Routes API)
 * Features:
 *   - AdvancedMarkerElement with royal minimalist luxury styling (no emojis or childish pointers)
 *   - Google Places Autocomplete (live predictive dropdown for Indian cities, monuments, hill stations)
 *   - Google Routes API (computeRoutes, real-time traffic-aware polylines, precise distance & ETA)
 *   - Zero-crash fallback engine with instant demo key activation modal
 *
 * Source Attribution: Adapted with Google Maps Platform Code Assist
 */

// Source: Google Maps Platform Code Assist

(function () {
  'use strict';

  /* ── Mandatory Usage Tracking Attribution ────────────────────────── */
  const USAGE_ATTRIBUTION = ['gmp_git_agentskills_v1'];
  const MAP_ID = 'DEMO_MAP_ID';

  /* ── Crowd Pressure Palette ──────────────────────────────────────── */
  const PRESSURE_COLORS = {
    HIGH:     { color: '#dc2626', bg: '#fef2f2', label: 'High', title: 'High Footfall' },
    MODERATE: { color: '#d97706', bg: '#fffbeb', label: 'Moderate', title: 'Moderate Footfall' },
    LOW:      { color: '#16a34a', bg: '#f0fdf4', label: 'Low', title: 'Low Footfall' },
  };

  /* ── Demo Fallback Destinations ─────────────────────────────────── */
  const DEMO_DESTINATIONS = [
    {
      id: 101,
      name: "Darjeeling",
      state: "West Bengal",
      district: "Darjeeling",
      latitude: 27.0410,
      longitude: 88.2663,
      category: "nature",
      crowd_pressure: 46,
      crowd_level: "moderate",
      hidden_gem: false,
      opportunity_score: 88,
      sustainability_score: 82,
      accessibility_score: 76,
      description: "Queen of the Hills, renowned for emerald tea estates, Kanchenjunga sunrises, and colonial heritage.",
      reason_to_visit: "Himalayan panoramas, heritage tea gardens, and the Darjeeling Himalayan Railway.",
      tags: "tea,mountains,heritage,himalayas",
      image_path: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 102,
      name: "Kalimpong",
      state: "West Bengal",
      district: "Kalimpong",
      latitude: 27.0667,
      longitude: 88.4667,
      category: "culture",
      crowd_pressure: 24,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 93,
      sustainability_score: 91,
      accessibility_score: 72,
      description: "Tranquil hill haven adorned with ancient Buddhist monasteries, exotic nurseries, and Teesta Valley views.",
      reason_to_visit: "Peaceful cultural retreats, sacred monasteries, and lower tourist footfall.",
      tags: "hidden gem,monasteries,culture,mountains",
      image_path: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 103,
      name: "Kurseong",
      state: "West Bengal",
      district: "Darjeeling",
      latitude: 26.8825,
      longitude: 88.2773,
      category: "nature",
      crowd_pressure: 18,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 95,
      sustainability_score: 93,
      accessibility_score: 74,
      description: "The land of white orchids. Misty pine slopes, historic boarding schools, and serene heritage tea estates.",
      reason_to_visit: "Misty pine forests, quiet nature trails, and authentic tea tastings.",
      tags: "hidden gem,orchids,tea,nature",
      image_path: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 104,
      name: "Khajjiar",
      state: "Himachal Pradesh",
      district: "Chamba",
      latitude: 32.5497,
      longitude: 76.0259,
      category: "nature",
      crowd_pressure: 28,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 92,
      sustainability_score: 89,
      accessibility_score: 70,
      description: "Mini Switzerland of India — an alpine meadow encircled by ancient deodars with a tranquil floating island lake.",
      reason_to_visit: "Pristine meadow glades far less congested than major hill stations.",
      tags: "hidden gem,alpine,meadow,nature",
      image_path: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 105,
      name: "Mawlynnong",
      state: "Meghalaya",
      district: "East Khasi Hills",
      latitude: 25.2020,
      longitude: 91.8985,
      category: "rural",
      crowd_pressure: 32,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 94,
      sustainability_score: 98,
      accessibility_score: 68,
      description: "Asia's cleanest village, celebrated for living root bridges, spotless cobblestone trails, and community eco-stewardship.",
      reason_to_visit: "Living root bridges and community-driven sustainable living.",
      tags: "hidden gem,clean,eco,living root bridge",
      image_path: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 106,
      name: "Hampi",
      state: "Karnataka",
      district: "Vijayanagara",
      latitude: 15.3350,
      longitude: 76.4600,
      category: "heritage",
      crowd_pressure: 55,
      crowd_level: "moderate",
      hidden_gem: false,
      opportunity_score: 84,
      sustainability_score: 81,
      accessibility_score: 80,
      description: "UNESCO World Heritage site comprising magnificent boulder-strewn ruins of the 14th-century Vijayanagara Empire.",
      reason_to_visit: "Historic stone architecture and scenic Tungabhadra landscapes.",
      tags: "heritage,unesco,architecture,history",
      image_path: "https://images.unsplash.com/photo-1603288967394-0cf11c521eb8?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 107,
      name: "Spiti Valley",
      state: "Himachal Pradesh",
      district: "Lahaul and Spiti",
      latitude: 31.9689,
      longitude: 78.0524,
      category: "nature",
      crowd_pressure: 25,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 96,
      sustainability_score: 95,
      accessibility_score: 55,
      description: "Cold desert mountain valley at 3,800m — ancient Tibetan monasteries, fossil villages, and stark lunar landscapes.",
      reason_to_visit: "Key Gompa, Dhankar lake, and pure Himalayan stargazing.",
      tags: "hidden gem,desert,monasteries,himalayas",
      image_path: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 108,
      name: "Gandikota",
      state: "Andhra Pradesh",
      district: "Kadapa",
      latitude: 14.8041,
      longitude: 78.2838,
      category: "heritage",
      crowd_pressure: 20,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 95,
      sustainability_score: 92,
      accessibility_score: 65,
      description: "India's Grand Canyon — the Pennar river gorge cutting through majestic red sandstone fort ramparts.",
      reason_to_visit: "Breathtaking gorge vistas and medieval fort ruins with zero crowds.",
      tags: "hidden gem,canyon,fort,heritage",
      image_path: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 109,
      name: "Ziro Valley",
      state: "Arunachal Pradesh",
      district: "Lower Subansiri",
      latitude: 27.5479,
      longitude: 93.8219,
      category: "culture",
      crowd_pressure: 22,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 93,
      sustainability_score: 94,
      accessibility_score: 60,
      description: "UNESCO tentative heritage site — indigenous Apatani tribal culture, pine-clad hills, and organic rice-fish valleys.",
      reason_to_visit: "Apatani sustainable agro-culture, pine groves, and peaceful valley trails.",
      tags: "hidden gem,tribal,culture,unesco",
      image_path: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 110,
      name: "Pattadakal",
      state: "Karnataka",
      district: "Bagalkot",
      latitude: 15.9480,
      longitude: 75.8183,
      category: "heritage",
      crowd_pressure: 24,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 94,
      sustainability_score: 90,
      accessibility_score: 72,
      description: "UNESCO World Heritage Site with 7th-century Chalukyan temple architecture, remarkably serene and undervisited.",
      reason_to_visit: "Spectacular blend of North and South Indian temple designs.",
      tags: "hidden gem,unesco,chalukya,temples",
      image_path: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 111,
      name: "Dholavira",
      state: "Gujarat",
      district: "Kutch",
      latitude: 23.8876,
      longitude: 70.2165,
      category: "heritage",
      crowd_pressure: 16,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 97,
      sustainability_score: 94,
      accessibility_score: 58,
      description: "UNESCO 5,000-year-old Harappan city in the Great Rann of Kutch — world's earliest sophisticated water conservation systems.",
      reason_to_visit: "Ancient Harappan citadel, massive stone reservoirs, and the White Desert.",
      tags: "hidden gem,indus valley,harappa,unesco",
      image_path: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 112,
      name: "Majuli",
      state: "Assam",
      district: "Majuli",
      latitude: 26.9540,
      longitude: 94.1610,
      category: "culture",
      crowd_pressure: 26,
      crowd_level: "low",
      hidden_gem: true,
      opportunity_score: 92,
      sustainability_score: 91,
      accessibility_score: 62,
      description: "World's largest river island on the Brahmaputra — famous for neo-Vaishnavite satras, mask artisans, and rich wetland ecology.",
      reason_to_visit: "Traditional mask-making workshops, monk dances, and peaceful island cycling.",
      tags: "hidden gem,island,culture,monasteries",
      image_path: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80"
    }
  ];

  /* ── Core State ─────────────────────────────────────────────────── */
  let _isGoogleMaps = false;
  let _gMap = null;
  let _gLibraries = {};
  let _gMarkers = {};
  let _gPolylines = [];
  let _gWaypointMarkers = [];

  /* Fallback Leaflet State */
  let _lMap = null;
  let _lTileLayer = null;
  let _lMarkers = {};
  let _lRouteLayer = null;
  let _lStartMarker = null;
  let _lEndMarker = null;
  let _lCurrentTileKey = 'osm';

  /* Shared App State */
  let _allDestinations = [];
  let _activeCategory = 'all';
  let _activePressure = 'all';
  let _searchQuery = '';
  let _legendVisible = false;
  let _originCoords = null;
  let _destCoords = null;

  /* ── Boot Process ───────────────────────────────────────────────── */
  async function boot() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    // Explicit CSS height safety (CF2)
    if (!mapEl.offsetHeight || mapEl.offsetHeight < 100) {
      mapEl.style.minHeight = '100%';
      mapEl.style.height = (window.innerHeight - 70) + 'px';
    }

    wireUIEvents();
    await checkKeyAndInitialize();
    loadDestinations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ── Fetch Live Destinations from API ──────────────────────────── */
  async function loadDestinations() {
    try {
      const res = await fetch('/api/destinations?limit=100');
      if (res.ok) {
        const json = await res.json();
        const apiDests = (json.data && json.data.destinations) || json.destinations || [];
        if (apiDests.length > 0) {
          _allDestinations = apiDests.map(d => {
            const crowdLevel = (d.crowd_level || 'low').toLowerCase();
            const pressure = crowdLevel === 'high' || crowdLevel === 'very_high' ? 85 : (crowdLevel === 'moderate' ? 50 : 25);
            return {
              id: d.id,
              name: d.name,
              state: d.state,
              district: d.district || '',
              latitude: parseFloat(d.latitude),
              longitude: parseFloat(d.longitude),
              category: d.category || 'heritage',
              crowd_pressure: pressure,
              crowd_level: crowdLevel,
              hidden_gem: crowdLevel === 'low',
              opportunity_score: Math.round(d.popularity_score || 85),
              sustainability_score: Math.round(d.community_value_score || 88),
              accessibility_score: 75,
              description: d.description || '',
              reason_to_visit: d.reason_to_visit || d.description || '',
              tags: `${d.category || ''},${d.state || ''},${d.name || ''}`,
              image_path: d.image_path || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
            };
          });
          renderMarkers(_allDestinations);
          renderSidebarList(_allDestinations);
          return;
        }
      }
    } catch (err) {
      console.warn('Could not load destinations from API, using fallback:', err);
    }

    _allDestinations = [...DEMO_DESTINATIONS];
    renderMarkers(_allDestinations);
    renderSidebarList(_allDestinations);
  }

  /* ── Check API Key & Initialize Engine ──────────────────────────── */
  async function checkKeyAndInitialize() {
    let apiKey = window.GOOGLE_MAPS_API_KEY || '';

    if (!apiKey) {
      try {
        const res = await fetch('/api/maps/config');
        if (res.ok) {
          const cfg = await res.json();
          if (cfg && cfg.google_maps_api_key) {
            apiKey = cfg.google_maps_api_key.trim();
            window.GOOGLE_MAPS_API_KEY = apiKey;
          }
        }
      } catch (e) {
        console.warn('Could not fetch maps config:', e);
      }
    }

    if (apiKey) {
      try {
        await initGoogleMaps(apiKey);
        _isGoogleMaps = true;
        updateEngineBadge('Live Network', true);
        return;
      } catch (err) {
        console.error('Google Maps initialization failed, switching to fallback:', err);
      }
    }

    // Fallback if no key yet or key error
    initLeafletFallback();
    updateEngineBadge('Live Network', false);
  }

  /* ── Google Maps Platform Initializer ───────────────────────────── */
  async function initGoogleMaps(apiKey) {
    // Dynamic bootstrap loader
    if (!window.google || !window.google.maps || !window.google.maps.importLibrary) {
      await loadGoogleMapsScript(apiKey);
    }

    // Import official modern libraries (no legacy classes)
    const [
      { Map, InfoWindow },
      { AdvancedMarkerElement, PinElement },
      placesLib,
      routesLib
    ] = await Promise.all([
      google.maps.importLibrary('maps'),
      google.maps.importLibrary('marker'),
      google.maps.importLibrary('places'),
      google.maps.importLibrary('routes')
    ]);

    _gLibraries = {
      Map,
      InfoWindow,
      AdvancedMarkerElement,
      PinElement,
      places: placesLib,
      routes: routesLib
    };

    const mapEl = document.getElementById('map');
    mapEl.innerHTML = ''; // Clean canvas

    _gMap = new Map(mapEl, {
      center: { lat: 22.5, lng: 80.0 }, // Geographical center of India
      zoom: 5,
      mapId: MAP_ID,
      internalUsageAttributionIds: USAGE_ATTRIBUTION,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      }
    });

    // Close drawer on map click
    _gMap.addListener('click', () => {
      closeMapDrawer();
    });

    // Initialize Places Autocomplete (New)
    initGooglePlacesAutocomplete();

    console.info('[YatraSetu] Google Maps Platform initialized with Advanced Markers & Routes API.');
  }

  function loadGoogleMapsScript(apiKey) {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById('gmp-script');
      if (existing) {
        existing.onload = resolve;
        existing.onerror = reject;
        return;
      }

      // Bootstrap loader
      (g => {
        let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
        b[c] = b[c] || (b[c] = {});
        let d = b.maps = b.maps || {}, r = new Set, e = new URLSearchParams;
        let u = () => h || (h = new Promise(async (f, n) => {
          await (a = m.createElement("script"));
          a.id = 'gmp-script';
          e.set("libraries", [...r] + "");
          for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
          e.set("callback", c + ".maps." + q);
          a.src = `https://maps.googleapis.com/maps/api/js?` + e;
          d[q] = f;
          a.onerror = () => n(Error(p + " could not load."));
          m.head.append(a);
        }));
        d[l] ? console.warn(p + " only loads once.") : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
      })({
        key: apiKey,
        v: "weekly"
      });

      // Wait for importLibrary to be defined
      const check = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.importLibrary) {
          clearInterval(check);
          resolve();
        }
      }, 50);

      setTimeout(() => {
        clearInterval(check);
        reject(new Error("Timeout loading Google Maps"));
      }, 10000);
    });
  }

  /* ── Google Places Autocomplete (New) ────────────────────────────── */
  function initGooglePlacesAutocomplete() {
    const originInput = document.getElementById('routeOrigin');
    const destInput = document.getElementById('routeDestination');
    const places = _gLibraries.places;
    if (!places) return;

    // Check if PlaceAutocompleteElement Web Component is supported
    if (places.PlaceAutocompleteElement) {
      try {
        mountPlaceAutocompleteElement('originAutocompleteMount', originInput, (place) => {
          _originCoords = {
            lat: place.location.lat(),
            lng: place.location.lng(),
            name: place.displayName || place.formattedAddress
          };
          if (originInput) originInput.value = _originCoords.name;
          setRouteStatus(`Origin set to ${_originCoords.name}`, 'info');
        });

        mountPlaceAutocompleteElement('destAutocompleteMount', destInput, (place) => {
          _destCoords = {
            lat: place.location.lat(),
            lng: place.location.lng(),
            name: place.displayName || place.formattedAddress
          };
          if (destInput) destInput.value = _destCoords.name;
          setRouteStatus(`Destination set to ${_destCoords.name}`, 'info');
          if (_originCoords) calculateRoute();
        });
        return;
      } catch (e) {
        console.warn('PlaceAutocompleteElement mount notice:', e);
      }
    }

    // Fallback: Autocomplete programmatic input listener
    setupInputAutocomplete(originInput, (place) => {
      _originCoords = {
        lat: place.location.lat(),
        lng: place.location.lng(),
        name: place.displayName
      };
      setRouteStatus(`Origin set to ${_originCoords.name}`, 'info');
    });

    setupInputAutocomplete(destInput, (place) => {
      _destCoords = {
        lat: place.location.lat(),
        lng: place.location.lng(),
        name: place.displayName
      };
      setRouteStatus(`Destination set to ${_destCoords.name}`, 'info');
      if (_originCoords) calculateRoute();
    });
  }

  function mountPlaceAutocompleteElement(containerId, fallbackInput, onSelect) {
    const container = document.getElementById(containerId);
    if (!container || !window.google || !google.maps.places.PlaceAutocompleteElement) return;

    const el = new google.maps.places.PlaceAutocompleteElement({
      internalUsageAttributionIds: USAGE_ATTRIBUTION
    });

    try {
      el.includedRegionCodes = ['in'];
    } catch(e) {}

    const handleSelect = async (event) => {
      const place = event.place || (event.placePrediction && event.placePrediction.toPlace ? event.placePrediction.toPlace() : null);
      if (place) {
        await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
        onSelect(place);
      }
    };

    el.addEventListener('gmp-select', handleSelect);
    el.addEventListener('gmp-placeselect', handleSelect);

    container.innerHTML = '';
    container.appendChild(el);
    container.style.display = 'block';
    if (fallbackInput) fallbackInput.style.display = 'none';
  }

  function setupInputAutocomplete(inputEl, onSelect) {
    if (!inputEl || !window.google) return;
    try {
      const auto = new google.maps.places.Autocomplete(inputEl, {
        componentRestrictions: { country: 'in' },
        fields: ['displayName', 'formattedAddress', 'geometry', 'name']
      });
      auto.addListener('place_changed', () => {
        const place = auto.getPlace();
        if (place && place.geometry && place.geometry.location) {
          onSelect({
            location: place.geometry.location,
            displayName: place.name || place.formattedAddress
          });
        }
      });
    } catch (e) {
      console.warn('Autocomplete init notice:', e);
    }
  }

  /* ── Leaflet Vector Fallback ─────────────────────────────────────── */
  function initLeafletFallback() {
    if (typeof L === 'undefined') return;
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    _lMap = L.map('map', {
      center: [22.5, 80.0],
      zoom: 5,
      zoomControl: true,
      maxZoom: 18,
      minZoom: 3,
    });

    _lTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(_lMap);

    _lMap.on('click', () => {
      closeMapDrawer();
    });

    setTimeout(() => { if (_lMap) _lMap.invalidateSize(); }, 200);
    window.addEventListener('resize', () => { if (_lMap) _lMap.invalidateSize(); });
  }

  /* ── Marker Rendering (AdvancedMarkerElement vs Leaflet) ────────── */
  function renderMarkers(dests) {
    if (_isGoogleMaps && _gMap) {
      renderGoogleMarkers(dests);
    } else if (_lMap) {
      renderLeafletMarkers(dests);
    }
  }

  function renderGoogleMarkers(dests) {
    const { AdvancedMarkerElement, InfoWindow } = _gLibraries;

    Object.values(_gMarkers).forEach(m => { m.map = null; });
    _gMarkers = {};

    dests.forEach(dest => {
      if (!dest.latitude || !dest.longitude) return;

      const level = dest.crowd_pressure >= 80 ? 'high' : (dest.crowd_pressure >= 40 ? 'moderate' : 'low');
      const isGem = dest.hidden_gem;

      const pinEl = document.createElement('div');
      pinEl.className = `gmp-luxury-marker gmp-luxury-marker--${level} ${isGem ? 'is-gem' : ''}`;
      pinEl.setAttribute('title', `${dest.name} — ${dest.crowd_pressure}% Crowd`);
      pinEl.innerHTML = `
        ${isGem ? '<span class="gmp-marker-glow"></span>' : ''}
        <span class="gmp-marker-dot"></span>
      `;

      const marker = new AdvancedMarkerElement({
        map: _gMap,
        position: { lat: dest.latitude, lng: dest.longitude },
        title: dest.name,
        content: pinEl,
        internalUsageAttributionIds: USAGE_ATTRIBUTION
      });

      const infoContent = `
        <div style="font-family:system-ui,sans-serif;padding:4px 6px;color:#14281D;">
          <strong style="display:block;font-size:13px;">${escapeHtml(dest.name)}</strong>
          <span style="font-size:11px;color:#555;">${escapeHtml(dest.state)} &middot; ${dest.crowd_pressure}% Crowd</span>
        </div>`;

      const info = new InfoWindow({
        content: infoContent,
        disableAutoPan: true
      });

      pinEl.addEventListener('mouseenter', () => {
        info.open({ anchor: marker, map: _gMap });
      });

      pinEl.addEventListener('mouseleave', () => {
        info.close();
      });

      pinEl.addEventListener('click', (e) => {
        e.stopPropagation();
        focusDestination(dest.id);
      });

      _gMarkers[dest.id] = marker;
    });
  }

  function renderLeafletMarkers(dests) {
    Object.values(_lMarkers).forEach(m => _lMap.removeLayer(m));
    _lMarkers = {};

    dests.forEach(dest => {
      if (!dest.latitude || !dest.longitude) return;
      const level = dest.crowd_pressure >= 80 ? 'high' : (dest.crowd_pressure >= 40 ? 'moderate' : 'low');
      const isGem = dest.hidden_gem;

      const icon = L.divIcon({
        className: 'ys-marker-wrapper',
        html: `
          <div class="ys-marker ys-marker--${level} ${isGem ? 'is-gem' : ''}" data-id="${dest.id}">
            ${isGem ? '<span class="ys-marker-pulse"></span>' : ''}
            <span class="ys-marker-core"></span>
          </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([dest.latitude, dest.longitude], { icon, title: dest.name }).addTo(_lMap);
      marker.bindTooltip(`<strong>${escapeHtml(dest.name)}</strong><br>${escapeHtml(dest.state)} · ${dest.crowd_pressure}% Crowd`, {
        direction: 'top',
        offset: [0, -12],
        className: 'ys-custom-tooltip'
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        focusDestination(dest.id);
      });

      _lMarkers[dest.id] = marker;
    });
  }

  /* ── Driving Route Calculation (Google Routes API vs OSRM) ──────── */
  window.calculateRoute = async function () {
    const btn = document.getElementById('routeBtn');
    const originInput = document.getElementById('routeOrigin');
    const destInput = document.getElementById('routeDestination');
    const summaryCard = document.getElementById('routeSummary');

    const originText = (originInput ? originInput.value : '').trim();
    const destinationText = (destInput ? destInput.value : '').trim();

    if (!originText && !_originCoords) {
      setRouteStatus('Please enter an origin.', 'error');
      return;
    }
    if (!destinationText && !_destCoords) {
      setRouteStatus('Please enter a destination.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-inline"></span> Calculating…';
    }
    setRouteStatus('Calculating live route with traffic…', 'info');
    if (summaryCard) summaryCard.style.display = 'none';

    try {
      if (_isGoogleMaps && _gLibraries.routes && _gLibraries.routes.Route) {
        await computeGoogleRoute(originText, destinationText);
      } else {
        await computeOsrmRoute(originText, destinationText);
      }
    } catch (err) {
      console.error('Route calculation error:', err);
      setRouteStatus(err.message || 'Unable to compute driving route.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Find Route';
      }
    }
  };

  /* ── Google Routes API Implementation ───────────────────────────── */
  async function computeGoogleRoute(originText, destinationText) {
    const { Route } = _gLibraries.routes;
    const { AdvancedMarkerElement } = _gLibraries;

    clearRoute();

    let originReq = originText;
    if (_originCoords && _originCoords.lat && _originCoords.lng) {
      originReq = { lat: _originCoords.lat, lng: _originCoords.lng };
    }

    let destReq = destinationText;
    if (_destCoords && _destCoords.lat && _destCoords.lng) {
      destReq = { lat: _destCoords.lat, lng: _destCoords.lng };
    }

    const request = {
      origin: originReq,
      destination: destReq,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'duration'],
      internalUsageAttributionIds: USAGE_ATTRIBUTION
    };

    const { routes } = await Route.computeRoutes(request);

    if (!routes || !routes.length) {
      throw new Error('No driving route found between these locations.');
    }

    const primaryRoute = routes[0];

    _gPolylines = primaryRoute.createPolylines({
      polylineOptions: {
        strokeColor: '#14281D',
        strokeWeight: 6,
        strokeOpacity: 0.92
      }
    });

    _gPolylines.forEach(p => p.setMap(_gMap));

    try {
      _gWaypointMarkers = await primaryRoute.createWaypointAdvancedMarkers();
      _gWaypointMarkers.forEach(m => m.setMap(_gMap));
    } catch (e) {
      const path = primaryRoute.path;
      if (path && path.length > 0) {
        const startPos = path[0];
        const endPos = path[path.length - 1];

        const startPin = document.createElement('div');
        startPin.className = 'gmp-route-marker start';
        startPin.textContent = 'A';
        const startMarker = new AdvancedMarkerElement({
          map: _gMap,
          position: startPos,
          content: startPin,
          title: 'Origin',
          internalUsageAttributionIds: USAGE_ATTRIBUTION
        });

        const endPin = document.createElement('div');
        endPin.className = 'gmp-route-marker end';
        endPin.textContent = 'B';
        const endMarker = new AdvancedMarkerElement({
          map: _gMap,
          position: endPos,
          content: endPin,
          title: 'Destination',
          internalUsageAttributionIds: USAGE_ATTRIBUTION
        });

        _gWaypointMarkers.push(startMarker, endMarker);
      }
    }

    if (primaryRoute.path && primaryRoute.path.length) {
      const bounds = new google.maps.LatLngBounds();
      primaryRoute.path.forEach(pt => bounds.extend(pt));
      _gMap.fitBounds(bounds, { top: 70, right: 70, bottom: 70, left: 70 });
    }

    const distanceMeters = primaryRoute.distanceMeters || 0;
    const durationSeconds = (primaryRoute.duration && primaryRoute.duration.seconds) ? Number(primaryRoute.duration.seconds) : 0;

    const distEl = document.getElementById('routeDistance');
    const durEl = document.getElementById('routeDuration');
    const summaryCard = document.getElementById('routeSummary');

    if (distEl) {
      distEl.textContent = distanceMeters >= 1000
        ? `${(distanceMeters / 1000).toFixed(1)} km`
        : `${Math.round(distanceMeters)} m`;
    }

    if (durEl) {
      durEl.textContent = formatDuration(durationSeconds);
    }

    if (summaryCard) summaryCard.style.display = 'flex';
    const divBtn = document.getElementById('diversionBtn');
    if (divBtn) divBtn.style.display = 'flex';
    setRouteStatus(`Google Routes: Driving path ready (${(distanceMeters / 1000).toFixed(1)} km).`, 'success');
  }

  /* ── Fallback OSRM Route Calculation ─────────────────────────────── */
  async function computeOsrmRoute(originText, destinationText) {
    let start = _originCoords;
    if (!start || originText !== 'My current location') {
      start = await geocodePlace(originText);
      _originCoords = start;
    }

    let end = _destCoords;
    if (!end || (end.name && !destinationText.includes(end.name.split(',')[0]))) {
      end = await geocodePlace(destinationText);
      _destCoords = end;
    }

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl);
    if (!res.ok) throw new Error('Routing service is busy. Please try again.');
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes || !data.routes.length) {
      throw new Error('No drivable road route found between these points.');
    }

    const route = data.routes[0];
    drawOsrmRoute(route, start, end);

    const distEl = document.getElementById('routeDistance');
    const durEl = document.getElementById('routeDuration');
    const summaryCard = document.getElementById('routeSummary');
    if (distEl) distEl.textContent = (route.distance / 1000).toFixed(1) + ' km';
    if (durEl) durEl.textContent = formatDuration(route.duration);
    if (summaryCard) summaryCard.style.display = 'flex';
    const divBtn = document.getElementById('diversionBtn');
    if (divBtn) divBtn.style.display = 'flex';

    setRouteStatus('Route ready via vector map.', 'success');
  }

  function drawOsrmRoute(route, start, end) {
    if (!_lMap) return;
    if (_lRouteLayer) _lMap.removeLayer(_lRouteLayer);
    if (_lStartMarker) _lMap.removeLayer(_lStartMarker);
    if (_lEndMarker) _lMap.removeLayer(_lEndMarker);

    _lRouteLayer = L.geoJSON(route.geometry, {
      style: { color: '#14281D', weight: 5, opacity: 0.9 }
    }).addTo(_lMap);

    const startIcon = L.divIcon({
      className: 'ys-marker-wrapper',
      html: `<div class="ys-route-marker start">A</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    _lStartMarker = L.marker([start.lat, start.lng], { icon: startIcon }).addTo(_lMap);

    const endIcon = L.divIcon({
      className: 'ys-marker-wrapper',
      html: `<div class="ys-route-marker end">B</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    _lEndMarker = L.marker([end.lat, end.lng], { icon: endIcon }).addTo(_lMap);

    _lMap.fitBounds(_lRouteLayer.getBounds(), { padding: [60, 60], maxZoom: 14 });
  }

  async function geocodePlace(query) {
    const q = (query || '').trim();
    if (!q) throw new Error('Please enter a location name.');
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Location lookup temporarily busy.');
    const data = await res.json();
    if (!data.length) throw new Error(`Could not find "${q}".`);
    return { lat: Number(data[0].lat), lng: Number(data[0].lon), name: data[0].display_name };
  }

  /* ── Dynamic Route Diversion Comparison System ───────────────────── */
  let _diversionLayers = [];

  window.compareRouteDiversion = async function () {
    const origInput = document.getElementById('routeOrigin');
    const destInput = document.getElementById('routeDestination');
    const diversionCard = document.getElementById('routeDiversionCard');
    if (!diversionCard) return;

    const origin = (origInput ? origInput.value.trim() : '') || 'Darjeeling Town';
    const destination = (destInput ? destInput.value.trim() : '') || 'Tiger Hill';

    diversionCard.style.display = 'block';
    diversionCard.innerHTML =
      '<div style="text-align:center;padding:14px;color:rgba(20,40,29,0.7);">' +
        '<div class="skeleton" style="width:18px;height:18px;border-radius:50%;margin:0 auto 8px auto;"></div>' +
        'Evaluating mountain terrain, diurnal crowd models, and DDMA corridor baselines…' +
      '</div>';

    try {
      const res = await fetch(`/api/routes/diversion-comparison?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
      const json = await res.json();
      if (!json.success || !json.data) {
        diversionCard.innerHTML = '<div style="color:#dc2626;font-size:11px;">Could not evaluate diversion for this route.</div>';
        return;
      }

      renderDiversionCard(json.data, diversionCard);
      renderDiversionMapLayers(json.data.standard_route, json.data.diversion_route);
    } catch (err) {
      diversionCard.innerHTML = '<div style="color:#dc2626;font-size:11px;">Network error comparing corridors.</div>';
    }
  };

  function renderDiversionCard(data, cardEl) {
    const std = data.standard_route || {};
    const div = data.diversion_route || {};
    const comp = data.comparison || {};

    cardEl.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:6px;border-bottom:1px dashed #C5A059;">' +
        '<span style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#14281D;display:inline-flex;align-items:center;gap:5px;">' +
          '<img src="/static/img/logo_surya_seal.svg?v=15" width="13" height="13" alt="" style="display:inline-block;">' +
          '<span>Smart Decongestion Analysis</span>' +
        '</span>' +
        '<span style="font-size:10px;background:rgba(81,207,102,0.15);color:#15803d;padding:2px 6px;border-radius:4px;font-weight:700;">' +
          '-' + (comp.crowd_reduction_pct || 70) + '% Crowd' +
        '</span>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">' +
        '<div style="background:#fef2f2;border:1px solid rgba(220,38,38,0.3);border-radius:6px;padding:8px;">' +
          '<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#dc2626;margin-bottom:2px;">Normal Route</div>' +
          '<div style="font-size:12.5px;font-weight:700;color:#14281D;">' + (std.distance_km || 18.4) + ' km · ' + (std.duration_minutes || 52) + 'm</div>' +
          '<div style="font-size:10px;color:#991b1b;margin-top:2px;">+' + (std.traffic_delay_minutes || 35) + 'm queue · ' + (std.crowd_pressure || 94) + '% crowd</div>' +
          '<div style="font-size:9.5px;color:rgba(20,40,29,0.6);margin-top:4px;">0 Community Experiences</div>' +
        '</div>' +
        '<div style="background:#f0fdf4;border:1px solid rgba(22,163,74,0.35);border-radius:6px;padding:8px;">' +
          '<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#15803d;margin-bottom:2px;">YatraSetu Recommended</div>' +
          '<div style="font-size:12.5px;font-weight:700;color:#14281D;">' + (div.distance_km || 31.2) + ' km · ' + (div.duration_minutes || 78) + 'm</div>' +
          '<div style="font-size:10px;color:#15803d;margin-top:2px;">0 min queue · ' + (div.crowd_pressure || 24) + '% crowd</div>' +
          '<div style="font-size:9.5px;color:#15803d;font-weight:600;margin-top:4px;">+' + (comp.community_experiences_count || 2) + ' Village Experiences</div>' +
        '</div>' +
      '</div>' +
      '<div style="background:rgba(20,40,29,0.04);border-radius:6px;padding:6px 8px;margin-bottom:10px;font-size:10.5px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;">' +
        '<span><strong>Queuing:</strong> -' + (comp.queuing_saved_minutes || 75) + 'm</span>' +
        '<span><strong>Retention:</strong> ' + (div.local_retention_pct || 94) + '%</span>' +
        '<span><strong>Carbon:</strong> -' + (comp.carbon_savings_pct || 38) + '%</span>' +
      '</div>' +
      '<div style="font-size:11px;line-height:1.45;color:rgba(20,40,29,0.85);margin-bottom:8px;">' +
        '<strong style="color:#14281D;">Why YatraSetu Chose This:</strong> ' + escapeHtml(data.rationale || '') +
      '</div>' +
      '<div style="font-size:10px;color:rgba(20,40,29,0.7);background:#fff;border-left:2px solid #C5A059;padding:4px 8px;border-radius:0 4px 4px 0;margin-bottom:8px;">' +
        escapeHtml(data.ddma_safeguard || '') +
      '</div>' +
      '<div style="display:flex;gap:6px;justify-content:flex-end;">' +
        '<button type="button" class="btn btn-sm btn-outline" onclick="document.getElementById(\'routeDiversionCard\').style.display=\'none\';" style="font-size:10px;padding:3px 8px;">Dismiss</button>' +
      '</div>';
  }

  function renderDiversionMapLayers(std, div) {
    if (!std || !div) return;

    _diversionLayers.forEach(layer => {
      if (_lMap && _lMap.hasLayer(layer)) _lMap.removeLayer(layer);
      if (_isGoogleMaps && layer.setMap) layer.setMap(null);
    });
    _diversionLayers = [];

    if (_lRouteLayer && _lMap) _lMap.removeLayer(_lRouteLayer);

    const stdCoords = (std.waypoints || []).map(wp => [wp.latitude, wp.longitude]);
    const divCoords = (div.waypoints || []).map(wp => [wp.latitude, wp.longitude]);

    if (_lMap && stdCoords.length >= 2 && divCoords.length >= 2) {
      const stdPoly = L.polyline(stdCoords, {
        color: '#dc2626',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.85,
      }).addTo(_lMap);
      stdPoly.bindTooltip('Normal Route (' + (std.crowd_pressure || 94) + '% Congested)', { sticky: true });
      _diversionLayers.push(stdPoly);

      const divHalo = L.polyline(divCoords, {
        color: '#C5A059',
        weight: 8,
        opacity: 0.35,
      }).addTo(_lMap);
      _diversionLayers.push(divHalo);

      const divPoly = L.polyline(divCoords, {
        color: '#14281D',
        weight: 5,
        opacity: 0.95,
      }).addTo(_lMap);
      divPoly.bindTooltip('YatraSetu Diversion (' + (div.crowd_pressure || 24) + '% Tranquil)', { sticky: true });
      _diversionLayers.push(divPoly);

      (div.waypoints || []).forEach((wp, idx) => {
        if (wp.is_gem || (idx > 0 && idx < div.waypoints.length - 1)) {
          const gemIcon = L.divIcon({
            className: 'ys-marker-wrapper',
            html: '<div style="background:#14281D;color:#C5A059;border:1.5px solid #C5A059;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.3);">&#9670;</div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          const m = L.marker([wp.latitude, wp.longitude], { icon: gemIcon }).addTo(_lMap);
          m.bindPopup('<strong>' + escapeHtml(wp.name) + '</strong><br><span style="font-size:11px;color:#15803d;">' + escapeHtml(wp.note || 'Decongested Stop') + '</span>');
          _diversionLayers.push(m);
        }
      });

      const allPts = stdCoords.concat(divCoords);
      _lMap.fitBounds(L.latLngBounds(allPts), { padding: [50, 50] });
    }
  }

  /* ── Clear Route ────────────────────────────────────────────────── */
  window.clearRoute = function () {
    if (_isGoogleMaps) {
      _gPolylines.forEach(p => p.setMap(null));
      _gPolylines = [];
      _gWaypointMarkers.forEach(m => { m.map = null; });
      _gWaypointMarkers = [];
    }

    if (_lMap) {
      if (_lRouteLayer) { _lMap.removeLayer(_lRouteLayer); _lRouteLayer = null; }
      if (_lStartMarker) { _lMap.removeLayer(_lStartMarker); _lStartMarker = null; }
      if (_lEndMarker) { _lMap.removeLayer(_lEndMarker); _lEndMarker = null; }
    }

    _diversionLayers.forEach(layer => {
      if (_lMap && _lMap.hasLayer(layer)) _lMap.removeLayer(layer);
      if (_isGoogleMaps && layer.setMap) layer.setMap(null);
    });
    _diversionLayers = [];

    _originCoords = null;
    _destCoords = null;

    const originInput = document.getElementById('routeOrigin');
    const destInput = document.getElementById('routeDestination');
    const summaryCard = document.getElementById('routeSummary');
    const divCard = document.getElementById('routeDiversionCard');
    const divBtn = document.getElementById('diversionBtn');
    if (originInput) originInput.value = '';
    if (destInput) destInput.value = '';
    if (summaryCard) summaryCard.style.display = 'none';
    if (divCard) divCard.style.display = 'none';
    if (divBtn) divBtn.style.display = 'none';
    setRouteStatus('');
  };

  /* ── GPS Geolocation ────────────────────────────────────────────── */
  window.useCurrentLocation = function () {
    if (!navigator.geolocation) {
      setRouteStatus('Geolocation not supported by browser.', 'error');
      return;
    }
    setRouteStatus('Acquiring GPS coordinates…', 'info');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        _originCoords = { lat, lng, name: 'My Current Location' };

        const originInput = document.getElementById('routeOrigin');
        if (originInput) originInput.value = 'My Current Location';

        if (_isGoogleMaps && _gMap) {
          _gMap.panTo({ lat, lng });
          _gMap.setZoom(13);
        } else if (_lMap) {
          _lMap.flyTo([lat, lng], 13);
        }

        setRouteStatus('Current location acquired. Enter destination to find route.', 'success');
      },
      err => {
        setRouteStatus('Could not access GPS. Please type your starting location.', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ── Route To Specific Destination ──────────────────────────────── */
  window.routeToDestination = function (dest) {
    if (!dest) return;
    const destInput = document.getElementById('routeDestination');
    if (destInput) destInput.value = dest.name;

    _destCoords = {
      lat: dest.latitude,
      lng: dest.longitude,
      name: dest.name
    };

    const sidebar = document.getElementById('mapSidebar');
    if (sidebar && window.innerWidth <= 900) {
      sidebar.classList.add('sidebar-open');
    }

    if (_originCoords) {
      calculateRoute();
    } else {
      setRouteStatus('Set starting point above to calculate route.', 'info');
      const originInput = document.getElementById('routeOrigin');
      if (originInput) originInput.focus();
    }
  };

  /* ── Sidebar List & Filters ─────────────────────────────────────── */
  function renderSidebarList(dests) {
    const listEl = document.getElementById('mapDestList');
    const countEl = document.getElementById('destCountBadge');
    if (countEl) countEl.textContent = `${dests.length} spots`;
    if (!listEl) return;

    if (!dests.length) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:30px 10px;color:rgba(20,40,29,0.5);font-size:0.82rem;">
          No destinations match the selected criteria.
        </div>`;
      return;
    }

    listEl.innerHTML = dests.map(dest => {
      const level = dest.crowd_pressure >= 80 ? 'high' : (dest.crowd_pressure >= 40 ? 'moderate' : 'low');
      return `
        <div class="map-dest-item" id="dest-item-${dest.id}" onclick="focusDestination(${dest.id})">
          <div class="dest-item-header">
            <span class="dest-item-name">${escapeHtml(dest.name)}</span>
            <div class="dest-item-badges">
              ${dest.hidden_gem ? '<span class="dest-gem-badge" title="Hidden Gem">Gem</span>' : ''}
              <span class="badge" style="font-size:0.65rem;padding:2px 6px;">${escapeHtml(dest.category)}</span>
            </div>
          </div>
          <div class="dest-item-meta">
            <span class="dest-item-location">${escapeHtml(dest.state)}</span>
            <span class="dest-pressure-badge ${level}">${dest.crowd_pressure}% Crowd</span>
          </div>
          <div class="dest-pressure-bar-track">
            <div class="dest-pressure-bar-fill ${level}" style="width:${dest.crowd_pressure}%;"></div>
          </div>
        </div>`;
    }).join('');
  }

  window.focusDestination = function (id) {
    const dest = _allDestinations.find(d => d.id === id);
    if (!dest || !dest.latitude) return;

    document.querySelectorAll('.map-dest-item').forEach(el => el.classList.remove('active'));
    const itemEl = document.getElementById(`dest-item-${id}`);
    if (itemEl) {
      itemEl.classList.add('active');
      itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (_isGoogleMaps && _gMap) {
      _gMap.panTo({ lat: dest.latitude, lng: dest.longitude });
      _gMap.setZoom(12);
    } else if (_lMap) {
      _lMap.flyTo([dest.latitude, dest.longitude], 12, { duration: 1.2 });
    }

    openDestinationDrawer(dest);
  };

  window.setCategoryFilter = function (btn, cat) {
    document.querySelectorAll('.map-filter-chip.cat-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    _activeCategory = cat;
    applyFilters();
  };

  window.setPressureFilter = function (btn, pressure) {
    document.querySelectorAll('.map-filter-chip.pressure-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    _activePressure = pressure;
    applyFilters();
  };

  window.filterDestinationsLive = function (val) {
    _searchQuery = (val || '').toLowerCase().trim();
    applyFilters();
  };

  function applyFilters() {
    const filtered = _allDestinations.filter(d => {
      const matchCat = _activeCategory === 'all' || d.category === _activeCategory;

      let matchPress = true;
      if (_activePressure === 'low') matchPress = d.crowd_pressure < 40;
      else if (_activePressure === 'moderate') matchPress = d.crowd_pressure >= 40 && d.crowd_pressure < 80;
      else if (_activePressure === 'high') matchPress = d.crowd_pressure >= 80;
      else if (_activePressure === 'gem') matchPress = d.hidden_gem;

      const matchSearch = !_searchQuery ||
        d.name.toLowerCase().includes(_searchQuery) ||
        d.state.toLowerCase().includes(_searchQuery) ||
        d.district.toLowerCase().includes(_searchQuery) ||
        d.tags.toLowerCase().includes(_searchQuery);

      return matchCat && matchPress && matchSearch;
    });

    renderMarkers(filtered);
    renderSidebarList(filtered);
  }

  /* ── Drawer Details ─────────────────────────────────────────────── */
  function openDestinationDrawer(dest) {
    const drawer = document.getElementById('map-drawer');
    if (!drawer) return;

    const level = dest.crowd_pressure >= 80 ? 'high' : (dest.crowd_pressure >= 40 ? 'moderate' : 'low');
    const cfg = PRESSURE_COLORS[level.toUpperCase()];

    const nameEl = document.getElementById('drawer-name');
    const locEl = document.getElementById('drawer-location');
    if (nameEl) nameEl.textContent = dest.name;
    if (locEl) locEl.textContent = `${dest.district ? dest.district + ', ' : ''}${dest.state}`;

    const badgeRow = document.getElementById('drawer-badges');
    if (badgeRow) {
      badgeRow.innerHTML = `
        <span class="badge badge--${dest.category}">${escapeHtml(dest.category)}</span>
        <span class="badge badge--crowd-${level}">
          ${dest.crowd_pressure}% Crowd (${cfg.label})
        </span>
        ${dest.hidden_gem ? '<span class="badge badge--gem">Hidden Gem</span>' : ''}
      `;
    }

    const imgEl = document.getElementById('drawer-img');
    if (imgEl) {
      const fallbackUrl = `https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80`;
      imgEl.src = dest.image_path || fallbackUrl;
      imgEl.onerror = () => { imgEl.src = fallbackUrl; };
    }

    const oppEl = document.getElementById('drawer-score-opportunity');
    const sustEl = document.getElementById('drawer-score-sustainability');
    const accEl = document.getElementById('drawer-score-accessibility');
    if (oppEl) oppEl.textContent = dest.opportunity_score;
    if (sustEl) sustEl.textContent = dest.sustainability_score;
    if (accEl) accEl.textContent = dest.accessibility_score;

    const secretEl = document.getElementById('drawer-secret');
    if (secretEl) {
      secretEl.textContent = dest.reason_to_visit || dest.description || 'A remarkable cultural destination.';
    }

    /* Live Crowd Pressure Engine Prediction */
    const crowdPredEl = document.getElementById('drawer-crowd-prediction');
    if (crowdPredEl) {
      crowdPredEl.style.display = 'block';
      crowdPredEl.innerHTML = '<span style="color:rgba(20,40,29,0.6);">Predicting diurnal crowd profile…</span>';
      fetch(`/api/destinations/${dest.id}/crowd-prediction`)
        .then(r => r.json())
        .then(resp => {
          if (resp.success && resp.data) {
            const p = resp.data;
            const lvlColor = p.predicted_crowd_level === 'low' ? '#15803d' : (p.predicted_crowd_level === 'moderate' ? '#b45309' : '#dc2626');
            crowdPredEl.innerHTML = `
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
                <span style="font-weight:700;color:#14281D;text-transform:uppercase;letter-spacing:0.04em;font-size:10px;">
                  Crowd Forecast · ${p.evaluated_hour}:00
                </span>
                <span style="font-weight:700;color:${lvlColor};">
                  ${p.occupancy_percent}% (${p.status_label})
                </span>
              </div>
              <div style="color:rgba(20,40,29,0.8);font-size:11px;">
                <strong>Best Visit Window:</strong> ${escapeHtml(p.optimal_visit_window || 'Early Morning')}
              </div>
            `;
            crowdPredEl.style.display = 'block';
          } else {
            crowdPredEl.style.display = 'none';
          }
        })
        .catch(() => { crowdPredEl.style.display = 'none'; });
    }

    const routeBtn = document.getElementById('drawer-route-btn');
    if (routeBtn) {
      routeBtn.onclick = () => routeToDestination(dest);
    }

    const planBtn = document.getElementById('drawer-add-yatra');
    if (planBtn) {
      planBtn.href = `/plan?destination_id=${dest.id}&destination_name=${encodeURIComponent(dest.name)}`;
    }

    drawer.classList.add('drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
  }

  window.closeMapDrawer = function () {
    const drawer = document.getElementById('map-drawer');
    if (drawer) {
      drawer.classList.remove('drawer-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
  };

  /* ── UI Event Listeners ─────────────────────────────────────────── */
  function wireUIEvents() {
    const locateBtn = document.getElementById('locate-btn');
    if (locateBtn) locateBtn.addEventListener('click', useCurrentLocation);

    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

    const legendBtn = document.getElementById('legend-toggle-btn');
    if (legendBtn) legendBtn.addEventListener('click', toggleLegend);

    const sidebarToggleBtn = document.getElementById('map-sidebar-toggle');
    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', () => {
        const sb = document.getElementById('mapSidebar');
        if (sb) sb.classList.toggle('sidebar-open');
      });
    }

    const tileBtn = document.getElementById('tile-toggle-btn');
    if (tileBtn) {
      tileBtn.addEventListener('click', () => {
        if (_isGoogleMaps && _gMap) {
          const curType = _gMap.getMapTypeId();
          const newType = (curType === 'satellite' || curType === 'hybrid') ? 'roadmap' : 'hybrid';
          _gMap.setMapTypeId(newType);
        } else if (_lMap) {
          toggleLeafletTileLayer();
        }
      });
    }
  }

  function toggleFullscreen() {
    const container = document.getElementById('map-container');
    if (!document.fullscreenElement) {
      if (container && container.requestFullscreen) container.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  function toggleLegend() {
    _legendVisible = !_legendVisible;
    const el = document.getElementById('mapLegend');
    if (el) el.style.display = _legendVisible ? 'block' : 'none';
  }

  function toggleLeafletTileLayer() {
    if (!_lMap) return;
    if (_lCurrentTileKey === 'osm') {
      if (_lTileLayer) _lMap.removeLayer(_lTileLayer);
      _lTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Imagery'
      }).addTo(_lMap);
      _lCurrentTileKey = 'satellite';
    } else {
      if (_lTileLayer) _lMap.removeLayer(_lTileLayer);
      _lTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(_lMap);
      _lCurrentTileKey = 'osm';
    }
  }

  /* ── Helpers ────────────────────────────────────────────────────── */
  function setRouteStatus(msg, type = 'info') {
    const el = document.getElementById('routeStatus');
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'route-status ' + type;
  }

  function updateEngineBadge(text, isLive) {
    const badge = document.getElementById('mapEngineBadge');
    if (!badge) return;
    badge.textContent = text;
    if (isLive) {
      badge.style.background = 'rgba(20, 40, 29, 0.12)';
      badge.style.color = '#14281D';
      badge.style.borderColor = '#C5A059';
    }
  }

  function formatDuration(seconds) {
    const mins = Math.max(1, Math.round(seconds / 60));
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Ensure any banner element is removed
  const existingBanner = document.getElementById('gmp-key-banner');
  if (existingBanner) existingBanner.remove();

  window.openKeyModal = function () {
    if (document.getElementById('gmp-key-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'gmp-key-modal';
    modal.className = 'gmp-modal-backdrop';
    modal.innerHTML = `
      <div class="gmp-modal-box">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <h3 class="gmp-modal-title">Activate Google Maps Platform</h3>
          <button type="button" onclick="closeKeyModal()" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:#14281D;">✕</button>
        </div>
        <p style="font-size:0.84rem;color:rgba(20,40,29,0.8);margin-bottom:16px;line-height:1.5;">
          For instant zero-friction testing without billing setup, grab a free <strong>Google Maps Demo Key</strong>.
          Paste the key below to activate live Places autocomplete and driving directions.
        </p>
        <div style="margin-bottom:14px;">
          <a href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1" target="_blank" rel="noopener" style="font-size:0.8rem;color:#8c6b23;font-weight:700;text-decoration:underline;">
            Open Google Maps Demo Key Portal (Sign in &amp; Reveal Key) &nearr;
          </a>
        </div>
        <div style="margin-bottom:16px;">
          <label for="modalKeyInput" style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;margin-bottom:6px;">API Key</label>
          <input type="text" id="modalKeyInput" class="route-input" placeholder="AIzaSy..." style="width:100%;font-family:monospace;font-size:0.85rem;" autocomplete="off">
          <div id="modalKeyError" style="color:#dc2626;font-size:0.74rem;margin-top:4px;display:none;"></div>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button type="button" onclick="closeKeyModal()" class="btn-clear-route" style="padding:8px 16px;">Cancel</button>
          <button type="button" onclick="submitKeyModal()" class="btn-get-route" id="modalSubmitBtn" style="padding:8px 20px;">Activate Now</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => {
      const inp = document.getElementById('modalKeyInput');
      if (inp) inp.focus();
    }, 100);
  };

  window.closeKeyModal = function () {
    const modal = document.getElementById('gmp-key-modal');
    if (modal) modal.remove();
  };

  window.submitKeyModal = async function () {
    const inp = document.getElementById('modalKeyInput');
    const errEl = document.getElementById('modalKeyError');
    const btn = document.getElementById('modalSubmitBtn');
    const val = (inp ? inp.value : '').trim();

    if (!val) {
      if (errEl) { errEl.textContent = 'Please enter an API key.'; errEl.style.display = 'block'; }
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Activating…'; }
    if (errEl) errEl.style.display = 'none';

    try {
      const res = await fetch('/api/maps/save-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: val })
      });
      const data = await res.json();
      if (data.success) {
        window.GOOGLE_MAPS_API_KEY = val;
        closeKeyModal();
        const banner = document.getElementById('gmp-key-banner');
        if (banner) banner.remove();
        alert('Google Maps Key activated! Initializing live map…');
        location.reload();
      } else {
        if (errEl) {
          errEl.textContent = data.error || 'Failed to activate key.';
          errEl.style.display = 'block';
        }
      }
    } catch (e) {
      if (errEl) {
        errEl.textContent = 'Network error saving key. Please try again.';
        errEl.style.display = 'block';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Activate Now'; }
    }
  };

  /* ── Expose globals ─────────────────────────────────────────────── */
  window.YatraMap = {
    isGoogleMaps: () => _isGoogleMaps,
    getGoogleMap: () => _gMap,
    calculateRoute: window.calculateRoute,
    clearRoute: window.clearRoute,
    routeToDestination: window.routeToDestination,
    focusDestination: window.focusDestination,
  };

})();
