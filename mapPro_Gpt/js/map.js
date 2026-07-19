/* =====================================================
   map.js — MapLibre GL 기반 지구본/지도 렌더링 모듈
   줌아웃: 3D 지구본 / 줌인: 구글맵 수준 도시·골목 지도
   ===================================================== */
(function () {
  'use strict';

  const TRANSPORT_ICON = {
    plane: '✈', car: '🚗', train: '🚂', bus: '🚌',
    ship: '🚢', bicycle: '🚲', walk: '🚶',
  };
  const TRANSPORT_SPEED = {
    plane: 0.003, car: 0.0015, train: 0.002, bus: 0.0012,
    ship: 0.0007, bicycle: 0.0005, walk: 0.0003,
  };
  const TRANSPORT_STYLE = {
    plane:   { color: '#60a5fa', weight: 2   },
    car:     { color: '#34d399', weight: 2   },
    train:   { color: '#f59e0b', weight: 2.5 },
    bus:     { color: '#a78bfa', weight: 2   },
    ship:    { color: '#22d3ee', weight: 2   },
    bicycle: { color: '#fb923c', weight: 1.5 },
    walk:    { color: '#f472b6', weight: 1.5 },
  };

  let map = null;
  let mapReady = false;
  let onPlaceClickCb = null;

  // 지도 준비 전 데이터 큐 (map.on('load') 이전에 setPlaces/setRoutes 호출될 경우)
  let queuedPlaces = null;
  let queuedRoutes = null;
  let queuedPlaceMap = null;

  // 교통수단 이동 애니메이션
  let animFrame = null;
  let routeAnims = [];
  const transportMarkers = [];

  /* ── 초기화 (Promise — 스타일 로드 완료까지 대기) ── */
  function init(container) {
    return new Promise(resolve => {
      map = new maplibregl.Map({
        container,
        style: 'https://tiles.openfreemap.org/styles/dark',
        projection: 'globe',
        center: [20, 20],
        zoom: 1.5,
        minZoom: 0.5,
        maxZoom: 19,
        attributionControl: false,
      });

      const safety = setTimeout(() => {
        mapReady = true;
        _applyQueued();
        resolve();
      }, 8000);

      map.on('load', () => {
        clearTimeout(safety);
        _setupLayers();
        _setupFog();
        try { map.setProjection('globe'); } catch (_) {}
        mapReady = true;
        _applyQueued();
        resolve();
      });

      map.on('error', () => { clearTimeout(safety); resolve(); });
    });
  }

  function _applyQueued() {
    if (queuedPlaces !== null) {
      _doSetPlaces(queuedPlaces);
      queuedPlaces = null;
    }
    if (queuedRoutes !== null) {
      _doSetRoutes(queuedRoutes, queuedPlaceMap);
      queuedRoutes = null;
      queuedPlaceMap = null;
    }
  }

  /* ── 우주 배경 + 대기권 안개 ── */
  function _setupFog() {
    try {
      map.setFog({
        'space-color':    '#000010',
        'star-intensity': 0.85,
        'horizon-blend':  0.02,
        'color':          'rgba(14,25,50,0.7)',
        'high-color':     '#1e3a6e',
      });
    } catch (_) {}
  }

  /* ── GeoJSON 레이어 등록 ── */
  function _setupLayers() {
    map.addSource('routes-src', { type: 'geojson', data: _fc([]) });
    map.addSource('places-src', { type: 'geojson', data: _fc([]) });

    // 경로선 (이동수단별 색상 · 점선)
    map.addLayer({
      id: 'routes-layer',
      type: 'line',
      source: 'routes-src',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color':     ['get', 'color'],
        'line-width':     ['get', 'weight'],
        'line-opacity':   0.8,
        'line-dasharray': [6, 4],
      },
    });

    // 장소 마커 글로우
    map.addLayer({
      id: 'places-glow',
      type: 'circle',
      source: 'places-src',
      paint: {
        'circle-radius':  14,
        'circle-color':   '#f59e0b',
        'circle-opacity': 0.18,
      },
    });

    // 장소 마커 점
    map.addLayer({
      id: 'places-dot',
      type: 'circle',
      source: 'places-src',
      paint: {
        'circle-radius':       7,
        'circle-color':        '#f59e0b',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
      },
    });

    // 장소 이름 라벨
    map.addLayer({
      id: 'places-label',
      type: 'symbol',
      source: 'places-src',
      layout: {
        'text-field':    ['get', 'name'],
        'text-size':     12,
        'text-offset':   [0, 1.5],
        'text-anchor':   'top',
        'text-optional': true,
      },
      paint: {
        'text-color':       '#f59e0b',
        'text-halo-color':  '#000010',
        'text-halo-width':  2,
      },
    });

    _bindEvents();
  }

  /* ── 클릭 · 호버 이벤트 ── */
  function _bindEvents() {
    map.on('click', 'places-dot', e => {
      if (!e.features.length) return;
      const place = JSON.parse(e.features[0].properties.placeData);
      _popup(e.features[0].geometry.coordinates.slice(), `
        <div class="map-popup">
          <strong>${esc(place.name)}</strong>
          ${place.country   ? `<br><span>${esc(place.country)}</span>` : ''}
          ${place.visitDate ? `<br><small>📅 ${place.visitDate}</small>` : ''}
          ${place.memo      ? `<br><small>${esc(place.memo)}</small>` : ''}
        </div>`);
      if (onPlaceClickCb) onPlaceClickCb(place);
    });

    map.on('click', 'routes-layer', e => {
      if (!e.features.length) return;
      const p = e.features[0].properties;
      _popup(e.lngLat, `
        <div class="map-popup">
          <strong>${TRANSPORT_ICON[p.transport] || '🚀'} ${esc(p.fromName)} → ${esc(p.toName)}</strong>
          ${p.date ? `<br><small>📅 ${p.date}</small>` : ''}
          ${p.memo ? `<br><small>${esc(p.memo)}</small>` : ''}
        </div>`);
    });

    ['places-dot', 'places-glow'].forEach(id => {
      map.on('mouseenter', id, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', id, () => { map.getCanvas().style.cursor = ''; });
    });
    map.on('mouseenter', 'routes-layer', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'routes-layer', () => { map.getCanvas().style.cursor = ''; });
  }

  function _popup(lngLat, html) {
    new maplibregl.Popup({ closeButton: true, maxWidth: '260px' })
      .setLngLat(lngLat).setHTML(html).addTo(map);
  }

  /* ── 공개 API ── */
  function setPlaces(places) {
    if (!mapReady) { queuedPlaces = places; return; }
    _doSetPlaces(places);
  }

  function _doSetPlaces(places) {
    const src = map.getSource('places-src');
    if (!src) return;
    src.setData(_fc(
      places
        .filter(p => p.lat != null && p.lng != null)
        .map(p => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
          properties: { placeData: JSON.stringify(p), name: p.name },
        }))
    ));
  }

  function setRoutes(routes, places) {
    if (!mapReady) { queuedRoutes = routes; queuedPlaceMap = places; return; }
    _doSetRoutes(routes, places);
  }

  function _doSetRoutes(routes, places) {
    const routesSrc = map.getSource('routes-src');
    if (!routesSrc) return;

    const pm = {};
    places.forEach(p => { pm[p.id] = p; });

    const features = [];
    routeAnims = [];

    routes.forEach(r => {
      const from  = pm[r.fromPlaceId];
      const to    = pm[r.toPlaceId];
      if (!from || !to || from.lat == null || to.lat == null) return;

      const style = TRANSPORT_STYLE[r.transport] || TRANSPORT_STYLE.plane;
      const pts   = _greatCircle(from.lat, from.lng, to.lat, to.lng, 100);

      features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: pts.map(([la, ln]) => [ln, la]) },
        properties: {
          color: style.color, weight: style.weight,
          transport: r.transport,
          fromName: from.name, toName: to.name,
          date: r.date || '', memo: r.memo || '',
        },
      });

      routeAnims.push({
        pts,
        t: Math.random(),
        speed: TRANSPORT_SPEED[r.transport] || 0.002,
        icon:  TRANSPORT_ICON[r.transport]  || '🚀',
      });
    });

    routesSrc.setData(_fc(features));
    _startAnimation();
  }

  /* ── 교통수단 이동 애니메이션 (HTML 마커) ── */
  function _clearMarkers() {
    transportMarkers.forEach(m => m.remove());
    transportMarkers.length = 0;
  }

  function _startAnimation() {
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    _clearMarkers();
    if (!routeAnims.length || !map) return;

    routeAnims.forEach(a => {
      const el = document.createElement('div');
      el.className = 'transport-anim-icon';
      el.textContent = a.icon;
      const startPt = a.pts[0];
      const m = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([startPt[1], startPt[0]])
        .addTo(map);
      transportMarkers.push(m);
    });

    function tick() {
      routeAnims.forEach((a, i) => {
        a.t = (a.t + a.speed) % 1;
        const idx = Math.min(Math.floor(a.t * a.pts.length), a.pts.length - 1);
        const [lat, lng] = a.pts[idx];
        if (transportMarkers[i]) transportMarkers[i].setLngLat([lng, lat]);
      });
      animFrame = requestAnimationFrame(tick);
    }

    tick();
  }

  function focusPlace(place, zoom) {
    if (!map || place.lat == null) return;
    map.flyTo({ center: [place.lng, place.lat], zoom: zoom || 10, duration: 1200 });
  }

  function onPlaceClick(cb) { onPlaceClickCb = cb; }

  /* ── 헬퍼 ── */
  function _fc(features) { return { type: 'FeatureCollection', features }; }

  function _greatCircle(lat1, lng1, lat2, lng2, n) {
    n = n || 64;
    const R = Math.PI / 180, D = 180 / Math.PI;
    let dLng = lng2 - lng1;
    if (dLng >  180) dLng -= 360;
    if (dLng < -180) dLng += 360;
    const φ1 = lat1*R, λ1 = lng1*R, φ2 = lat2*R, λ2 = (lng1+dLng)*R;
    const d = 2*Math.asin(Math.sqrt(
      Math.pow(Math.sin((φ2-φ1)/2),2) + Math.cos(φ1)*Math.cos(φ2)*Math.pow(Math.sin((λ2-λ1)/2),2)
    ));
    if (d < 0.001) return [[lat1,lng1],[lat2,lng2]];
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const f = i/n;
      const A = Math.sin((1-f)*d)/Math.sin(d), B = Math.sin(f*d)/Math.sin(d);
      const x = A*Math.cos(φ1)*Math.cos(λ1) + B*Math.cos(φ2)*Math.cos(λ2);
      const y = A*Math.cos(φ1)*Math.sin(λ1) + B*Math.cos(φ2)*Math.sin(λ2);
      const z = A*Math.sin(φ1) + B*Math.sin(φ2);
      pts.push([Math.atan2(z,Math.sqrt(x*x+y*y))*D, Math.atan2(y,x)*D]);
    }
    return pts;
  }

  function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  window.MapManager = { init, setPlaces, setRoutes, focusPlace, onPlaceClick };
})();
