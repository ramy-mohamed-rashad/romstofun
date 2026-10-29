/**
 * Core Utilities & Helper Functions
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    const HTML_ESCAPE_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    window.App.Utils = {
        /**
         * Escape HTML to prevent XSS
         */
        escapeHtml(str) {
            if (str == null) return '';
            return String(str).replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char]);
        },

        /**
         * Format numeric values with commas
         */
        formatNumber(num) {
            return Number(num || 0).toLocaleString();
        },

        /**
         * Sanitize release year strings
         */
        sanitizeYear(year) {
            if (!year) return '';
            return String(year).replace('.0', '').trim();
        },

        /**
         * Debounce function for smooth search input handling
         */
        debounce(func, wait = 150) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        /**
         * Get query parameters as an object
         */
        getQueryParams() {
            return new URLSearchParams(window.location.search);
        }
    };
})(window);
