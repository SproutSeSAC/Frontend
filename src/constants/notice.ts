import {
  NoticeCategoryKey,
  NoticeCategoryValue,
  NoticeTab,
  TooltipKeys,
} from '@/types/notice';
import {
  MeetingType,
  MeetingTypeKey,
  MeetingTypeValue,
  NoticeDto,
} from '@/types/notice/noticeDto';

export const noticeTabList: NoticeTab[] = [
  { text: '전체', type: 'ALL' },
  { text: '캠퍼스 매니저', type: 'CAMPUS_MANAGER' },
  { text: '교육 매니저', type: 'EDU_MANAGER' },
  { text: '잡코디', type: 'JOB_COORDINATOR' },
  { text: '북마크', type: 'BOOKMARK' },
];

export const noticeCategoryOptions: {
  id: number;
  key: NoticeCategoryKey;
  name: NoticeCategoryValue;
  needExtraInfo: boolean;
}[] = [
  {
    id: 1,
    key: 'GENERAL_NOTICE',
    name: '일반공지',
    needExtraInfo: false,
  },
  { id: 2, key: 'SPECIAL_LECTURE', name: '특강', needExtraInfo: true },
  { id: 3, key: 'EMPLOYMENT', name: '취업정보', needExtraInfo: false },
  { id: 4, key: 'EVENT', name: '행사', needExtraInfo: true },
  { id: 5, key: 'ETC', name: '기타', needExtraInfo: false },
];

export const noticeCategoryFilterList: {
  id: number;
  key: NoticeCategoryKey;
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
date.setHours(18, 0, 0, 0);
const todayDateTime = date.toString();

const specialLectureEventFormValues = {
  applicationForm: '',
  applicationStartDateTime: todayDateTime,
  applicationEndDateTime: todayDateTime,
  sessions: [
    {
      sessionStartDateTime: '',
      sessionEndDateTime: '',
    },
  ],
  meetingType: 'ONLINE' as keyof MeetingType,
  meetingPlace: '',
  participantCapacity: 0,
  satisfactionSurvey: '',
};

export const defaultNoticeFormValues: NoticeDto.PostRequest = {
  targetCourseIdList: [],
  noticeType: 'GENERAL_NOTICE',
  title: '',
  content: '',
  ...specialLectureEventFormValues,
};
