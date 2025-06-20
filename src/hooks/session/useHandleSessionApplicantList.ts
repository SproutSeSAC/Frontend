import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  usePostAcceptSession,
  usePostRejectSession,
} from '@/services/session/sessionsMutations';
import { useGetSessionApplicantList } from '@/services/session/sessionsQueries';

import { Applicant, AppliedSessionStatusKey } from '@/types';

interface UseHandleSessionApplicantListProps {
  page: number;
  size: number;
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

export const useHandleSessionApplicantList = (
  params: UseHandleSessionApplicantListProps,
) => {
  const [checkedList, setCheckedList] = useState<
    { participantId: number; name: string; status: AppliedSessionStatusKey }[]
  >([]);

  const queryClient = useQueryClient();

  const {
    data: { content: applicantList = [], totalPages } = initialApplicantList,
    isLoading: isApplicantListLoading,
  } = useGetSessionApplicantList(params);

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['useGetSessionApplicantList', params.sessionId],
    });
  };

  const {
    mutateAsync: acceptApplicant,
    isPending: isAcceptPending,
    isIdle: isAcceptIdle,
  } = usePostAcceptSession();

  const {
    mutateAsync: rejectApplicant,
    isPending: isRejectPending,
    isIdle: isRejectIdle,
  } = usePostRejectSession();

  const isPending =
    (isAcceptPending && !isAcceptIdle) || (isRejectPending && !isRejectIdle);

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
    return setCheckedList(prevList => {
      const hasParticipantId = prevList.find(
        ({ participantId: prevId }) => prevId === newId,
      );
      return hasParticipantId
        ? prevList.filter(({ participantId: prevId }) => prevId !== newId)
        : [...prevList, { participantId: newId, status, name: userName }];
    });
  };

  return {
    applicantList,
    totalPages,
    isApplicantListLoading,
    checkedList,
    onCheckedChange,
    onAllClearCheckedChange,
    onAllCheckedChange,
    invalidateQueries,

    acceptApplicant,
    rejectApplicant,
    isPending,
  };
};
