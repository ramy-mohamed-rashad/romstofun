/**
 * Navigation Component Controller
 * Handles mobile hamburger drawer, keyboard accessibility, and overlay interactions.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.Navigation = {
        init() {
            const hamburgerBtn = document.querySelector('.hamburger-btn');
            const mobileNav = document.getElementById('mobile-nav');

            if (!hamburgerBtn || !mobileNav) return;

            hamburgerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = mobileNav.classList.toggle('is-active');
                hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (mobileNav.classList.contains('is-active') && !mobileNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                    mobileNav.classList.remove('is-active');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Close mobile menu on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileNav.classList.contains('is-active')) {
                    mobileNav.classList.remove('is-active');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    };
})(window);

