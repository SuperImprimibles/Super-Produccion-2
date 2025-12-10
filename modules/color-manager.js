// ============================================================
// COLOR MANAGER
// Manages color palette and application
// ============================================================

const ColorManager = {
    // Initialize color manager
    init() {
        this.setupColorListeners();
        console.log('✅ Color manager initialized');
    },

    // Setup color input listeners
    setupColorListeners() {
        const colorInputs = document.querySelectorAll('.color-circulo');

        colorInputs.forEach((input, index) => {
            input.addEventListener('change', (e) => {
                this.handleColorChange(index, e.target.value);
            });
        });
    },

    // Handle color change
    handleColorChange(index, color) {
        StateManager.setColor(index, color);
        console.log(`Color ${index} changed to ${color}`);
    },

    // Get current colors
    getColors() {
        return StateManager.get('colores');
    },

    // Set colors
    setColors(colors) {
        colors.forEach((color, index) => {
            StateManager.setColor(index, color);
        });
        this.updateColorInputs();
    },

    // Update color inputs in UI
    updateColorInputs() {
        const colorInputs = document.querySelectorAll('.color-circulo');
        const colors = this.getColors();

        colorInputs.forEach((input, index) => {
            if (colors[index]) {
                input.value = colors[index];
            }
        });
    },

    // Apply colors to PowerPoint slide
    async applyColorsToSlide() {
        try {
            const colors = this.getColors();

            // Apply first color to selected shapes
            if (colors[0]) {
                await PowerPointAPI.applyColorToShape(colors[0]);
            }

            console.log('✅ Colors applied to slide');
        } catch (error) {
            console.error('Error applying colors:', error);
        }
    }
};

// Export for use in other modules
window.ColorManager = ColorManager;
