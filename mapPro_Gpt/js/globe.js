/* =====================================================
   globe.js — Globe.gl 지구본 렌더링 모듈
   GeoJSON 폴리곤으로 구글맵 스타일의 지도형 지구 구현
   ===================================================== */
(function () {
  'use strict';

  // 이동수단별 시각 설정
  const TRANSPORT = {
    plane:   { color: '#60a5fa', dashLen: 0.35, dashGap: 0.15, animTime: 1500, altScale: 0.45 },
    car:     { color: '#34d399', dashLen: 0.7,  dashGap: 0.3,  animTime: 3000, altScale: 0.05 },
    train:   { color: '#f59e0b', dashLen: 0.6,  dashGap: 0.2,  animTime: 2500, altScale: 0.04 },
    bus:     { color: '#a78bfa', dashLen: 0.5,  dashGap: 0.25, animTime: 2800, altScale: 0.04 },
    ship:    { color: '#22d3ee', dashLen: 0.55, dashGap: 0.35, animTime: 4000, altScale: 0.02 },
    bicycle: { color: '#fb923c', dashLen: 0.3,  dashGap: 0.3,  animTime: 5000, altScale: 0.01 },
    walk:    { color: '#f472b6', dashLen: 0.2,  dashGap: 0.4,  animTime: 6000, altScale: 0.01 },
  };

  let globe = null;
  let onPlaceClickCb = null;

  async function init(container) {
    // 지구본을 먼저 초기화 (로딩 화면이 빨리 사라지도록)
    globe = Globe()
      /* ── 배경 ── */
      .backgroundColor('#040d21')
      .showAtmosphere(true)
      .atmosphereColor('#1e5a9e')
      .atmosphereAltitude(0.13)
      /* 다크 지구 텍스처: 위성이 아닌 어두운 단색 → 폴리곤과 함께 지도 느낌 */
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')

      /* ── 격자선 (경위도 선) ── */
      .showGraticules(true)

      /* ── 국가 폴리곤 (비동기 로드 후 채워짐) ── */
      .polygonsData([])
      .polygonCapColor(() => '#1a3560')
      .polygonSideColor(() => '#0f2040')
      .polygonStrokeColor(() => '#3a70b0')
      .polygonAltitude(0.003)
      .polygonLabel(({ properties: d }) =>
        `<div class="globe-tooltip"><strong>${d.name || ''}</strong></div>`
      )

      /* ── 장소 마커 ── */
      .pointsData([])
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointColor(() => '#f59e0b')
      .pointRadius(0.45)
      .pointAltitude(0.014)
      .pointsMerge(false)
      .pointLabel(d => `
        <div class="globe-tooltip">
          <strong>${esc(d.name)}</strong>
          ${d.country ? '<br><span style="color:#8aacce">' + esc(d.country) + '</span>' : ''}
          ${d.visitDate ? '<br><span style="color:#4a6a90">📅 ' + d.visitDate + '</span>' : ''}
        </div>
      `)
      .onPointClick(point => {
        if (onPlaceClickCb) onPlaceClickCb(point);
      })
      .onPointHover(pt => {
        container.style.cursor = pt ? 'pointer' : 'grab';
      })

      /* ── 경로 아크 ── */
      .arcsData([])
      .arcStartLat(d => d.fromLat)
      .arcStartLng(d => d.fromLng)
      .arcEndLat(d => d.toLat)
      .arcEndLng(d => d.toLng)
      .arcColor(d => {
        const c = (TRANSPORT[d.transport] || TRANSPORT.plane).color;
        return [`${c}aa`, c];   // 출발→도착 방향으로 페이드
      })
      .arcDashLength(d => (TRANSPORT[d.transport] || TRANSPORT.plane).dashLen)
      .arcDashGap(d => (TRANSPORT[d.transport] || TRANSPORT.plane).dashGap)
      .arcDashAnimateTime(d => (TRANSPORT[d.transport] || TRANSPORT.plane).animTime)
      .arcAltitudeAutoScale(d => (TRANSPORT[d.transport] || TRANSPORT.plane).altScale)
      .arcStroke(0.45)
      .arcLabel(d => {
        const icons = {
          plane:'✈', car:'🚗', train:'🚂', bus:'🚌',
          ship:'🚢', bicycle:'🚲', walk:'🚶',
        };
        return `
          <div class="globe-tooltip">
            <strong>${icons[d.transport] || '🚀'} ${esc(d.fromName)} → ${esc(d.toName)}</strong>
            ${d.memo ? '<br><span style="color:#8aacce">' + esc(d.memo) + '</span>' : ''}
            ${d.date ? '<br><span style="color:#4a6a90">📅 ' + d.date + '</span>' : ''}
          </div>
        `;
      })

      (container);

    // 국가 GeoJSON 비동기 로드 (지구본 표시 후 배경에서 처리)
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) globe.polygonsData(data.features); })
      .catch(() => {}); // 실패해도 지구본은 정상 동작

    // 초기 시점 (동아시아 중심)
    globe.pointOfView({ lat: 25, lng: 115, altitude: 2.4 });

    // 자동 회전 (느리게)
    const ctrl = globe.controls();
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.25;
    ctrl.enableDamping = true;
    ctrl.dampingFactor = 0.1;

    // 마커 클릭 시 회전 정지
    globe.onPointClick(() => { ctrl.autoRotate = false; });

    // 창 크기 변경 대응
    window.addEventListener('resize', () => {
      globe.width(container.clientWidth);
      globe.height(container.clientHeight);
    });
  }

  function setPlaces(places) {
    if (!globe) return;
    globe.pointsData(places.filter(p => p.lat != null && p.lng != null));
  }

  function setRoutes(routes, places) {
    if (!globe) return;
    const map = {};
    places.forEach(p => { map[p.id] = p; });

    const arcs = routes
      .map(r => {
        const from = map[r.fromPlaceId];
        const to   = map[r.toPlaceId];
        if (!from || !to || from.lat == null || to.lat == null) return null;
        return {
          ...r,
          fromLat: from.lat, fromLng: from.lng, fromName: from.name,
          toLat:   to.lat,   toLng:   to.lng,   toName:   to.name,
        };
      })
      .filter(Boolean);

    globe.arcsData(arcs);
  }

  function focusPlace(place, altitude = 1.8) {
    if (!globe || place.lat == null) return;
    globe.controls().autoRotate = false;
    globe.pointOfView({ lat: place.lat, lng: place.lng, altitude }, 1000);
  }

  function onPlaceClick(cb) { onPlaceClickCb = cb; }

  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  window.GlobeManager = { init, setPlaces, setRoutes, focusPlace, onPlaceClick, TRANSPORT };
})();
