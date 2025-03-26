import { LIMITLESS_CAPACITY_NUM } from '@/constants';
import { MeetingType, NoticeDto } from '@/types';
import { formatDate } from '@/utils';

import Tag from '@/components/common/tag/Tag';

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
      data: (
        <>
          <div className="mb-1.5 flex flex-wrap gap-1.5 tracking-normal">
            <Tag
              text="시작"
              color="grayLight"
              size="big"
              className="!px-2.5 !py-0"
            />

            <span className="flex-1 pr-1">
              {formatDate(applicationStartDateTime, 'yyyy.MM.dd')}
            </span>
            <span className="text-darkGray-hover">
              {formatDate(applicationStartDateTime, 'a h시 mm분')}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 tracking-normal">
            <Tag
              text="마감"
              color="grayLight"
              size="big"
              className="!px-2.5 !py-0"
            />
            <span className="pr-1">
              {formatDate(applicationEndDateTime, 'yyyy.MM.dd')}
            </span>
            <span className="text-darkGray-hover">
              {formatDate(applicationEndDateTime, 'a h시 mm분')}
            </span>
          </div>
        </>
      ),
    },
    {
      type: '장소',
      data: meetingType === 'ONLINE' ? '-' : meetingPlace || '-',
    },
    {
      type: '유형',
      data: noticeDisplay[meetingType],
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
            <li key={item.sessionId} className="flex gap-1.5 tracking-normal">
              <Tag
                text={`${index + 1}회차`}
                color="grayLight"
                size="big"
                className="min-w-fit !px-2.5 !py-0"
              />
              <span className="flex-1">
                {formatDate(item.sessionStartDateTime, 'yyyy.MM.dd')}{' '}
                <span className="text-darkGray-hover">
                  {formatDate(item.sessionStartDateTime, 'a h시 mm분')} ~
                </span>{' '}
                <span className="text-darkGray-hover">
                  {formatDate(item.sessionEndDateTime, 'a h시 mm분')}
                </span>
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
          className={`flex py-1 text-[22px] ${type === '일시' && 'col-span-2'}`}
        >
          <h4 className="min-w-20 tracking-tighter text-mainGray-active">
            {type}
          </h4>
          <span className="mr-3 text-mainGray-active">|</span>
          {type === '일시' ? (
            <ul className="flex flex-col gap-y-1.5 tracking-tight">{data}</ul>
          ) : (
            <span>{data}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
