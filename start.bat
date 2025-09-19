@echo off
echo Starting Synchronization Tasks Manager...
echo.
cd /d "C:\Users\moham\source\repos\ServiceSynchronizerUI"
echo Current directory: %CD%
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Building frontend...
call npm run build
echo.
echo Starting application...
echo The app will be available at: http://localhost:3001
echo Press Ctrl+C to stop the application
echo.
call npm start
pause
