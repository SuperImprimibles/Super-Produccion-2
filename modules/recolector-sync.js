// ============================================================
// RECOLECTOR SYNC - Sincronización con Ventana del Recolector
// ============================================================

const RecolectorSync = (function () {
    'use strict';

    const STORAGE_KEY = 'superProduccion_recolectorState';
    let recolectorWindow = null;
    let syncInterval = null;

    // Initialize
    function init() {
        console.log('🔄 Initializing Recolector Sync...');
        setupStorageListener();
        setupRecolectorButton();
    }

    // Setup storage listener for sync
    function setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === STORAGE_KEY) {
                handleRecolectorUpdate(event.newValue);
            }
        });
    }

    // Setup recolector button
    function setupRecolectorButton() {
        const btnRecolector = document.getElementById('btn-recolector');
        if (btnRecolector) {
            btnRecolector.addEventListener('click', openRecolector);
        }
    }

    // Open recolector window
    function openRecolector() {
        const width = 400;
        const height = 600;
        const left = window.screen.width - width - 20;
        const top = 100;

        const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

        // Close existing window if open
        if (recolectorWindow && !recolectorWindow.closed) {
            recolectorWindow.focus();
            return;
        }

        // Open new window
        recolectorWindow = window.open('recolector.html', 'Recolector', features);

        if (recolectorWindow) {
            console.log('✅ Recolector window opened');
            startSync();

            // Send current state to recolector
            setTimeout(() => {
                syncStateToRecolector();
            }, 500);
        } else {
            console.error('❌ Failed to open Recolector window. Check popup blocker.');
            alert('No se pudo abrir la ventana del Recolector. Por favor, permite ventanas emergentes para este sitio.');
        }
    }

    // Handle recolector update from storage
    function handleRecolectorUpdate(newValue) {
        if (!newValue) return;

        try {
            const recolectorState = JSON.parse(newValue);
            console.log('📥 Received update from Recolector:', recolectorState);

            // Update main window state
            if (recolectorState.personajes) {
                StateManager.setState({ personajes: recolectorState.personajes });
                DragDropHandler.updateGridDisplay('personajes');
            }

            if (recolectorState.fondos) {
                StateManager.setState({ fondos: recolectorState.fondos });
                DragDropHandler.updateGridDisplay('fondos');
            }

        } catch (error) {
            console.error('❌ Error parsing recolector state:', error);
        }
    }

    // Sync state to recolector
    function syncStateToRecolector() {
        const currentState = StateManager.getState();
        const recolectorState = {
            personajes: currentState.personajes || [],
            fondos: currentState.fondos || [],
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recolectorState));
            console.log('📤 State synced to Recolector');
        } catch (error) {
            console.error('❌ Error syncing to Recolector:', error);
        }
    }

    // Start periodic sync
    function startSync() {
        if (syncInterval) {
            clearInterval(syncInterval);
        }

        syncInterval = setInterval(() => {
            if (recolectorWindow && !recolectorWindow.closed) {
                syncStateToRecolector();
            } else {
                stopSync();
            }
        }, 1000);

        console.log('🔄 Periodic sync started');
    }

    // Stop sync
    function stopSync() {
        if (syncInterval) {
            clearInterval(syncInterval);
            syncInterval = null;
            console.log('⏹️ Periodic sync stopped');
        }
    }

    // Check if recolector is open
    function isRecolectorOpen() {
        return recolectorWindow && !recolectorWindow.closed;
    }

    // Close recolector
    function closeRecolector() {
        if (recolectorWindow && !recolectorWindow.closed) {
            recolectorWindow.close();
            recolectorWindow = null;
            stopSync();
            console.log('✅ Recolector window closed');
        }
    }

    // Public API
    return {
        init,
        openRecolector,
        closeRecolector,
        isRecolectorOpen,
        syncStateToRecolector
    };
})();
