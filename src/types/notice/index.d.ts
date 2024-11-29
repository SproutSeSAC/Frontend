import { NoticeDto } from '@/types/notice/noticeDto';
import { Role } from '@/types/userInfoDto';

export * from '@/types/notice/noticeDto';

type AdminRole = Pick<
  Role,
  'CAMPUS_MANAGER' | 'EDU_MANAGER' | 'JOB_COORDINATOR'
>;

type NoticeTabKind = {
  ALL: '전체';
  BOOKMARK: '북마크';
  EDIT: '공지사항 등록';
} & AdminRole;

export type KeyOfNoticeTabKind = keyof NoticeTabKind;

export type NoticeTab = {
  text: NoticeTabKind[KeyOfNoticeTabKind];
  type: keyof NoticeTabKind;
};

export type NoticeCategory = {
  ALL: '통합';
  GENERAL_NOTICE: '일반공지';
  SPECIAL_LECTURE: '특강';
  EMPLOYMENT: '취업정보';
  EVENT: '행사';
  ETC: '기타';
};
export type NoticeCategoryKey = keyof NoticeCategory;
export type NoticeCategoryValue = NoticeCategory[keyof NoticeCategory];

export type SpecialLectureOrEventValue = Extract<
  NoticeCategoryValue,
  '행사' | '특강'
>;

export type TooltipKeys = keyof Pick<
  NoticeDto.PostRequest,
  'meetingType' | 'satisfactionSurvey'
>;

export type NoticeFilter = {
  page: number;
  size: number;
  noticeType: NoticeCategoryKey;
  keyword?: string;
};
