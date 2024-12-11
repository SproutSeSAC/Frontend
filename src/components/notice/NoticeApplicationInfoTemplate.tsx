import { dateFormat } from '@/utils/dateFormat';

import { LIMITLESS_CAPACITY_NUM } from '@/constants';
import { MeetingType, NoticeDetail } from '@/types';

interface NoticeApplicationInfoTemplateProps {
  notice: NoticeDetail;
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
      data: `${dateFormat(applicationStartDateTime)} ~ ${dateFormat(applicationEndDateTime)}`,
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
                {dateFormat(item.sessionStartDateTime)}
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
                {dateFormat(item.sessionStartDateTime, 'HH:mm')} ~{' '}
                {dateFormat(item.sessionEndDateTime, 'HH:mm')}
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
      data: meetingPlace || '-',
    },
  ] as const;

  return (
    <ul className="mt-4 grid list-none grid-cols-2 gap-4 rounded-lg bg-white p-4 px-5 py-6 shadow-card">
      {noticeApplicationInfo.map(({ type, data }) => (
        <li key={type} className="flex items-center gap-3 py-1 text-[22px]">
          <h4 className="border-r-solid border-r border-r-gray2 pr-3 tracking-tighter text-gray2">
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
