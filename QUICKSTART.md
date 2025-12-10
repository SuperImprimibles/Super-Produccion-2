# Guía Rápida de Instalación

## Pasos Rápidos

### 1. Instalar Dependencias
```bash
cd powerpoint-addin
npm install
```

### 2. Generar Certificados
```bash
npm run dev-certs
```
**Importante**: Acepta confiar en el certificado cuando se te solicite.

### 3. Iniciar Servidor
```bash
npm start
```
Deja esta ventana abierta. El servidor debe estar corriendo en `https://localhost:3000`

### 4. Cargar en PowerPoint

**Windows:**
1. Abre PowerPoint
2. Insertar → Mis complementos → Complementos compartidos
3. Cargar complemento → Selecciona `manifest.xml`

**Mac:**
1. Abre PowerPoint
2. Insertar → Complementos → Mis complementos
3. Complementos de desarrollador → + → Selecciona `manifest.xml`

### 5. Usar el Add-in

1. Verás un botón "Super Producción" en la pestaña Inicio
2. Haz clic para abrir el panel lateral
3. ¡Empieza a crear!

## Troubleshooting

**El add-in no carga:**
- Verifica que `npm start` esté corriendo
- Cierra y vuelve a abrir PowerPoint
- Verifica que confías en el certificado SSL

**Error de certificado:**
```bash
npm run dev-certs
```
Acepta confiar en el certificado en tu sistema.

## Próximos Pasos

Lee el [README.md](README.md) completo para más detalles sobre uso y desarrollo.
