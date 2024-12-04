import { useEffect } from 'react';

import { BlockerFunction, useBlocker } from 'react-router-dom';

interface UsePageBlockerProps {
  isBlockRefresh?: boolean;
  form?: {
    isDirty: boolean;
    isSubmitted?: boolean;
  };
}

export const usePageBlocker = ({
  isBlockRefresh,
  form,
}: UsePageBlockerProps) => {
  const when: BlockerFunction = ({ currentLocation, nextLocation }) => {
    const isDiffLocation =
      `${currentLocation.pathname}${currentLocation.search}` !==
      `${nextLocation.pathname}${nextLocation.search}`;

    if (form) {
      return isDiffLocation && form.isDirty && !form.isSubmitted;
    }
    return isDiffLocation;
  };

  const blocker = useBlocker(when);

  useEffect(() => {
    if (!isBlockRefresh) return undefined;

    if (form && !form.isDirty) return undefined;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlockRefresh, form]);

  return {
    blocker,
  };
};
