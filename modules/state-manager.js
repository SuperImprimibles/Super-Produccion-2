// ============================================================
// STATE MANAGER
// Manages global application state
// ============================================================

const StateManager = {
    state: {
        personajes: Array(12).fill(null),
        fondos: Array(12).fill(null),
        logo: null,
        tematica: '',
        nombre: '',
        edad: '',
        publico: 'general',
        colores: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
        currentTab: 'personajes',
        presets: {}
    },

    // Initialize state from localStorage
    init() {
        const saved = localStorage.getItem('superProduccion_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
                console.log('✅ State loaded from localStorage');
            } catch (error) {
                console.error('Error loading state:', error);
            }
        }
    },

    // Save state to localStorage
    save() {
        try {
            localStorage.setItem('superProduccion_state', JSON.stringify(this.state));
            console.log('✅ State saved to localStorage');
        } catch (error) {
            console.error('Error saving state:', error);
        }
    },

    // Get state value
    get(key) {
        return this.state[key];
    },

    // Set state value
    set(key, value) {
        this.state[key] = value;
        this.save();
        this.notifyListeners(key, value);
    },

    // Set personaje at index
    setPersonaje(index, imageUrl) {
        this.state.personajes[index] = imageUrl;
        this.save();
        this.notifyListeners('personajes', this.state.personajes);
    },

    // Set fondo at index
    setFondo(index, imageUrl) {
        this.state.fondos[index] = imageUrl;
        this.save();
        this.notifyListeners('fondos', this.state.fondos);
    },

    // Set color at index
    setColor(index, color) {
        this.state.colores[index] = color;
        this.save();
        this.notifyListeners('colores', this.state.colores);
    },

    // Clear personaje at index
    clearPersonaje(index) {
        this.state.personajes[index] = null;
        this.save();
        this.notifyListeners('personajes', this.state.personajes);
    },

    // Clear fondo at index
    clearFondo(index) {
        this.state.fondos[index] = null;
        this.save();
        this.notifyListeners('fondos', this.state.fondos);
    },

    // Get all state
    getAll() {
        return { ...this.state };
    },

    // Reset state
    reset() {
        this.state = {
            personajes: Array(12).fill(null),
            fondos: Array(12).fill(null),
            logo: null,
            tematica: '',
            nombre: '',
            edad: '',
            publico: 'general',
            colores: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
            currentTab: 'personajes',
            presets: this.state.presets // Keep presets
        };
        this.save();
        this.notifyListeners('reset', this.state);
    },

    // Listeners for state changes
    listeners: {},

    // Add listener
    addListener(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    },

    // Notify listeners
    notifyListeners(key, value) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(value));
        }
        // Also notify 'any' listeners
        if (this.listeners['any']) {
            this.listeners['any'].forEach(callback => callback(key, value));
        }
    }
};

// Export for use in other modules
window.StateManager = StateManager;
