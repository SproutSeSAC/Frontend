import {
  MeetingTypeKey,
  MeetingTypeValue,
  NoticeCategoryList,
  NoticeTabList,
  TooltipKeys,
} from '@/types/notice';
import { NoticeDto } from '@/types/notice/noticeDto';

export const noticeTabDisplay = {
  ALL: '전체',
  BOOKMARK: '북마크',
  CAMPUS_MANAGER: '캠퍼스 매니저',
  EDU_MANAGER: '교육 매니저',
  JOB_COORDINATOR: '잡코디',
  EDIT: '공지사항 등록',
} as const;

export const noticeCategoryDisplay = {
  ALL: '통합',
  GENERAL: '일반공지',
  SPECIAL_LECTURE: '특강',
  EMPLOYMENT: '취업정보',
  EVENT: '행사',
  ETC: '기타',
} as const;

export const noticeTabList: NoticeTabList = [
  { text: '전체', type: 'ALL' },
  { text: '캠퍼스 매니저', type: 'CAMPUS_MANAGER' },
  { text: '교육 매니저', type: 'EDU_MANAGER' },
  { text: '잡코디', type: 'JOB_COORDINATOR' },
  { text: '북마크', type: 'BOOKMARK' },
];

export const noticeCategoryListOfForm: NoticeCategoryList = [
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

export const noticeCategoryList: NoticeCategoryList = [
  { id: 0, key: 'ALL', name: '통합', needExtraInfo: false },
  ...noticeCategoryListOfForm,
];

export const meetingTypeOptionList: {
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
  meetingType: 'ONLINE' as MeetingTypeKey,
  meetingPlace: undefined,
  participantCapacity: LIMITLESS_CAPACITY_NUM,
  satisfactionSurvey: undefined,
  isPhoneNumberRequired: false,
};

export const defaultNoticeFormValues: NoticeDto.PostNotice = {
  targetCourseIdList: [],
  noticeType: 'GENERAL',
  title: '',
  content: '',
};
