/**
 * Game Card Component Renderer
 * Generates semantic, accessible card elements with companion app store integration.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.GameCard = {
        /**
         * Render single game card HTML string
         * @param {Object} game - Game metadata record
         * @param {number} index - Index for animation staggering
         * @returns {string} HTML string
         */
        render(game, index = 0) {
            const { escapeHtml, formatNumber, sanitizeYear } = window.App.Utils;
            const config = window.App.Config;

            const loves = game.loves || 0;
            const rating = Number(game.rating || 4.5).toFixed(2);
            const views = game.views || 0;
            const downloads = game.downloads || Math.floor(views * 0.42);
            const downloadsStr = downloads > 0 ? formatNumber(downloads) : `${formatNumber(views)} views`;
            const yearStr = sanitizeYear(game.year);
            const yearBadge = yearStr ? `<span class="tag-year">${escapeHtml(yearStr)}</span>` : '';
            const collection = (loves > 50 || rating >= 4.6) ? 'popular' : 'classics';

            const animDelay = index < config.ANIMATION_STAGGER_MAX ? `style="animation-delay: ${index * 0.03}s"` : '';

            return `
                <article class="game-card" data-emulator="${escapeHtml((game.emulator || '').toLowerCase())}" data-collection="${collection}" data-genre="${escapeHtml((game.genre || '').toLowerCase())}" data-type="guide" ${animDelay}>
                    <div class="image-wrapper">
                        <span class="tag-emulator">${escapeHtml(game.emulator || 'ROM')}</span>
                        ${yearBadge}
                        <img src="${escapeHtml(game.image)}" alt="${escapeHtml(game.title)}" loading="lazy" decoding="async">
                    </div>
                    <div class="card-body">
                        <h3 class="game-title" title="${escapeHtml(game.title)}">${escapeHtml(game.title)}</h3>
                        <span class="game-genre">${escapeHtml(game.genre || 'Action')}</span>
                        <div class="game-meta">
                            <span class="meta-rating" title="Rating">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                ${rating}
                            </span>
                            <span class="meta-loves" title="Loves / Fans">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                                ${formatNumber(loves)}
                            </span>
                            <span class="meta-downloads" title="Downloads / Players">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                ${downloadsStr}
                            </span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="${config.APP_STORE_URL}" target="_blank" rel="noopener noreferrer" class="btn-game-app">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.9 1.9 0 0 1-.22-.9V2.714a1.9 1.9 0 0 1 .22-.9zm11.24 11.244l2.094-2.095-10.87-6.275 8.776 8.37zm0 1.884l-8.776 8.37 10.87-6.275-2.094-2.095zm1.488-1.488l2.906 1.678c.848.49.848 1.288 0 1.778l-2.906 1.678-2.316-2.316 2.316-2.316z"/></svg>
                            Get on Google Play &#8599;
                        </a>
                    </div>
                </article>
            `;
        }
    };
})(window);

