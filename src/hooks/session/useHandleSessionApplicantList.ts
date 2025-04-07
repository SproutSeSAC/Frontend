import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

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
    { participantId: number; name: string; status: AppliedSessionStatusKey }[]
  >([]);

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

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['useGetSessionApplicantList', sessionId],
    });
  };

  const { mutateAsync: acceptApplicant, isPending: isAcceptPending } =
    usePostAcceptSession({
      onSuccess: invalidateQueries,
    });

  const { mutateAsync: rejectApplicant, isPending: isRejectPending } =
    usePostRejectSession({
      onSuccess: invalidateQueries,
    });

  const onAllClearCheckedChange = () => setCheckedList([]);

  const onAllCheckedChange = () =>
    setCheckedList(
      applicantList && applicantList?.length !== 0
        ? applicantList?.map(
            ({ noticeParticipantId: id, status, userName }) => ({
              participantId: id,
              status,
              name: userName,
            }),
          )
        : [],
    );

  const onCheckedChange = ({
    noticeParticipantId: newId,
    status,
    userName,
  }: Pick<Applicant, 'noticeParticipantId' | 'status' | 'userName'>) => {
    setCheckedList(prevList => {
      return prevList.find(({ participantId: id }) => id === newId)
        ? prevList.filter(({ participantId: id }) => id === newId)
        : [...prevList, { participantId: newId, status, name: userName }];
    });
  };

  return {
    applicantList,
    isApplicantListLoading,
    checkedList,
    onCheckedChange,
    onAllClearCheckedChange,
    onAllCheckedChange,

    acceptApplicant,
    isAcceptPending,
    rejectApplicant,
    isRejectPending,
  };
};
