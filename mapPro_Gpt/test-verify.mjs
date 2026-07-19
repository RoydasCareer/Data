import { chromium } from 'playwright';
import { writeFileSync, existsSync } from 'fs';

const BASE   = 'http://localhost:8282';
const OUTDIR = '/tmp/pw-test';
const errors = [];

const browser = await chromium.launch({
  headless: true,
  args: [
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
  ]
});
const page    = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();

page.on('pageerror', e  => errors.push('[pageerror] ' + e.message));
page.on('console',  msg => { if (msg.type() === 'error') errors.push('[console] ' + msg.text()); });

// 1. 페이지 열기
const res = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
console.log('HTTP status:', res.status());

// 2. MapLibre GL 캔버스 대기
try {
  await page.waitForSelector('.maplibregl-canvas', { timeout: 15000 });
  console.log('MapLibre 지도: OK');
} catch {
  console.log('MapLibre 지도: FAIL (MapLibre CDN 로드 실패)');
}

// 3. 로딩 오버레이 상태 진단 (2초 간격으로 10번 체크)
let overlayHidden = false;
for (let i = 1; i <= 10; i++) {
  await page.waitForTimeout(2000);
  const state = await page.evaluate(() => {
    const el = document.getElementById('loading-overlay');
    if (!el) return { exists: false };
    return {
      exists: true,
      hasHidden: el.classList.contains('hidden'),
      display: window.getComputedStyle(el).display,
    };
  });
  console.log(`t=${i*2}s: exists=${state.exists}, hasHidden=${state.hasHidden}, display=${state.display}`);
  if (state.hasHidden || state.display === 'none') { overlayHidden = true; break; }
}
if (!overlayHidden) {
  await page.evaluate(() => document.getElementById('loading-overlay').classList.add('hidden'));
  console.log('로딩 오버레이 제거: TIMEOUT → 강제 제거');
} else {
  console.log('로딩 오버레이 제거: OK');
}

// 4. 초기 화면 스크린샷
await page.screenshot({ path: `${OUTDIR}/ss-01-initial.png` });
console.log('스크린샷 저장: ss-01-initial.png');

// 5. DOM 요소 확인
const checks = [
  ['#navbar',              '네비게이션 바'],
  ['#btn-add-place',       '장소 추가 버튼'],
  ['#btn-add-route',       '경로 추가 버튼'],
  ['#btn-toggle-sidebar',  '사이드바 토글 버튼'],
];
for (const [sel, label] of checks) {
  const el = await page.$(sel);
  console.log(`${label}: ${el ? 'OK' : 'MISSING'}`);
}

// 6. 사이드바 열기 + 샘플 데이터 확인
await page.click('#btn-toggle-sidebar');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUTDIR}/ss-02-sidebar.png` });
console.log('스크린샷 저장: ss-02-sidebar.png');

const placeCount = (await page.$$('.place-item')).length;
const routeCount = await page.evaluate(() => {
  document.querySelector('.tab-btn[data-tab="routes"]').click();
  return document.querySelectorAll('.route-item').length;
});
await page.waitForTimeout(300);
console.log(`장소 항목: ${placeCount}개 (기대값 6)`);
console.log(`경로 항목: ${routeCount}개 (기대값 6)`);
await page.screenshot({ path: `${OUTDIR}/ss-03-routes.png` });
console.log('스크린샷 저장: ss-03-routes.png');

// 7. 장소 추가 모달 테스트
await page.evaluate(() => document.querySelector('.tab-btn[data-tab="places"]').click());
await page.waitForTimeout(200);
await page.click('#btn-add-place');
await page.waitForTimeout(400);
const modalOk = await page.evaluate(() =>
  !document.getElementById('modal-place').classList.contains('hidden')
);
console.log(`장소 추가 모달: ${modalOk ? 'OK' : 'FAIL'}`);
await page.screenshot({ path: `${OUTDIR}/ss-04-modal.png` });
console.log('스크린샷 저장: ss-04-modal.png');

// 8. 통계 탭
await page.keyboard.press('Escape');
await page.evaluate(() => document.getElementById('modal-place').classList.add('hidden'));
await page.evaluate(() => document.querySelector('.tab-btn[data-tab="stats"]').click());
await page.waitForTimeout(300);
const statPlaces = await page.$eval('#stat-places', el => el.textContent.trim());
const statRoutes = await page.$eval('#stat-routes', el => el.textContent.trim());
console.log(`통계 — 장소: ${statPlaces}, 경로: ${statRoutes}`);
await page.screenshot({ path: `${OUTDIR}/ss-05-stats.png` });
console.log('스크린샷 저장: ss-05-stats.png');

// 결과 요약
console.log('\n=== JS 에러 ===');
errors.length === 0 ? console.log('없음 ✓') : errors.forEach(e => console.log(e));

await browser.close();
console.log('\n모든 검증 완료');
