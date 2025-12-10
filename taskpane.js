// ============================================================
// TASKPANE.JS - Main Orchestrator
// Initializes and coordinates all modules
// ============================================================

(function () {
    'use strict';

    // Office.js initialization
    Office.onReady((info) => {
        if (info.host === Office.HostType.PowerPoint) {
            console.log('🚀 Super Producción Add-in starting...');
            initializeAddin();
        } else {
            console.error('❌ This add-in only works in PowerPoint');
            document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: #ff6b6b;">Este complemento solo funciona en PowerPoint</div>';
        }
    });

    // Initialize add-in
    async function initializeAddin() {
        try {
            // Initialize PowerPoint API
            await PowerPointAPI.initialize();

            // Initialize State Manager
            StateManager.init();

            // Initialize UI Controller
            UIController.init();

            // Initialize Drag and Drop
            DragDropHandler.init();

            // Initialize Color Manager
            ColorManager.init();

            // Initialize Preset Manager
            PresetManager.init();

            // Initialize Slide Handler
            await SlideHandler.init();

            // Initialize Slide Grid Manager
            await SlideGridManager.init();

            // Initialize Tab Navigation
            TabNavigation.init();

            // Initialize Form Controls
            initializeFormControls();

            // Initialize Top Bar Buttons
            initializeTopBarButtons();

            // Load initial grid displays
            DragDropHandler.updateGridDisplay('personajes');
            DragDropHandler.updateGridDisplay('fondos');

            // Start auto-refresh for slide grid
            SlideGridManager.startAutoRefresh(3000);

            console.log('✅ Super Producción Add-in initialized successfully!');

        } catch (error) {
            console.error('❌ Error initializing add-in:', error);
            alert('Error al inicializar el complemento: ' + error.message);
        }
    }

    // Initialize form controls
    function initializeFormControls() {
        const tematicaInput = document.getElementById('tematica');
        const nombreInput = document.getElementById('nombre-input');
        const edadInput = document.getElementById('edad');
        const publicoInput = document.getElementById('publico');
        const previewTexto = document.getElementById('preview-texto');

        // Update preview when inputs change
        const updatePreview = () => {
            const nombre = nombreInput.value || 'NOMBRE';
            previewTexto.textContent = nombre.toUpperCase();

            // Update state
            StateManager.setState({
                tematica: tematicaInput.value,
                nombre: nombreInput.value,
                edad: edadInput.value,
                publico: publicoInput.value
            });
        };

        tematicaInput?.addEventListener('input', updatePreview);
        nombreInput?.addEventListener('change', updatePreview);
        edadInput?.addEventListener('input', updatePreview);
        publicoInput?.addEventListener('change', updatePreview);
    }

    // Initialize top bar buttons
    function initializeTopBarButtons() {
        // Guardar button
        const btnGuardar = document.getElementById('btn-guardar');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', handleGuardar);
        }

        // Importar button
        const btnImportar = document.getElementById('btn-importar');
        if (btnImportar) {
            btnImportar.addEventListener('click', handleImportar);
        }

        // Deshacer button
        const btnDeshacer = document.getElementById('btn-deshacer');
        if (btnDeshacer) {
            btnDeshacer.addEventListener('click', handleDeshacer);
        }

        // Rehacer button
        const btnRehacer = document.getElementById('btn-rehacer');
        if (btnRehacer) {
            btnRehacer.addEventListener('click', handleRehacer);
        }

        // Historial button
        const btnHistorial = document.getElementById('btn-historial');
        if (btnHistorial) {
            btnHistorial.addEventListener('click', handleHistorial);
        }

        // Publicar button
        const btnPublicar = document.getElementById('btn-publicar');
        if (btnPublicar) {
            btnPublicar.addEventListener('click', handlePublicar);
        }
    }

    // Button handlers
    function handleGuardar() {
        console.log('💾 Guardar clicked');
        const state = StateManager.getState();
        const stateJson = JSON.stringify(state, null, 2);

        // Create a blob and download
        const blob = new Blob([stateJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'super-produccion-state.json';
        a.click();
        URL.revokeObjectURL(url);

        console.log('✅ Estado guardado');
    }

    function handleImportar() {
        console.log('📁 Importar clicked');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const state = JSON.parse(event.target.result);
                        StateManager.setState(state);
                        DragDropHandler.updateGridDisplay('personajes');
                        DragDropHandler.updateGridDisplay('fondos');
                        console.log('✅ Estado importado');
                    } catch (error) {
                        console.error('❌ Error importing state:', error);
                        alert('Error al importar el archivo');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    function handleDeshacer() {
        console.log('↩️ Deshacer clicked');
        // TODO: Implement undo functionality
        alert('Funcionalidad de Deshacer en desarrollo');
    }

    function handleRehacer() {
        console.log('↪️ Rehacer clicked');
        // TODO: Implement redo functionality
        alert('Funcionalidad de Rehacer en desarrollo');
    }

    function handleHistorial() {
        console.log('📜 Historial clicked');
        // TODO: Implement history functionality
        alert('Funcionalidad de Historial en desarrollo');
    }

    function handlePublicar() {
        console.log('🚀 Publicar clicked');
        // TODO: Implement publish functionality
        alert('Funcionalidad de Publicar en desarrollo');
    }

    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });

})();

