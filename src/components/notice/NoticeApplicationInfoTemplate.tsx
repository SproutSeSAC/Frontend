import { LIMITLESS_CAPACITY_NUM } from '@/constants';
import { MeetingType, NoticeDto } from '@/types';
import { formatDate } from '@/utils';

interface NoticeApplicationInfoTemplateProps {
  notice: NoticeDto.GetNoticeDetail;
}
export const noticeDisplay: { [key in keyof MeetingType]: string } = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
};

export default function NoticeApplicationInfoTemplate({
  notice: {
    applicationEndDateTime = '',
    applicationStartDateTime = '',
    sessions = [],
    participantCapacity = 10000,
    meetingType = 'OFFLINE',
    meetingPlace = '',
  },
}: NoticeApplicationInfoTemplateProps) {
  const noticeApplicationInfo = [
    {
      type: '신청기간',
      data: `${formatDate(applicationStartDateTime, 'yyyy.MM.dd a h시')} ~ ${formatDate(applicationEndDateTime, 'yyyy.MM.dd a h시')}`,
    },
    {
      type: '인원',
      data:
        participantCapacity >= LIMITLESS_CAPACITY_NUM
          ? '제한 없음'
          : `${participantCapacity}명`,
    },
    {
      type: '일시',
      data: sessions
        ? sessions.map((item, index) => (
            <li key={item.sessionId}>
              <span>
                {formatDate(item.sessionStartDateTime)}
                <span className="px-2">
                  {index !== sessions.length - 1 && '/ '}
                </span>
              </span>
            </li>
          ))
        : '-',
    },
    {
      type: '시간',
      data: sessions
        ? sessions.map((item, index) => (
            <li key={item.sessionId}>
              <span>
                {formatDate(item.sessionStartDateTime, 'HH:mm')} ~{' '}
                {formatDate(item.sessionEndDateTime, 'HH:mm')}
                <span className="px-2">
                  {index !== sessions.length - 1 && '/ '}
                </span>
              </span>
            </li>
          ))
        : '-',
    },
    {
      type: '유형',
      data: noticeDisplay[meetingType],
    },
    {
      type: '장소',
      data: meetingType === 'ONLINE' ? '-' : meetingPlace || '-',
    },
  ] as const;

  return (
    <ul className="mt-4 grid list-none grid-cols-2 gap-x-6 gap-y-4 rounded-lg bg-white p-4 px-5 py-6 shadow-card">
      {noticeApplicationInfo.map(({ type, data }) => (
        <li key={type} className="flex items-center gap-3 py-1 text-[22px]">
          <h4 className="border-r-solid mr-3 min-w-16 border-r border-r-mainGray pr-3 tracking-tighter text-mainGray">
            {type}
          </h4>
          {type === '일시' || type === '시간' ? (
            <ul className="flex flex-1 flex-wrap">{data}</ul>
          ) : (
            <span>{data}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
