import { noticeCategoryDisplay, noticeTabDisplay } from '@/constants';
import { SessionStatus } from '@/constants/serviceConstant';
import { NoticeDto } from '@/types/notice/noticeDto';
import { ManagerRole } from '@/types/user';

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
  role: keyof ManagerRole;
};
export type NoticeSession = {
  sessionId: number;
  sessionStartDateTime: string;
  sessionEndDateTime: string;
  participantCount: number;
  currentStatus: SessionStatus;
};

/* Notice Request Params */
export type NoticeIdParams = {
  noticeId: string;
};
export type NoticeSessionParams = {
  sessionId: number;
  participantId?: number;
};
export type NoticeCommentParams = {
  commentId: number;
};
