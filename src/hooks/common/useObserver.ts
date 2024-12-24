import { RefObject, useCallback, useEffect } from 'react';

interface UseObserverProps {
  runFucAtIntersect: () => void;
  root?: Element | null;
  rootMargin?: string;
  target: RefObject<Element>;
  threshold?: number | number[];
}

export const useObserver = ({
  runFucAtIntersect,
  root = null,
  rootMargin = '0px',
  target,
  threshold = 1.0,
}: UseObserverProps) => {
  const onIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        runFucAtIntersect();
      }
    },
    [runFucAtIntersect],
  );

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
