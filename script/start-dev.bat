@echo off
cd /d "%~dp0.."
echo ===================================================
echo Starting Project - Frontend and Backend
echo ===================================================

echo [1/2] Starting Backend (Spring Boot) in new window...
start "Backend (Spring Boot)" cmd /k "mvnw.cmd spring-boot:run"

echo [2/2] Starting Frontend (Next.js) in new window...
start "Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo All services are starting up!
echo Ensure that both terminal windows remain open.
