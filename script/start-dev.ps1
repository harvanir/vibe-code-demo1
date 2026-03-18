Set-Location -Path "$PSScriptRoot\.."

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting Project - Frontend and Backend" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host "[1/2] Starting Backend (Spring Boot) in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\mvnw.cmd spring-boot:run"

Write-Host "[2/2] Starting Frontend (Next.js) in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "All services are starting up!" -ForegroundColor Green
Write-Host "Ensure that both terminal windows remain open." -ForegroundColor Gray
