import { PageableType, RoleKey } from '@/types';

export namespace SessionDto {
  export type GetSessionApplicantList = PageableType & { content: Applicant[] };
  export type GetAppliedSessionList = {
    allList: AppliedSession[];
    nearList: AppliedSession[];
  };
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
  applicationTime?: string;
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
