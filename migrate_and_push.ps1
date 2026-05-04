# This script restructures the LuminaCast project into a clean monorepo
# and pushes the changes directly to the remote main branch.

Write-Host "Creating monorepo directories..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "frontend"
New-Item -ItemType Directory -Force -Path "backend"

Write-Host "Moving Next.js frontend files..." -ForegroundColor Cyan
$frontendFiles = @(
    "src", "public", "package.json", "package-lock.json",
    "next.config.mjs", "tailwind.config.ts", "tsconfig.json",
    "postcss.config.mjs", ".eslintrc.json", "components.json",
    "next-env.d.ts", "Dockerfile"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "frontend\" -Force
    }
}

Write-Host "Moving .NET backend files..." -ForegroundColor Cyan
$backendFiles = @(
    "LuminaCast.Backend",
    "LuminaCast.Backend.Tests",
    "LuminaCast.sln"
)

foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "backend\" -Force
    }
}

Write-Host "Executing Git Operations..." -ForegroundColor Green
git add .
git commit -m "feat: restructure monorepo to enterprise standards, add terraform and tests"
git push origin main

Write-Host "Migration and Push Complete!" -ForegroundColor Green
