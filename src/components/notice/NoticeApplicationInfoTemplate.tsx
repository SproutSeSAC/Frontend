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
        <div className="flex flex-wrap gap-2.5">
          <div className="flex flex-wrap gap-1.5 tracking-normal">
            <Tag
              text="시작"
              color="grayLight"
              size="big"
              className="!px-2.5 !py-0"
            />

            <span className="inline-block shrink-0">
              {formatDate(applicationStartDateTime, 'yyyy.MM.dd')}
            </span>
            <span className="tracking-tighter text-darkGray-hover">
              {formatDate(applicationStartDateTime, 'a h시 mm분')}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Tag
              text="마감"
              color="grayLight"
              size="big"
              className="!px-2.5 !py-0"
            />
            <span className="inline-block shrink-0">
              {formatDate(applicationEndDateTime, 'yyyy.MM.dd')}
            </span>
            <span className="tracking-tighter text-darkGray-hover">
              {formatDate(applicationEndDateTime, 'a h시 mm분')}
            </span>
          </div>
        </div>
      ),
    },
    {
      type: '유형',
      data: noticeDisplay[meetingType],
    },
    {
      type: '장소',
      data:
        meetingType === 'ONLINE' ? (
          <span className="text-darkGray">추후 링크 제공 예정</span>
        ) : (
          meetingPlace || <span className="text-darkGray">장소 미정</span>
        ),
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
                className="!min-w-14 !px-2.5 !py-0"
              />
              <div className="flex-1 leading-[23px]">
                <span className="inline-block min-w-[110px] shrink-0 pr-2">
                  {formatDate(item.sessionStartDateTime, 'yyyy.MM.dd')}
                </span>
                <span className="inline-block tracking-tighter text-darkGray-hover">
                  {formatDate(item.sessionStartDateTime, 'a h시 mm분')}
                </span>
                <span className="px-1 text-darkGray-hover">~</span>
                <span className="tracking-tighter text-darkGray-hover">
                  {formatDate(item.sessionEndDateTime, 'a h시 mm분')}
                </span>
              </div>
            </li>
          ))
        : '-',
    },
  ] as const;

  return (
    <ul className="grid list-none grid-cols-2 gap-x-6 gap-y-6 rounded-[20px] bg-white p-7">
      {noticeApplicationInfo.map(({ type, data }) => (
        <li
          key={type}
          className={`flex gap-2.5 text-xl ${(type === '일시' || type === '신청기간') && 'col-span-2'}`}
        >
          <h4 className="h-fit min-w-[78px] border-r-2 leading-[23px] tracking-tighter text-mainGray-active">
            {type}
          </h4>
          {type === '일시' ? (
            <ul className="flex flex-col gap-y-2.5 tracking-tight">{data}</ul>
          ) : (
            <span className="leading-[23px]">{data}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
