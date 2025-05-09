import {
  MeetingTypeKey,
  NoticeCategoryDisplayKey,
  NoticeSession,
  NoticeTargetCourse,
  NoticeWriter,
  PageableType,
  RoleKey,
} from '@/types';

export namespace SessionDto {
  export type GetSessionApplicantList = PageableType & { content: Applicant[] };
  export type GetAppliedSessionList = {
    allList: AppliedSession[];
    nearList: AppliedSession[];
  };
  export type GetNoticeSessionList = NoticeSessionDetail[];
}

type Applicant = {
  noticeParticipantId: number;
  userId: number;
  userName: string;
  nickName: string;
  phoneNumber: string;
  email: string;
  profileImageUrl: string;
  status: 'WAIT' | 'PARTICIPANT' | 'REJECT';
  campuses: { id: number; name: string }[];
  courses: { id: number; name: string }[];
  applicationDateTime: string;
};

type AppliedSession = {
  title: string;
  postId: number;
  sessionId: number;
  participantId: number;
  startDateTime: string;
  endDateTime: string;
  role: RoleKey;
  ordinal: number;
};

type NoticeSessionDetail = {
  postId: number;
  noticeId: number;
  title: string;
  noticeType: NoticeCategoryDisplayKey;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  applicationStartDateTime: string;
  applicationEndDateTime: string;
  meetingPlace: string;
  meetingType: MeetingTypeKey;
  participantCapacity: number;
  writer: NoticeWriter;
  targetCourses: NoticeTargetCourse[];
  session: NoticeSession;
};
