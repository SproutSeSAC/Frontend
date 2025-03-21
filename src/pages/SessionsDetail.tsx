import { useState, useEffect } from 'react';

import {
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useFetchSessionsByType,
  fetchParticipantDetail,
} from '@/services/session/sessionQueries';

import { formatDate, isSuperAdmin } from '@/utils';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import Toast from '@/components/common/Toast';
import SquareButton from '@/components/common/button/SquareButton';
import SearchInput from '@/components/common/input/SearchInput';
import SessionCard from '@/components/session/SessionCard';

export default function SessionsDetail() {
  const { data: userProfile } = useGetUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const { sessions, isLoading } = useFetchSessionsByType();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [participantDetails, setParticipantDetails] = useState<number[]>([]); 

  useEffect(() => {
    if (!isSuperAdmin(userProfile?.role)) {
      fetchParticipantDetail().then(data => {
        setParticipantDetails(data.map(p => p.id)); 
      });
    }
  }, [userProfile]);

  const showToast = (message: string, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      // TODO: 검색 실행 로직 추가 (추후 구현)
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (!userProfile) return false;

    if (!isSuperAdmin(userProfile.role)) {
      if (!participantDetails.includes(session.id)) {
        return false;
      }
    }

    const searchTermLowerCase = searchTerm.toLowerCase();

    const matchesSearchTerm =
      session.title.toLowerCase().includes(searchTermLowerCase) ||
      session.content.toLowerCase().includes(searchTermLowerCase) ||
      session.writer.userName.toLowerCase().includes(searchTermLowerCase) ||
      session.targetCourses.some(course =>
        course.courseName.toLowerCase().includes(searchTermLowerCase),
      );

    return matchesSearchTerm;
  });

  return (
        <>
          <div className="mb-6 flex w-full max-w-[95%] items-center gap-4">
            {isSuperAdmin(userProfile?.role) && (
              <>
                <div
                  className="flex mr-4 flex-grow justify-end gap-5"
                >
                  <SearchInput
                    name="search"
                    placeholder="찾으시는 이벤트의 내용을 입력해 주세요"
                    width="w-[40vw]"
                    height="h-12"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onEnter={handleSearchSubmit}
                  />
                  <SquareButton
                    name="검색하기"
                    onClick={handleSearchSubmit}
                    className="h-full whitespace-nowrap font-medium"
                  />
                </div>
              </>
            )}
          </div>
            {isLoading && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <LoopLoading />
              </div>
            )}
            {!isLoading &&
              (filteredSessions.length === 0 ? (
                <EmptyContent
                  message="신청한 이벤트가 없습니다."
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                />
              ) : (
              <div className="grid w-[95%] grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredSessions.flatMap(session =>
                  session.sessions?.map(subSession => (
                <SessionCard
                  key={`${session.id}-${subSession.sessionId}`}
                  session={{
                    id: subSession.sessionId,
                    participantId: participantDetails.find(p => p === session.id) || 0,
                    title: session.title,
                    meetingType: session.meetingType,
                    location: session.meetingPlace || '미정',
                    date: subSession.sessionStartDateTime
                      ? formatDate(new Date(subSession.sessionStartDateTime), 'yyyy.MM.dd')
                      : '날짜 없음',
                    startTime: subSession.sessionStartDateTime ? new Date(subSession.sessionStartDateTime) : null,
                    endTime: subSession.sessionEndDateTime ? new Date(subSession.sessionEndDateTime) : null,
                    currentStatus: subSession.currentStatus || 'UNKNOWN',
                    applicationStartDateTime: session.applicationStartDateTime ? new Date(session.applicationStartDateTime) : null,
                    applicationEndDateTime: session.applicationEndDateTime ? new Date(session.applicationEndDateTime) : null,
                    participantCapacity: session.participantCapacity,
                    satisfactionSurvey: session.satisfactionSurvey
                  }}
                  showToast={showToast}
                />

                  )) || []
                )}
              </div>

              ))}
            {toastMessage && (
              <div className="fixed right-4 top-4 z-50">
                <Toast
                  message={toastMessage}
                  onClose={() => setToastMessage(null)}
                />
              </div>
            )}
    </>
  );
}
