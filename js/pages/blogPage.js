/**
 * Blog Page Controller
 * Manages retrospective guide listings, console category tabs, and real-time search.
 */
(function(window) {
    'use strict';

    window.App = window.App || {};

    window.App.BlogPage = {
        init() {
            const blogPostsGrid = document.getElementById('blog-posts-grid');
            if (!blogPostsGrid) return;

            const games = window.App.DataService.getGames();
            const config = window.App.Config;
            const { debounce } = window.App.Utils;

            const blogSearchInput = document.getElementById('blog-search-input');
            const visibleBlogCount = document.getElementById('visible-blog-count');
            const totalBlogCount = document.getElementById('total-blog-count');
            const btnBlogLoadMore = document.getElementById('btn-blog-load-more');
            const blogLoadMoreWrapper = document.getElementById('blog-load-more-wrapper');
            const blogFilterPills = document.querySelectorAll('#blog-filter-pills .pill-item');

            let activeBlogEmulator = 'all';
            let currentBlogLimit = config.DEFAULT_PAGE_SIZE;
            let filteredBlogs = [];

            function filterAndRenderBlogs() {
                const query = blogSearchInput ? blogSearchInput.value.trim().toLowerCase() : '';

                filteredBlogs = games.filter(g => {
                    const emuMatch = (activeBlogEmulator === 'all' || (g.emulator || '').toLowerCase() === activeBlogEmulator.toLowerCase());
                    let queryMatch = true;
                    if (query) {
                        const titleMatch = (g.title || '').toLowerCase().includes(query);
                        const genreMatch = (g.genre || '').toLowerCase().includes(query);
                        queryMatch = titleMatch || genreMatch;
                    }
                    return emuMatch && queryMatch;
                });

                if (totalBlogCount) totalBlogCount.textContent = filteredBlogs.length;
                const toShow = filteredBlogs.slice(0, currentBlogLimit);
                if (visibleBlogCount) visibleBlogCount.textContent = toShow.length;

                if (toShow.length > 0) {
                    blogPostsGrid.innerHTML = toShow.map(g => window.App.BlogCard.render(g)).join('');
                } else {
                    blogPostsGrid.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #64748b; background: #ffffff; border-radius: 12px; border: 1px dashed #cbd5e1;">
                            <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">📝</span>
                            <h3 style="color: #1e293b;">No articles found</h3>
                            <p>No blog reports matched your search. Try another console or title.</p>
                        </div>
                    `;
                }

                if (blogLoadMoreWrapper) {
                    blogLoadMoreWrapper.style.display = (currentBlogLimit >= filteredBlogs.length) ? 'none' : 'block';
                }
            }

            // Console filter tabs
            blogFilterPills.forEach(pill => {
                pill.addEventListener('click', (e) => {
                    e.preventDefault();
                    blogFilterPills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    activeBlogEmulator = pill.getAttribute('data-blog-filter') || 'all';
                    currentBlogLimit = config.DEFAULT_PAGE_SIZE;
                    filterAndRenderBlogs();
                });
            });

            // Debounced Search Input
            if (blogSearchInput) {
                const onSearch = debounce(() => {
                    currentBlogLimit = config.DEFAULT_PAGE_SIZE;
                    filterAndRenderBlogs();
                }, 100);

                blogSearchInput.addEventListener('input', onSearch);
            }

            // Load More
            if (btnBlogLoadMore) {
                btnBlogLoadMore.addEventListener('click', () => {
                    currentBlogLimit += config.DEFAULT_PAGE_SIZE;
                    filterAndRenderBlogs();
                });
            }

            // Initial render
            filterAndRenderBlogs();
        }
    };
})(window);
