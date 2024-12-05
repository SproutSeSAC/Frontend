import { NoticeCategoryValue, NoticeTab, TooltipKeys } from '@/types/notice';
import {
  MeetingType,
  MeetingTypeKey,
  MeetingTypeValue,
  NoticeDto,
} from '@/types/notice/noticeDto';

import { NoticeCategoryKeySchemaType } from '@/components/notice/form/NoticeFormSchema';

export const noticeTabList: NoticeTab[] = [
  { text: '전체', type: 'ALL' },
  { text: '캠퍼스 매니저', type: 'CAMPUS_MANAGER' },
  { text: '교육 매니저', type: 'EDU_MANAGER' },
  { text: '잡코디', type: 'JOB_COORDINATOR' },
  { text: '북마크', type: 'BOOKMARK' },
];

export const noticeCategoryOptions: {
  id: number;
  key: NoticeCategoryKeySchemaType;
  name: NoticeCategoryValue;
  needExtraInfo: boolean;
}[] = [
  {
    id: 1,
    key: 'GENERAL',
    name: '일반공지',
    needExtraInfo: false,
  },
  { id: 2, key: 'SPECIAL_LECTURE', name: '특강', needExtraInfo: true },
  { id: 3, key: 'EMPLOYMENT', name: '취업정보', needExtraInfo: false },
  { id: 4, key: 'EVENT', name: '행사', needExtraInfo: true },
  { id: 5, key: 'ETC', name: '기타', needExtraInfo: false },
];

export const NOTICE_ALL = 'ALL';
export const NOTICE_GENERAL = 'GENERAL';
export const NOTICE_SPECIAL_LECTURE = 'SPECIAL_LECTURE';
export const NOTICE_EMPLOYMENT = 'EMPLOYMENT';
export const NOTICE_EVENT = 'EVENT';
export const NOTICE_ETC = 'ETC';

export type NoticeCategoryKey =
  | typeof NOTICE_ALL
  | typeof NOTICE_GENERAL
  | typeof NOTICE_SPECIAL_LECTURE
  | typeof NOTICE_EMPLOYMENT
  | typeof NOTICE_EVENT
  | typeof NOTICE_ETC;

// NoticeCategoryKeySchemaType 사용시 사용처에서 타입에러 발생해서 NoticeCategoryKey 새로운 타입 정의함.
// notice type 정리가 안되어있어서 전체적으로 타입 재정의 필요함.
export const noticeCategoryDisplay: { [key in NoticeCategoryKey]: string } = {
  ALL: '통합',
  GENERAL: '일반공지',
  SPECIAL_LECTURE: '특강',
  EMPLOYMENT: '취업정보',
  EVENT: '행사',
  ETC: '기타',
};

export const noticeCategoryFilterList: {
  id: number;
  key: NoticeCategoryKeySchemaType;
  name: NoticeCategoryValue;
}[] = [{ id: 1, key: 'ALL', name: '통합' }, ...noticeCategoryOptions];

export const meetingTypeOptions: {
  id: number;
  name: MeetingTypeValue;
  key: MeetingTypeKey;
}[] = [
  { id: 1, name: '온라인', key: 'ONLINE' },
  { id: 2, name: '오프라인', key: 'OFFLINE' },
];

export const tooltip: Record<TooltipKeys, string> = {
  satisfactionSurvey:
    '특강/행사 시작 10분 후 신청한 교육생들에게 만족도조사 링크 알림이 전송됩니다.',
  meetingType:
    '온라인인 경우 Zoom 링크를, 오프라인인 경우 장소 위치를 작성해 주세요',
};

const date = new Date();
date.setHours(19, 0, 0, 0);
export const defaultIsoDateTime = date.toISOString();

export const LIMITLESS_CAPACITY_NUM = 10000;

export const specialLectureEventFormValues = {
  applicationStartDateTime: defaultIsoDateTime,
  applicationEndDateTime: defaultIsoDateTime,
  sessions: [
    {
      id: 1,
      sessionStartDateTime: defaultIsoDateTime,
      sessionEndDateTime: defaultIsoDateTime,
    },
  ],
  meetingType: 'ONLINE' as keyof MeetingType,
  meetingPlace: undefined,
  participantCapacity: LIMITLESS_CAPACITY_NUM,
  satisfactionSurvey: undefined,
  isPhoneNumberRequired: false,
};

export const defaultNoticeFormValues: NoticeDto.Post = {
  targetCourseIdList: [],
  noticeType: 'GENERAL',
  title: '',
  content: '',
};
