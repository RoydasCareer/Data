/* =====================================================
   data.js — 데이터 레이어 (localforage / IndexedDB)
   ===================================================== */
(function () {
  'use strict';

  const KEY_PLACES = 'tg_places';
  const KEY_PHOTOS  = 'tg_photos';
  const KEY_ROUTES  = 'tg_routes';

  function uuid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  async function loadAll(key) {
    return (await localforage.getItem(key)) || [];
  }

  async function saveAll(key, arr) {
    await localforage.setItem(key, arr);
  }

  /* ---------- PLACES ---------- */
  async function getPlaces() {
    return loadAll(KEY_PLACES);
  }

  async function savePlace(place) {
    const list = await getPlaces();
    if (!place.id) {
      place.id = uuid();
      place.createdAt = Date.now();
      list.push(place);
    } else {
      const idx = list.findIndex(p => p.id === place.id);
      if (idx >= 0) list[idx] = place; else list.push(place);
    }
    await saveAll(KEY_PLACES, list);
    return place;
  }

  async function deletePlace(id) {
    const places = (await getPlaces()).filter(p => p.id !== id);
    await saveAll(KEY_PLACES, places);

    // 해당 장소에 연결된 사진은 미지정으로 전환
    const photos = await loadAll(KEY_PHOTOS);
    await saveAll(KEY_PHOTOS, photos.map(ph =>
      ph.placeId === id ? { ...ph, placeId: null } : ph
    ));

    // 해당 장소가 포함된 경로 삭제
    const routes = (await loadAll(KEY_ROUTES)).filter(
      r => r.fromPlaceId !== id && r.toPlaceId !== id
    );
    await saveAll(KEY_ROUTES, routes);
  }

  /* ---------- PHOTOS ---------- */
  async function getPhotos(placeId) {
    const all = await loadAll(KEY_PHOTOS);
    return placeId !== undefined ? all.filter(ph => ph.placeId === placeId) : all;
  }

  async function savePhoto(photo) {
    const list = await loadAll(KEY_PHOTOS);
    if (!photo.id) {
      photo.id = uuid();
      photo.createdAt = Date.now();
      list.push(photo);
    } else {
      const idx = list.findIndex(p => p.id === photo.id);
      if (idx >= 0) list[idx] = photo; else list.push(photo);
    }
    await saveAll(KEY_PHOTOS, list);
    return photo;
  }

  async function deletePhoto(id) {
    await saveAll(KEY_PHOTOS, (await loadAll(KEY_PHOTOS)).filter(p => p.id !== id));
  }

  /* ---------- ROUTES ---------- */
  async function getRoutes() {
    return loadAll(KEY_ROUTES);
  }

  async function saveRoute(route) {
    const list = await getRoutes();
    if (!route.id) {
      route.id = uuid();
      route.createdAt = Date.now();
      list.push(route);
    } else {
      const idx = list.findIndex(r => r.id === route.id);
      if (idx >= 0) list[idx] = route; else list.push(route);
    }
    await saveAll(KEY_ROUTES, list);
    return route;
  }

  async function deleteRoute(id) {
    await saveAll(KEY_ROUTES, (await getRoutes()).filter(r => r.id !== id));
  }

  async function hasData() {
    return (await getPlaces()).length > 0;
  }

  window.AppData = {
    uuid,
    getPlaces, savePlace, deletePlace,
    getPhotos,  savePhoto,  deletePhoto,
    getRoutes,  saveRoute,  deleteRoute,
    hasData,
  };
})();
