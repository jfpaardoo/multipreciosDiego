import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Disable browser's default scroll restoration to avoid fighting
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const scrollToTop = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
            
            // Also try scrolling the root element in case it's the scroll container
            const root = document.getElementById('root');
            if (root) root.scrollTo(0, 0);
        };

        // Execute immediately
        scrollToTop();

        // And a small delay to handle any async layout shifts
        const timeoutId = setTimeout(scrollToTop, 0);
        
        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}
