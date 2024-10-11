import { useState } from 'react';

import { useCreateCalendar } from '@/services/schedule/calendarMutations';

import { AdminCalendarLabel } from '@/constants';

interface SubscribeAndShareCalendarProps {
  toggleModal: () => void;
}

export const useSubscribeAndShareCalendar = ({
  toggleModal,
}: SubscribeAndShareCalendarProps) => {
  const [currentAdminCalendar, setCurrentAdminCalendar] =
    useState<AdminCalendarLabel>('교육 매니저의 새싹 캘린더');

  const { mutate } = useCreateCalendar();

  /* 매니저의 캘린더 생성 버튼 */
  const onConfirmCreateClick = () => {
    mutate();
    toggleModal();
  };

  /* 학생들의 구독 버튼 */
  const onConfirmSubscribeClick = () => {
    window.open('', '_blank'); // 공유 캘린더 링크 넣기
    toggleModal();
  };

  const onAdminCalendarClick = (label: AdminCalendarLabel) => {
    setCurrentAdminCalendar(label);
    toggleModal();
  };

  return {
    currentAdminCalendar,
    onConfirmSubscribeClick,
    onConfirmCreateClick,
    onAdminCalendarClick,
  };
};
