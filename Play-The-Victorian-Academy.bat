@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "The Victorian Academy server" cmd /c "cd /d "%~dp0" && py -m http.server 8765"
  timeout /t 2 /nobreak >nul
  start "" "http://127.0.0.1:8765/"
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "The Victorian Academy server" cmd /c "cd /d "%~dp0" && python -m http.server 8765"
  timeout /t 2 /nobreak >nul
  start "" "http://127.0.0.1:8765/"
  exit /b
)
start "" "%~dp0index.html"
endlocal