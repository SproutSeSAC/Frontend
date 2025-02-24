import { axiosInstance } from '@/services/axiosInstance';
import { fetchParticipantDetail } from '@/services/session/sessionQueries';
import { cancelParticipant } from '@/services/session/sessionMutations';

export const useCancelParticipant = (
  sessionId: number,
  showToast: (message: string, duration?: number) => void,
  refreshData: () => void = () => {}
) => {
  const handleCancelParticipant = async (selectedParticipantId: number) => {
    try {
      const participantDetails = await fetchParticipantDetail();
      const matchedParticipant = participantDetails.find(
        (participant) => Number(participant.id) === Number(selectedParticipantId)
      );

      if (!matchedParticipant) {
        showToast('선택한 세션의 정보를 찾을 수 없습니다.', 1000);
        return;
      }

      const noticeId = matchedParticipant.id;
      const noticeResponse = await axiosInstance.get(`/notices/${noticeId}`);
      const noticeData = noticeResponse.data;

      if (!noticeData.sessions?.length) {
        showToast('세션 정보가 없습니다.', 1000);
        return;
      }

      const matchedSession = noticeData.sessions.find((s: any) => s.sessionId === sessionId);

      if (!matchedSession) {
        showToast('선택한 참가자의 세션을 찾을 수 없습니다.', 1000);
        return;
      }

      await cancelParticipant(matchedSession.sessionId, matchedParticipant.participantId);
      showToast('특강/행사 신청이 성공적으로 취소되었습니다.', 1000);
      refreshData();
    } catch {
      showToast('참여 신청 취소 중 오류가 발생했습니다.', 1000);
    }
  };

  return { handleCancelParticipant };
};
