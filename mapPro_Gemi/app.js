'use strict';

/* ──────────────────────────────────────────────
   유틸
   ────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ──────────────────────────────────────────────
   항공사 설정
   ────────────────────────────────────────────── */
const AIRLINES = {
  default:    { name: '항공사 미선택',   color: '#ef4444' },
  korean:     { name: '대한항공',        color: '#004b9e' },
  asiana:     { name: '아시아나항공',    color: '#e8192c' },
  jeju:       { name: '제주항공',        color: '#f97316' },
  tway:       { name: '티웨이항공',      color: '#e11d48' },
  vietjet:    { name: '비엣젯',          color: '#ef4444' },
  thai:       { name: '타이항공',        color: '#6d28d9' },
  ana:        { name: 'ANA',             color: '#006db7' },
  jal:        { name: 'JAL',             color: '#9b1c1c' },
  singapore:  { name: '싱가포르항공',    color: '#c9a84c' },
  emirates:   { name: '에미레이츠',      color: '#9b1c1c' },
};

const TRANSPORT_ICONS = { plane: '✈', ship: '⛵', car: '🚗', train: '🚆', walk: '🚶' };
const TRANSPORT_COLOR = { plane: '#ef4444', ship: '#0ea5e9', car: '#22c55e', train: '#3b82f6', walk: '#f59e0b' };

/* ──────────────────────────────────────────────
   앱 상태
   ────────────────────────────────────────────── */
const state = {
  locations: [],    // { id, lat, lng, name, photos:[{url,name}] }
  routes: [],       // { id, origin, dest, transport, airline, color, label, planeMarker, animFrameId, t }
  selectedLoc: null,
  fsIndex: 0,
  pendingPhotos: [],
  pendingIdx: 0,
  editTarget: null, // { type:'loc'|'route', id }
  // 검색 선택값
  originSel: null,
  destSel: null,
  manualSel: null,
  airlineSel: null,
  editLocSel: null,
};

let nextId = 1;
function uid() { return `id-${nextId++}`; }

/* ──────────────────────────────────────────────
   MapLibre GL JS 초기화
   ────────────────────────────────────────────── */
let map;

function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    center: [113, 26],
    zoom: 1.5,
    minZoom: 0,
    maxZoom: 20,
    attributionControl: false,
    projection: 'globe',
  });

  map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

  // iframe 내 wheel 버블링 차단
  document.getElementById('map')
    .addEventListener('wheel', e => e.stopPropagation(), { passive: false });

  // 안전망: 12초 후에도 load 이벤트가 안 오면 강제로 로딩 해제
  const loadTimer = setTimeout(hideLoading, 12000);

  map.on('load', () => {
    clearTimeout(loadTimer);
    // MapLibre GL JS가 지원하는 fog 속성만 사용 (star-intensity / high-color는 Mapbox 전용)
    try {
      map.setFog({
        range: [0.5, 10],
        color: 'rgb(150, 195, 230)',
        'horizon-blend': 0.04,
      });
    } catch (e) {
      console.warn('setFog 미지원:', e.message);
    }
    addRoutesLayer();
    loadMockData();
    hideLoading();
  });

  // 스타일 로드 실패 등 오류 발생 시에도 로딩 해제
  map.on('error', (e) => {
    console.warn('MapLibre 오류:', e.error?.message);
    clearTimeout(loadTimer);
    hideLoading();
  });
}

function hideLoading() {
  const el = document.getElementById('loading');
  if (!el || el.classList.contains('fade-out')) return;
  el.classList.add('fade-out');
  setTimeout(() => el.remove(), 600);
}

/* ──────────────────────────────────────────────
   GeoJSON 경로 레이어 (비행기 제외, 선만)
   ────────────────────────────────────────────── */
