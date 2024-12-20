import { useCallback, useEffect, useRef } from 'react';

import { useLocation } from 'react-router-dom';

import { notificationOpenAtom } from '@/atoms/notificationAtom';

import { useAtom } from 'jotai';

import CollapsibleSideView from '@/components/common/container/CollapsibleSideView';
import OutsideClickContainer from '@/components/common/container/OutsideClickContainer';
import NotificationContent from '@/components/notification/NotificationContent';
import NotificationHeader from '@/components/notification/NotificationHeader';

export default function NotificationSideView() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  const [isNotificationOpen, setIsNotificationOpen] =
    useAtom(notificationOpenAtom);

  const handleClose = useCallback(() => {
    setIsNotificationOpen(false);
  }, [setIsNotificationOpen]);

  useEffect(() => {
    if (isNotificationOpen && previousPath.current !== location.pathname) {
      handleClose();
    }
    previousPath.current = location.pathname;
  }, [handleClose, isNotificationOpen, location.pathname]);

  return (
    <OutsideClickContainer onClose={handleClose}>
      <CollapsibleSideView
        sideViewOpen={isNotificationOpen}
        onClose={handleClose}
        headerContent={<NotificationHeader handleClose={handleClose} />}
        mainContent={<NotificationContent />}
        className="fixed right-0 max-w-[412px] bg-white px-5 pt-10 shadow-card"
        hideButton
      />
    </OutsideClickContainer>
  );
}
