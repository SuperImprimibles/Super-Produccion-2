// ============================================================
// UI CONTROLLER
// Manages UI interactions and updates
// ============================================================

const UIController = {
    elements: {},

    // Initialize UI controller
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupStateListeners();
        this.loadInitialState();
        console.log('✅ UI Controller initialized');
    },

    // Cache DOM elements
    cacheElements() {
        this.elements = {
            // Tabs
            tabPersonajes: document.querySelector('[data-tab="personajes"]'),
            tabFondos: document.querySelector('[data-tab="fondos"]'),
            vistaPersonajes: document.getElementById('vista-personajes'),
            vistaFondos: document.getElementById('vista-fondos'),

            // Inputs
            tematica: document.getElementById('tematica'),
            nombre: document.getElementById('nombre-input'),
            edad: document.getElementById('edad'),
            publico: document.getElementById('publico'),
            previewTexto: document.getElementById('preview-texto'),

            // Colors
            colores: document.querySelectorAll('.color-circulo'),

            // Presets
            presetSelector: document.getElementById('preset-selector'),
            btnCargar: document.getElementById('btn-cargar'),
            btnGuardar: document.getElementById('btn-guardar'),

            // Apply button
            btnAplicar: document.getElementById('btn-aplicar'),

            // Loading
            loadingOverlay: document.getElementById('loading-overlay')
        };
    },

    // Setup event listeners
    setupEventListeners() {
        // Tab switching
        this.elements.tabPersonajes?.addEventListener('click', () => this.switchTab('personajes'));
        this.elements.tabFondos?.addEventListener('click', () => this.switchTab('fondos'));

        // Input changes
        this.elements.tematica?.addEventListener('input', (e) => {
            StateManager.set('tematica', e.target.value);
        });

        this.elements.nombre?.addEventListener('change', (e) => {
            StateManager.set('nombre', e.target.value);
            this.updateTextPreview();
        });

        this.elements.edad?.addEventListener('input', (e) => {
            StateManager.set('edad', e.target.value);
        });

        this.elements.publico?.addEventListener('change', (e) => {
            StateManager.set('publico', e.target.value);
        });

        // Color changes
        this.elements.colores.forEach((colorInput, index) => {
            colorInput.addEventListener('change', (e) => {
                StateManager.setColor(index, e.target.value);
            });
        });

        // Preset buttons
        this.elements.btnCargar?.addEventListener('click', () => {
            PresetManager.loadPreset(this.elements.presetSelector.value);
        });

        this.elements.btnGuardar?.addEventListener('click', () => {
            PresetManager.savePreset();
        });

        // Apply button
        this.elements.btnAplicar?.addEventListener('click', async () => {
            await this.applyToSlide();
        });
    },

    // Setup state listeners
    setupStateListeners() {
        StateManager.addListener('nombre', () => this.updateTextPreview());
        StateManager.addListener('colores', (colors) => this.updateColorInputs(colors));
    },

    // Load initial state
    loadInitialState() {
        const state = StateManager.getAll();

        if (this.elements.tematica) this.elements.tematica.value = state.tematica || '';
        if (this.elements.nombre) this.elements.nombre.value = state.nombre || '';
        if (this.elements.edad) this.elements.edad.value = state.edad || '';
        if (this.elements.publico) this.elements.publico.value = state.publico || 'general';

        this.updateColorInputs(state.colores);
        this.updateTextPreview();
    },

    // Switch tab
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-superior').forEach(tab => {
            tab.classList.remove('activo');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('activo');

        // Update tab content
        document.querySelectorAll('.vista-tab').forEach(vista => {
            vista.classList.remove('activo');
        });
        document.getElementById(`vista-${tabName}`)?.classList.add('activo');

        StateManager.set('currentTab', tabName);
    },

    // Update text preview
    updateTextPreview() {
        const nombre = StateManager.get('nombre');
        if (this.elements.previewTexto) {
            this.elements.previewTexto.textContent = nombre || 'NOMBRE';
        }
    },

    // Update color inputs
    updateColorInputs(colors) {
        this.elements.colores.forEach((input, index) => {
            if (colors[index]) {
                input.value = colors[index];
            }
        });
    },

    // Show loading
    showLoading(show = true) {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    },

    // Apply to slide
    async applyToSlide() {
        try {
            this.showLoading(true);

            const state = StateManager.getAll();

            // Apply background (first fondo)
            const fondo = state.fondos.find(f => f !== null);
            if (fondo) {
                await PowerPointAPI.setBackgroundImage(fondo);
            }

            // Apply personajes
            const personajes = state.personajes.filter(p => p !== null);
            for (let i = 0; i < personajes.length; i++) {
                await PowerPointAPI.insertImageFromUrl(personajes[i], {
                    left: 100 + (i * 150),
                    top: 200,
                    width: 120,
                    height: 120
                });
            }

            // Apply text
            if (state.nombre) {
                await PowerPointAPI.addText(state.nombre, {
                    left: 50,
                    top: 50,
                    width: 400,
                    height: 100
                });
            }

            this.showLoading(false);
            console.log('✅ Applied to slide successfully');
        } catch (error) {
            console.error('Error applying to slide:', error);
            this.showLoading(false);
            alert('Error al aplicar a la diapositiva: ' + error.message);
        }
    }
};

// Export for use in other modules
window.UIController = UIController;
