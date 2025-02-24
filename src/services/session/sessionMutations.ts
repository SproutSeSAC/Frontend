import { axiosInstance } from '@/services/axiosInstance';

export const acceptParticipant = async (
  sessionId: number,
  participantId: number,
) => {
  await axiosInstance.post(
    `/notices/sessions/${sessionId}/accept/${participantId}`,
  );
};

export const rejectParticipant = async (
  sessionId: number,
  participantId: number,
) => {
  await axiosInstance.post(
    `/notices/sessions/${sessionId}/reject/${participantId}`,
  );
};

export const cancelParticipant = async (
  sessionId: number,
  participantId: number,
) => {
  await axiosInstance.delete(
    `/notices/sessions/${sessionId}/cancel/${participantId}`,
  );
};

export const applyForSession = async (
  sessionId: number,
  phoneNumber: string,
) => {
  await axiosInstance.post(`/notices/sessions/${sessionId}/application`, {
    phoneNumber,
  });
};
