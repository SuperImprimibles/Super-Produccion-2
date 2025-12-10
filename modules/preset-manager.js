// ============================================================
// PRESET MANAGER
// Manages saving and loading of presets
// ============================================================

const PresetManager = {
    // Initialize preset manager
    init() {
        this.loadPresetList();
        console.log('✅ Preset manager initialized');
    },

    // Load preset list
    loadPresetList() {
        const presets = StateManager.get('presets') || {};
        const selector = document.getElementById('preset-selector');

        if (!selector) return;

        // Clear existing options except first
        while (selector.options.length > 1) {
            selector.remove(1);
        }

        // Add presets to selector
        Object.keys(presets).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            selector.appendChild(option);
        });
    },

    // Save current state as preset
    savePreset() {
        const name = prompt('Nombre del preset:');
        if (!name) return;

        const state = StateManager.getAll();
        const preset = {
            personajes: state.personajes,
            fondos: state.fondos,
            tematica: state.tematica,
            nombre: state.nombre,
            edad: state.edad,
            publico: state.publico,
            colores: state.colores
        };

        const presets = StateManager.get('presets') || {};
        presets[name] = preset;
        StateManager.set('presets', presets);

        this.loadPresetList();

        // Select the newly saved preset
        const selector = document.getElementById('preset-selector');
        if (selector) {
            selector.value = name;
        }

        console.log(`✅ Preset "${name}" saved`);
    },

    // Load preset
    loadPreset(name) {
        if (!name) {
            alert('Selecciona un preset');
            return;
        }

        const presets = StateManager.get('presets') || {};
        const preset = presets[name];

        if (!preset) {
            alert('Preset no encontrado');
            return;
        }

        // Apply preset to state
        StateManager.set('tematica', preset.tematica || '');
        StateManager.set('nombre', preset.nombre || '');
        StateManager.set('edad', preset.edad || '');
        StateManager.set('publico', preset.publico || 'general');

        preset.colores.forEach((color, index) => {
            StateManager.setColor(index, color);
        });

        preset.personajes.forEach((img, index) => {
            StateManager.setPersonaje(index, img);
        });

        preset.fondos.forEach((img, index) => {
            StateManager.setFondo(index, img);
        });

        // Update UI
        UIController.loadInitialState();
        DragDropHandler.updateGridDisplay('personajes');
        DragDropHandler.updateGridDisplay('fondos');

        console.log(`✅ Preset "${name}" loaded`);
    },

    // Delete preset
    deletePreset(name) {
        if (!name) return;

        if (!confirm(`¿Eliminar preset "${name}"?`)) return;

        const presets = StateManager.get('presets') || {};
        delete presets[name];
        StateManager.set('presets', presets);

        this.loadPresetList();
        console.log(`✅ Preset "${name}" deleted`);
    }
};

// Export for use in other modules
window.PresetManager = PresetManager;
