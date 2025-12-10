# Cómo Iniciar el Add-in de PowerPoint

## Pasos para Desarrollo

### 1. Instalar Certificados (Solo la primera vez)
```powershell
npm run dev-certs
```

### 2. Iniciar el Servidor de Desarrollo
Abre una terminal y ejecuta:
```powershell
npm run dev
```

**IMPORTANTE**: Deja esta terminal abierta. El servidor debe estar corriendo todo el tiempo.

### 3. Abrir PowerPoint con el Add-in
Abre **OTRA terminal** (la primera debe seguir corriendo) y ejecuta:
```powershell
npm run start
```

Esto abrirá PowerPoint con el add-in cargado.

## Detener el Desarrollo

1. Cierra PowerPoint
2. En la segunda terminal, ejecuta:
```powershell
npm run stop
```
3. En la primera terminal, presiona `Ctrl+C` para detener el servidor

## Solución de Problemas

### Error: "No pudimos cargar el complemento"
- **Causa**: El servidor de desarrollo no está corriendo
- **Solución**: Asegúrate de tener `npm run dev` ejecutándose en una terminal

### El add-in no aparece en PowerPoint
- Ejecuta `npm run stop` y luego `npm run start` nuevamente
- Verifica que los certificados estén instalados con `npm run dev-certs`

## Estructura de Terminales

```
Terminal 1 (Servidor):          Terminal 2 (PowerPoint):
┌─────────────────────┐        ┌─────────────────────┐
│ npm run dev         │        │ npm run start       │
│ [Mantener abierta]  │        │ [Abre PowerPoint]   │
│                     │        │                     │
│ Server running...   │        │ npm run stop        │
│ https://localhost:  │        │ [Cierra PowerPoint] │
│ 3000                │        │                     │
└─────────────────────┘        └─────────────────────┘
```