function addRoutesLayer() {
  map.addSource('routes', {
    type: 'geojson',
    data: buildRoutesGeoJSON(),
  });

  // 모든 교통수단 경로에 점선 표시 (비행기 포함)
  map.addLayer({
    id: 'routes-line',
    type: 'line',
    source: 'routes',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2.5,
      'line-dasharray': [3, 1.5],
      'line-opacity': 0.85,
    },
  });
}

function buildRoutesGeoJSON() {
  const features = state.routes.map(r => ({
    type: 'Feature',
    properties: { id: r.id, transport: r.transport, color: r.color },
    geometry: {
      type: 'LineString',
      coordinates: generateArcCoords(
        r.origin.lat, r.origin.lng, r.dest.lat, r.dest.lng, 80
      ),
    },
  }));
  return { type: 'FeatureCollection', features };
}

function refreshRoutesLayer() {
  if (!map.getSource('routes')) return;
  map.getSource('routes').setData(buildRoutesGeoJSON());
}

/* ──────────────────────────────────────────────
   대권 경로 수학
   ────────────────────────────────────────────── */
const DEG = Math.PI / 180;

function greatCirclePoint(lat1, lng1, lat2, lng2, t) {
  const φ1 = lat1 * DEG, λ1 = lng1 * DEG;
  const φ2 = lat2 * DEG, λ2 = lng2 * DEG;
  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((φ2 - φ1) / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2
  ));
  if (d < 1e-10) return { lat: lat1, lng: lng1 };
  const A = Math.sin((1 - t) * d) / Math.sin(d);
  const B = Math.sin(t * d) / Math.sin(d);
  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);
  return {
    lat: Math.atan2(z, Math.sqrt(x * x + y * y)) / DEG,
    lng: Math.atan2(y, x) / DEG,
  };
}

function generateArcCoords(lat1, lng1, lat2, lng2, n = 80) {
  const coords = [];
  for (let i = 0; i <= n; i++) {
    const p = greatCirclePoint(lat1, lng1, lat2, lng2, i / n);
    coords.push([p.lng, p.lat]);
  }
  return coords;
}

function bearing(lat1, lng1, lat2, lng2) {
  const dL = (lng2 - lng1) * DEG;
  const φ1 = lat1 * DEG, φ2 = lat2 * DEG;
  const y = Math.sin(dL) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dL);
  return ((Math.atan2(y, x) / DEG) + 360) % 360;
}

/* ──────────────────────────────────────────────
   비행기 마커 & 애니메이션
   ────────────────────────────────────────────── */
/* 교통수단별 마커 아이콘 생성
   비행기: 흰색 SVG (색상 배경 원, 방위각 회전)
   나머지: 이모지 (색상 배경 원, 이동만으로 방향 표현) */
function buildTransportEl(transport, color) {
  const el = document.createElement('div');
  el.className = 'transport-marker';

  const inner = document.createElement('div');
  inner.className = 'transport-inner';
  inner.style.background = color;

  if (transport === 'plane') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.style.cssText = 'display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'white');
    path.setAttribute('d', 'M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z');
    svg.appendChild(path);
    inner.appendChild(svg);
  } else {
    const EMOJI = { ship: '⛵', car: '🚗', train: '🚆', walk: '🚶' };
    inner.textContent = EMOJI[transport] || '•';
  }

  el.appendChild(inner);
  return el;
}

/* 속도: 교통수단별 상대 속도 설정 */
const TRANSPORT_SPEED = {
  plane: 0.0010,
  ship:  0.0004,
  car:   0.0007,
  train: 0.0008,
  walk:  0.0003,
};

