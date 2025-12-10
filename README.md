# 🎨 Super Producción - PowerPoint Add-in

Office Add-in para PowerPoint que permite crear presentaciones personalizadas con personajes, fondos, colores y textos directamente desde un panel lateral integrado.

## ✨ Características

- **Panel Lateral Integrado**: Interfaz completa dentro de PowerPoint
- **Personajes y Fondos**: Arrastra y suelta imágenes personalizadas
- **Paleta de Colores**: Personaliza los colores de tu presentación
- **Presets**: Guarda y carga configuraciones completas
- **Aplicación Directa**: Aplica cambios a las diapositivas con un clic

## 📋 Requisitos

- **PowerPoint 2016 o superior** (Windows/Mac)
- O **Microsoft 365** con PowerPoint Online
- **Node.js** (para desarrollo)

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
cd powerpoint-addin
npm install
```

### 2. Generar Certificados SSL

Los add-ins de Office requieren HTTPS. Genera certificados de desarrollo:

```bash
npm run dev-certs
```

Sigue las instrucciones para confiar en el certificado.

### 3. Iniciar Servidor de Desarrollo

```bash
npm start
```

Esto iniciará un servidor HTTPS en `https://localhost:3000`

### 4. Cargar el Add-in en PowerPoint

#### Windows:

1. Abre PowerPoint
2. Ve a **Insertar** > **Mis complementos** > **Complementos compartidos**
3. Click en **Cargar complemento**
4. Navega a la carpeta `powerpoint-addin` y selecciona `manifest.xml`
5. Click **Aceptar**

#### Mac:

1. Abre PowerPoint
2. Ve a **Insertar** > **Complementos** > **Mis complementos**
3. En la sección **Complementos de desarrollador**, click en **+**
4. Selecciona `manifest.xml`
5. Click **Agregar**

#### PowerPoint Online:

1. Abre PowerPoint Online
2. Ve a **Insertar** > **Complementos de Office**
3. Click en **Cargar mi complemento**
4. Selecciona **Cargar desde archivo**
5. Selecciona `manifest.xml`

## 🎯 Uso

### 1. Abrir el Panel

- Después de cargar el add-in, verás un botón **"Super Producción"** en la pestaña **Inicio**
- Haz clic para abrir el panel lateral

### 2. Agregar Personajes y Fondos

- **Pestaña Personajes**: Arrastra imágenes a los espacios vacíos (+)
- **Pestaña Fondos**: Arrastra fondos y elementos decorativos
- Puedes arrastrar archivos desde tu computadora

### 3. Configurar Presentación

- **Temática**: Escribe el tema de tu presentación
- **Nombre**: Selecciona o escribe un nombre
- **Edad**: Ingresa la edad del destinatario
- **Público**: Selecciona el público objetivo
- **Colores**: Personaliza la paleta de colores

### 4. Aplicar a Diapositiva

- Haz clic en **"Aplicar a Diapositiva"**
- Los elementos se insertarán en la diapositiva activa

### 5. Guardar Presets

- Configura personajes, fondos y colores
- Haz clic en **"Guardar"** en la sección Presets
- Ingresa un nombre para tu preset
- Carga presets guardados desde el selector

## 🛠️ Desarrollo

### Estructura de Archivos

```
powerpoint-addin/
├── manifest.xml          # Configuración del add-in
├── package.json          # Dependencias npm
├── taskpane.html         # Interfaz del panel
├── taskpane.css          # Estilos
├── taskpane.js           # Orquestador principal
├── commands.html         # Comandos del ribbon
├── modules/
│   ├── powerpoint-api.js      # Wrapper de Office.js
│   ├── state-manager.js       # Gestión de estado
│   ├── slide-handler.js       # Manejo de diapositivas
│   ├── ui-controller.js       # Control de UI
│   ├── drag-drop-handler.js   # Drag & drop
│   ├── color-manager.js       # Gestión de colores
│   └── preset-manager.js      # Presets
├── assets/               # Recursos (imágenes, etc.)
└── icons/                # Iconos del add-in
```

### Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Generar certificados SSL
npm run dev-certs

# Validar manifest.xml
npm run validate

# Detener servidor
npm stop
```

### Debugging

1. En PowerPoint, presiona **F12** para abrir DevTools
2. O haz clic derecho en el panel y selecciona **Inspeccionar**
3. Revisa la consola para logs y errores

## 🔧 Configuración Avanzada

### Cambiar Puerto

Edita `package.json` y cambia el puerto en el script `dev`:

```json
"dev": "http-server -p 3001 -S -C cert.pem -K key.pem"
```

También actualiza las URLs en `manifest.xml`.

### Producción

Para producción, necesitarás:

1. Hosting HTTPS (GitHub Pages, Azure, etc.)
2. Actualizar URLs en `manifest.xml`
3. Publicar en AppSource (opcional)

## ❓ Troubleshooting

### El add-in no carga

- Verifica que el servidor esté corriendo (`npm start`)
- Asegúrate de que el certificado SSL esté confiado
- Revisa que PowerPoint tenga acceso a `https://localhost:3000`

### Errores de CORS

- Los add-ins de Office tienen restricciones de CORS
- Asegúrate de que las imágenes estén en el mismo dominio o usen CORS headers

### El botón no aparece

- Cierra y vuelve a abrir PowerPoint
- Verifica que `manifest.xml` esté correctamente configurado
- Revisa que el add-in esté en la lista de complementos

## 📝 Notas

- **Desarrollo Local**: El add-in usa `localhost:3000` para desarrollo
- **Persistencia**: Los datos se guardan en localStorage del navegador
- **Compatibilidad**: Funciona en PowerPoint 2016+, Mac y Online

## 🤝 Soporte

Para problemas o preguntas:
- Revisa la [documentación de Office Add-ins](https://docs.microsoft.com/office/dev/add-ins/)
- Consulta los logs en la consola del navegador

---

**Versión:** 1.0.0  
**Última actualización:** 2024-11-30
