/**
 * Data Service Layer
 * Encapsulates game and emulator dataset access and caching.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    let _games = null;
    let _emulators = null;
    let _isInitialized = false;

    window.App.DataService = {
        /**
         * Initialize data from global memory bundle or fetch fallbacks
         */
        async init() {
            if (_isInitialized) return;

            // 1. Resolve Games Data
            if (Array.isArray(window.GAMES_DATA) && window.GAMES_DATA.length > 0) {
                _games = window.GAMES_DATA;
            } else {
                try {
                    const res = await fetch(window.App.Config.DATA_PATHS.GAMES);
                    _games = await res.json();
                    window.GAMES_DATA = _games;
                } catch (err) {
                    console.warn('[DataService] Fallback fetch for games.json failed:', err);
                    _games = [];
                }
            }

            // 2. Resolve Emulators Data
            if (Array.isArray(window.EMULATORS_DATA) && window.EMULATORS_DATA.length > 0) {
                _emulators = window.EMULATORS_DATA;
            } else {
                try {
                    const res = await fetch(window.App.Config.DATA_PATHS.EMULATORS);
                    _emulators = await res.json();
                    window.EMULATORS_DATA = _emulators;
                } catch (err) {
                    console.warn('[DataService] Fallback fetch for emulators.json failed:', err);
                    _emulators = [];
                }
            }

            _isInitialized = true;
        },

        getGames() {
            return _games || [];
        },

        getEmulators() {
            return _emulators || [];
        },

        getGameById(id) {
            if (!_games) return null;
            return _games.find(g => String(g.id) === String(id)) || null;
        },

        getEmulatorByCode(code) {
            if (!_emulators || !code) return null;
            const search = code.toLowerCase();
            return _emulators.find(e => 
                (e.code && e.code.toLowerCase() === search) || 
                (e.id && e.id.toLowerCase() === search)
            ) || null;
        }
    };
})(window);

