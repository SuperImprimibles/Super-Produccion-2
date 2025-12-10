# Script de Reinstalación del Add-in de PowerPoint
# Super Producción - Reinstalación Automática

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Super Producción - Reinstalar Add-in  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que estamos en el directorio correcto
$addinPath = "d:\SuperImprimible\Super Produccion\powerpoint-addin"
if (-not (Test-Path $addinPath)) {
    Write-Host "Error: No se encuentra el directorio del add-in" -ForegroundColor Red
    exit 1
}

Set-Location $addinPath

# 2. Cerrar PowerPoint si está abierto
Write-Host "[1/6] Cerrando PowerPoint..." -ForegroundColor Yellow
$powerpoint = Get-Process -Name "POWERPNT" -ErrorAction SilentlyContinue
if ($powerpoint) {
    Write-Host "  - PowerPoint está abierto. Cerrando..." -ForegroundColor Gray
    Stop-Process -Name "POWERPNT" -Force
    Start-Sleep -Seconds 2
    Write-Host "  - PowerPoint cerrado" -ForegroundColor Green
} else {
    Write-Host "  - PowerPoint no estaba abierto" -ForegroundColor Green
}

# 3. Limpiar caché de Office
Write-Host ""
Write-Host "[2/6] Limpiando caché de Office..." -ForegroundColor Yellow
$cachePath = "$env:LOCALAPPDATA\Microsoft\Office\16.0\Wef"
if (Test-Path $cachePath) {
    try {
        Remove-Item -Recurse -Force $cachePath -ErrorAction Stop
        Write-Host "  - Caché eliminado exitosamente" -ForegroundColor Green
    } catch {
        Write-Host "  - Advertencia: No se pudo eliminar el caché completamente" -ForegroundColor Yellow
        Write-Host "    Esto puede ser normal si Office está en uso" -ForegroundColor Gray
    }
} else {
    Write-Host "  - No hay caché para limpiar" -ForegroundColor Green
}

# 4. Verificar/Instalar dependencias
Write-Host ""
Write-Host "[3/6] Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  - Instalando dependencias..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  - Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host "  - Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "  - Dependencias ya instaladas" -ForegroundColor Green
}

# 5. Verificar certificados
Write-Host ""
Write-Host "[4/6] Verificando certificados SSL..." -ForegroundColor Yellow
if (-not (Test-Path "certs")) {
    Write-Host "  - Generando certificados de desarrollo..." -ForegroundColor Gray
    npm run dev-certs
    Write-Host "  - Certificados generados" -ForegroundColor Green
} else {
    Write-Host "  - Certificados ya existen" -ForegroundColor Green
}

# 6. Iniciar servidor en segundo plano
Write-Host ""
Write-Host "[5/6] Iniciando servidor de desarrollo..." -ForegroundColor Yellow

# Matar cualquier proceso de Node.js que esté usando el puerto 3000
$nodeProcesses = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($nodeProcesses) {
    foreach ($pid in $nodeProcesses) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
}

# Iniciar el servidor
Write-Host "  - Iniciando servidor en https://localhost:3000..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$addinPath'; npm start" -WindowStyle Normal

# Esperar a que el servidor esté listo
Write-Host "  - Esperando a que el servidor esté listo..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Verificar que el servidor está corriendo
$serverRunning = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "https://localhost:3000" -SkipCertificateCheck -TimeoutSec 2 -ErrorAction SilentlyContinue
        $serverRunning = $true
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

if ($serverRunning) {
    Write-Host "  - Servidor iniciado correctamente" -ForegroundColor Green
} else {
    Write-Host "  - Advertencia: No se pudo verificar el servidor" -ForegroundColor Yellow
    Write-Host "    Verifica manualmente que esté corriendo" -ForegroundColor Gray
}

# 7. Abrir PowerPoint y mostrar instrucciones
Write-Host ""
Write-Host "[6/6] Abriendo PowerPoint..." -ForegroundColor Yellow
Start-Process "POWERPNT"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Reinstalación Preparada              " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pasos finales (manuales):" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. En PowerPoint, ve a:" -ForegroundColor White
Write-Host "   Insertar → Mis complementos → Complementos compartidos" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Haz clic en 'Cargar complemento'" -ForegroundColor White
Write-Host ""
Write-Host "3. Selecciona el archivo:" -ForegroundColor White
Write-Host "   $addinPath\manifest.xml" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. El botón 'Super Producción' aparecerá en la pestaña Inicio" -ForegroundColor White
Write-Host ""
Write-Host "Nota: El servidor está corriendo en otra ventana." -ForegroundColor Cyan
Write-Host "      NO cierres esa ventana mientras uses el add-in." -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
