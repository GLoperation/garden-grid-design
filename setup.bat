@echo off
REM ╔═══════════════════════════════════════════════════╗
REM ║         GardenGridDesign - Setup Script           ║
REM ║                  Windows                          ║
REM ╚═══════════════════════════════════════════════════╝

echo.
echo 🌱 GardenGridDesign — Setup
echo ─────────────────────────────

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js not found.
    echo    Install it from: https://nodejs.org  (v18+ recommended^)
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo ✅ Node.js %NODE_VER% found

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ npm not found. It usually comes with Node.js.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo ✅ npm %NPM_VER% found

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo ❌ npm install failed. Check errors above.
    pause
    exit /b 1
)

echo ✅ Dependencies installed

REM Setup .env if not exists
if not exist .env (
    copy .env.example .env >nul
    echo.
    echo 📄 Created .env file from .env.example
    echo    ⚠️  To enable the chat assistant, edit .env and add your Anthropic API key.
    echo    Get one at: https://console.anthropic.com/
    echo    (The garden planner works fully without it — chat is optional.^)
) else (
    echo ✅ .env file already exists
)

echo.
echo ─────────────────────────────
echo 🎉 Setup complete!
echo.
echo    Start the app:  npm run dev
echo    Then open:       http://localhost:3000
echo.
echo    Build for production:  npm run build
echo    Preview build:         npm run preview
echo.
pause
