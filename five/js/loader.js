//лоудер
(function() {
    'use strict';

    const MIN_SHOW_TIME = 2100;
    const MAX_SHOW_TIME = 5000;

    function initLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        const startTime = performance.now();

        function hideLoader() {
            loader.classList.add('hidden');
        }

        window.addEventListener('load', () => {
            const elapsed = performance.now() - startTime;
            const delay = Math.max(0, MIN_SHOW_TIME - elapsed);

            setTimeout(hideLoader, delay);
        }, { once: true });

        setTimeout(hideLoader, MAX_SHOW_TIME);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoader, { once: true });
    } else {
        initLoader();
    }
})();