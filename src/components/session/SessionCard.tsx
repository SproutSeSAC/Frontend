import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '@/services/axiosInstance';
import { useNavigate } from "react-router-dom";
import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  fetchParticipantDetailWithNotice,
  fetchParticipants,
  fetchParticipantDetail,
} from '@/services/session/sessionQueries';
import { cancelParticipant } from '@/services/session/sessionMutations';

import { Session, SessionCardProps, SessionStatus } from '@/types';
import { formatDate, isSuperAdmin } from '@/utils';

import TrashButton from '@/components/common/button/TrashButton';

function SessionCard({ session, showToast }: SessionCardProps) {
  const { data: userProfile } = useGetUserProfile();
  const [noticeData, setNoticeData] = useState<Session | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();

  // ✅ 참가자 리스트 페이지로 이동하는 함수
  const handleNavigateToApplicants = () => {
    navigate(`/application-status-for-sessions/post/${session.id}`);
  };

  const fetchData = useCallback(() => {
    if (!userProfile || hasFetched) return;
    setHasFetched(true);

    if (isSuperAdmin(userProfile.role)) {
      fetchParticipants(session.id)
      .catch(() => showToast('특강 신청 목록을 불러오는 중 오류가 발생했습니다.', 1000));
    } else {
      fetchParticipantDetailWithNotice()
        .then(data => {
          if (!data || !Array.isArray(data)) return;

          const matchedSession = data.flatMap(notice => notice.sessions).find(s => s.sessionId === session.id);

          if (matchedSession) {
            setNoticeData(prev => {
              if (!prev) {
                return { 
                  id: session.id,
                  title: session.title,
                  status: "UNKNOWN",
                  sessions: [matchedSession],
                } as Session;
              }

              return {
                ...prev,
                sessions: [matchedSession],
              };
            });
          }
        })
        .catch(() => showToast('특강 신청 목록을 불러오는 중 오류가 발생했습니다.', 1000));
    }
  }, [userProfile, hasFetched, session.id, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isValidUrl = (url: string): boolean => {
    const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*$/;
    return pattern.test(url);
  };

  const openSurveyLink = () => {
    if (!noticeData?.satisfactionSurvey) return;

    let surveyUrl = noticeData.satisfactionSurvey.trim();
    if (!surveyUrl.startsWith('http')) {
      surveyUrl = `https://${surveyUrl}`;
    }

    if (isValidUrl(surveyUrl)) {
      window.open(surveyUrl, '_blank', 'noopener,noreferrer');
    } else {
      showToast('잘못된 URL입니다.', 1000);
    }
  };

  const getSessionStatus = (status?: SessionStatus): string => {
    const statusMap: Record<SessionStatus, string> = {
      WAIT: "대기",
      PARTICIPANT: "승인",
      REJECT: "반려",
      UNKNOWN: "알 수 없는 상태",
    };
    return status ? statusMap[status] || "알 수 없는 상태" : "알 수 없는 상태";
  };

  const getNoticeStatus = () => {
    if (userProfile && isSuperAdmin(userProfile.role)) {
      return noticeData?.status === "ACTIVE" ? "모집 중" : "모집 종료";
    }

    if (!noticeData?.sessions?.length) {
      return getSessionStatus("UNKNOWN");
    }

    const validSessionStatus = noticeData.sessions.find(
      (session) => session.currentStatus
    )?.currentStatus;

    return getSessionStatus(validSessionStatus || "UNKNOWN");
  };

  const getStatusStyle = (status: string) => {
    const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
      "모집 중": { bg: "bg-mainGreen/20", text: "text-mainGreen", border: "border-lightGreen-hover" },
      "모집 종료": { bg: "bg-darkGray/20", text: "text-darkGray-hover", border: "border-lightGreen-hover" },
      "대기": { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500/20" },
      "승인": { bg: "bg-mainGreen/20", text: "text-darkGreen", border: "border-mainGreen-hover/20" },
      "반려": { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500/20" },
      "알 수 없는 상태": { bg: "bg-darkGray/20", text: "text-darkGray-hover", border: "border-lightGreen-hover" },
    };

    return statusStyles[status] || statusStyles["알 수 없는 상태"];
  };

  const noticeStatus = getNoticeStatus();
  const { bg, text, border } = getStatusStyle(noticeStatus);  

  const handleCancelParticipant = async (selectedParticipantId: number) => {
    try {
      const participantDetails = await fetchParticipantDetail();
  
      const matchedParticipant = participantDetails.find(
        (participant) => Number(participant.id) === Number(selectedParticipantId) 
      );
  
      if (!matchedParticipant) {
        showToast("선택한 세션의 정보를 찾을 수 없습니다.", 1000);
        return;
      }
  
      const noticeId = matchedParticipant.id;
  
      const noticeResponse = await axiosInstance.get(`/notices/${noticeId}`);
      const noticeData = noticeResponse.data;
  
      if (!noticeData.sessions?.length) {
        showToast(`세션 정보가 없습니다.`, 1000);
        return;
      }
  
      const matchedSession = noticeData.sessions.find(
        (s: any) => s.sessionId === session.id
      );
  
      if (!matchedSession) {
        showToast("선택한 참가자의 세션을 찾을 수 없습니다.", 1000);
        return;
      }
      await cancelParticipant(matchedSession.sessionId, matchedParticipant.participantId);
      showToast("특강/행사 신청이 성공적으로 취소되었습니다.", 1000);
    } catch (error) {
      showToast("참여 신청 취소 중 오류가 발생했습니다.", 1000);
    }
  };
  const isValidDate = (date: string | Date | null): boolean => {
    return date instanceof Date && !Number.isNaN(date.getTime());
  };

  return (
    <div className={`group cursor-default relative w-[25vw] min-w-[300px] h-[30vh] max-w-[370px] max-h-[261px] bg-white rounded-lg border ${border} overflow-hidden hover:shadow-card`}>
      {/* 모집 상태 */}
      <div className={`absolute left-[8%] top-[10%] flex items-center justify-center min-w-[80px] w-[23%] h-[14%] px-[2%] py-[1%] ${bg} rounded-lg`}>
        <div className={`${text} text-base whitespace-nowrap`}>{noticeStatus}</div>
      </div>

      {/* 삭제 버튼 (관리자가 아닌 경우) */}
      {!isSuperAdmin(userProfile?.role) && (
        <div className="absolute right-[3%] top-[5%]">
          <TrashButton onConfirmClick={() => handleCancelParticipant(session.participantId)} />
        </div>
      )}

      {/* 특강 제목 */}
      <div className="absolute left-[8%] top-[32%] w-[80%] text-black overflow-x-auto whitespace-nowrap scrollbar-hide text-xl font-medium">
        {noticeData ? noticeData.title : session.title}
        </div>
  
        {/* 특강 정보 */}
        <div className="absolute left-[8%] top-[50%] flex flex-col gap-2 text-darkGray text-sm font-normal">
          <div className='overflow-x-auto whitespace-nowrap scrollbar-hide'>{session.meetingType === 'ONLINE' ? '링크' : '장소'} |{' '}
          {session.location}</div>
          <div>일자 | {formatDate(session.date, 'yyyy.MM.dd')}</div>
          <div>
            시간 |{' '}
            {session.startTime && session.endTime && isValidDate(session.startTime) && isValidDate(session.endTime)
              ? `${formatDate(session.startTime, 'HH:mm')} ~ ${formatDate(session.endTime, 'HH:mm')}`
              : '시간 미정'}
          </div>
        </div>

      {/* 참가자 확인 버튼 */}
      <div
        className="absolute min-w-[90px] right-[8%] top-[75%] flex cursor-pointer items-center justify-center w-[25%] h-[15%] px-[2%] py-[1%] bg-darkGray hover:bg-darkGray-hover active:bg-darkGray-active rounded-lg"
        tabIndex={0}
        role="button"
        onClick={() => {
          if (userProfile && isSuperAdmin(userProfile.role)) {
            handleNavigateToApplicants();
          } else {
            openSurveyLink();
          }
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (userProfile && isSuperAdmin(userProfile.role)) {
              handleNavigateToApplicants();
            } else {
              openSurveyLink();
            }
          }
        }}
      >
        <div className="text-white text-sm font-normal whitespace-nowrap">
          {userProfile && isSuperAdmin(userProfile.role) ? '참여자 조회' : '만족도 조사'}
        </div>
      </div>
    </div>
  );
}

export default SessionCard;
