/**
 * Blog Detail Page Controller
 * Dynamically constructs in-depth technical analysis and emulation guide reports for any title.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.BlogDetailPage = {
        init() {
            const artHeadline = document.getElementById('art-headline');
            if (!artHeadline) return;

            const games = window.App.DataService.getGames();
            const { escapeHtml, formatNumber, sanitizeYear } = window.App.Utils;

            const urlParams = new URLSearchParams(window.location.search);
            const gameId = urlParams.get('id');

            let targetGame = null;
            if (gameId) {
                targetGame = window.App.DataService.getGameById(gameId);
            }

            // Fallback to first available game if not found
            if (!targetGame && games.length > 0) {
                targetGame = games[0];
            }

            if (!targetGame) return;

            const title = targetGame.title || 'Classic Game';
            const emu = targetGame.emulator || 'Console';
            const genre = targetGame.genre || 'Action';
            const yearStr = sanitizeYear(targetGame.year) || 'Classic';
            const rating = Number(targetGame.rating || 4.5).toFixed(2);
            const loves = targetGame.loves || 0;
            const views = targetGame.views || 0;
            const region = targetGame.region || 'Global';

            // Document Meta & Title
            document.title = `${title}: Mobile Emulation Report | romstofun`;
            const metaDesc = document.getElementById('blog-meta-desc');
            if (metaDesc) {
                metaDesc.setAttribute('content', `In-depth performance analysis, recommended settings, and review for ${title} on ${emu}.`);
            }

            // Breadcrumb
            const breadcrumbTitle = document.getElementById('breadcrumb-article-title');
            if (breadcrumbTitle) breadcrumbTitle.textContent = title;

            // Article Meta & Headline
            artHeadline.textContent = `${title}: Complete Retrospective & Emulation Guide`;
            const artMetaPlatform = document.getElementById('art-meta-platform');
            if (artMetaPlatform) artMetaPlatform.textContent = emu;
            const artMetaGenre = document.getElementById('art-meta-genre');
            if (artMetaGenre) artMetaGenre.textContent = genre;

            // Featured Image
            const featuredImg = document.getElementById('art-featured-image');
            if (featuredImg) {
                featuredImg.src = targetGame.image;
                featuredImg.alt = title;
            }

            // Overview & Retrospective Sections
            const artOverview = document.getElementById('art-overview');
            if (artOverview) {
                artOverview.textContent = `${title} stands as one of the most memorable and celebrated experiences on the ${emu} platform. First emerging in ${yearStr}, the title captivated players worldwide through its distinctive design, memorable atmosphere, and technical prowess that pushed the system to its full capacity.`;
            }

            const artOverview2 = document.getElementById('art-overview-2');
            if (artOverview2) {
                artOverview2.textContent = `Boasting an average community score of ${rating} out of 5 and cherished by ${formatNumber(loves)} registered fans, ${title} continues to hold a revered spot in retro gaming history. Whether revisited for nostalgia or explored for the first time, its legacy remains undisputed.`;
            }

            const artCallout = document.getElementById('art-callout-text');
            if (artCallout) {
                artCallout.textContent = `On modern Android devices, ${title} benefits from high-definition upscaling, stable 60 FPS performance, quick-save states, and tactile controller integration through recommended mobile emulator setups.`;
            }

            const artGameplay = document.getElementById('art-gameplay');
            if (artGameplay) {
                artGameplay.textContent = `Categorized under the ${genre} genre, the gameplay loop strikes an engaging balance between challenging mechanics and rewarding progression. Level pacing, responsive handling, and finely crafted scenarios keep the experience fresh from start to finish.`;
            }

            const artScore = document.getElementById('art-score');
            if (artScore) {
                artScore.innerHTML = `${rating} <span style="font-size: 1.2rem; color: #64748b;">/ 5.0</span>`;
            }

            // Sidebar Hardware & Game Specifications
            const sbPlatform = document.getElementById('sidebar-platform');
            if (sbPlatform) sbPlatform.textContent = emu;
            const sbGenre = document.getElementById('sidebar-genre');
            if (sbGenre) sbGenre.textContent = genre;
            const sbYear = document.getElementById('sidebar-year');
            if (sbYear) sbYear.textContent = yearStr;
            const sbRegion = document.getElementById('sidebar-region');
            if (sbRegion) sbRegion.textContent = region;
            const sbRating = document.getElementById('sidebar-rating');
            if (sbRating) sbRating.textContent = `★ ${rating}`;
            const sbLoves = document.getElementById('sidebar-loves');
            if (sbLoves) sbLoves.textContent = `♥ ${formatNumber(loves)}`;
            const sbViews = document.getElementById('sidebar-views');
            if (sbViews) sbViews.textContent = formatNumber(views);

            // Related Titles from the Same Console
            const relatedContainer = document.getElementById('sidebar-related-games');
            if (relatedContainer) {
                const related = games
                    .filter(g => g.emulator === emu && String(g.id) !== String(targetGame.id))
                    .slice(0, 4);

                if (related.length > 0) {
                    relatedContainer.innerHTML = related.map(rg => `
                        <a href="blog-detail.html?id=${rg.id}" style="display: flex; gap: 0.75rem; align-items: center; text-decoration: none; color: inherit; padding: 0.5rem; border-radius: 8px; border: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#fdf2f8'" onmouseout="this.style.background='transparent'">
                            <img src="${rg.image}" alt="${escapeHtml(rg.title)}" style="width: 60px; height: 42px; object-fit: cover; border-radius: 6px;" loading="lazy" decoding="async">
                            <div style="overflow: hidden;">
                                <h4 style="font-size: 0.88rem; margin: 0 0 0.2rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #0f172a;">${escapeHtml(rg.title)}</h4>
                                <span style="font-size: 0.75rem; color: #d97706; font-weight: 700;">★ ${Number(rg.rating || 4.5).toFixed(2)}</span>
                            </div>
                        </a>
                    `).join('');
                } else {
                    relatedContainer.innerHTML = `<span style="font-size: 0.85rem; color: #94a3b8;">No other titles found.</span>`;
                }
            }
        }
    };
})(window);

