// ============================================================
// TAB-NAVIGATION.JS - Tab Navigation Manager
// Handles navigation between tabs and sections
// ============================================================

const TabNavigation = (function () {
    'use strict';

    let currentLeftTab = 'personajes';
    let currentRightSection = 0; // 0: Temática, 1: Texto, 2: Colores, 3: Presets

    // Initialize tab navigation
    function init() {
        console.log('🔄 Initializing Tab Navigation...');

        // Initialize left panel tabs
        initLeftPanelTabs();

        // Initialize right panel navigation
        initRightPanelNavigation();

        // Set initial states
        showLeftTab('personajes');
        showRightSection(0);

        console.log('✅ Tab Navigation initialized');
    }

    // Initialize left panel tabs (Personajes/Fondos)
    function initLeftPanelTabs() {
        const tabButtons = document.querySelectorAll('.left-tab-btn');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                showLeftTab(tabName);
            });
        });
    }

    // Show specific left panel tab
    function showLeftTab(tabName) {
        currentLeftTab = tabName;

        // Update tab buttons
        const tabButtons = document.querySelectorAll('.left-tab-btn');
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update tab content
        const tabContents = document.querySelectorAll('.left-tab-content');
        tabContents.forEach(content => {
            if (content.dataset.tab === tabName) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        console.log(`📑 Switched to left tab: ${tabName}`);
    }

    // Initialize right panel navigation
    function initRightPanelNavigation() {
        const navDots = document.querySelectorAll('.right-nav-dot');

        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showRightSection(index);
            });
        });
    }

    // Show specific right panel section
    function showRightSection(sectionIndex) {
        currentRightSection = sectionIndex;

        // Update navigation dots
        const navDots = document.querySelectorAll('.right-nav-dot');
        navDots.forEach((dot, index) => {
            if (index === sectionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update section content
        const sections = document.querySelectorAll('.right-section');
        sections.forEach((section, index) => {
            if (index === sectionIndex) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        const sectionNames = ['Temática', 'Texto', 'Colores', 'Presets'];
        console.log(`📑 Switched to right section: ${sectionNames[sectionIndex]}`);
    }

    // Get current states
    function getCurrentLeftTab() {
        return currentLeftTab;
    }

    function getCurrentRightSection() {
        return currentRightSection;
    }

    // Public API
    return {
        init,
        showLeftTab,
        showRightSection,
        getCurrentLeftTab,
        getCurrentRightSection
    };
})();
