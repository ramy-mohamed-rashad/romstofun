/**
 * romstofun - Static Retro Gaming Hub
 * Lightweight Progressive Enhancement Controller (100% Static DOM, Zero JSON runtime dependencies)
 */
(function() {
    'use strict';

    // ==========================================
    // 1. Mobile Navigation & Accessibility
    // ==========================================
    function initNavigation() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mobileNav = document.getElementById('mobile-nav') || document.getElementById('main-nav');

        if (!hamburgerBtn || !mobileNav) return;

        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = mobileNav.classList.toggle('is-active');
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        });

        // Close mobile drawer on outside click
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('is-active') && !mobileNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                mobileNav.classList.remove('is-active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-active')) {
                mobileNav.classList.remove('is-active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==========================================
    // 2. Home Page Interactive Filters
    // ==========================================
    function initHomePage() {
        const landingGamesContainer = document.getElementById('games-container');
        const filterSelects = document.querySelectorAll('.filter-dropdown');
        if (!landingGamesContainer || filterSelects.length === 0) return;

        const emuSelect = document.getElementById('emulator-select');
        const collSelect = document.getElementById('collection-select');
        const typeSelect = document.getElementById('type-select');
        const activeFiltersDisplay = document.getElementById('active-filters-display');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        const popularEmulatorsSection = document.getElementById('popular-emulators-section');

        const gameCards = Array.from(landingGamesContainer.querySelectorAll('.game-card'));

        function applyHomeFilters() {
            const selectedEmu = emuSelect ? emuSelect.value.toLowerCase() : 'all';
            const selectedColl = collSelect ? collSelect.value.toLowerCase() : 'all';
            const selectedSort = typeSelect ? typeSelect.value : 'all';

            const isFiltering = (selectedEmu !== 'all' || selectedColl !== 'all' || selectedSort !== 'all');

            // Requirement: If filter is selected with value instead of all, hide popular emulators section
            if (popularEmulatorsSection) {
                popularEmulatorsSection.style.display = isFiltering ? 'none' : '';
            }

            // Update active filter badge display
            const activeFilterLabels = [];
            if (selectedEmu !== 'all' && emuSelect) activeFilterLabels.push(emuSelect.options[emuSelect.selectedIndex].text);
            if (selectedColl !== 'all' && collSelect) activeFilterLabels.push(collSelect.options[collSelect.selectedIndex].text);
            if (selectedSort !== 'all' && typeSelect) activeFilterLabels.push(typeSelect.options[typeSelect.selectedIndex].text);

            if (activeFiltersDisplay) {
                activeFiltersDisplay.textContent = isFiltering ? activeFilterLabels.join(', ') : 'None';
                activeFiltersDisplay.style.color = isFiltering ? '#e11d48' : '';
            }
            if (clearFiltersBtn) {
                clearFiltersBtn.style.display = isFiltering ? 'inline-block' : 'none';
            }

            // Filter pre-rendered cards in DOM
            let matchCount = 0;
            gameCards.forEach(card => {
                const cardEmu = (card.getAttribute('data-emulator') || '').toLowerCase();
                const cardGenre = (card.getAttribute('data-genre') || '').toLowerCase();
                const cardColl = (card.getAttribute('data-collection') || '').toLowerCase();

                const emuMatch = (selectedEmu === 'all' || cardEmu === selectedEmu);
                let collMatch = true;

                if (selectedColl !== 'all') {
                    if (selectedColl === 'fighting') {
                        collMatch = cardGenre.includes('fight') || cardGenre.includes('battle') || cardGenre.includes('wrestl');
                    } else if (selectedColl === 'sports') {
                        collMatch = cardGenre.includes('sport') || cardGenre.includes('soccer') || cardGenre.includes('football');
                    } else if (selectedColl === 'racing') {
                        collMatch = cardGenre.includes('racing') || cardGenre.includes('driving');
                    } else if (selectedColl === 'platform') {
                        collMatch = cardGenre.includes('platform');
                    } else if (selectedColl === 'rpg') {
                        collMatch = cardGenre.includes('rpg') || cardGenre.includes('role');
                    } else if (selectedColl === 'shooter') {
                        collMatch = cardGenre.includes('shooter') || cardGenre.includes('shoot');
                    } else if (selectedColl === 'horror') {
                        collMatch = cardGenre.includes('horror') || cardGenre.includes('survival');
                    } else if (selectedColl === 'popular') {
                        collMatch = cardColl === 'popular';
                    } else {
                        collMatch = cardGenre.includes(selectedColl) || cardColl.includes(selectedColl);
                    }
                }

                if (emuMatch && collMatch) {
                    card.style.display = '';
                    matchCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Handle empty state message
            let emptyMsg = document.getElementById('home-no-results');
            if (matchCount === 0) {
                if (!emptyMsg) {
                    emptyMsg = document.createElement('div');
                    emptyMsg.id = 'home-no-results';
                    emptyMsg.style.gridColumn = '1 / -1';
                    emptyMsg.style.textAlign = 'center';
                    emptyMsg.style.padding = '3rem 1rem';
                    emptyMsg.style.color = '#64748b';
                    emptyMsg.innerHTML = '<h3 style="margin-bottom:0.5rem;color:#0f172a;">No games match your selected filters</h3><p>Try resetting filters or <a href="games.html" style="color:#e11d48;font-weight:700;">explore all 80 games &rarr;</a></p>';
                    landingGamesContainer.appendChild(emptyMsg);
                } else {
                    emptyMsg.style.display = 'block';
                }
            } else if (emptyMsg) {
                emptyMsg.style.display = 'none';
            }
        }

        filterSelects.forEach(sel => sel.addEventListener('change', applyHomeFilters));

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                filterSelects.forEach(s => s.selectedIndex = 0);
                applyHomeFilters();
            });
        }
    }

    // ==========================================
    // 3. Games Page (DOM Filtering & Live Search)
    // ==========================================
    function initGamesPage() {
        const gamesGrid = document.getElementById('all-games-grid');
        if (!gamesGrid) return;

        const pillItems = Array.from(document.querySelectorAll('#emulator-pills .pill-item'));
        const searchInput = document.getElementById('game-search-input');
        const searchClear = document.getElementById('active-search-clear');
        const visibleCountEl = document.getElementById('visible-games-count');
        const gameCards = Array.from(gamesGrid.querySelectorAll('.game-card'));

        // Parse initial URL query params or hash
        const urlParams = new URLSearchParams(window.location.search);
        let activeFilter = (urlParams.get('emulator') || window.location.hash.replace('#', '') || 'all').toLowerCase();
        let activeGenre = (urlParams.get('genre') || urlParams.get('collection') || '').toLowerCase();

        function filterGames() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            let visibleCount = 0;

            gameCards.forEach(card => {
                const cardEmu = (card.getAttribute('data-emulator') || '').toLowerCase();
                const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
                const cardGenre = (card.getAttribute('data-genre') || '').toLowerCase();

                const emuMatch = (activeFilter === 'all' || activeFilter === '' || cardEmu === activeFilter);
                let genreMatch = true;
                if (activeGenre) {
                    genreMatch = cardGenre.includes(activeGenre);
                }

                const queryMatch = !query || cardTitle.includes(query) || cardGenre.includes(query) || cardEmu.includes(query);

                if (emuMatch && genreMatch && queryMatch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (visibleCountEl) {
                visibleCountEl.textContent = visibleCount;
            }

            // Manage empty state
            let noResults = document.getElementById('games-no-results');
            if (visibleCount === 0) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.id = 'games-no-results';
                    noResults.style.gridColumn = '1 / -1';
                    noResults.style.textAlign = 'center';
                    noResults.style.padding = '4rem 1rem';
                    noResults.style.color = '#64748b';
                    noResults.innerHTML = `
                        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎮</div>
                        <h3 style="font-size: 1.35rem; color: #0f172a; margin-bottom: 0.5rem;">No games found</h3>
                        <p style="margin-bottom: 1.5rem;">We couldn't find any games matching your current search or platform selection.</p>
                        <button type="button" id="reset-games-filter" class="btn-primary" style="display: inline-block; cursor: pointer;">Show All 80 Games</button>
                    `;
                    gamesGrid.appendChild(noResults);

                    const resetBtn = document.getElementById('reset-games-filter');
                    if (resetBtn) {
                        resetBtn.addEventListener('click', () => {
                            setActivePill('all');
                            if (searchInput) searchInput.value = '';
                            if (searchClear) searchClear.style.display = 'none';
                            activeGenre = '';
                            filterGames();
                        });
                    }
                } else {
                    noResults.style.display = 'block';
                }
            } else if (noResults) {
                noResults.style.display = 'none';
            }
        }

        function setActivePill(filterName) {
            activeFilter = filterName.toLowerCase();
            pillItems.forEach(pill => {
                const f = (pill.getAttribute('data-filter') || '').toLowerCase();
                if (f === activeFilter) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        }

        // Initialize active pill from URL
        setActivePill(activeFilter);

        // Click listeners on platform pills
        pillItems.forEach(pill => {
            pill.addEventListener('click', function(e) {
                e.preventDefault();
                const targetFilter = (pill.getAttribute('data-filter') || 'all').toLowerCase();
                setActivePill(targetFilter);
                activeGenre = '';

                // Update hash without triggering reload
                if (window.history.pushState) {
                    const newHash = targetFilter === 'all' ? '' : `#${targetFilter}`;
                    window.history.pushState(null, '', window.location.pathname + newHash);
                }

                filterGames();
            });
        });

        // Search input handling
        if (searchInput) {
            let timer = null;
            searchInput.addEventListener('input', function() {
                clearTimeout(timer);
                if (searchClear) {
                    searchClear.style.display = searchInput.value ? 'block' : 'none';
                }
                timer = setTimeout(filterGames, 120);
            });
        }

        if (searchClear && searchInput) {
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                searchClear.style.display = 'none';
                filterGames();
                searchInput.focus();
            });
        }

        // Popstate handler for browser back/forward buttons
        window.addEventListener('popstate', function() {
            activeFilter = (window.location.hash.replace('#', '') || 'all').toLowerCase();
            setActivePill(activeFilter);
            filterGames();
        });

        // Initial run
        filterGames();
    }

    // ==========================================
    // 4. Blog Directory (DOM Filtering & Live Search)
    // ==========================================
    function initBlogPage() {
        const blogGrid = document.getElementById('blog-posts-grid');
        if (!blogGrid) return;

        const pillItems = Array.from(document.querySelectorAll('#blog-filter-pills .pill-item'));
        const searchInput = document.getElementById('blog-search-input');
        const visibleCountEl = document.getElementById('visible-blog-count');
        const blogCards = Array.from(blogGrid.querySelectorAll('.blog-card'));

        let activeBlogFilter = 'all';

        function filterBlogCards() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            let visibleCount = 0;

            blogCards.forEach(card => {
                const cardEmu = (card.getAttribute('data-emulator') || '').toLowerCase();
                const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
                const cardText = card.textContent.toLowerCase();

                const emuMatch = (activeBlogFilter === 'all' || cardEmu === activeBlogFilter);
                const queryMatch = !query || cardTitle.includes(query) || cardText.includes(query);

                if (emuMatch && queryMatch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (visibleCountEl) {
                visibleCountEl.textContent = visibleCount;
            }
        }

        pillItems.forEach(pill => {
            pill.addEventListener('click', function(e) {
                e.preventDefault();
                activeBlogFilter = (pill.getAttribute('data-blog-filter') || 'all').toLowerCase();
                pillItems.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                filterBlogCards();
            });
        });

        if (searchInput) {
            let timer = null;
            searchInput.addEventListener('input', function() {
                clearTimeout(timer);
                timer = setTimeout(filterBlogCards, 120);
            });
        }
    }

    // ==========================================
    // Lifecycle Dispatcher
    // ==========================================
    function init() {
        initNavigation();
        initHomePage();
        initGamesPage();
        initBlogPage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
