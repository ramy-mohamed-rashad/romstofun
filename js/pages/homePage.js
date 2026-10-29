/**
 * Home Page Controller
 * Manages landing page interactive filters and reactive console section visibility.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.HomePage = {
        init() {
            const landingGamesContainer = document.getElementById('games-container');
            const filterSelects = document.querySelectorAll('.filter-dropdown');
            const activeFiltersDisplay = document.getElementById('active-filters-display');
            const clearFiltersBtn = document.getElementById('clear-filters-btn');
            const popularEmulatorsSection = document.getElementById('popular-emulators-section');

            if (!landingGamesContainer || filterSelects.length === 0) return;

            const games = window.App.DataService.getGames();
            const config = window.App.Config;

            const emuSelect = document.getElementById('emulator-select');
            const collSelect = document.getElementById('collection-select');
            const typeSelect = document.getElementById('type-select');

            function applyFilters() {
                if (!games || games.length === 0) return;

                const selectedEmu = emuSelect ? emuSelect.value : 'all';
                const selectedColl = collSelect ? collSelect.value : 'all';
                const selectedSort = typeSelect ? typeSelect.value : 'all';

                const isFiltering = (selectedEmu !== 'all' || selectedColl !== 'all' || selectedSort !== 'all');

                // Reactively toggle popular emulators visibility based on active filter state
                if (popularEmulatorsSection) {
                    popularEmulatorsSection.style.display = isFiltering ? 'none' : 'block';
                }

                // Update filter indicators
                const activeFilterLabels = [];
                if (selectedEmu !== 'all' && emuSelect) activeFilterLabels.push(emuSelect.options[emuSelect.selectedIndex].text);
                if (selectedColl !== 'all' && collSelect) activeFilterLabels.push(collSelect.options[collSelect.selectedIndex].text);
                if (selectedSort !== 'all' && typeSelect) activeFilterLabels.push(typeSelect.options[typeSelect.selectedIndex].text);

                if (activeFiltersDisplay) {
                    activeFiltersDisplay.textContent = isFiltering ? activeFilterLabels.join(', ') : 'None';
                    activeFiltersDisplay.style.color = isFiltering ? 'var(--clr-primary)' : '';
                }
                if (clearFiltersBtn) {
                    clearFiltersBtn.style.display = isFiltering ? 'inline-block' : 'none';
                }

                // Filter dataset by emulator & genre/collection
                let filtered = games.filter(g => {
                    const emuMatch = (selectedEmu === 'all' || (g.emulator || '').toLowerCase() === selectedEmu.toLowerCase());
                    let collMatch = true;

                    if (selectedColl !== 'all') {
                        const gameGenre = (g.genre || '').toLowerCase();
                        if (selectedColl === 'action') {
                            collMatch = gameGenre.includes('action');
                        } else if (selectedColl === 'adventure') {
                            collMatch = gameGenre.includes('adventure');
                        } else if (selectedColl === 'fighting') {
                            collMatch = gameGenre.includes('fighting') || gameGenre.includes('battle') || gameGenre.includes('wrestling');
                        } else if (selectedColl === 'sports') {
                            collMatch = gameGenre.includes('sport') || gameGenre.includes('soccer') || gameGenre.includes('football') || gameGenre.includes('wrestling');
                        } else if (selectedColl === 'racing') {
                            collMatch = gameGenre.includes('racing') || gameGenre.includes('driving') || gameGenre.includes('vehicular');
                        } else if (selectedColl === 'platform') {
                            collMatch = gameGenre.includes('platform');
                        } else if (selectedColl === 'rpg' || selectedColl === 'role-playing') {
                            collMatch = gameGenre.includes('role-playing') || gameGenre.includes('rpg');
                        } else if (selectedColl === 'shooter') {
                            collMatch = gameGenre.includes('shooter') || gameGenre.includes('shooting');
                        } else if (selectedColl === 'horror') {
                            collMatch = gameGenre.includes('horror') || gameGenre.includes('survival');
                        } else if (selectedColl === 'classic' || selectedColl === 'classics') {
                            collMatch = gameGenre.includes('classic') || gameGenre.includes('compilation') || gameGenre.includes('misc') || (g.loves <= 40);
                        } else if (selectedColl === 'popular') {
                            collMatch = (g.loves > 40 || g.rating >= 4.5);
                        } else {
                            collMatch = gameGenre.includes(selectedColl);
                        }
                    }

                    return emuMatch && collMatch;
                });

                // Apply sort order
                if (selectedSort === 'rating') {
                    filtered.sort((a, b) => b.rating - a.rating);
                } else if (selectedSort === 'loves') {
                    filtered.sort((a, b) => b.loves - a.loves);
                }

                // Render top games up to landing limit
                const toShow = filtered.slice(0, config.LANDING_GAMES_LIMIT);
                if (toShow.length > 0) {
                    landingGamesContainer.innerHTML = toShow.map((g, idx) => window.App.GameCard.render(g, idx)).join('');
                } else {
                    landingGamesContainer.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: #64748b;">
                            <h3>No games match your selected filters</h3>
                            <p>Try resetting the dropdown filters or browse our full ROMs library.</p>
                        </div>
                    `;
                }
            }

            filterSelects.forEach(sel => sel.addEventListener('change', applyFilters));

            if (clearFiltersBtn) {
                clearFiltersBtn.addEventListener('click', () => {
                    filterSelects.forEach(s => s.selectedIndex = 0);
                    applyFilters();
                });
            }
        }
    };
})(window);
