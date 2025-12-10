// ============================================================
// POWERPOINT API WRAPPER
// Provides simplified interface to Office.js PowerPoint API
// ============================================================

const PowerPointAPI = {
    // Initialize PowerPoint API
    async initialize() {
        return new Promise((resolve, reject) => {
            Office.onReady((info) => {
                if (info.host === Office.HostType.PowerPoint) {
                    console.log('✅ PowerPoint API initialized');
                    resolve(true);
                } else {
                    reject(new Error('Not running in PowerPoint'));
                }
            });
        });
    },

    // Get current slide
    async getCurrentSlide() {
        return PowerPoint.run(async (context) => {
            const slides = context.presentation.slides;
            const selectedSlides = slides.getSelectedSlides();
            selectedSlides.load('items');

            await context.sync();

            if (selectedSlides.items.length > 0) {
                return selectedSlides.items[0];
            }
            return null;
        });
    },

    // Insert image into current slide
    async insertImage(imageUrl, options = {}) {
        return PowerPoint.run(async (context) => {
            const slides = context.presentation.slides;
            const selectedSlides = slides.getSelectedSlides();
            selectedSlides.load('items');

            await context.sync();

            if (selectedSlides.items.length === 0) {
                throw new Error('No slide selected');
            }

            const slide = selectedSlides.items[0];

            // Default options
            const {
                left = 100,
                top = 100,
                width = 200,
                height = 200
            } = options;

            // Insert image
            const image = slide.shapes.addPicture({
                base64ImageString: imageUrl,
                left: left,
                top: top,
                width: width,
                height: height
            });

            await context.sync();

            console.log('✅ Image inserted successfully');
            return image;
        });
    },

    // Insert image from URL
    async insertImageFromUrl(url, options = {}) {
        try {
            // Fetch image and convert to base64
            const response = await fetch(url);
            const blob = await response.blob();
            const base64 = await this.blobToBase64(blob);

            // Remove data URL prefix if present
            const base64Data = base64.split(',')[1] || base64;

            return await this.insertImage(base64Data, options);
        } catch (error) {
            console.error('Error inserting image from URL:', error);
            throw error;
        }
    },

    // Convert blob to base64
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },

    // Apply color to selected shape
    async applyColorToShape(color) {
        return PowerPoint.run(async (context) => {
            const slides = context.presentation.slides;
            const selectedSlides = slides.getSelectedSlides();
            selectedSlides.load('items');

            await context.sync();

            if (selectedSlides.items.length === 0) {
                throw new Error('No slide selected');
            }

            const slide = selectedSlides.items[0];
            const shapes = slide.shapes;
            shapes.load('items');

            await context.sync();

            // Apply color to all shapes (or implement shape selection)
            shapes.items.forEach(shape => {
                shape.fill.setSolidColor(color);
            });

            await context.sync();

            console.log('✅ Color applied to shapes');
        });
    },

    // Add text to slide
    async addText(text, options = {}) {
        return PowerPoint.run(async (context) => {
            const slides = context.presentation.slides;
            const selectedSlides = slides.getSelectedSlides();
            selectedSlides.load('items');

            await context.sync();

            if (selectedSlides.items.length === 0) {
                throw new Error('No slide selected');
            }

            const slide = selectedSlides.items[0];

            const {
                left = 50,
                top = 50,
                width = 400,
                height = 100
            } = options;

            const textBox = slide.shapes.addTextBox(text, {
                left: left,
                top: top,
                width: width,
                height: height
            });

            await context.sync();

            console.log('✅ Text added successfully');
            return textBox;
        });
    },

    // Get slide count
    async getSlideCount() {
        return PowerPoint.run(async (context) => {
            const slides = context.presentation.slides;
            slides.load('items');

            await context.sync();

            return slides.items.length;
        });
    },

    // Set background image
    async setBackgroundImage(imageUrl) {
        return PowerPoint.run(async (context) => {
            const slides = context.presentation.slides;
            const selectedSlides = slides.getSelectedSlides();
            selectedSlides.load('items');

            await context.sync();

            if (selectedSlides.items.length === 0) {
                throw new Error('No slide selected');
            }

            const slide = selectedSlides.items[0];

            // Fetch and convert image
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const base64 = await this.blobToBase64(blob);
            const base64Data = base64.split(',')[1] || base64;

            // Insert as background (full slide size)
            const image = slide.shapes.addPicture({
                base64ImageString: base64Data,
                left: 0,
                top: 0,
                width: 720, // Standard slide width
                height: 540  // Standard slide height
            });

            // Send to back
            image.sendToBack();

            await context.sync();

            console.log('✅ Background image set');
            return image;
        });
    }
};

// Export for use in other modules
window.PowerPointAPI = PowerPointAPI;