function startTransportAnimation(route) {
  if (route.animFrameId) cancelAnimationFrame(route.animFrameId);
  if (route.planeMarker) { route.planeMarker.remove(); route.planeMarker = null; }

  const el = buildTransportEl(route.transport, route.color);
  route.planeMarker = new maplibregl.Marker({ element: el, anchor: 'center' })
    .setLngLat([route.origin.lng, route.origin.lat])
    .addTo(map);

  if (route.t === undefined) route.t = 0;
  const speed = TRANSPORT_SPEED[route.transport] || 0.0008;
  const inner = el.firstChild;

  function tick() {
    route.t = (route.t + speed) % 1;
    const pos = greatCirclePoint(
      route.origin.lat, route.origin.lng,
      route.dest.lat,   route.dest.lng,
      route.t
    );
    // 비행기만 방위각 회전 (SVG는 크기 변화 없이 회전 가능)
    if (route.transport === 'plane') {
      const next = greatCirclePoint(
        route.origin.lat, route.origin.lng,
        route.dest.lat,   route.dest.lng,
        Math.min(route.t + 0.003, 1)
      );
      const deg = bearing(pos.lat, pos.lng, next.lat, next.lng);
      inner.style.transform = `rotate(${deg}deg)`;
    }
    route.planeMarker.setLngLat([pos.lng, pos.lat]);
    route.animFrameId = requestAnimationFrame(tick);
  }
  tick();
}

function stopTransportAnimation(route) {
  if (route.animFrameId) { cancelAnimationFrame(route.animFrameId); route.animFrameId = null; }
  if (route.planeMarker) { route.planeMarker.remove(); route.planeMarker = null; }
}

/* ──────────────────────────────────────────────
   Mock 데이터
   ────────────────────────────────────────────── */
function loadMockData() {
  const icn = { lat: 37.4602, lng: 126.4407, name: '인천국제공항 (ICN)' };
  const bkk = { lat: 13.6900, lng: 100.7501, name: '방콕 수완나품 (BKK)' };

  addLocationInternal(icn.lat, icn.lng, icn.name, []);
  addLocationInternal(bkk.lat, bkk.lng, bkk.name, []);

  const route = {
    id: uid(),
    origin: icn, dest: bkk,
    transport: 'plane',
    airline: 'vietjet',
    color: AIRLINES.vietjet.color,
    label: 'VietJet VJ870',
    t: 0,
  };
  state.routes.push(route);
  refreshRoutesLayer();
  startTransportAnimation(route);
  updateStats();
  renderRouteList();
}

/* ──────────────────────────────────────────────
   위치 마커
   ────────────────────────────────────────────── */
function addLocationInternal(lat, lng, name, photos) {
  const dup = state.locations.find(
    l => Math.abs(l.lat - lat) < 0.009 && Math.abs(l.lng - lng) < 0.009
  );
  if (dup) {
    dup.photos.push(...photos);
    updateStats();
    return dup;
  }
  const loc = { id: uid(), lat, lng, name: name || coordLabel(lat, lng), photos: [...photos] };
  state.locations.push(loc);
  addLocMarker(loc);
  updateStats();
  return loc;
}

function addLocMarker(loc) {
  const el = document.createElement('div');
  el.className = 'loc-marker';
  el.innerHTML = `<div class="loc-dot"></div>`;
  el.addEventListener('click', () => onLocMarkerClick(loc));

  const popup = new maplibregl.Popup({ offset: 12, closeButton: true, maxWidth: '220px' })
    .setHTML(buildLocPopupHtml(loc));

  const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
    .setLngLat([loc.lng, loc.lat])
    .setPopup(popup)
    .addTo(map);

  loc._marker = marker;
}

function buildLocPopupHtml(loc) {
  const photoTxt = loc.photos.length
    ? `사진 ${Number(loc.photos.length)}장`
    : '사진 없음';
  return `<div class="popup-name">${escHtml(loc.name)}</div>
<div class="popup-meta">${photoTxt}</div>
<div class="popup-actions">
  ${loc.photos.length
    ? `<button class="popup-btn" onclick="window.openLocGallery('${escHtml(loc.id)}')">갤러리</button>`
    : ''}
  <button class="popup-btn" onclick="window.startEditLocation('${escHtml(loc.id)}')">수정</button>
  <button class="popup-btn popup-btn-del" onclick="window.deleteLocation('${escHtml(loc.id)}')">삭제</button>
</div>`;
}

