// ============================================================
// RECOLECTOR.JS - Ventana Flotante del Recolector
// ============================================================

(function () {
    'use strict';

    const STORAGE_KEY = 'superProduccion_recolectorState';
    let currentTab = 'personajes';
    let personajes = [];
    let fondos = [];

    // Initialize
    function init() {
        console.log('🎭 Initializing Recolector Window...');

        setupTabs();
        setupDragAndDrop();
        setupStorageListener();
        loadStateFromStorage();

        // Sync with main window every second
        setInterval(syncWithMainWindow, 1000);

        console.log('✅ Recolector initialized');
    }

    // Setup tabs
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-superior');
        const tabViews = document.querySelectorAll('.vista-tab');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                currentTab = tabName;

                // Update active tab button
                tabButtons.forEach(b => b.classList.remove('activo'));
                btn.classList.add('activo');

                // Update active tab view
                tabViews.forEach(v => v.classList.remove('activo'));
                const targetView = document.getElementById(`vista-${tabName}`);
                if (targetView) {
                    targetView.classList.add('activo');
                }

                console.log(`📍 Switched to tab: ${tabName}`);
            });
        });
    }

    // Setup drag and drop
    function setupDragAndDrop() {
        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach(zone => {
            // Drag start
            zone.addEventListener('dragstart', handleDragStart);

            // Drag over
            zone.addEventListener('dragover', handleDragOver);

            // Drop
            zone.addEventListener('drop', handleDrop);

            // Drag end
            zone.addEventListener('dragend', handleDragEnd);
        });

        // Trash bins
        const trashPersonajes = document.querySelector('.item-basura-personajes');
        const trashFondos = document.querySelector('.item-basura-fondos');

        if (trashPersonajes) {
            trashPersonajes.addEventListener('click', () => clearAll('personajes'));
        }

        if (trashFondos) {
            trashFondos.addEventListener('click', () => clearAll('fondos'));
        }
    }

    // Handle drag start
    function handleDragStart(e) {
        e.currentTarget.classList.add('dragging');
        const slot = e.currentTarget.getAttribute('data-slot');
        const img = e.currentTarget.querySelector('img');

        if (img) {
            e.dataTransfer.setData('text/plain', img.src);
            e.dataTransfer.setData('slot', slot);
        }
    }

    // Handle drag over
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    // Handle drop
    function handleDrop(e) {
        e.preventDefault();

        const slot = e.currentTarget.getAttribute('data-slot');
        if (!slot) return;

        // Get image from drop
        let imageData = null;

        // Check for file drop
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addImage(currentTab, parseInt(slot), event.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
        // Check for URL drop
        else if (e.dataTransfer.getData('text/plain')) {
            imageData = e.dataTransfer.getData('text/plain');
            addImage(currentTab, parseInt(slot), imageData);
        }
    }

    // Handle drag end
    function handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
    }

    // Add image
    function addImage(type, slot, imageData) {
        const array = type === 'personajes' ? personajes : fondos;

        // Update array
        array[slot] = imageData;

        // Update display
        updateGridDisplay(type);

        // Save to storage
        saveStateToStorage();

        console.log(`✅ Image added to ${type} slot ${slot}`);
    }

    // Update grid display
    function updateGridDisplay(type) {
        const array = type === 'personajes' ? personajes : fondos;
        const viewId = `vista-${type}`;
        const view = document.getElementById(viewId);

        if (!view) return;

        const items = view.querySelectorAll('.item-grid[data-slot]');

        items.forEach(item => {
            const slot = parseInt(item.getAttribute('data-slot'));
            const imageData = array[slot];

            // Remove existing image
            const existingImg = item.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }

            // Add new image if exists
            if (imageData) {
                const img = document.createElement('img');
                img.src = imageData;
                img.alt = `${type} ${slot}`;
                item.textContent = '';
                item.appendChild(img);
            } else {
                item.textContent = '+';
            }
        });
    }

    // Clear all
    function clearAll(type) {
        if (confirm(`¿Eliminar todos los ${type}?`)) {
            if (type === 'personajes') {
                personajes = [];
            } else {
                fondos = [];
            }

            updateGridDisplay(type);
            saveStateToStorage();

            console.log(`🗑️ Cleared all ${type}`);
        }
    }

    // Setup storage listener
    function setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === STORAGE_KEY) {
                loadStateFromStorage();
            }
        });
    }

    // Load state from storage
    function loadStateFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const state = JSON.parse(stored);

                if (state.personajes) {
                    personajes = state.personajes;
                    updateGridDisplay('personajes');
                }

                if (state.fondos) {
                    fondos = state.fondos;
                    updateGridDisplay('fondos');
                }

                console.log('📥 State loaded from storage');
            }
        } catch (error) {
            console.error('❌ Error loading state:', error);
        }
    }

    // Save state to storage
    function saveStateToStorage() {
        try {
            const state = {
                personajes: personajes,
                fondos: fondos,
                timestamp: Date.now()
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            console.log('💾 State saved to storage');
        } catch (error) {
            console.error('❌ Error saving state:', error);
        }
    }

    // Sync with main window
    function syncWithMainWindow() {
        // This function runs periodically to ensure sync
        // The actual sync happens via localStorage events
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
