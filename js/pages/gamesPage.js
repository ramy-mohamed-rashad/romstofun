/**
 * Games Page Controller
 * Manages ROM directory, seamless SPA transitions, live search, and dynamic pagination.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.GamesPage = {
        init() {
            const allGamesGrid = document.getElementById('all-games-grid');
            if (!allGamesGrid) return;

            const games = window.App.DataService.getGames();
            const config = window.App.Config;
            const { debounce } = window.App.Utils;

            const urlParams = new URLSearchParams(window.location.search);
            let activeEmulatorParam = (urlParams.get('emulator') || '').toLowerCase();
            let activeGenreParam = (urlParams.get('genre') || urlParams.get('collection') || '').toLowerCase();

            const emuBanner = document.getElementById('active-emu-banner');
            const emuLogo = document.getElementById('active-emu-logo');
            const emuName = document.getElementById('active-emu-name');
            const emuCount = document.getElementById('active-emu-count');
            const breadcrumbCurrent = document.getElementById('breadcrumb-current');
            const pageTitle = document.getElementById('games-page-title');
            const pageSubtitle = document.getElementById('games-page-subtitle');
            const searchInput = document.getElementById('game-search-input');
            const searchClear = document.getElementById('active-search-clear');
            const btnClearSearch = document.getElementById('btn-clear-search');
            const visibleCountEl = document.getElementById('visible-games-count');
            const totalCountEl = document.getElementById('total-games-count');
            const btnLoadMore = document.getElementById('btn-load-more');
            const loadMoreWrapper = document.getElementById('load-more-wrapper');
            const pillItems = document.querySelectorAll('#emulator-pills .pill-item');

            let currentDisplayLimit = config.DEFAULT_PAGE_SIZE;
            let filteredDataset = [];
            let currentEmuInfo = null;

            function updateUIState() {
                if (activeEmulatorParam && activeEmulatorParam !== 'all') {
                    currentEmuInfo = window.App.DataService.getEmulatorByCode(activeEmulatorParam);
                } else {
                    currentEmuInfo = null;
                }

                // Update active pill styling
                pillItems.forEach(pill => {
                    const pillFilter = (pill.getAttribute('data-filter') || '').toLowerCase();
                    if (activeEmulatorParam && activeEmulatorParam !== 'all') {
                        pill.classList.toggle('active', pillFilter === activeEmulatorParam);
                    } else if (!activeGenreParam && pillFilter === 'all') {
                        pill.classList.add('active');
                    } else {
                        pill.classList.remove('active');
                    }
                });

                // Update Banner and Header Headings
                if (currentEmuInfo) {
                    if (emuBanner) emuBanner.style.display = 'flex';
                    if (emuLogo) emuLogo.src = currentEmuInfo.logo;
                    if (emuName) emuName.textContent = `${currentEmuInfo.name} Games`;
                    if (pageTitle) pageTitle.textContent = `${currentEmuInfo.name} ROMs & Games`;
                    if (breadcrumbCurrent) breadcrumbCurrent.textContent = currentEmuInfo.name;
                } else if (activeGenreParam) {
                    const prettyGenre = activeGenreParam.charAt(0).toUpperCase() + activeGenreParam.slice(1);
                    if (emuBanner) emuBanner.style.display = 'flex';
                    if (emuLogo) emuLogo.src = 'assets/images/emulators/ps2.svg';
                    if (emuName) emuName.textContent = `${prettyGenre} Collection`;
                    if (pageTitle) pageTitle.textContent = `${prettyGenre} Games Collection`;
                    if (pageSubtitle) pageSubtitle.textContent = `Browse games categorized under the ${prettyGenre} genre.`;
                    if (breadcrumbCurrent) breadcrumbCurrent.textContent = `${prettyGenre} Collection`;
                } else {
                    if (emuBanner) emuBanner.style.display = 'none';
                    if (pageTitle) pageTitle.textContent = 'Retro ROMs & Games Library';
                    if (pageSubtitle) pageSubtitle.textContent = `Browse ${games.length} classic games with community ratings, fan loves, and direct companion guide.`;
                    if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Games & ROMs';
                }
            }

            function filterAndRenderGames() {
                const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

                filteredDataset = games.filter(game => {
                    const emuMatch = (!currentEmuInfo) || 
                        (game.emulator && game.emulator.toLowerCase() === currentEmuInfo.code.toLowerCase());

                    let genreMatch = true;
                    if (activeGenreParam) {
                        const gameGenre = (game.genre || '').toLowerCase();
                        if (activeGenreParam === 'fighting') {
                            genreMatch = gameGenre.includes('fighting') || gameGenre.includes('battle') || gameGenre.includes('wrestling');
                        } else if (activeGenreParam === 'sports') {
                            genreMatch = gameGenre.includes('sport') || gameGenre.includes('soccer') || gameGenre.includes('football') || gameGenre.includes('wrestling');
                        } else if (activeGenreParam === 'racing') {
                            genreMatch = gameGenre.includes('racing') || gameGenre.includes('driving') || gameGenre.includes('vehicular');
                        } else if (activeGenreParam === 'platform') {
                            genreMatch = gameGenre.includes('platform');
                        } else if (activeGenreParam === 'rpg' || activeGenreParam === 'role-playing') {
                            genreMatch = gameGenre.includes('role-playing') || gameGenre.includes('rpg');
                        } else if (activeGenreParam === 'shooter') {
                            genreMatch = gameGenre.includes('shooter') || gameGenre.includes('shooting');
                        } else if (activeGenreParam === 'classic') {
                            genreMatch = gameGenre.includes('classic') || gameGenre.includes('compilation') || gameGenre.includes('misc');
                        } else {
                            genreMatch = gameGenre.includes(activeGenreParam);
                        }
                    }

                    let queryMatch = true;
                    if (query) {
                        const titleMatch = (game.title || '').toLowerCase().includes(query);
                        const genreTextMatch = (game.genre || '').toLowerCase().includes(query);
                        queryMatch = titleMatch || genreTextMatch;
                    }

                    return emuMatch && genreMatch && queryMatch;
                });

                if (totalCountEl) totalCountEl.textContent = filteredDataset.length;
                if (emuCount) {
                    if (currentEmuInfo) {
                        emuCount.textContent = `${filteredDataset.length} games available for this console`;
                    } else if (activeGenreParam) {
                        emuCount.textContent = `${filteredDataset.length} games in this collection`;
                    }
                }

                const toShow = filteredDataset.slice(0, currentDisplayLimit);
                if (visibleCountEl) visibleCountEl.textContent = toShow.length;

                if (toShow.length > 0) {
                    allGamesGrid.innerHTML = toShow.map((g, idx) => window.App.GameCard.render(g, idx)).join('');
                } else {
                    allGamesGrid.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #64748b; background: #ffffff; border-radius: 12px; border: 1px dashed #cbd5e1;">
                            <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🔍</span>
                            <h3 style="color: #1e293b;">No games found</h3>
                            <p>No titles matched your criteria. Try clearing the search or choosing another filter.</p>
                            <a href="javascript:void(0)" id="btn-empty-reset" class="btn-primary-small" style="margin-top: 1rem; display: inline-block;">View All Games</a>
                        </div>
                    `;
                    const emptyReset = document.getElementById('btn-empty-reset');
                    if (emptyReset) {
                        emptyReset.addEventListener('click', () => switchEmulator('all'));
                    }
                }

                if (loadMoreWrapper) {
                    loadMoreWrapper.style.display = (currentDisplayLimit >= filteredDataset.length) ? 'none' : 'block';
                }
            }

            // Smooth SPA Transition Handler (No Page Reload)
            let isTransitionRunning = false;
            function switchEmulator(targetFilter, updateHistory = true) {
                if (isTransitionRunning) return;
                isTransitionRunning = true;

                // 1. Smooth Fade-Out & Slide-Down of the Grid
                allGamesGrid.classList.add('is-transitioning');
                if (emuBanner) emuBanner.classList.add('is-switching');

                setTimeout(() => {
                    // 2. Update params
                    activeEmulatorParam = targetFilter === 'all' ? '' : targetFilter.toLowerCase();
                    if (targetFilter !== 'all') {
                        activeGenreParam = '';
                    }

                    // 3. Update Browser URL
                    if (updateHistory) {
                        let newUrl = 'games.html';
                        if (activeEmulatorParam) {
                            newUrl = `games.html?emulator=${encodeURIComponent(activeEmulatorParam)}`;
                        }
                        window.history.pushState({ emulator: activeEmulatorParam }, '', newUrl);
                    }

                    // 4. Update Header, banner, pills
                    updateUIState();

                    // 5. Reset limit & search
                    currentDisplayLimit = config.DEFAULT_PAGE_SIZE;
                    if (searchInput) {
                        searchInput.value = '';
                        if (searchClear) searchClear.style.display = 'none';
                    }

                    // 6. Render new games
                    filterAndRenderGames();

                    // 7. Smooth Fade-In of new cards
                    requestAnimationFrame(() => {
                        allGamesGrid.classList.remove('is-transitioning');
                        if (emuBanner) emuBanner.classList.remove('is-switching');
                        isTransitionRunning = false;
                    });
                }, config.TRANSITION_DURATION_MS);
            }

            // Attach Click Listeners to Emulator Pills
            pillItems.forEach(pill => {
                pill.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetFilter = (pill.getAttribute('data-filter') || '').toLowerCase();
                    switchEmulator(targetFilter);
                });
            });

            // Banner link reset
            if (emuBanner) {
                const bannerLink = emuBanner.querySelector('a');
                if (bannerLink) {
                    bannerLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        switchEmulator('all');
                    });
                }
            }

            // Browser Back / Forward popstate
            window.addEventListener('popstate', () => {
                const currentParams = new URLSearchParams(window.location.search);
                const targetEmulator = (currentParams.get('emulator') || 'all').toLowerCase();
                activeGenreParam = (currentParams.get('genre') || currentParams.get('collection') || '').toLowerCase();
                switchEmulator(targetEmulator, false);
            });

            // Debounced Live Search
            if (searchInput) {
                const onSearch = debounce(() => {
                    currentDisplayLimit = config.DEFAULT_PAGE_SIZE;
                    if (searchClear) {
                        searchClear.style.display = searchInput.value ? 'block' : 'none';
                    }
                    filterAndRenderGames();
                }, 100);

                searchInput.addEventListener('input', onSearch);
            }

            if (btnClearSearch && searchInput) {
                btnClearSearch.addEventListener('click', () => {
                    searchInput.value = '';
                    searchClear.style.display = 'none';
                    currentDisplayLimit = config.DEFAULT_PAGE_SIZE;
                    filterAndRenderGames();
                });
            }

            // Load More Pagination
            if (btnLoadMore) {
                btnLoadMore.addEventListener('click', () => {
                    currentDisplayLimit += config.DEFAULT_PAGE_SIZE;
                    filterAndRenderGames();
                });
            }

            // Initial view hydration
            updateUIState();
            filterAndRenderGames();
        }
    };
})(window);

