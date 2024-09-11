import { RefObject, useEffect } from 'react';

interface UseObserverProps {
  onIntersect: (entry: IntersectionObserverEntry) => void;
  root?: Element | null;
  rootMargin?: string;
  target: RefObject<Element>;
  threshold?: number | number[];
}

const useObserver = ({
  onIntersect,
  root = null,
  rootMargin = '0px',
  target,
  threshold = 1.0,
}: UseObserverProps) => {
  useEffect(() => {
    const observedDOM = target.current;
    let observer: IntersectionObserver | undefined;

    if (observedDOM) {
      observer = new IntersectionObserver(
        entries => entries.forEach(entry => onIntersect && onIntersect(entry)),
        {
          root,
          rootMargin,
          threshold,
        },
      );
      observer.observe(observedDOM);
    }
    return () => {
      if (observer && observedDOM) {
        observer.unobserve(observedDOM);
      }
    };
  }, [root, target, rootMargin, threshold, onIntersect]);

  return { target };
};

export default useObserver;
