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
  const handleNavigateToApplicants = () => {
    navigate(`/application-status-for-sessions/post/${session.id}`, {
      state: {
        title: session.title,
        date: session.date,
        startTime: session.startTime ? formatDate(new Date(session.startTime), "HH:mm") : "시간 미정",
        endTime: session.endTime ? formatDate(new Date(session.endTime), "HH:mm") : "시간 미정",
        participantCapacity: session.participantCapacity ?? "제한 없음", 
      },
    });
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
    if (!session.satisfactionSurvey) {
      showToast('만족도 조사 링크가 제공되지 않았습니다.', 1000);
      return;
    }
  
    let surveyUrl = session.satisfactionSurvey.trim();
  
    if (!isValidUrl(surveyUrl)) {
      showToast('만족도 조사 링크가 유효하지 않습니다.', 1000);
      return;
    }
    
    window.open(surveyUrl, '_blank', 'noopener,noreferrer');
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
    if (!userProfile) return getSessionStatus("UNKNOWN");
  
    const now = new Date();
  
    if (isSuperAdmin(userProfile.role)) {
      if (!session.applicationStartDateTime || !session.applicationEndDateTime) {
        return "모집 종료";
      }
  
      const startDate = new Date(session.applicationStartDateTime);
      const endDate = new Date(session.applicationEndDateTime);
  
      return now >= startDate && now <= endDate ? "모집 중" : "모집 종료";
    }
  
    const sessionEndDateTime = session.endTime ? new Date(session.endTime) : new Date(session.date);
  
    if (sessionEndDateTime < now) {
      return "종료";
    }
  
    if (!noticeData?.sessions?.length) {
      return getSessionStatus("UNKNOWN");
    }
  
    const validSessionStatus = noticeData.sessions.find(
      (s) => s.currentStatus
    )?.currentStatus;
  
    return getSessionStatus(validSessionStatus || "UNKNOWN");
  };

  const getStatusStyle = (status: string) => {
    const statusStyles: Record<string, { bg: string; text: string; }> = {
      "모집 중": { bg: "bg-red-400/15", text: "text-red-400" },
      "모집 종료": { bg: "bg-darkGray/20", text: "text-darkGray-hover" },
      "종료": { bg: "bg-darkGray/20", text: "text-darkGray-hover" },
      "대기": { bg: "bg-red-400/15", text: "text-red-400" },
      "승인": { bg: "bg-mainGreen/20", text: "text-darkGreen" },
      "반려": { bg: "bg-mainBlue/30", text: "text-mainBlue-active" },
      "알 수 없는 상태": { bg: "bg-darkGray/20", text: "text-darkGray-hover" },
    };

    return statusStyles[status] || statusStyles["알 수 없는 상태"];
  };

  const noticeStatus = getNoticeStatus();
  const { bg, text } = getStatusStyle(noticeStatus);  

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
  
      setHasFetched(false);
      fetchData(); 
    } catch {
      showToast("참여 신청 취소 중 오류가 발생했습니다.", 1000);
    }
  };
  

  const isValidDate = (date: string | Date | null): boolean => {
    return date instanceof Date && !Number.isNaN(date.getTime());
  };
  
  if (noticeStatus === "알 수 없는 상태") {
    return null;
  }
  
  return (
    <div className={`group cursor-default relative w-[25vw] min-w-[300px] h-[30vh] max-w-[370px] max-h-[261px] bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-card`}>

      <div className={`absolute left-[8%] top-[10%] flex items-center justify-center min-w-[80px] w-[23%] h-[14%] px-[2%] py-[1%] ${bg} rounded-lg`}>
        <div className={`${text} text-base whitespace-nowrap`}>{noticeStatus}</div>
      </div>

      {!isSuperAdmin(userProfile?.role) && (
        <div className="absolute right-[3%] top-[5%]">
          <TrashButton onConfirmClick={() => handleCancelParticipant(session.participantId)} />
        </div>
      )}

      <div className="absolute left-[8%] top-[32%] w-[80%] text-black overflow-x-auto whitespace-nowrap scrollbar-hide text-xl font-medium">
        {noticeData ? noticeData.title : session.title}
        </div>
  
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