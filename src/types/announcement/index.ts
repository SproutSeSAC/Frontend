import { AnnouncementDto } from '@/types/announcement/announcementDto';

export type AnnouncementCategory = {
  GENERAL: '통합';
  SPECIAL_LECTURE: '특강';
  EMPLOYMENT: '취업꿀팁';
  MATCHING_DAY: '매칭데이';
};

export type AnnouncementCategoryKey = keyof AnnouncementCategory;
export type AnnouncementCategoryValue =
  AnnouncementCategory[keyof AnnouncementCategory];

export type TooltipKeys = keyof Pick<
  AnnouncementDto.PostRequest,
  'meetingType' | 'satisfactionSurvey'
>;