function refreshLocMarker(loc) {
  if (loc._marker) {
    loc._marker.getPopup().setHTML(buildLocPopupHtml(loc));
  }
}

function coordLabel(lat, lng) {
  const la = lat >= 0 ? `${lat.toFixed(2)}°N` : `${(-lat).toFixed(2)}°S`;
  const lo = lng >= 0 ? `${lng.toFixed(2)}°E` : `${(-lng).toFixed(2)}°W`;
  return `${la}, ${lo}`;
}

function onLocMarkerClick(loc) {
  if (loc.photos.length) {
    state.selectedLoc = loc;
    buildGallery(loc);
    openModal('photo-modal');
  }
}

/* ──────────────────────────────────────────────
   Nominatim 지명 검색
   ────────────────────────────────────────────── */
let searchTimers = {};

function setupSearchInput(inputId, resultsId, badgeId, onSelect) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  const badge = badgeId ? document.getElementById(badgeId) : null;

  input.addEventListener('input', () => {
    clearTimeout(searchTimers[inputId]);
    const q = input.value.trim();
    if (!q) { hideResults(results); return; }
    results.innerHTML = `<div class="search-loading">검색 중…</div>`;
    results.classList.remove('hidden');
    searchTimers[inputId] = setTimeout(() => geocode(q, results, badge, onSelect, input), 350);
  });

  input.addEventListener('blur', () => {
    setTimeout(() => hideResults(results), 180);
  });
}

