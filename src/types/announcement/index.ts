import { AnnouncementDto } from '@/types/announcement/announcementDto';

export type AnnouncementCategory = {
  GENERAL: '통합';
  GENERAL_ANNOUNCEMENT: '일반공지';
  SPECIAL_LECTURE: '특강';
  EMPLOYMENT: '취업꿀팁';
  EVENT: '행사';
  ETC: '기타';
};

export type AnnouncementCategoryKey = keyof AnnouncementCategory;
export type AnnouncementCategoryValue =
  AnnouncementCategory[keyof AnnouncementCategory];

export type TooltipKeys = keyof Pick<
  AnnouncementDto.PostRequest,
  'meetingType' | 'satisfactionSurvey'
>;
