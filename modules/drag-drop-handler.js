// ============================================================
// DRAG AND DROP HANDLER
// Manages drag and drop functionality for images
// ============================================================

const DragDropHandler = {
    draggedElement: null,
    draggedSlot: null,

    // Initialize drag and drop
    init() {
        this.setupDragListeners();
        this.setupFileDropListeners();
        console.log('✅ Drag and drop handler initialized');
    },

    // Setup drag listeners for grid items
    setupDragListeners() {
        const items = document.querySelectorAll('.item-grid[draggable="true"]');

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
            item.addEventListener('dragover', (e) => this.handleDragOver(e));
            item.addEventListener('drop', (e) => this.handleDrop(e));
        });
    },

    // Setup file drop listeners
    setupFileDropListeners() {
        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', async (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    await this.handleFileDrop(files[0], zone);
                }
            });
        });
    },

    // Handle drag start
    handleDragStart(e) {
        this.draggedElement = e.target;
        this.draggedSlot = e.target.dataset.slot;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    },

    // Handle drag end
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
        this.draggedSlot = null;
    },

    // Handle drag over
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    },

    // Handle drop
    handleDrop(e) {
        e.preventDefault();

        if (!this.draggedElement) return;

        const targetSlot = e.currentTarget.dataset.slot;
        const currentTab = StateManager.get('currentTab');

        // Swap images
        if (currentTab === 'personajes') {
            const sourceImg = StateManager.get('personajes')[this.draggedSlot];
            const targetImg = StateManager.get('personajes')[targetSlot];

            StateManager.setPersonaje(this.draggedSlot, targetImg);
            StateManager.setPersonaje(targetSlot, sourceImg);

            this.updateGridDisplay('personajes');
        } else if (currentTab === 'fondos') {
            const sourceImg = StateManager.get('fondos')[this.draggedSlot];
            const targetImg = StateManager.get('fondos')[targetSlot];

            StateManager.setFondo(this.draggedSlot, targetImg);
            StateManager.setFondo(targetSlot, sourceImg);

            this.updateGridDisplay('fondos');
        }
    },

    // Handle file drop
    async handleFileDrop(file, zone) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, arrastra solo imágenes');
            return;
        }

        const slot = zone.dataset.slot;
        const currentTab = StateManager.get('currentTab');

        // Read file as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;

            if (currentTab === 'personajes') {
                StateManager.setPersonaje(slot, imageUrl);
            } else if (currentTab === 'fondos') {
                StateManager.setFondo(slot, imageUrl);
            }

            this.updateGridDisplay(currentTab);
        };
        reader.readAsDataURL(file);
    },

    // Update grid display
    updateGridDisplay(tab) {
        const vista = document.getElementById(`vista-${tab}`);
        if (!vista) return;

        const items = vista.querySelectorAll('.item-grid[data-slot]');
        const data = StateManager.get(tab);

        items.forEach((item, index) => {
            const imageUrl = data[index];

            // Clear existing content
            item.innerHTML = '';

            if (imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                item.appendChild(img);
            } else {
                item.textContent = '+';
            }
        });
    }
};

// Export for use in other modules
window.DragDropHandler = DragDropHandler;
