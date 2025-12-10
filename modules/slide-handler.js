// ============================================================
// SLIDE HANDLER
// Manages slide selection and synchronization
// ============================================================

const SlideHandler = {
    currentSlideIndex: 0,

    // Initialize slide handler
    async init() {
        try {
            await this.updateCurrentSlide();
            this.setupSlideChangeListener();
            console.log('✅ Slide handler initialized');
        } catch (error) {
            console.error('Error initializing slide handler:', error);
        }
    },

    // Update current slide index
    async updateCurrentSlide() {
        try {
            const slide = await PowerPointAPI.getCurrentSlide();
            if (slide) {
                // Note: Office.js doesn't directly provide slide index
                // We'll track it manually or use workarounds
                console.log('Current slide updated');
            }
        } catch (error) {
            console.error('Error updating current slide:', error);
        }
    },

    // Setup listener for slide changes
    setupSlideChangeListener() {
        // Office.js doesn't have direct slide change events
        // We can poll or use selection change events
        // For now, we'll implement a simple polling mechanism
        setInterval(async () => {
            await this.updateCurrentSlide();
        }, 2000); // Check every 2 seconds
    },

    // Get current slide
    async getCurrentSlide() {
        return await PowerPointAPI.getCurrentSlide();
    }
};

// Export for use in other modules
window.SlideHandler = SlideHandler;
