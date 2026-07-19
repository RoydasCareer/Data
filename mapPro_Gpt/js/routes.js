/* =====================================================
   routes.js — 이동 경로 CRUD UI 모듈
   ===================================================== */
(function () {
  'use strict';

  const TRANSPORT = {
    plane:   { icon: '✈️', label: '비행기' },
    car:     { icon: '🚗', label: '자동차' },
    train:   { icon: '🚂', label: '기차'   },
    bus:     { icon: '🚌', label: '버스'   },
    ship:    { icon: '🚢', label: '선박'   },
    bicycle: { icon: '🚲', label: '자전거' },
    walk:    { icon: '🚶', label: '도보'   },
  };

  function init() {
    document.getElementById('btn-add-route').addEventListener('click', openAddModal);
    document.getElementById('btn-add-route-2').addEventListener('click', openAddModal);
    document.getElementById('btn-save-route').addEventListener('click', handleSave);
    document.querySelectorAll('[data-modal="route"]').forEach(el =>
      el.addEventListener('click', closeModal)
    );
    _initSearch('route-from-input', 'route-from-results', 'route-from-id');
    _initSearch('route-to-input',   'route-to-results',   'route-to-id');
  }

  /* ── 장소 검색 (저장된 장소 + Nominatim) ── */
  function _initSearch(inputId, resultsId, hiddenId) {
    const input   = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    let timer = null;

    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim();
      document.getElementById(hiddenId).value = '';

      if (q.length < 1) { results.classList.add('hidden'); return; }

      timer = setTimeout(() => _search(q, input, results, hiddenId), 400);
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !results.contains(e.target))
        results.classList.add('hidden');
    });
  }

  async function _search(q, input, results, hiddenId) {
    const places = await AppData.getPlaces();
    const saved  = places.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.country || '').toLowerCase().includes(q.toLowerCase())
    );

    let nom = [];
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=ko,en`;
      const res = await fetch(url, { headers: { 'User-Agent': 'TravelMapApp/1.0' } });
      nom = await res.json();
    } catch (_) {}

    _renderResults(input, results, hiddenId, saved, nom);
  }

  function _renderResults(input, results, hiddenId, saved, nom) {
    results.innerHTML = '';

    // 저장된 장소 (즉시 선택 가능)
    saved.forEach(p => {
      const div = document.createElement('div');
      div.className = 'geocode-item saved-place';
      div.innerHTML = `📍 <strong>${esc(p.name)}</strong>${p.country ? ` <span class="geocode-country">(${esc(p.country)})</span>` : ''}`;
      div.addEventListener('click', () => {
        input.value = p.name;
        document.getElementById(hiddenId).value = p.id;
        results.classList.add('hidden');
      });
      results.appendChild(div);
    });

    // Nominatim 검색 결과 (선택 시 자동 저장)
    nom.forEach(r => {
      const parts   = r.display_name.split(', ');
      const name    = parts[0];
      const country = parts[parts.length - 1];
      const summary = r.display_name.length > 55
        ? r.display_name.slice(0, 55) + '…'
        : r.display_name;

      const div = document.createElement('div');
      div.className = 'geocode-item';
      div.innerHTML = `🔍 <strong>${esc(name)}</strong> <span class="geocode-country">${esc(summary)}</span>`;
      div.addEventListener('click', async () => {
        const lat = parseFloat(r.lat);
        const lng = parseFloat(r.lon);

        const places = await AppData.getPlaces();
        let place = places.find(p =>
          p.lat != null && Math.abs(p.lat - lat) < 0.05 && Math.abs(p.lng - lng) < 0.05
        );

        if (!place) {
          place = await AppData.savePlace({ name, country, lat, lng });
          if (window.PlacesUI) await PlacesUI.refresh();
        }

        input.value = place.name;
        document.getElementById(hiddenId).value = place.id;
        results.classList.add('hidden');
      });
      results.appendChild(div);
    });

    results.classList.toggle('hidden', results.children.length === 0);
  }

  /* ── 모달 ── */
  async function openAddModal() {
    document.getElementById('modal-route-title').textContent = '✈️ 경로 추가';
    document.getElementById('route-edit-id').value = '';
    document.getElementById('form-route').reset();
    _clearSearch();
    document.getElementById('modal-route').classList.remove('hidden');
  }

  async function openEditModal(route) {
    document.getElementById('modal-route-title').textContent = '✏️ 경로 수정';
    document.getElementById('route-edit-id').value = route.id;
    _clearSearch();

    const places = await AppData.getPlaces();
    const pm = {};
    places.forEach(p => { pm[p.id] = p; });

    const from = pm[route.fromPlaceId];
    const to   = pm[route.toPlaceId];
    if (from) {
      document.getElementById('route-from-input').value = from.name;
      document.getElementById('route-from-id').value    = from.id;
    }
    if (to) {
      document.getElementById('route-to-input').value = to.name;
      document.getElementById('route-to-id').value    = to.id;
    }

    document.getElementById('route-transport').value = route.transport || 'plane';
    document.getElementById('route-date').value       = route.date     || '';
    document.getElementById('route-memo').value       = route.memo     || '';
    document.getElementById('modal-route').classList.remove('hidden');
  }

  function _clearSearch() {
    ['route-from-input', 'route-to-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['route-from-id', 'route-to-id'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['route-from-results', 'route-to-results'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }

  function closeModal() {
    document.getElementById('modal-route').classList.add('hidden');
  }

  /* ── 저장 ── */
  async function handleSave() {
    const fromId = document.getElementById('route-from-id').value;
    const toId   = document.getElementById('route-to-id').value;

    if (!fromId || !toId) {
      alert('출발지와 도착지를 선택해 주세요.\n검색 후 목록에서 클릭하여 선택하세요.');
      return;
    }
    if (fromId === toId) { alert('출발지와 도착지가 같습니다.'); return; }

    const editId = document.getElementById('route-edit-id').value || undefined;
    await AppData.saveRoute({
      id:          editId,
      fromPlaceId: fromId,
      toPlaceId:   toId,
      transport:   document.getElementById('route-transport').value || 'plane',
      date:        document.getElementById('route-date').value,
      memo:        document.getElementById('route-memo').value.trim(),
    });

    closeModal();
    await refresh();
  }

  /* ── 삭제 ── */
  async function handleDelete(id) {
    if (!confirm('이 경로를 삭제하시겠습니까?')) return;
    await AppData.deleteRoute(id);
    await refresh();
  }

  /* ── 목록 렌더링 ── */
  async function renderList() {
    const routes = await AppData.getRoutes();
    const places = await AppData.getPlaces();
    const pm     = {};
    places.forEach(p => { pm[p.id] = p; });

    const el = document.getElementById('routes-list');

    if (!routes.length) {
      el.innerHTML = '<div class="empty-state">✈️ 아직 등록된 경로가 없습니다.</div>';
      return;
    }

    el.innerHTML = routes.map(r => {
      const from = pm[r.fromPlaceId];
      const to   = pm[r.toPlaceId];
      const t    = TRANSPORT[r.transport] || { icon: '🚀', label: r.transport };
      return `
        <div class="route-item" data-id="${r.id}">
          <div class="route-icon">${t.icon}</div>
          <div class="route-info">
            <div class="route-name">
              ${from ? esc(from.name) : '(삭제됨)'} → ${to ? esc(to.name) : '(삭제됨)'}
            </div>
            <div class="route-sub">
              ${t.label}${r.date ? ' · ' + r.date : ''}${r.memo ? ' · ' + esc(r.memo) : ''}
            </div>
          </div>
          <div class="place-actions">
            <button class="btn-icon-sm" data-action="edit"   data-id="${r.id}" title="수정">✏️</button>
            <button class="btn-icon-sm danger" data-action="delete" data-id="${r.id}" title="삭제">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    el.querySelectorAll('[data-action="edit"]').forEach(btn => {
      const r = routes.find(x => x.id === btn.dataset.id);
      if (r) btn.addEventListener('click', () => openEditModal(r));
    });
    el.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => handleDelete(btn.dataset.id));
    });
  }

  /* ── 지도 갱신 ── */
  async function updateGlobe() {
    const places = await AppData.getPlaces();
    const routes = await AppData.getRoutes();
    MapManager.setRoutes(routes, places);
  }

  async function refresh() {
    await renderList();
    await updateGlobe();
    if (window.PlacesUI) PlacesUI.updateStats();
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.RoutesUI = { init, refresh, openAddModal };
})();
