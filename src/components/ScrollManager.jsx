import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SCROLL_PAGES = ['/', '/my-posts'];

const ScrollManager = () => {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const shouldPreserve = SCROLL_PAGES.includes(pathname);
    const manualReset = sessionStorage.getItem('manualScrollReset') === 'true';

    const restoreScroll = () => {
      if (manualReset) {
        // Manual nav from nav link → reset scroll
        window.scrollTo({ top: 0, behavior: 'auto' });
        sessionStorage.removeItem('manualScrollReset');
        return;
      }

      const savedY = parseInt(sessionStorage.getItem(`scroll-${pathname}`), 10);
      if (shouldPreserve && !isNaN(savedY) && savedY > 0) {
        window.scrollTo({ top: savedY, behavior: 'auto' });
      } else if (!shouldPreserve) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    const timeoutId = setTimeout(restoreScroll, 0);

    const handleScroll = () => {
      if (shouldPreserve) {
        sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return null;
};

export default ScrollManager;
