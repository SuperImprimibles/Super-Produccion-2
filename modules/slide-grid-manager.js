// ============================================================
// SLIDE GRID MANAGER - Gestión del Grid 3x3 de Diapositivas
// ============================================================

const SlideGridManager = (function () {
    'use strict';

    let currentSlideIndex = 1;
    let totalSlides = 0;
    let updateInterval = null;

    // Initialize
    function init() {
        console.log('📊 Initializing Slide Grid Manager...');
        setupEventListeners();
        return loadSlideGrid();
    }

    // Setup event listeners
    function setupEventListeners() {
        const slideItems = document.querySelectorAll('.diapositiva-item');
        slideItems.forEach(item => {
            item.addEventListener('click', handleSlideClick);
        });
    }

    // Handle slide click
    async function handleSlideClick(event) {
        const slideItem = event.currentTarget;
        const slideNumber = parseInt(slideItem.getAttribute('data-slide'));

        if (slideNumber <= totalSlides) {
            await goToSlide(slideNumber);
            updateSelectedSlide(slideNumber);
        }
    }

    // Go to specific slide
    async function goToSlide(slideNumber) {
        try {
            await PowerPoint.run(async (context) => {
                const presentation = context.presentation;
                const slides = presentation.slides;
                slides.load('items');

                await context.sync();

                if (slideNumber > 0 && slideNumber <= slides.items.length) {
                    const targetSlide = slides.items[slideNumber - 1];
                    targetSlide.load('id');
                    await context.sync();

                    // Set as active slide
                    presentation.setSelectedSlides([targetSlide.id]);
                    await context.sync();

                    currentSlideIndex = slideNumber;
                    console.log(`✅ Navigated to slide ${slideNumber}`);
                }
            });
        } catch (error) {
            console.error('❌ Error navigating to slide:', error);
        }
    }

    // Update selected slide visual indicator
    function updateSelectedSlide(slideNumber) {
        const slideItems = document.querySelectorAll('.diapositiva-item');
        slideItems.forEach(item => {
            item.classList.remove('selected');
            if (parseInt(item.getAttribute('data-slide')) === slideNumber) {
                item.classList.add('selected');
            }
        });
    }

    // Load slide grid
    async function loadSlideGrid() {
        try {
            await PowerPoint.run(async (context) => {
                const presentation = context.presentation;
                const slides = presentation.slides;
                slides.load('items');

                await context.sync();

                totalSlides = slides.items.length;
                console.log(`📊 Total slides: ${totalSlides}`);

                // Update each slide preview
                for (let i = 0; i < Math.min(9, totalSlides); i++) {
                    const slide = slides.items[i];
                    await updateSlidePreview(i + 1, slide, context);
                }

                await context.sync();

                // Update selected slide
                if (totalSlides > 0) {
                    updateSelectedSlide(1);
                }
            });

            console.log('✅ Slide grid loaded successfully');
        } catch (error) {
            console.error('❌ Error loading slide grid:', error);
        }
    }

    // Update slide preview
    async function updateSlidePreview(slideNumber, slide, context) {
        try {
            const slideItem = document.querySelector(`.diapositiva-item[data-slide="${slideNumber}"]`);
            const previewImg = slideItem?.querySelector('.preview-slide');

            if (!slideItem || !previewImg) return;

            // Load slide shapes to check if it has content
            slide.load('shapes');
            await context.sync();

            // For now, we'll show a placeholder
            // In a full implementation, you would generate a thumbnail
            if (slide.shapes.items.length > 0) {
                // Slide has content - show placeholder with indicator
                previewImg.style.display = 'none';
                slideItem.style.backgroundColor = '#1a1a1a';
            } else {
                // Empty slide
                previewImg.style.display = 'none';
                slideItem.style.backgroundColor = '#0d0d0d';
            }

        } catch (error) {
            console.error(`❌ Error updating preview for slide ${slideNumber}:`, error);
        }
    }

    // Refresh grid
    async function refreshGrid() {
        console.log('🔄 Refreshing slide grid...');
        await loadSlideGrid();
    }

    // Start auto-refresh
    function startAutoRefresh(intervalMs = 5000) {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        updateInterval = setInterval(refreshGrid, intervalMs);
        console.log(`🔄 Auto-refresh started (${intervalMs}ms)`);
    }

    // Stop auto-refresh
    function stopAutoRefresh() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
            console.log('⏹️ Auto-refresh stopped');
        }
    }

    // Get current slide
    function getCurrentSlide() {
        return currentSlideIndex;
    }

    // Get total slides
    function getTotalSlides() {
        return totalSlides;
    }

    // Public API
    return {
        init,
        refreshGrid,
        startAutoRefresh,
        stopAutoRefresh,
        goToSlide,
        getCurrentSlide,
        getTotalSlides
    };
})();
