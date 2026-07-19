const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('C:/PP/mapPro_Claude/index.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>\s*\n*<!--/);
if (!m) { console.error('script block not found'); process.exit(1); }

const js = m[1];
try {
  new vm.Script(js);
  console.log('PASS: JS 문법 오류 없음 (' + js.length + ' chars)');
} catch(e) {
  console.error('SYNTAX ERROR: ' + e.message);
  // 오류 위치 주변 코드 출력
  const lines = js.split('\n');
  const match = e.message.match(/:(\d+)/);
  if (match) {
    const errLine = parseInt(match[1]);
    console.error('\n--- 오류 근처 코드 (HTML line ~' + (errLine + 614) + ') ---');
    for (let i = Math.max(0, errLine-3); i < Math.min(lines.length, errLine+2); i++) {
      console.error((i+1 === errLine ? '>>>' : '   ') + ' ' + (i+1) + ': ' + lines[i]);
    }
  }
  process.exit(1);
}
