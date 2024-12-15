import { ManagerRole } from '../user';

import { StatusBase } from '@/constants/serviceConstant';
import {
  MeetingTypeKey,
  NoticeCategoryDisplayKey,
  NoticeSession,
  NoticeTargetCourse,
  NoticeWriter,
} from '@/types/notice';

import { NoticeFormSchemaType } from '@/components/notice/form/NoticeFormSchema';

export namespace NoticeDto {
  export type GetNoticeList = {
    isLastPage: boolean;
    notices: NoticeDisplay[];
  };
  export type GetNoticeDetail = NoticeDetail;
  export type GetNoticeComment = { comments: NoticeComment[] };

  export type PostNotice = NoticeFormSchemaType;
}

interface NoticeCommonFields {
  title: string;
  content: string;
  noticeType: NoticeCategoryDisplayKey;
  isScraped: boolean;
  viewCount: number;
}

interface NoticeDisplay extends NoticeCommonFields {
  noticeId: number;
  userId: number;
  username: string;
  roleType: keyof ManagerRole;
  isContentOverMaxLength: boolean;
  createdDateTime: string;
  modifiedDateTime: string;
  targetCourse: string[];
}

interface NoticeDetail extends NoticeCommonFields {
  id: number;
  viewCount: number;
  status: StatusBase;
  writer: NoticeWriter;
  targetCourses: NoticeTargetCourse[];
  // Optional
  sessions?: NoticeSession[];
  isPhoneNumberRequired?: boolean;
  applicationStartDateTime?: string;
  applicationEndDateTime?: string;
  meetingPlace?: string;
  meetingType?: MeetingTypeKey;
  satisfactionSurvey?: string;
  participantCapacity?: number;
}

interface NoticeComment {
  commentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userName: string;
  userProfileUrl: string;
  roleType: keyof Role;
}
