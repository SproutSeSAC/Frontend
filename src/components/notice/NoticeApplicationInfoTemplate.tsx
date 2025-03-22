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
      type: '유형',
      data: noticeDisplay[meetingType],
    },
    {
      type: '장소',
      data: meetingType === 'ONLINE' ? '-' : meetingPlace || '-',
    },
    {
      type: '일시',
      data: sessions
        ? sessions.map(item => (
            <li key={item.sessionId}>
              <span>
                {formatDate(item.sessionStartDateTime, 'yyyy.MM.dd a h시 mm분')}{' '}
                ~ {formatDate(item.sessionEndDateTime, 'a h시 mm분')}
              </span>
            </li>
          ))
        : '-',
    },
  ] as const;

  return (
    <ul className="mt-4 grid list-none grid-cols-2 gap-x-6 gap-y-4 rounded-lg bg-white p-4 px-5 py-6 shadow-card">
      {noticeApplicationInfo.map(({ type, data }) => (
        <li
          key={type}
          className={`flex items-center gap-3 py-1 text-[22px] ${type === '일시' && 'col-span-2'}`}
        >
          <h4 className="mr-3 min-w-14 border-r border-r-mainGray-active pr-3 tracking-tighter text-mainGray-active">
            {type}
          </h4>
          {type === '일시' ? (
            <ul className="flex flex-1 flex-wrap tracking-tight">{data}</ul>
          ) : (
            <span>{data}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
