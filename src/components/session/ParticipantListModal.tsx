import { useCallback, useEffect, useState } from 'react';

import {
  acceptParticipant,
  rejectParticipant,
} from '@/services/session/sessionMutations';
import { fetchParticipants } from '@/services/session/sessionQueries';

import { Participant, ParticipantListModalProps, SessionStatus } from '@/types';

import Alert from '@/components/common/modal/Alert';

function ParticipantListModal({
  onClose,
  sessionId,
  showToast,
}: ParticipantListModalProps & {
  showToast: (message: string, duration?: number) => void;
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const loadParticipants = useCallback(() => {
    setIsLoading(true);
    fetchParticipants(sessionId)
      .then(setParticipants)
      .catch(() =>
        showToast('참여자 목록을 불러오는 중 오류가 발생했습니다.', 1000),
      )
      .finally(() => setIsLoading(false));
  }, [sessionId, showToast]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const handleAccept = (participantId: number) => {
    acceptParticipant(sessionId, participantId)
      .then(() => {
        showToast('참여 수락이 완료되었습니다.', 1000);
        loadParticipants();
      })
      .catch(() => showToast('참여 수락에 실패하였습니다.', 1000));
  };

  const handleReject = (participantId: number) => {
    rejectParticipant(sessionId, participantId)
      .then(() => {
        showToast('참여 거절이 완료되었습니다.', 1000);
        loadParticipants();
      })
      .catch(() => showToast('참여 거절에 실패하였습니다.', 1000));
  };

  const renderStatusText = (status: SessionStatus) => {
    switch (status) {
      case 'WAIT':
        return '대기';
      case 'PARTICIPANT':
        return '승인';
      case 'REJECT':
        return '반려';
      default:
        return '알 수 없는 상태';
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[50vw] max-h-[50vh] min-h-[50vh] relative bg-white rounded-lg overflow-hidden p-6 shadow-lg">
        {alertMessage && (
          <Alert
            text={alertMessage}
            buttonList={[
              {
                name: '확인',
                onClick: () => setAlertMessage(null),
                color: 'gray',
              },
            ]}
          />
        )}
        <button
          className="absolute right-[24px] top-[24px] text-darkGray-active text-xl font-medium hover:text-gray-600"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="w-[614px] left-[48px] top-[60px] absolute text-black text-2xl font-semibold font-['Pretendard Variable']">
          참여자 리스트
        </h2>

        {isLoading ? (
          <div className="text-center mt-8 text-darkGray-active">로딩 중...</div>
        ) : participants.length === 0 ? (
          <div className="text-center text-darkGray-active mt-8">참여자가 없습니다.</div>
        ) : (
          <div className="h-[108px] top-[142px] relative flex-col w-full items-center gap-[40px] inline-flex">
            {participants.map((participant) => (
              <div key={participant.id} className="max-w-[90%] w-full flex justify-between items-center flex-wrap">
                <div className="flex justify-start items-center gap-[13px]">
                  <div className="text-darkGray-active text-xl">{participant.name}</div>
                  <div className="text-darkGray-active text-xl">({renderStatusText(participant.status)})</div>
                </div>
                <div className="flex justify-end items-center gap-[10px] flex-wrap">
                  <button
                    className="w-[86px] h-[37px] px-[11px] py-[4px] bg-[#00c42a]/20 rounded-lg border flex justify-center items-center text-[#006b17] text-base"
                    onClick={() => handleAccept(participant.id)}
                    disabled={participant.status === 'ACCEPT'}
                  >
                    수락
                  </button>
                  <button
                    className="w-[86px] h-[37px] px-[11px] py-[4px] bg-[#ff8c4e]/20 rounded-lg border flex justify-center items-center text-[#fc3737] text-base"
                    onClick={() => handleReject(participant.id)}
                    disabled={participant.status === 'REJECT'}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>

        )}
      </div>
    </div>
  );
}

export default ParticipantListModal;
