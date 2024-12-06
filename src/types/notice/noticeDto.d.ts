import { Role } from '../user';

import { NoticeCategoryKey } from '@/constants';

export namespace NoticeDto {
  export type GetResponse = NoticeGetResponse;
  export type Post = NoticeFormSchemaType;
}

type Status = 'ACTIVE' | 'INACTIVE' | 'END';

type NoticeGetResponse = {
  id: number;
  title: string;
  content: string;
  writerName: string;
  startDate: string;
  endDate: string;
  status: Status;
  noticeType: string;
  createdDateTime: string;
  modifiedDateTime: string;
}[];

type MeetingType = { ONLINE: '온라인'; OFFLINE: '오프라인' };

type MeetingTypeKey = keyof MeetingType;
type MeetingTypeValue = MeetingType[keyof MeetingType];

type Session = {
  sessionStartDateTime: string;
  sessionEndDateTime: string;
};

type NoticePostRequiredParams = {
  targetCourseIdList: number[];
  noticeType: NoticeCategoryKey;
  title: string;
  content: string;
};

type NoticePostExtraParams = {
  applicationForm?: string;
  applicationStartDateTime?: string;
  applicationEndDateTime?: string;
  sessions: Session[];
  meetingType: MeetingTypeKey;
  meetingPlace: string;
  participantCapacity?: number;
  satisfactionSurvey?: string;
};

type NoticePostRequest = NoticePostRequiredParams &
  Partial<NoticePostExtraParams>;

// -------- type 재정의 --------
interface Notice {
  noticeId: number;
  userId: number;
  username: string;
  roleType: keyof Role;
  content: string;
  title: string;
  viewCount: number;
  noticeType: NoticeCategoryKey;
  createdDateTime: string;
  modifiedDateTime: string;
  isScraped: false;
  targetCourse: string[];
}

interface NoticeDetail
  extends Pick<Notice, 'title' | 'viewCount' | 'noticeType' | 'isScraped'> {
  id: number;
  content: string;
  status: Status;
  isPhoneNumberRequired: boolean;
  applicationStartDateTime: string;
  applicationEndDateTime: string;
  meetingPlace: string;
  meetingType: MeetingTypeKey;
  applicationForm: string;
  satisfactionSurvey: string;
  participantCapacity: number;
  writer: Writer;
  targetCourses: TargetCourses[];
  isScraped: boolean;
  sessions: Sessions[];
}

interface Writer {
  userId: number;
  userName: string;
  profileUrl: string;
  role: keyof Role;
}

interface TargetCourses {
  courseId: number;
  courseName: string;
}

interface Sessions {
  sessionId: number;
  sessionStartDateTime: string;
  sessionEndDateTime: string;
  participantCount: number;
  currentStatus: string | null;
}

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userName: string;
  userProfileUrl: string;
  roleType: keyof Role;
}

type GetNoticeListResponse = { notices: Notice[] };
type GetNoticeDetailResponse = NoticeDetail;
type GetNoticeCommentResponse = { comments: Comment[] };
