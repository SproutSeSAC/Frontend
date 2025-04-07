import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDialogContext } from '@/hooks/common/useDialogContext';

import {
  usePostAcceptSession,
  usePostRejectSession,
} from '@/services/session/sessionsMutations';
import { useGetSessionApplicantList } from '@/services/session/sessionsQueries';

import { Applicant, AppliedSessionStatusKey } from '@/types';

interface UseHandleSessionApplicantListProps {
  sessionId: number;
  searchParticipantStatus?: AppliedSessionStatusKey;
}

const initialApplicantList = {
  content: [],
  totalPages: 0,
  currentPage: 0,
  pageSize: 0,
  nextPage: null,
};

export const useHandleSessionApplicantList = ({
  sessionId,
  searchParticipantStatus,
}: UseHandleSessionApplicantListProps) => {
  const [checkedList, setCheckedList] = useState<
    { participantId: number; status: AppliedSessionStatusKey }[]
  >([]);

  const { showToast } = useDialogContext();

  const queryClient = useQueryClient();

  const {
    data: { content: applicantList = [] } = initialApplicantList,
    isLoading: isApplicantListLoading,
  } = useGetSessionApplicantList({
    sessionId,
    page: 1,
    size: 10,
    searchParticipantStatus,
  });

  const { mutateAsync: acceptApplicant, isPending: isAcceptPending } =
    usePostAcceptSession({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['useGetSessionApplicantList', sessionId],
        });
      },
    });
  const { mutateAsync: rejectApplicant, isPending: isRejectPending } =
    usePostRejectSession({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['useGetSessionApplicantList', sessionId],
        });
      },
    });

  const onAllClearCheckedChange = () => setCheckedList([]);

  const onAllCheckedChange = () =>
    setCheckedList(
      applicantList && applicantList?.length !== 0
        ? applicantList?.map(({ noticeParticipantId: id, status }) => ({
            participantId: id,
            status,
          }))
        : [],
    );

  const onCheckedChange = ({
    noticeParticipantId: newId,
    status,
  }: Pick<Applicant, 'noticeParticipantId' | 'status'>) => {
    setCheckedList(prevList => {
      return prevList.find(({ participantId: id }) => id === newId)
        ? prevList.filter(({ participantId: id }) => id === newId)
        : [...prevList, { participantId: newId, status }];
    });
  };

  const handleCheckedItemAccept = async () => {
    if (checkedList.length === 0) {
      showToast('선택된 참가자가 없습니다.');
      return;
    }

    try {
      await Promise.all(
        checkedList.map(({ participantId, status }) => {
          if (status !== 'PARTICIPANT') {
            acceptApplicant({ sessionId, participantId });
          }
          return null;
        }),
      );
      showToast('선택한 참가자들을 모두 승인했습니다.');
      setCheckedList([]);
    } catch {
      showToast('참가자 승인 중 오류가 발생했습니다.');
    }
  };

  const handleCheckedItemReject = async () => {
    if (checkedList.length === 0) {
      showToast('선택된 참가자가 없습니다.');
      return;
    }

    try {
      await Promise.all(
        checkedList.map(({ participantId, status }) => {
          if (status !== 'REJECT') {
            rejectApplicant({ sessionId, participantId });
          }
          return null;
        }),
      );
      showToast('선택한 참가자들을 모두 반려했습니다.');
      setCheckedList([]);
    } catch {
      showToast('참가자 반려 중 오류가 발생했습니다.');
    }
  };

  return {
    applicantList,
    isApplicantListLoading,
    checkedList,
    onCheckedChange,
    onAllClearCheckedChange,
    onAllCheckedChange,
    handleCheckedItemAccept,
    isAcceptPending,
    handleCheckedItemReject,
    isRejectPending,
  };
};
