/**
 * Application Bootstrap & Lifecycle Orchestrator
 * Clean Architecture entry point coordinating services, UI components, and active views.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.init = async function() {
        try {
            // 1. Initialize data layer (memory bundle or fetch)
            if (window.App.DataService) {
                await window.App.DataService.init();
            }

            // 2. Global UI components
            if (window.App.Navigation) {
                window.App.Navigation.init();
            }

            // 3. Page-specific controllers (detect active view containers)
            if (window.App.HomePage) {
                window.App.HomePage.init();
            }

            if (window.App.GamesPage) {
                window.App.GamesPage.init();
            }

            if (window.App.BlogPage) {
                window.App.BlogPage.init();
            }

            if (window.App.BlogDetailPage) {
                window.App.BlogDetailPage.init();
            }
        } catch (err) {
            console.error('[App] Initialization error:', err);
        }
    };

    // Hydrate upon DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.App.init);
    } else {
        window.App.init();
    }
})(window);
