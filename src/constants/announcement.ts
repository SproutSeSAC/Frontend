import {
  AnnouncementCategoryKey,
  AnnouncementCategoryValue,
  AnnouncementDto,
  MeetingTypeKey,
  MeetingTypeValue,
  TooltipKeys,
} from '@/types';

export const announcementCategoryFilterList: {
  id: number;
  key: AnnouncementCategoryKey;
  name: AnnouncementCategoryValue;
}[] = [
  { id: 1, key: 'GENERAL', name: '통합' },
  { id: 2, key: 'SPECIAL_LECTURE', name: '특강' },
  { id: 3, key: 'EMPLOYMENT', name: '취업꿀팁' },
];

export const announcementCategoryOptions: {
  id: number;
  key: AnnouncementCategoryKey;
  name: AnnouncementCategoryValue;
}[] = [
  { id: 1, key: 'GENERAL_ANNOUNCEMENT', name: '일반공지' },
  { id: 2, key: 'SPECIAL_LECTURE', name: '특강' },
  { id: 3, key: 'EMPLOYMENT', name: '취업꿀팁' },
  { id: 4, key: 'EVENT', name: '행사' },
  { id: 5, key: 'ETC', name: '기타' },
];

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

export const defaultAnnouncementFormValues: AnnouncementDto.PostRequest = {
  targetCourseList: [],
  noticeType: '',
  applicationForm: '',
  applicationStartDateTime: '',
  applicationEndDateTime: '',
  eventSchedule: '',
  eventTime: '',
  meetingType: {
    type: 'ONLINE',
    detail: '',
  },
  satisfactionSurvey: '',
  title: '',
  content: '',
  writerId: 0,
};
