/* =====================================================
   photos.js — 사진 라이브러리 모듈
   EXIF GPS 파싱 + 지역 자동 연결 + 뷰어
   ===================================================== */
(function () {
  'use strict';

  let currentPlaceId   = null;  // null이면 전체 사진
  let viewerPhotos     = [];
  let viewerIdx        = 0;
  let reassignPhotoId  = null;

  /* ── 초기화 ── */
  function init() {
    // 업로드
    const zone  = document.getElementById('upload-zone');
    const input = document.getElementById('photo-input');
    zone.addEventListener('click', () => input.click());
    document.getElementById('btn-select-photos')
      .addEventListener('click', e => { e.stopPropagation(); input.click(); });
    input.addEventListener('change', handleFileSelect);

    // 드래그 앤 드롭
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      processFiles(Array.from(e.dataTransfer.files));
    });

    // 모달 닫기
    document.querySelectorAll('[data-modal="photos"]').forEach(el =>
      el.addEventListener('click', closeModal)
    );

    // 뷰어 컨트롤
    document.getElementById('viewer-prev').addEventListener('click', () => showViewer(viewerIdx - 1));
    document.getElementById('viewer-next').addEventListener('click', () => showViewer(viewerIdx + 1));
    document.querySelector('.viewer-close').addEventListener('click', closeViewer);
    document.querySelector('.viewer-bg').addEventListener('click', closeViewer);
    document.getElementById('btn-delete-photo').addEventListener('click', deleteCurrentPhoto);
    document.getElementById('btn-reassign-photo').addEventListener('click', openReassign);

    // 지역 재지정 모달
    document.querySelectorAll('[data-modal="reassign"]').forEach(el =>
      el.addEventListener('click', () => document.getElementById('modal-reassign').classList.add('hidden'))
    );
    document.getElementById('btn-confirm-reassign').addEventListener('click', confirmReassign);

    // 키보드 단축키
    document.addEventListener('keydown', e => {
      if (document.getElementById('photo-viewer').classList.contains('hidden')) return;
      if (e.key === 'ArrowLeft')  showViewer(viewerIdx - 1);
      if (e.key === 'ArrowRight') showViewer(viewerIdx + 1);
      if (e.key === 'Escape')     closeViewer();
    });
  }

  /* ── 모달 열기/닫기 ── */
  function openForPlace(place) {
    currentPlaceId = place ? place.id : null;
    document.getElementById('modal-photos-title').textContent =
      `📷 ${place ? place.name : '전체 사진'}`;
    document.getElementById('modal-photos').classList.remove('hidden');
    renderGrid();
  }

  function closeModal() {
    document.getElementById('modal-photos').classList.add('hidden');
  }

  /* ── 파일 처리 ── */
  function handleFileSelect(e) {
    processFiles(Array.from(e.target.files));
    e.target.value = '';
  }

  async function processFiles(files) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;

    for (const file of imageFiles) {
      try {
        const dataUrl = await readAsDataUrl(file);
        let lat = null, lng = null, takenAt = null;

        // EXIF GPS 파싱
        if (window.exifr) {
          try {
            const exif = await exifr.parse(file, { gps: true, exif: true });
            if (exif) {
              lat     = exif.latitude  ?? null;
              lng     = exif.longitude ?? null;
              takenAt = exif.DateTimeOriginal
                ? new Date(exif.DateTimeOriginal).toISOString().slice(0, 10)
                : null;
            }
          } catch (_) { /* EXIF 없는 사진은 그냥 진행 */ }
        }

        // GPS 있으면 가장 가까운 장소 자동 연결 (50km 이내)
        let placeId = currentPlaceId;
        if (lat != null && !currentPlaceId) {
          placeId = await findNearestPlace(lat, lng, 50);
        }

        await AppData.savePhoto({ placeId, filename: file.name, dataUrl, lat, lng, takenAt, note: '' });
      } catch (err) {
        console.error('사진 저장 실패:', file.name, err);
      }
    }

    await renderGrid();
    if (window.PlacesUI) PlacesUI.updateStats();
  }

  /* ── 가장 가까운 장소 탐색 ── */
  async function findNearestPlace(lat, lng, maxKm) {
    const places = await AppData.getPlaces();
    let best = null, bestDist = Infinity;
    for (const p of places) {
      if (p.lat == null) continue;
      const d = haversine(lat, lng, p.lat, p.lng);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    return best && bestDist <= maxKm ? best.id : null;
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
      * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  /* ── 사진 그리드 렌더링 ── */
  async function renderGrid() {
    const photos = await AppData.getPhotos(currentPlaceId);
    const grid   = document.getElementById('photo-grid');
    viewerPhotos = photos;

    if (!photos.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">📷 아직 사진이 없습니다.<br>위 영역에 사진을 드래그하거나 선택하세요.</div>';
      return;
    }

    // innerHTML 사용 시 esc()로 XSS 방지 (dataUrl은 신뢰 데이터)
    grid.innerHTML = photos.map((ph, i) => `
      <div class="photo-thumb" data-idx="${i}">
        <img src="${ph.dataUrl}" alt="${esc(ph.filename || '사진')}">
        <div class="photo-thumb-badge">${esc(ph.filename || '사진')}</div>
        <button class="photo-thumb-del" data-id="${ph.id}" title="삭제">✕</button>
      </div>
    `).join('');

    grid.querySelectorAll('.photo-thumb').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('.photo-thumb-del')) return;
        showViewer(parseInt(el.dataset.idx, 10));
      });
    });

    grid.querySelectorAll('.photo-thumb-del').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        if (!confirm('이 사진을 삭제하시겠습니까?')) return;
        await AppData.deletePhoto(btn.dataset.id);
        await renderGrid();
        if (window.PlacesUI) PlacesUI.updateStats();
      });
    });
  }

  /* ── 뷰어 ── */
  function showViewer(idx) {
    if (!viewerPhotos.length) return;
    viewerIdx = ((idx % viewerPhotos.length) + viewerPhotos.length) % viewerPhotos.length;
    const ph  = viewerPhotos[viewerIdx];
    document.getElementById('viewer-img').src        = ph.dataUrl;
    document.getElementById('viewer-counter').textContent = `${viewerIdx + 1} / ${viewerPhotos.length}`;
    document.getElementById('viewer-info').textContent    =
      [ph.takenAt ? '📅 ' + ph.takenAt : '', ph.filename || ''].filter(Boolean).join('  ');
    document.getElementById('photo-viewer').classList.remove('hidden');
  }

  function closeViewer() {
    document.getElementById('photo-viewer').classList.add('hidden');
    document.getElementById('viewer-img').src = '';
  }

  async function deleteCurrentPhoto() {
    const ph = viewerPhotos[viewerIdx];
    if (!ph || !confirm('이 사진을 삭제하시겠습니까?')) return;
    await AppData.deletePhoto(ph.id);
    await renderGrid();
    if (window.PlacesUI) PlacesUI.updateStats();
    if (!viewerPhotos.length) closeViewer();
    else showViewer(viewerIdx);
  }

  /* ── 지역 재지정 ── */
  async function openReassign() {
    const ph = viewerPhotos[viewerIdx];
    if (!ph) return;
    reassignPhotoId = ph.id;

    const places = await AppData.getPlaces();
    const sel    = document.getElementById('reassign-place-select');
    sel.innerHTML = '<option value="">-- 미지정 --</option>'
      + places.map(p =>
        `<option value="${p.id}"${p.id === ph.placeId ? ' selected' : ''}>${esc(p.name)}</option>`
      ).join('');
    document.getElementById('modal-reassign').classList.remove('hidden');
  }

  async function confirmReassign() {
    const newPlaceId = document.getElementById('reassign-place-select').value || null;
    const all  = await AppData.getPhotos();
    const ph   = all.find(p => p.id === reassignPhotoId);
    if (ph) { ph.placeId = newPlaceId; await AppData.savePhoto(ph); }
    document.getElementById('modal-reassign').classList.add('hidden');
    await renderGrid();
  }

  /* ── 유틸 ── */
  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload  = e => resolve(e.target.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.PhotosUI = { init, openForPlace };
})();
