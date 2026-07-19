/* =====================================================
   places.js — 장소 CRUD UI 모듈
   ===================================================== */
(function () {
  'use strict';

  /* ── 지오코딩 (Nominatim) ── */
  let geocodeTimer = null;

  function initGeocode() {
    const input = document.getElementById('geocode-input');
    const dropdown = document.getElementById('geocode-results');

    input.addEventListener('input', () => {
      clearTimeout(geocodeTimer);
      const q = input.value.trim();
      if (q.length < 2) { dropdown.classList.add('hidden'); return; }
      geocodeTimer = setTimeout(() => runGeocode(q, dropdown), 400);
    });

    // 모달 닫힐 때 드롭다운 닫기
    document.querySelectorAll('[data-modal="place"]').forEach(el =>
      el.addEventListener('click', () => dropdown.classList.add('hidden'))
    );
  }

  async function runGeocode(q, dropdown) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&accept-language=ko,en`;
      const res = await fetch(url, { headers: { 'User-Agent': 'TravelMapApp/1.0' } });
      const results = await res.json();

      if (!results.length) { dropdown.classList.add('hidden'); return; }

      dropdown.innerHTML = results.map((r, i) =>
        `<div class="geocode-item" data-i="${i}">${esc(r.display_name)}</div>`
      ).join('');
      dropdown.classList.remove('hidden');

      dropdown.querySelectorAll('.geocode-item').forEach((item, i) => {
        item.addEventListener('click', () => {
          const r = results[i];
          const parts = r.display_name.split(', ');
          document.getElementById('place-name').value    = parts[0];
          document.getElementById('place-country').value = parts[parts.length - 1];
          document.getElementById('place-lat').value     = parseFloat(r.lat).toFixed(6);
          document.getElementById('place-lng').value     = parseFloat(r.lon).toFixed(6);
          document.getElementById('geocode-input').value = r.display_name;
          dropdown.classList.add('hidden');

          // 지도에서 해당 위치로 이동
          if (window.MapManager) {
            MapManager.focusPlace({ lat: parseFloat(r.lat), lng: parseFloat(r.lon) }, 12);
          }
        });
      });
    } catch (e) {
      dropdown.classList.add('hidden');
    }
  }

  function init() {
    document.getElementById('btn-add-place').addEventListener('click', openAddModal);
    document.getElementById('btn-add-place-2').addEventListener('click', openAddModal);
    document.getElementById('btn-save-place').addEventListener('click', handleSave);
    document.querySelectorAll('[data-modal="place"]').forEach(el =>
      el.addEventListener('click', closeModal)
    );
    document.getElementById('place-search').addEventListener('input', renderList);
    initGeocode();
  }

  /* ── 모달 열기/닫기 ── */
  function openAddModal() {
    document.getElementById('modal-place-title').textContent = '📍 장소 추가';
    document.getElementById('place-edit-id').value = '';
    document.getElementById('form-place').reset();
    document.getElementById('geocode-input').value = '';
    document.getElementById('geocode-results').classList.add('hidden');
    document.getElementById('modal-place').classList.remove('hidden');
  }

  function openEditModal(place) {
    document.getElementById('modal-place-title').textContent = '✏️ 장소 수정';
    document.getElementById('place-edit-id').value    = place.id;
    document.getElementById('place-name').value       = place.name      || '';
    document.getElementById('place-country').value    = place.country   || '';
    document.getElementById('place-lat').value        = place.lat       ?? '';
    document.getElementById('place-lng').value        = place.lng       ?? '';
    document.getElementById('place-date').value       = place.visitDate || '';
    document.getElementById('place-memo').value       = place.memo      || '';
    document.getElementById('modal-place').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('modal-place').classList.add('hidden');
  }

  /* ── 저장 ── */
  async function handleSave() {
    const name = document.getElementById('place-name').value.trim();
    if (!name) { alert('장소명을 입력해 주세요.'); return; }

    const latRaw = document.getElementById('place-lat').value;
    const lngRaw = document.getElementById('place-lng').value;
    const lat = latRaw !== '' ? parseFloat(latRaw) : null;
    const lng = lngRaw !== '' ? parseFloat(lngRaw) : null;

    const editId = document.getElementById('place-edit-id').value || undefined;
    await AppData.savePlace({
      id:        editId,
      name,
      country:   document.getElementById('place-country').value.trim(),
      lat:       lat != null && !isNaN(lat) ? lat : null,
      lng:       lng != null && !isNaN(lng) ? lng : null,
      visitDate: document.getElementById('place-date').value,
      memo:      document.getElementById('place-memo').value.trim(),
    });

    closeModal();
    await refresh();
  }

  /* ── 삭제 ── */
  async function handleDelete(id) {
    if (!confirm('이 장소와 관련 경로를 모두 삭제하시겠습니까?')) return;
    await AppData.deletePlace(id);
    await refresh();
    // 경로 목록도 갱신
    if (window.RoutesUI) await RoutesUI.refresh();
  }

  /* ── 목록 렌더링 ── */
  async function renderList() {
    const query   = document.getElementById('place-search').value.toLowerCase();
    const places  = await AppData.getPlaces();
    const filtered = query
      ? places.filter(p =>
          p.name.toLowerCase().includes(query) ||
          (p.country || '').toLowerCase().includes(query)
        )
      : places;

    const el = document.getElementById('places-list');

    if (!filtered.length) {
      el.innerHTML = '<div class="empty-state">📍 표시할 장소가 없습니다.</div>';
      return;
    }

    el.innerHTML = filtered.map(p => `
      <div class="place-item" data-id="${p.id}">
        <div class="place-icon">📍</div>
        <div class="place-info">
          <div class="place-name">${esc(p.name)}</div>
          <div class="place-sub">
            ${p.country ? esc(p.country) : ''}
            ${p.visitDate ? ' · ' + p.visitDate : ''}
          </div>
        </div>
        <div class="place-actions">
          <button class="btn-icon-sm" data-action="photos" title="사진">📷</button>
          <button class="btn-icon-sm" data-action="edit"   title="수정">✏️</button>
          <button class="btn-icon-sm danger" data-action="delete" title="삭제">🗑️</button>
        </div>
      </div>
    `).join('');

    el.querySelectorAll('.place-item').forEach(item => {
      const id    = item.dataset.id;
      const place = places.find(p => p.id === id);

      // 행 클릭 → 지구본 포커스
      item.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        if (place?.lat != null) MapManager.focusPlace(place);
        el.querySelectorAll('.place-item').forEach(x => x.classList.remove('selected'));
        item.classList.add('selected');
      });

      item.querySelector('[data-action="photos"]')
        ?.addEventListener('click', () => PhotosUI.openForPlace(place));
      item.querySelector('[data-action="edit"]')
        ?.addEventListener('click', () => openEditModal(place));
      item.querySelector('[data-action="delete"]')
        ?.addEventListener('click', () => handleDelete(id));
    });
  }

  /* ── 지구본 + 통계 갱신 ── */
  async function updateGlobe() {
    const places = await AppData.getPlaces();
    const routes = await AppData.getRoutes();
    MapManager.setPlaces(places);
    MapManager.setRoutes(routes, places);
  }

  async function updateStats() {
    const places   = await AppData.getPlaces();
    const photos   = await AppData.getPhotos();
    const routes   = await AppData.getRoutes();
    const countries = new Set(places.map(p => p.country).filter(Boolean));
    document.getElementById('stat-places').textContent    = places.length;
    document.getElementById('stat-countries').textContent = countries.size;
    document.getElementById('stat-photos').textContent    = photos.length;
    document.getElementById('stat-routes').textContent    = routes.length;
  }

  async function refresh() {
    await renderList();
    await updateGlobe();
    await updateStats();
  }

  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  window.PlacesUI = { init, refresh, openAddModal, openEditModal, updateStats };
})();
