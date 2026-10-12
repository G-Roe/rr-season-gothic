@echo off
setlocal
cd /d "%~dp0"

echo Checking the site builds before deploying...
call npm run build
if errorlevel 1 (
    echo.
    echo Build failed - nothing was pushed.
    pause
    exit /b 1
)

echo.
git status --short
echo.

set "MSG="
set /p "MSG=Commit message (blank for default): "
if "%MSG%"=="" set "MSG=Site update %DATE% %TIME:~0,5%"

git add -A
git commit -m "%MSG%"
if errorlevel 1 (
    echo.
    echo Nothing new to commit - pushing any existing commits.
)

git push origin main
if errorlevel 1 (
    echo.
    echo Push failed.
    pause
    exit /b 1
)

echo.
echo Deployed. Cloudflare will rebuild the site from GitHub.
pause
