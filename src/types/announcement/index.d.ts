import { AnnouncementDto } from '@/types/announcement/announcementDto';
import { Role } from '@/types/userInfoDto';

export * from '@/types/announcement/announcementDto';

type AdminRole = Pick<
  Role,
  'CAMPUS_MANAGER' | 'EDU_MANAGER' | 'JOB_COORDINATOR'
>;

type AnnouncementTabKind = {
  ALL: '전체';
  BOOKMARK: '북마크';
  EDIT: '공지사항 등록';
} & AdminRole;

export type KeyOfAnnouncementTabKind = keyof AnnouncementTabKind;

export type AnnouncementTab = {
  text: AnnouncementTabKind[KeyOfAnnouncementTabKind];
  type: keyof AnnouncementTabKind;
};

export type AnnouncementCategory = {
  ALL: '통합';
  GENERAL_ANNOUNCEMENT: '일반공지';
  SPECIAL_LECTURE: '특강';
  EMPLOYMENT: '취업정보';
  EVENT: '행사';
  ETC: '기타';
};
export type AnnouncementCategoryKey = keyof AnnouncementCategory;
export type AnnouncementCategoryValue =
  AnnouncementCategory[keyof AnnouncementCategory];

export type SpecialLectureOrEventValue = Extract<
  AnnouncementCategoryValue,
  '행사' | '특강'
>;

export type TooltipKeys = keyof Pick<
  AnnouncementDto.PostRequest,
  'meetingType' | 'satisfactionSurvey'
>;

export type AnnouncementFilter = {
  page: number;
  size: number;
  announcementType: AnnouncementCategoryKey;
  keyword?: string;
};
