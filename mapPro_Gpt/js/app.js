/* =====================================================
   app.js — 앱 초기화 및 모듈 연결
   ===================================================== */
(function () {
  'use strict';

  function hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.add('hidden');
  }

  async function init() {
    // ── 탭 전환 ──
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${tab}`).classList.add('active');
      });
    });

    // ── 사이드바 토글 ──
    document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('hidden');
    });
    document.getElementById('btn-close-sidebar').addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('hidden');
    });

    // ── 모달 백드롭 클릭으로 닫기 ──
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => {
        backdrop.closest('.modal').classList.add('hidden');
      });
    });

    // ── 모듈 초기화 ──
    PlacesUI.init();
    PhotosUI.init();
    RoutesUI.init();

    // ── 지구본 클릭 → 사이드바 장소 탭 포커스 ──
    MapManager.onPlaceClick(place => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.remove('hidden');

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.querySelector('.tab-btn[data-tab="places"]').classList.add('active');
      document.getElementById('tab-places').classList.add('active');

      setTimeout(() => {
        const item = document.querySelector(`.place-item[data-id="${place.id}"]`);
        if (item) {
          document.querySelectorAll('.place-item').forEach(x => x.classList.remove('selected'));
          item.classList.add('selected');
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    });

    // ── 첫 실행 시 샘플 데이터 로드 ──
    const hasData = await AppData.hasData();
    if (!hasData) {
      await loadSampleData();
    }

    // ── 초기 데이터 렌더링 ──
    try {
      await PlacesUI.refresh();
      await RoutesUI.refresh();
    } catch (err) {
      console.error('데이터 렌더링 오류:', err);
    }

    // ── 지도 초기화 (스타일 로드 완료까지 대기) ──
    try {
      await MapManager.init(document.getElementById('map-container'));
    } catch (err) {
      console.error('지도 초기화 실패:', err);
    }
    hideLoading();
  }

  const SAMPLE_DATA = {
    places: [
      { id: 'place-icn', name: '인천국제공항',       country: '대한민국', lat: 37.4602,  lng: 126.4407,  visitDate: '2024-01-15', memo: '여행의 시작점' },
      { id: 'place-bkk', name: '방콕 수완나품 공항', country: '태국',     lat: 13.6811,  lng: 100.7472,  visitDate: '2024-01-15', memo: '비엣젯 타고 도착. 톡톡 타고 시내로' },
      { id: 'place-nrt', name: '도쿄 나리타 공항',   country: '일본',     lat: 35.7720,  lng: 140.3929,  visitDate: '2024-03-10', memo: '벚꽃 시즌 방문' },
      { id: 'place-cdg', name: '파리 샤를드골 공항', country: '프랑스',   lat: 49.0097,  lng: 2.5479,    visitDate: '2024-06-05', memo: '에어프랑스 AF267' },
      { id: 'place-lhr', name: '런던 히드로 공항',   country: '영국',     lat: 51.4700,  lng: -0.4543,   visitDate: '2024-06-08', memo: '유로스타로 파리에서 이동' },
      { id: 'place-jfk', name: '뉴욕 JFK 공항',      country: '미국',     lat: 40.6413,  lng: -73.7781,  visitDate: '2024-08-20', memo: '브리티시 에어웨이즈 BA175' },
    ],
    routes: [
      { id: 'route-1', fromPlaceId: 'place-icn', toPlaceId: 'place-bkk', transport: 'plane', date: '2024-01-15', memo: '비엣젯 VZ869 (약 6시간)' },
      { id: 'route-2', fromPlaceId: 'place-bkk', toPlaceId: 'place-nrt', transport: 'plane', date: '2024-03-10', memo: '타이항공 TG682' },
      { id: 'route-3', fromPlaceId: 'place-nrt', toPlaceId: 'place-cdg', transport: 'plane', date: '2024-06-05', memo: '에어프랑스 AF267 (12시간)' },
      { id: 'route-4', fromPlaceId: 'place-cdg', toPlaceId: 'place-lhr', transport: 'train', date: '2024-06-08', memo: '유로스타 (2시간 15분)' },
      { id: 'route-5', fromPlaceId: 'place-lhr', toPlaceId: 'place-jfk', transport: 'plane', date: '2024-08-20', memo: 'British Airways BA175 (7시간)' },
      { id: 'route-6', fromPlaceId: 'place-jfk', toPlaceId: 'place-icn', transport: 'plane', date: '2024-08-28', memo: '대한항공 KE082 (14시간)' },
    ],
  };

  async function loadSampleData() {
    for (const p of SAMPLE_DATA.places) await AppData.savePlace(p);
    for (const r of SAMPLE_DATA.routes) await AppData.saveRoute(r);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
