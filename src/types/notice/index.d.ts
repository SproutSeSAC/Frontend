import { noticeCategoryDisplay, noticeTabDisplay } from '@/constants';
import { PaginationFilter } from '@/types/filter';
import { NoticeDto } from '@/types/notice/noticeDto';
import { AppliedSessionStatusKey } from '@/types/session';
import { HasAdminRole } from '@/types/user';

export * from '@/types/notice/noticeDto';

/* Notice Tab */
export type NoticeTabDisplay = typeof noticeTabDisplay;
export type NoticeTabDisplayKey = keyof NoticeTabDisplay;
export type NoticeTabDisplayValue = NoticeTabDisplay[keyof NoticeTabDisplay];
export type NoticeTabList = {
  type: NoticeTabDisplayKey;
  text: NoticeTabDisplayValue;
}[];

/* Notice Category */
export type NoticeCategoryDisplay = typeof noticeCategoryDisplay;
export type NoticeCategoryDisplayKey = keyof NoticeCategoryDisplay;
export type NoticeCategoryDisplayValue =
  NoticeCategoryDisplay[keyof NoticeCategoryDisplay];
export type NoticeCategoryList = {
  id: number;
  key: NoticeCategoryDisplayKey;
  name: NoticeCategoryDisplayValue;
  needExtraInfo: boolean;
}[];

/* Notice Form */
export type SpecialLectureOrEventValue = Extract<
  NoticeCategoryValue,
  '행사' | '특강'
>;
export type TooltipKeys = keyof Pick<
  NoticeDto.PostNotice,
  'meetingType' | 'satisfactionSurvey'
>;
export type MeetingType = { ONLINE: '온라인'; OFFLINE: '오프라인' };
export type MeetingTypeKey = keyof MeetingType;
export type MeetingTypeValue = MeetingType[keyof MeetingType];

/* Notice Detail */
export type NoticeTargetCourse = {
  courseId: number;
  courseName: string;
};
export type NoticeWriter = {
  userId: number;
  userName: string;
  profileUrl: string;
  role: keyof HasAdminRole;
};
export type NoticeSession = {
  sessionId: number;
  sessionStartDateTime: string;
  sessionEndDateTime: string;
  participantCount: number;
  currentStatus: AppliedSessionStatusKey;
  ordinal: number;
};

/* Notice 필터 */
export type NoticeFilter = PaginationFilter & {
  noticeType?: NoticeCategoryDisplayKey;
  roleType?: NoticeTabDisplayKey;
  keyword?: string;
  onlyScraped?: boolean;
  offset?: boolean;
};

export type NoticeCommentParams = {
  commentId: number;
};
