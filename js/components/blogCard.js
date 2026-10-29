/**
 * Blog Card Component Renderer
 * Generates editorial guide and technical retrospective card previews.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.BlogCard = {
        /**
         * Render single blog card preview HTML string
         * @param {Object} game - Game metadata record
         * @returns {string} HTML string
         */
        render(game) {
            const { escapeHtml, formatNumber, sanitizeYear } = window.App.Utils;

            const rating = Number(game.rating || 4.5).toFixed(2);
            const loves = game.loves || 0;
            const yearStr = sanitizeYear(game.year);
            const yearMeta = yearStr ? ` • ${escapeHtml(yearStr)}` : '';

            return `
                <article class="blog-card" data-emulator="${escapeHtml((game.emulator || '').toLowerCase())}">
                    <div class="blog-thumb">
                        <span class="blog-badge">${escapeHtml(game.emulator || 'Console')}</span>
                        <img src="${escapeHtml(game.image)}" alt="${escapeHtml(game.title)}" loading="lazy" decoding="async">
                    </div>
                    <div class="card-body">
                        <div class="blog-meta-top">
                            <span>${escapeHtml(game.genre || 'Action')}${yearMeta}</span>
                            <span>• 4 min read</span>
                        </div>
                        <h3 class="blog-title" title="${escapeHtml(game.title)}">${escapeHtml(game.title)}: Mobile Emulation Report</h3>
                        <p class="blog-excerpt">In-depth performance analysis, recommended graphics configuration, gameplay retrospective, and Android setup guide for ${escapeHtml(game.title)} on ${escapeHtml(game.emulator)}.</p>
                    </div>
                    <div class="blog-footer">
                        <div style="display: flex; gap: 0.75rem; align-items: center; font-weight: 700;">
                            <span style="color: #d97706;">★ ${rating}</span>
                            <span style="color: #e11d48;">♥ ${formatNumber(loves)}</span>
                        </div>
                        <a href="blog-detail.html?id=${escapeHtml(game.id)}" class="read-more-link">
                            Read Report &rarr;
                        </a>
                    </div>
                </article>
            `;
        }
    };
})(window);
