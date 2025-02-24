import { SessionStatus, StatusBase } from '@/constants/serviceConstant';
import {
  MeetingTypeKey,
  NoticeCategoryDisplayKey,
  NoticeSession,
  NoticeTargetCourse,
  NoticeWriter,
} from '@/types/notice';
import { HasAdminRole } from '@/types/user';

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
  postId: number;
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
  roleType: keyof HasAdminRole;
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
  createdAt: string;
  // Optional
  sessions?: NoticeSession[];
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

interface NoticeSessionParticipantsStatus {
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };

  first: boolean;
  last: boolean;
  empty: boolean;

  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    unpaged: boolean;
    paged: boolean;
    pageNumber: number;
    pageSize: number;
  };

  content: [
    {
      userId: number;
      status: SessionStatus;
      userName: string;
      nickName: string;
      profileImageUrl: string;
    },
  ];
}
