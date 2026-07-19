@echo off
chcp 65001 > nul
echo.
echo  ========================================
echo   여행 지구본 - 로컬 서버 시작
echo  ========================================
echo.

set PORT=8080
set URL=http://localhost:%PORT%

:: Python 3 확인
python --version > nul 2>&1
if %errorlevel% == 0 (
  echo  [Python] http.server 시작 중 (포트 %PORT%)...
  echo  브라우저에서 %URL% 을 열어주세요.
  echo  종료하려면 Ctrl+C 를 누르세요.
  echo.
  start "" "%URL%"
  python -m http.server %PORT%
  goto :end
)

:: Python 확인 (py 명령)
py --version > nul 2>&1
if %errorlevel% == 0 (
  echo  [Python] http.server 시작 중 (포트 %PORT%)...
  start "" "%URL%"
  py -m http.server %PORT%
  goto :end
)

:: Node.js / npx 확인
npx --version > nul 2>&1
if %errorlevel% == 0 (
  echo  [Node.js] serve 시작 중 (포트 %PORT%)...
  start "" "%URL%"
  npx serve -p %PORT% .
  goto :end
)

echo  [오류] Python 또는 Node.js 가 설치되어 있지 않습니다.
echo.
echo  해결 방법 중 하나를 선택하세요:
echo  1. Python 설치: https://www.python.org/downloads/
echo  2. Node.js 설치: https://nodejs.org/
echo  3. VS Code "Live Server" 확장으로 index.html 열기
echo  4. Chrome 에서 직접 열기 (일부 기능 제한될 수 있음)
echo.
pause

:end
