import { AnnouncementDto } from '@/types/announcement/announcementDto';
import { Role } from '@/types/userInfoDto';

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

export * from '@/types/announcement/announcementDto';

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

export type TooltipKeys = keyof Pick<
  AnnouncementDto.PostRequest,
  'meetingType' | 'satisfactionSurvey'
>;
