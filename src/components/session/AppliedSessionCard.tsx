import { useParams } from 'react-router-dom';

import { useGetPostDetail } from '@/services/post/postQueries';

import { appliedSessionStatusObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { AppliedSession, AppliedSessionStatusKey, NoticeDto } from '@/types';
import { formatDate, isValidUrl } from '@/utils';

import TrashButton from '@/components/common/button/TrashButton';
import Tag from '@/components/common/tag/Tag';
import AppliedSessionCancelModal from '@/components/session/AppliedSessionCancelModal';

interface AppliedSessionCardProps {
  session: AppliedSession;
}

export default function AppliedSessionCard({
  session,
}: AppliedSessionCardProps) {
  const { startDateTime, endDateTime, postId, sessionId: sId } = session;

  const params = useParams();

  const { data: noticeDetail } =
    useGetPostDetail<NoticeDto.GetNoticeDetail>(postId);

  const currSession = noticeDetail?.sessions?.find(
    ({ sessionId }) => sessionId === sId,
  );

  const checkIsEndSession = (sessionEndDateTime: string) => {
    return new Date(sessionEndDateTime).getTime() < new Date().getTime();
  };

  const { showDialog, showToast } = useDialogContext();

  const openSurveyLink = () => {
    if (!noticeDetail?.satisfactionSurvey) {
      showToast('만족도 조사 링크가 제공되지 않았습니다.');
      return;
    }

    const surveyUrl = noticeDetail?.satisfactionSurvey.trim();
    if (!isValidUrl(surveyUrl)) {
      showToast('만족도 조사 링크가 유효하지 않습니다.');
      return;
    }

    window.open(surveyUrl, '_black');
  };

  const handleShowDialog = async (participantSession: AppliedSession) => {
    await showDialog({
      key: 'SESSIONS-CANCEL-CARD-TYPE',
      element: currSession && (
        <AppliedSessionCancelModal
          session={{ ...participantSession, sessionId: currSession.sessionId }}
        />
      ),
    });
  };

  if (!currSession) return null;

  const isEndSession = checkIsEndSession(currSession?.sessionEndDateTime);
  const currentStatus: AppliedSessionStatusKey = isEndSession
    ? 'COMPLETE'
    : currSession.currentStatus || 'UNKNOWN';

  return (
    currSession &&
    currentStatus && (
      <div className="group relative flex w-full min-w-[300px] cursor-default flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-card">
        {!params?.userId && (
          <TrashButton
            onClick={() => handleShowDialog(session)}
            className="absolute right-[5%] top-[8%]"
          />
        )}

        <Tag
          size="big"
          text={appliedSessionStatusObj[currentStatus]}
          statusKey={currentStatus}
          className="!w-[86px] justify-center"
        />

        <h4 className="mt-3 line-clamp-2 text-xl font-medium text-black">
          {noticeDetail?.title} {currSession.ordinal}회차
        </h4>

        <ul className="my-2 flex flex-1 flex-col gap-1.5 text-sm font-normal text-darkGray">
          <li className="flex gap-1">
            <span className="min-w-fit">장소</span>
            <span>|</span>
            <span className="overflow-x-scroll truncate whitespace-nowrap scrollbar-hide">
              {noticeDetail?.meetingType === 'ONLINE' &&
                (noticeDetail?.meetingPlace ? (
                  <a
                    href="https://www.naver.com" // NOTE: url 변경하기
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-x-scroll truncate whitespace-nowrap text-blue-300 underline underline-offset-1 scrollbar-hide"
                  >
                    {noticeDetail?.meetingPlace}
                  </a>
                ) : (
                  <span className="text-darkGray">미정</span>
                ))}

              {noticeDetail?.meetingType === 'OFFLINE' &&
                (noticeDetail?.meetingPlace ? (
                  <span className="overflow-x-scroll truncate whitespace-nowrap scrollbar-hide">
                    {noticeDetail?.meetingPlace}
                  </span>
                ) : (
                  <span className="text-darkGray">미정</span>
                ))}
            </span>
          </li>

          <li className="flex gap-1">
            <span className="min-w-fit">일자</span>
            <span>|</span>
            <span className="overflow-x-scroll truncate whitespace-nowrap scrollbar-hide">
              {formatDate(startDateTime, 'yyyy.MM.dd') || '미정'}
            </span>
          </li>

          <li className="flex gap-1">
            <span className="min-w-fit">시간</span>
            <span>|</span>
            {startDateTime && endDateTime
              ? `${formatDate(startDateTime, 'HH:mm')} ~ ${formatDate(endDateTime, 'HH:mm')}`
              : '시간 미정'}
          </li>
        </ul>

        <button
          className="flex w-[25%] min-w-[90px] cursor-pointer items-center justify-center self-end rounded-lg bg-darkGray px-[2%] py-[2.5%] hover:bg-darkGray-hover active:bg-darkGray-active disabled:cursor-default disabled:bg-mainGray"
          onClick={openSurveyLink}
          disabled={noticeDetail?.satisfactionSurvey === ''}
          onKeyDown={event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            openSurveyLink();
          }}
        >
          <span className="whitespace-nowrap text-sm font-normal text-white">
            만족도 조사
          </span>
        </button>
      </div>
    )
  );
}
