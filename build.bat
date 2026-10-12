@echo off
setlocal
cd /d "%~dp0"

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 goto :fail
)

echo Building site...
call npm run build
if errorlevel 1 goto :fail

echo.
echo Starting preview server (Ctrl+C to stop)...
call npm run preview -- --open
goto :eof

:fail
echo.
echo Build failed.
pause
exit /b 1
