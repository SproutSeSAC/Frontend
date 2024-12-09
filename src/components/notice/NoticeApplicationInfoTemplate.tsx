import { dateFormat } from '@/utils/dateFormat';

import { MeetingType, NoticeDetail } from '@/types';

interface NoticeApplicationInfoTemplateProps {
  notice: NoticeDetail | undefined;
}
export const noticeDisplay: { [key in keyof MeetingType]: string } = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
};

export default function NoticeApplicationInfoTemplate({
  notice,
}: NoticeApplicationInfoTemplateProps) {
  return (
    <div>
      <div className="mt-4 flex w-full gap-5 rounded-lg bg-white p-4 px-5 py-6 shadow-card">
        <div className="flex w-1/2 flex-col gap-6">
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid min-w-14 border-r border-r-gray2 pr-3 text-gray2">
              기간
            </div>
            <div className="">
              {notice?.applicationStartDateTime &&
              notice?.applicationEndDateTime
                ? ` ${dateFormat(notice.applicationStartDateTime)} ~ ${dateFormat(notice.applicationEndDateTime)}`
                : '-'}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid min-w-14 border-r border-r-gray2 pr-3 text-gray2">
              일시
            </div>
            <div>
              {notice && notice?.sessions
                ? notice.sessions.map((item, index) => (
                    <span key={item.sessionId}>
                      {dateFormat(item.sessionStartDateTime)}
                      {index !==
                        (notice?.sessions && notice.sessions.length - 1) &&
                        ' / '}
                    </span>
                  ))
                : '-'}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              유형
            </div>
            <div className="">
              {notice?.meetingType
                ? noticeDisplay[notice.meetingType] || '-'
                : '-'}
            </div>
          </div>
        </div>

        <div className="flex w-1/2 flex-col gap-6">
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid min-w-14 border-r border-r-gray2 pr-3 text-gray2">
              인원
            </div>
            <div>{notice?.participantCapacity || 0}명</div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              시간
            </div>
            <div className="">
              {notice?.applicationStartDateTime &&
              notice?.applicationEndDateTime
                ? `${dateFormat(notice?.applicationStartDateTime, 'HH:mm')} ~ ${dateFormat(notice?.applicationEndDateTime, 'HH:mm')}`
                : 0}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              장소
            </div>
            <div>{notice?.meetingPlace || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
