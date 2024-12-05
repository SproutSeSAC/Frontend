import { useCallback, useEffect } from 'react';

import { BlockerFunction, useBlocker } from 'react-router-dom';

import { useDialogContext } from '@/hooks/useDialogContext';

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
      currentLocation.pathname !== nextLocation.pathname ||
      currentLocation.search !== nextLocation.search;

    if (form) {
      return isDiffLocation && form.isDirty && !form.isSubmitted;
    }
    return isDiffLocation;
  };

  const blocker = useBlocker(when);

  useEffect(() => {
    if (!isBlockRefresh || (form && !form.isDirty)) return undefined;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlockRefresh, form]);

  const { alert, hideDialog } = useDialogContext();

  const handleLeave = useCallback(() => {
    if (blocker.state !== 'blocked') return;
    alert({
      text: '정말 나가시겠어요?',
      subText: '저장하지 않은 내용을 잃어버릴 수 있어요.',
      buttonList: [
        {
          name: '계속 작성하기',
          color: 'gray',
          onClick: () => {
            hideDialog();
            blocker?.reset();
          },
        },
        {
          name: '나가기',
          onClick: () => {
            hideDialog();
            blocker.proceed();
          },
        },
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);

  useEffect(() => {
    if (blocker.state === 'blocked') handleLeave();
  }, [blocker.state, handleLeave]);

  return {
    blocker,
    handleLeave,
  };
};
