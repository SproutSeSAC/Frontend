import { useEffect } from 'react';

import { BlockerFunction, useBlocker } from 'react-router-dom';

interface UsePageBlockerProps {
  isBlockRefresh?: boolean;
  isForm: boolean;
  isFormDirty?: boolean;
}

export const usePageBlocker = ({
  isBlockRefresh,
  isForm = false,
  isFormDirty = false,
}: UsePageBlockerProps) => {
  const when: BlockerFunction = ({ currentLocation, nextLocation }) => {
    const isDiffLocation =
      `${currentLocation.pathname}${currentLocation.search}` !==
      `${nextLocation.pathname}${nextLocation.search}`;

    if (isForm) {
      return isDiffLocation && isFormDirty;
    }
    return isDiffLocation;
  };

  const blocker = useBlocker(when);

  useEffect(() => {
    if (!isBlockRefresh) return undefined;

    if (isForm && !isFormDirty) return undefined;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlockRefresh, isForm, isFormDirty]);

  return {
    blocker,
  };
};
