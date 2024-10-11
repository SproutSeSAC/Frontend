import { useState } from 'react';

import { AdminCalendarLabel } from '@/constants';

interface SubscribeAndShareCalendarProps {
  toggleModal: () => void;
}

export const useSubscribeAndShareCalendar = ({
  toggleModal,
}: SubscribeAndShareCalendarProps) => {
  const [currentAdminCalendar, setCurrentAdminCalendar] =
    useState<AdminCalendarLabel>('교육 매니저의 새싹 캘린더');

  /* 매니저의 공유 버튼 */
  const onConfirmShareClick = () => {
    toggleModal();
  };

  /* 학생들의 구독 버튼 */
  const onConfirmSubscribeClick = () => {
    window.open('', '_blank'); // 공유 캘린더 링크 넣기
    toggleModal();
  };

  const onAdminCalendarClick = (type: AdminCalendarLabel) => {
    setCurrentAdminCalendar(type);
    toggleModal();
  };

  return {
    currentAdminCalendar,
    onConfirmSubscribeClick,
    onConfirmShareClick,
    onAdminCalendarClick,
  };
};
