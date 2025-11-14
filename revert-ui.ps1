# PowerShell Script to Revert UI Changes
# Run this script from the GhostMetrics directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GhostMetrics UI Revert Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = "dashboard/frontend/src"

# Check if backup files exist
$loginBackup = Join-Path $frontendPath "pages/Login.backup.jsx"
$buttonBackup = Join-Path $frontendPath "components/Auth/GoogleLoginButton.backup.jsx"

if (-not (Test-Path $loginBackup)) {
    Write-Host "❌ Error: Login backup file not found!" -ForegroundColor Red
    Write-Host "   Expected: $loginBackup" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $buttonBackup)) {
    Write-Host "❌ Error: GoogleLoginButton backup file not found!" -ForegroundColor Red
    Write-Host "   Expected: $buttonBackup" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Backup files found!" -ForegroundColor Green
Write-Host ""
Write-Host "This will revert the following files:" -ForegroundColor Yellow
Write-Host "  1. Login.jsx" -ForegroundColor White
Write-Host "  2. GoogleLoginButton.jsx" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "Do you want to continue? (Y/N)"

if ($confirmation -ne 'Y' -and $confirmation -ne 'y') {
    Write-Host "❌ Revert cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Reverting files..." -ForegroundColor Cyan

# Revert Login.jsx
try {
    $loginSource = Join-Path $frontendPath "pages/Login.backup.jsx"
    $loginDest = Join-Path $frontendPath "pages/Login.jsx"
    Copy-Item -Path $loginSource -Destination $loginDest -Force
    Write-Host "✅ Reverted Login.jsx" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to revert Login.jsx: $_" -ForegroundColor Red
}

# Revert GoogleLoginButton.jsx
try {
    $buttonSource = Join-Path $frontendPath "components/Auth/GoogleLoginButton.backup.jsx"
    $buttonDest = Join-Path $frontendPath "components/Auth/GoogleLoginButton.jsx"
    Copy-Item -Path $buttonSource -Destination $buttonDest -Force
    Write-Host "✅ Reverted GoogleLoginButton.jsx" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to revert GoogleLoginButton.jsx: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Revert completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your frontend dev server" -ForegroundColor White
Write-Host "  2. Visit http://localhost:5173/login" -ForegroundColor White
Write-Host "  3. Verify the original design is restored" -ForegroundColor White
Write-Host ""
