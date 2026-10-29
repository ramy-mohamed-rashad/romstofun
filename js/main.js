/**
 * romstofun - Static Retro Gaming Hub
 * Lightweight Progressive Enhancement Controller (100% Static DOM, Zero JSON runtime dependencies)
 */
(function() {
    'use strict';

    // ==========================================
    // 1. Mobile Navigation & Drawer
    // ==========================================
    function initNavigation() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mobileNav = document.getElementById('mobile-nav') || document.querySelector('.main-nav');

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

            // Reactive requirement: Hide popular emulators showcase if any filter is active
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

            // Filter all pre-rendered cards
            const matchedCards = [];
            gameCards.forEach(card => {
                const cardEmu = (card.getAttribute('data-emulator') || '').toLowerCase();
                const cardGenre = (card.getAttribute('data-genre') || '').toLowerCase();
                const cardColl = (card.getAttribute('data-collection') || '').toLowerCase();
                const isFeatured = card.getAttribute('data-featured') === 'true';

                if (!isFiltering) {
                    // Default state: display the top 12 featured cards
                    if (isFeatured) {
                        card.style.display = '';
                        matchedCards.push(card);
                    } else {
                        card.style.display = 'none';
                    }
                    return;
                }

                const emuMatch = (selectedEmu === 'all' || cardEmu === selectedEmu);
                let collMatch = true;
                if (selectedColl !== 'all') {
                    collMatch = cardColl.includes(selectedColl) || cardGenre.includes(selectedColl);
                }

                if (emuMatch && collMatch) {
                    card.style.display = '';
                    matchedCards.push(card);
                } else {
                    card.style.display = 'none';
                }
            });

            // Apply sorting by re-appending DOM nodes
            if (selectedSort === 'rating') {
                matchedCards.sort((a, b) => {
                    const rA = parseFloat(a.getAttribute('data-rating')) || 0;
                    const rB = parseFloat(b.getAttribute('data-rating')) || 0;
                    return rB - rA;
                });
                matchedCards.forEach(c => landingGamesContainer.appendChild(c));
            } else if (selectedSort === 'loves') {
                matchedCards.sort((a, b) => {
                    const lA = parseInt(a.getAttribute('data-loves')) || 0;
                    const lB = parseInt(b.getAttribute('data-loves')) || 0;
                    return lB - lA;
                });
                matchedCards.forEach(c => landingGamesContainer.appendChild(c));
            }

            // Manage empty state
            let emptyMsg = document.getElementById('home-no-results');
            if (matchedCards.length === 0) {
                if (!emptyMsg) {
                    emptyMsg = document.createElement('div');
                    emptyMsg.id = 'home-no-results';
                    emptyMsg.style.gridColumn = '1 / -1';
                    emptyMsg.style.textAlign = 'center';
                    emptyMsg.style.padding = '3.5rem 1rem';
                    emptyMsg.style.color = '#64748b';
                    emptyMsg.innerHTML = '<h3 style="margin-bottom:0.5rem;color:#0f172a;font-size:1.3rem;">No games match your selected filters</h3><p style="margin-bottom:1rem;">Try clearing dropdowns or explore our entire 80-game directory.</p><button type="button" id="home-reset-btn" class="btn-primary" style="cursor:pointer;display:inline-block;">Reset All Filters</button>';
                    landingGamesContainer.appendChild(emptyMsg);
                    document.getElementById('home-reset-btn').addEventListener('click', () => {
                        filterSelects.forEach(s => s.selectedIndex = 0);
                        applyHomeFilters();
                    });
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
        const btnClearSearch = document.getElementById('btn-clear-search');
        const visibleCountEl = document.getElementById('visible-games-count');
        const totalCountEl = document.getElementById('total-games-count');
        const gameCards = Array.from(gamesGrid.querySelectorAll('.game-card'));

        // Genre Banner Elements
        const genreBanner = document.getElementById('active-genre-banner');
        const genreBannerTitle = document.getElementById('genre-banner-title');
        const genreBannerSubtitle = document.getElementById('genre-banner-subtitle');
        const genreBannerIcon = document.getElementById('genre-banner-icon');
        const resetGenreBtn = document.getElementById('reset-genre-btn');

        const genreIcons = {
            'action': '⚔️',
            'adventure': '🗺️',
            'classic': '🕹️',
            'platform': '🍄',
            'fighting': '🥊',
            'sports': '⚽',
            'racing': '🏎️',
            'shooter': '🎯',
            'rpg': '🛡️',
            'horror': '🧟'
        };

        const knownEmulators = ['ps2', 'psp', 'ps3', 'psx', 'gba', 'nes', '3ds', 'n64', 'nds', 'snes', 'wii', 'sg'];

        // Parse initial URL query params or hash
        const urlParams = new URLSearchParams(window.location.search);
        const collectionGenres = ['action', 'adventure', 'classic', 'platform', 'fighting', 'sports', 'racing', 'shooter', 'rpg', 'horror'];
        const urlGenre = (urlParams.get('genre') || urlParams.get('collection') || '').toLowerCase();
        
        // Canonical SEO Redirection: If user/crawler hits legacy ?genre=, forward directly to dedicated static page
        if (urlGenre && collectionGenres.includes(urlGenre)) {
            window.location.replace(`collections/${urlGenre}.html`);
            return;
        }

        let activeEmulator = (urlParams.get('emulator') || '').toLowerCase();
        let activeGenre = urlGenre;

        // Handle URL Hash (e.g., #ps2, #genre-fighting, #action)
        const hash = (window.location.hash || '').replace('#', '').toLowerCase();
        if (hash) {
            const cleanHash = hash.replace('genre-', '');
            if (knownEmulators.includes(cleanHash)) {
                activeEmulator = cleanHash;
            } else {
                activeGenre = cleanHash;
            }
        }

        if (totalCountEl) {
            totalCountEl.textContent = gameCards.length;
        }

        function updateGenreBanner(matchCount) {
            if (!genreBanner) return;
            if (activeGenre && activeGenre !== 'all') {
                genreBanner.style.display = 'flex';
                const prettyTitle = activeGenre.charAt(0).toUpperCase() + activeGenre.slice(1);
                if (genreBannerTitle) genreBannerTitle.textContent = `${prettyTitle} Collection`;
                if (genreBannerSubtitle) genreBannerSubtitle.textContent = `Showing ${matchCount} verified ${prettyTitle} titles across platforms`;
                if (genreBannerIcon) genreBannerIcon.textContent = genreIcons[activeGenre] || '🎮';
            } else {
                genreBanner.style.display = 'none';
            }
        }

        function filterGames() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            let visibleCount = 0;

            gameCards.forEach(card => {
                const cardEmu = (card.getAttribute('data-emulator') || '').toLowerCase();
                const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
                const cardGenre = (card.getAttribute('data-genre') || '').toLowerCase();
                const cardColl = (card.getAttribute('data-collection') || '').toLowerCase();

                const emuMatch = (!activeEmulator || activeEmulator === 'all' || cardEmu === activeEmulator);
                
                let genreMatch = true;
                if (activeGenre && activeGenre !== 'all') {
                    genreMatch = cardColl.includes(activeGenre) || cardGenre.includes(activeGenre);
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

            updateGenreBanner(visibleCount);

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
                            resetAllFilters();
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
            activeEmulator = (!filterName || filterName === 'all') ? '' : filterName.toLowerCase();
            pillItems.forEach(pill => {
                const f = (pill.getAttribute('data-filter') || '').toLowerCase();
                const isMatch = (!activeEmulator && f === 'all') || (f === activeEmulator);
                pill.classList.toggle('active', isMatch);
            });
        }

        function resetAllFilters() {
            activeEmulator = '';
            activeGenre = '';
            setActivePill('all');
            if (searchInput) searchInput.value = '';
            if (searchClear) searchClear.style.display = 'none';
            if (window.history.pushState) {
                window.history.pushState(null, '', window.location.pathname);
            }
            filterGames();
        }

        if (resetGenreBtn) {
            resetGenreBtn.addEventListener('click', resetAllFilters);
        }

        // Initialize active pill from URL
        setActivePill(activeEmulator || 'all');

        // Click listeners on platform pills
        pillItems.forEach(pill => {
            pill.addEventListener('click', function(e) {
                e.preventDefault();
                const targetFilter = (pill.getAttribute('data-filter') || 'all').toLowerCase();
                setActivePill(targetFilter);

                // Update hash without triggering reload
                if (window.history.pushState) {
                    const newHash = (!activeEmulator) ? '' : `#${activeEmulator}`;
                    window.history.pushState(null, '', window.location.pathname + newHash);
                }

                filterGames();
            });
        });

        // Search input handling
        function doClearSearch() {
            if (searchInput) {
                searchInput.value = '';
                if (searchClear) searchClear.style.display = 'none';
                filterGames();
                searchInput.focus();
            }
        }

        if (searchInput) {
            let timer = null;
            searchInput.addEventListener('input', function() {
                clearTimeout(timer);
                if (searchClear) {
                    searchClear.style.display = searchInput.value ? 'block' : 'none';
                }
                timer = setTimeout(filterGames, 100);
            });
        }

        if (searchClear) searchClear.addEventListener('click', doClearSearch);
        if (btnClearSearch) btnClearSearch.addEventListener('click', doClearSearch);

        // Popstate handler for browser back/forward buttons
        window.addEventListener('popstate', function() {
            const p = new URLSearchParams(window.location.search);
            const h = (window.location.hash || '').replace('#', '').toLowerCase();
            activeEmulator = (p.get('emulator') || '').toLowerCase();
            activeGenre = (p.get('genre') || p.get('collection') || '').toLowerCase();
            if (h) {
                const ch = h.replace('genre-', '');
                if (knownEmulators.includes(ch)) activeEmulator = ch;
                else activeGenre = ch;
            }
            setActivePill(activeEmulator || 'all');
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
                timer = setTimeout(filterBlogCards, 100);
            });
        }
    }

    // ==========================================
    // 5. Dedicated Collection Pages (Live Search)
    // ==========================================
    function initCollectionPage() {
        const collectionGrid = document.getElementById('collection-games-grid');
        const searchInput = document.getElementById('collection-search-input');
        const visibleCountEl = document.getElementById('visible-collection-count');
        if (!collectionGrid) return;

        const cards = Array.from(collectionGrid.querySelectorAll('.game-card'));

        function filterCollectionCards() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            let visibleCount = 0;

            cards.forEach(card => {
                const title = (card.getAttribute('data-title') || '').toLowerCase();
                const emu = (card.getAttribute('data-emulator') || '').toLowerCase();
                const genre = (card.getAttribute('data-genre') || '').toLowerCase();

                const isMatch = !query || title.includes(query) || emu.includes(query) || genre.includes(query);

                if (isMatch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (visibleCountEl) {
                visibleCountEl.textContent = visibleCount;
            }

            let noResults = document.getElementById('collection-no-results');
            if (visibleCount === 0) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.id = 'collection-no-results';
                    noResults.style.gridColumn = '1 / -1';
                    noResults.style.textAlign = 'center';
                    noResults.style.padding = '3.5rem 1rem';
                    noResults.style.color = '#64748b';
                    noResults.innerHTML = `
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
                        <h3 style="font-size: 1.25rem; color: #0f172a; margin-bottom: 0.5rem;">No games found in this collection</h3>
                        <p style="margin-bottom: 1.25rem;">Try another search term or clear the search field.</p>
                        <button type="button" id="clear-collection-search" class="btn-primary" style="display: inline-block; cursor: pointer;">Clear Search</button>
                    `;
                    collectionGrid.appendChild(noResults);

                    const clearBtn = document.getElementById('clear-collection-search');
                    if (clearBtn) {
                        clearBtn.addEventListener('click', () => {
                            if (searchInput) {
                                searchInput.value = '';
                                filterCollectionCards();
                                searchInput.focus();
                            }
                        });
                    }
                } else {
                    noResults.style.display = 'block';
                }
            } else if (noResults) {
                noResults.style.display = 'none';
            }
        }

        if (searchInput) {
            let timer = null;
            searchInput.addEventListener('input', function() {
                clearTimeout(timer);
                timer = setTimeout(filterCollectionCards, 100);
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
        initCollectionPage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
