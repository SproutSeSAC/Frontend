import { Link } from 'react-router-dom';

import { useGetPostDetail } from '@/services/post/postQueries';

import { sessionStatusObj } from '@/constants';
import { NoticeDisplay, NoticeDto, SessionStatusKey } from '@/types';
import { formatDate, getDDay } from '@/utils';

import Tag from '@/components/common/tag/Tag';

interface AdminSessionCardListByNoticeProps {
  notice: NoticeDisplay;
}

export default function ManagingSessionCardList({
  notice,
}: AdminSessionCardListByNoticeProps) {
  const { postId } = notice;

  const { data: noticeDetail } =
    useGetPostDetail<NoticeDto.GetNoticeDetail>(postId);

  const getSessionStatus = (applicationEndDateTime: string) => {
    const checkIsEndSession = (endDateTime: string) => {
      return new Date(endDateTime).getTime() < new Date().getTime();
    };

    const isEndSession = checkIsEndSession(applicationEndDateTime);

    const currentStatus: SessionStatusKey = isEndSession
      ? 'INACTIVE'
      : noticeDetail?.status || 'UNKNOWN';

    return currentStatus;
  };

  if (!noticeDetail || !noticeDetail.sessions) return null;

  const { title, meetingType, applicationEndDateTime } = noticeDetail;

  return noticeDetail.sessions?.map(session => (
    <div
      key={session.sessionId}
      className="group relative flex w-full min-w-[300px] cursor-default flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Tag
          size="big"
          text={sessionStatusObj[getSessionStatus(applicationEndDateTime!)]}
          statusKey={getSessionStatus(applicationEndDateTime!)}
          className="!w-[86px] justify-center"
        />
        {getSessionStatus(applicationEndDateTime!) === 'ACTIVE' && (
          <Tag
            size="big"
            text={`마감 D${getDDay(applicationEndDateTime!)}`}
            color="lightGreen"
            className="justify-center"
          />
        )}
      </div>

      <h4 className="mt-3 line-clamp-2 text-xl font-medium text-black">
        {title} {session.ordinal}회차
      </h4>

      <ul className="mt-3 flex flex-1 flex-col gap-1.5 overflow-hidden text-sm font-normal text-darkGray">
        <li className="flex gap-1">
          <span className="min-w-fit">장소</span>
          <span>|</span>
          {noticeDetail?.meetingPlace &&
            (meetingType === 'ONLINE' ? (
              <a
                href="https://www.naver.com" // NOTE: url 변경하기
                target="_blank"
                rel="noreferrer"
                className="overflow-x-scroll truncate whitespace-nowrap text-blue-300 underline underline-offset-1 scrollbar-hide"
              >
                {noticeDetail.meetingPlace}
              </a>
            ) : (
              <span className="overflow-x-scroll whitespace-nowrap scrollbar-hide">
                {noticeDetail?.meetingPlace}
              </span>
            ))}

          {noticeDetail.meetingPlace === '' && <span>미정</span>}
        </li>
        <li className="flex gap-1">
          <span className="min-w-fit">일자</span>
          <span>|</span>
          <span>
            {formatDate(session.sessionStartDateTime, 'yyyy.MM.dd') ||
              '날짜 없음'}
          </span>
        </li>
        <li className="flex gap-1">
          <span className="min-w-fit">시간</span>
          <span>|</span>
          <span>
            {session.sessionStartDateTime && session.sessionEndDateTime
              ? `${formatDate(session.sessionStartDateTime, 'HH:mm')} ~ ${formatDate(session.sessionEndDateTime, 'HH:mm')}`
              : '시간 미정'}
          </span>
        </li>
      </ul>

      <Link
        to={`${postId}?sessionId=${session.sessionId}`}
        className="flex w-[25%] min-w-[90px] cursor-pointer items-center justify-center self-end whitespace-nowrap rounded-lg bg-darkGray px-[2%] py-[2.5%] text-sm font-normal text-white hover:bg-darkGray-hover active:bg-darkGray-active"
      >
        참여자 조회
      </Link>
    </div>
  ));
}
