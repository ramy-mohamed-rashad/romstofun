/**
 * Application Configuration
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.Config = Object.freeze({
        APP_STORE_URL: 'https://play.google.com/store/search?q=agames&c=apps&fpr=false',
        DEFAULT_PAGE_SIZE: 24,
        LANDING_GAMES_LIMIT: 12,
        ANIMATION_STAGGER_MAX: 12,
        TRANSITION_DURATION_MS: 120,
        DATA_PATHS: {
            GAMES: 'assets/data/games.json',
            EMULATORS: 'assets/data/emulators.json'
        }
    });
})(window);