async function geocode(query, resultsEl, badgeEl, onSelect, inputEl) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&accept-language=ko,en`;
    const res = await fetch(url, { headers: { 'User-Agent': 'TravelGlobeApp/1.0' } });
    const data = await res.json();
    renderSearchResults(data, resultsEl, badgeEl, onSelect, inputEl);
  } catch {
    resultsEl.innerHTML = `<div class="search-loading">검색 실패. 네트워크를 확인해주세요.</div>`;
  }
}

function renderSearchResults(data, resultsEl, badgeEl, onSelect, inputEl) {
  if (!data.length) {
    resultsEl.innerHTML = `<div class="search-loading">결과가 없습니다.</div>`;
    return;
  }
  resultsEl.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.textContent = item.display_name;
    div.addEventListener('mousedown', e => {
      e.preventDefault();
      const place = {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        name: item.display_name,
      };
      inputEl.value = item.display_name;
      if (badgeEl) {
        badgeEl.textContent = `✓ ${item.display_name.split(',')[0]}`;
        badgeEl.classList.remove('hidden');
      }
      hideResults(resultsEl);
      onSelect(place);
    });
    resultsEl.appendChild(div);
  });
}

function hideResults(el) {
  el.classList.add('hidden');
  el.innerHTML = '';
}

/* ──────────────────────────────────────────────
   경로 추가
   ────────────────────────────────────────────── */
function handleAddRoute() {
  if (!state.originSel) { alert('출발지를 검색해서 선택해주세요.'); return; }
  if (!state.destSel)   { alert('도착지를 검색해서 선택해주세요.'); return; }

  const transport = document.getElementById('transport-mode').value;
  const airlineKey = state.airlineSel?.key || 'default';
  const airline = AIRLINES[airlineKey] || AIRLINES.default;
  const color = transport === 'plane' ? airline.color : TRANSPORT_COLOR[transport];

  const route = {
    id: uid(),
    origin: { ...state.originSel },
    dest:   { ...state.destSel },
    transport,
    airline: transport === 'plane' ? airlineKey : null,
    color,
    label: `${TRANSPORT_ICONS[transport]} ${state.originSel.name.split(',')[0]} → ${state.destSel.name.split(',')[0]}`,
    t: 0,
  };

  state.routes.push(route);
  addLocationInternal(route.origin.lat, route.origin.lng, route.origin.name, []);
  addLocationInternal(route.dest.lat,   route.dest.lng,   route.dest.name,   []);

  refreshRoutesLayer();
  startTransportAnimation(route);
  updateStats();
  renderRouteList();

  // 입력 초기화
  document.getElementById('origin-search').value = '';
  document.getElementById('dest-search').value = '';
  document.getElementById('origin-badge').classList.add('hidden');
  document.getElementById('dest-badge').classList.add('hidden');
  document.getElementById('airline-search').value = '';
  document.getElementById('airline-badge').classList.add('hidden');
  state.originSel = null;
  state.destSel = null;
  state.airlineSel = null;

  // 경로 중간으로 이동
  const midLat = (route.origin.lat + route.dest.lat) / 2;
  const midLng = (route.origin.lng + route.dest.lng) / 2;
  map.flyTo({ center: [midLng, midLat], zoom: 3, duration: 1200 });
}

/* ──────────────────────────────────────────────
   경로 목록 렌더링
   ────────────────────────────────────────────── */
function renderRouteList() {
  const el = document.getElementById('route-list');
  if (!state.routes.length) {
    el.innerHTML = '<p class="list-empty">경로가 없습니다.</p>';
    return;
  }
  el.innerHTML = state.routes.map(r => {
    const icon = TRANSPORT_ICONS[r.transport] || '📍';
    const airlineTxt = r.transport === 'plane' && r.airline && r.airline !== 'default'
      ? `<div class="route-airline">${escHtml(AIRLINES[r.airline]?.name || '')}</div>` : '';
    return `<div class="route-item" style="border-left-color:${escHtml(r.color)}">
      <div class="route-item-header">
        <span class="route-icon">${icon}</span>
        <div class="route-label">
          ${escHtml(r.origin.name.split(',')[0])} → ${escHtml(r.dest.name.split(',')[0])}
          ${airlineTxt}
        </div>
      </div>
      <div class="route-item-actions">
        <button class="popup-btn" onclick="window.startEditRoute('${escHtml(r.id)}')">수정</button>
        <button class="popup-btn popup-btn-del" onclick="window.deleteRoute('${escHtml(r.id)}')">삭제</button>
      </div>
    </div>`;
  }).join('');
}

/* ──────────────────────────────────────────────
   수정 / 삭제 (위치)
   ────────────────────────────────────────────── */
window.openLocGallery = function(id) {
  const loc = state.locations.find(l => l.id === id);
  if (!loc || !loc.photos.length) return;
  state.selectedLoc = loc;
  buildGallery(loc);
  openModal('photo-modal');
};

window.startEditLocation = function(id) {
  const loc = state.locations.find(l => l.id === id);
  if (!loc) return;
  state.editTarget = { type: 'loc', id };
  state.editLocSel = null;
  document.getElementById('edit-title').textContent = '📍 위치 수정';
  document.getElementById('edit-name').value = loc.name;
  document.getElementById('edit-loc-section').style.display = '';
  document.getElementById('edit-loc-search').value = '';
  document.getElementById('edit-loc-badge').classList.add('hidden');
  hideResults(document.getElementById('edit-loc-results'));
  document.getElementById('edit-photo-input').value = '';
  openModal('edit-modal');
};

window.deleteLocation = function(id) {
  const idx = state.locations.findIndex(l => l.id === id);
  if (idx === -1) return;
  if (!confirm(`'${state.locations[idx].name}' 위치를 삭제할까요?`)) return;
  state.locations[idx]._marker?.remove();
  state.locations.splice(idx, 1);
  updateStats();
};

/* ──────────────────────────────────────────────
   수정 / 삭제 (경로)
   ────────────────────────────────────────────── */
window.startEditRoute = function(id) {
  const route = state.routes.find(r => r.id === id);
  if (!route) return;
  state.editTarget = { type: 'route', id };
  document.getElementById('edit-title').textContent = '🗺 경로 이름 수정';
  document.getElementById('edit-name').value = route.label;
  document.getElementById('edit-loc-section').style.display = 'none';
  openModal('edit-modal');
};

window.deleteRoute = function(id) {
  const idx = state.routes.findIndex(r => r.id === id);
  if (idx === -1) return;
  if (!confirm('이 경로를 삭제할까요?')) return;
  stopTransportAnimation(state.routes[idx]);
  state.routes.splice(idx, 1);
  refreshRoutesLayer();
  updateStats();
  renderRouteList();
};

function confirmEdit() {
  const name = document.getElementById('edit-name').value.trim();
  if (!name) { alert('이름을 입력해주세요.'); return; }
  const { type, id } = state.editTarget || {};

  if (type === 'loc') {
    const loc = state.locations.find(l => l.id === id);
    if (loc) {
      loc.name = name;
      // 위치 이동
      if (state.editLocSel) {
        loc.lat = state.editLocSel.lat;
        loc.lng = state.editLocSel.lng;
        loc._marker.setLngLat([loc.lng, loc.lat]);
        map.flyTo({ center: [loc.lng, loc.lat], zoom: 10, duration: 800 });
      }
      // 사진 추가
      const photoInput = document.getElementById('edit-photo-input');
      Array.from(photoInput.files).forEach(f => {
        loc.photos.push({ url: URL.createObjectURL(f), name: f.name });
      });
      photoInput.value = '';
      refreshLocMarker(loc);
      updateStats();
    }
  } else if (type === 'route') {
    const route = state.routes.find(r => r.id === id);
    if (route) route.label = name;
    renderRouteList();
  }
  state.editTarget = null;
  state.editLocSel = null;
  closeModal('edit-modal');
}

/* ──────────────────────────────────────────────
   EXIF 사진 업로드
   ────────────────────────────────────────────── */
async function handlePhotoUpload(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  const noExif = [];

  for (const file of files) {
    const url = URL.createObjectURL(file);
    try {
      const data = await exifr.parse(file, { gps: true });
      if (data?.latitude && data?.longitude) {
        const loc = addLocationInternal(data.latitude, data.longitude, null, [{ url, name: file.name }]);
        map.flyTo({ center: [loc.lng, loc.lat], zoom: 12, duration: 900 });
      } else {
        noExif.push({ file, url });
      }
    } catch {
      noExif.push({ file, url });
    }
  }

  if (noExif.length) {
    state.pendingPhotos = noExif;
    state.pendingIdx = 0;
    showManualModal();
  }
  e.target.value = '';
}

/* ──────────────────────────────────────────────
   수동 위치 지정 모달
   ────────────────────────────────────────────── */
function showManualModal() {
  if (state.pendingIdx >= state.pendingPhotos.length) return;
  const { file } = state.pendingPhotos[state.pendingIdx];
  document.getElementById('manual-filename').textContent = `📷 ${file.name}`;
  document.getElementById('manual-search').value = '';
  hideResults(document.getElementById('manual-results'));
  state.manualSel = null;
  openModal('manual-modal');
}

function confirmManual() {
  if (!state.manualSel) { alert('장소를 검색해서 선택해주세요.'); return; }
  const { url, file } = state.pendingPhotos[state.pendingIdx];
  const loc = addLocationInternal(
    state.manualSel.lat, state.manualSel.lng,
    state.manualSel.name,
    [{ url, name: file.name }]
  );
  map.flyTo({ center: [loc.lng, loc.lat], zoom: 12, duration: 900 });
  advancePending();
}

function skipManual() {
  URL.revokeObjectURL(state.pendingPhotos[state.pendingIdx].url);
  advancePending();
}

function advancePending() {
  closeModal('manual-modal');
  state.pendingIdx++;
  if (state.pendingIdx < state.pendingPhotos.length) {
    setTimeout(showManualModal, 350);
  }
}

/* ──────────────────────────────────────────────
   갤러리 / 전체화면 뷰어
   ────────────────────────────────────────────── */
function buildGallery(loc) {
  document.getElementById('modal-location-name').textContent = loc.name;
  document.getElementById('modal-photo-count').textContent = `사진 ${loc.photos.length}장`;
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';
  loc.photos.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.name;
    img.loading = 'lazy';
    item.appendChild(img);
    item.addEventListener('click', () => openFullscreen(i));
    grid.appendChild(item);
  });
}

function openFullscreen(index) {
  state.fsIndex = index;
  updateFsImage();
  document.getElementById('fullscreen-viewer').classList.remove('hidden');
}

function updateFsImage() {
  const photos = state.selectedLoc?.photos;
  if (!photos?.length) return;
  document.getElementById('fs-img').src = photos[state.fsIndex].url;
  document.getElementById('fs-counter').textContent = `${state.fsIndex + 1} / ${photos.length}`;
}

function closeFullscreen() {
  document.getElementById('fullscreen-viewer').classList.add('hidden');
}

function stepFs(dir) {
  const len = state.selectedLoc?.photos.length;
  if (!len) return;
  state.fsIndex = (state.fsIndex + dir + len) % len;
  updateFsImage();
}

/* ──────────────────────────────────────────────
   통계
   ────────────────────────────────────────────── */
function updateStats() {
  document.getElementById('visit-count').textContent = state.locations.length;
  const photos = state.locations.reduce((s, l) => s + l.photos.length, 0);
  document.getElementById('photo-count').textContent = photos;
  document.getElementById('route-count').textContent = state.routes.length;
}

/* ──────────────────────────────────────────────
   임베드 코드 복사
   ────────────────────────────────────────────── */
function copyEmbed() {
  const src = location.href.replace(location.hash, '');
  const code = `<iframe src="${src}" width="100%" height="520" frameborder="0" allowfullscreen style="border-radius:14px;border:none;"></iframe>`;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copy-embed-btn');
    btn.textContent = '✅ 복사됨!';
    setTimeout(() => { btn.textContent = '임베드 코드 복사'; }, 2200);
  }).catch(() => {
    prompt('아래 코드를 복사하세요:', code);
  });
}

/* ──────────────────────────────────────────────
   모달 헬퍼
   ────────────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  el.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
}

function closeModal(id) {
  const el = document.getElementById(id);
  el.classList.remove('visible');
  setTimeout(() => el.classList.add('hidden'), 280);
}

/* ──────────────────────────────────────────────
   항공사 로컬 검색
   ────────────────────────────────────────────── */
function setupAirlineSearch() {
  const input = document.getElementById('airline-search');
  const resultsEl = document.getElementById('airline-results');
  const badge = document.getElementById('airline-badge');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    resultsEl.innerHTML = '';
    state.airlineSel = null;
    badge.classList.add('hidden');

    if (!q) { resultsEl.classList.add('hidden'); return; }

    const matches = Object.entries(AIRLINES).filter(([key, info]) =>
      key !== 'default' && (info.name.toLowerCase().includes(q) || key.includes(q))
    );

    if (!matches.length) {
      const d = document.createElement('div');
      d.className = 'search-loading';
      d.textContent = '결과 없음';
      resultsEl.appendChild(d);
      resultsEl.classList.remove('hidden');
      return;
    }

    matches.forEach(([key, info]) => {
      const div = document.createElement('div');
      div.className = 'search-result-item';

      const dot = document.createElement('span');
      dot.style.cssText = `display:inline-block;width:9px;height:9px;border-radius:50%;background:${info.color};margin-right:7px;vertical-align:middle;flex-shrink:0`;
      div.appendChild(dot);
      div.appendChild(document.createTextNode(info.name));

      div.addEventListener('mousedown', e => {
        e.preventDefault();
        input.value = info.name;
        badge.textContent = `✓ ${info.name}`;
        badge.classList.remove('hidden');
        resultsEl.classList.add('hidden');
        state.airlineSel = { key, ...info };
      });
      resultsEl.appendChild(div);
    });
    resultsEl.classList.remove('hidden');
  });

  input.addEventListener('blur', () => {
    setTimeout(() => resultsEl.classList.add('hidden'), 180);
  });
}

/* ──────────────────────────────────────────────
   이벤트 등록
   ────────────────────────────────────────────── */
function setupEvents() {
  // 사진 업로드
  document.getElementById('photo-input').addEventListener('change', handlePhotoUpload);

  // 경로 검색 입력
  setupSearchInput('origin-search', 'origin-results', 'origin-badge', place => {
    state.originSel = place;
  });
  setupSearchInput('dest-search', 'dest-results', 'dest-badge', place => {
    state.destSel = place;
  });

  // 수동 모달 검색
  setupSearchInput('manual-search', 'manual-results', null, place => {
    state.manualSel = place;
  });

  // 교통수단 변경 시 항공사 검색 표시/숨김
  document.getElementById('transport-mode').addEventListener('change', e => {
    const isPlane = e.target.value === 'plane';
    document.getElementById('airline-group').style.display = isPlane ? '' : 'none';
    if (!isPlane) {
      state.airlineSel = null;
      document.getElementById('airline-search').value = '';
      document.getElementById('airline-badge').classList.add('hidden');
    }
  });

  // 항공사 검색
  setupAirlineSearch();

  // 경로 추가
  document.getElementById('add-route-btn').addEventListener('click', handleAddRoute);

  // 갤러리 모달
  document.getElementById('modal-close').addEventListener('click', () => closeModal('photo-modal'));
  document.getElementById('modal-backdrop').addEventListener('click', () => closeModal('photo-modal'));
  document.querySelector('#photo-modal .modal-content').addEventListener('click', e => e.stopPropagation());

  // 수동 위치 모달
  document.getElementById('manual-confirm').addEventListener('click', confirmManual);
  document.getElementById('manual-skip').addEventListener('click', skipManual);

  // 수정 모달
  document.getElementById('edit-confirm').addEventListener('click', confirmEdit);

  function cancelEdit() {
    state.editTarget = null;
    state.editLocSel = null;
    closeModal('edit-modal');
  }
  document.getElementById('edit-cancel').addEventListener('click', cancelEdit);
  document.getElementById('edit-close-btn').addEventListener('click', cancelEdit);
  document.getElementById('edit-backdrop').addEventListener('click', cancelEdit);

  // 수정 모달 — 위치 검색
  setupSearchInput('edit-loc-search', 'edit-loc-results', 'edit-loc-badge', place => {
    state.editLocSel = place;
    document.getElementById('edit-name').value = place.name.split(',')[0];
  });

  // 전체화면 뷰어
  document.getElementById('fs-close').addEventListener('click', closeFullscreen);
  document.getElementById('fs-prev').addEventListener('click', () => stepFs(-1));
  document.getElementById('fs-next').addEventListener('click', () => stepFs(1));

  // 임베드 복사
  document.getElementById('copy-embed-btn').addEventListener('click', copyEmbed);

  // 키보드
  document.addEventListener('keydown', e => {
    const fs = document.getElementById('fullscreen-viewer');
    if (!fs.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft')  stepFs(-1);
      if (e.key === 'ArrowRight') stepFs(1);
      if (e.key === 'Escape')     closeFullscreen();
      return;
    }
    if (e.key === 'Escape') {
      ['photo-modal', 'manual-modal', 'edit-modal'].forEach(id => {
        const el = document.getElementById(id);
        if (!el.classList.contains('hidden')) closeModal(id);
      });
    }
  });
}

/* ──────────────────────────────────────────────
   진입점
   ────────────────────────────────────────────── */
setupEvents();
initMap();
