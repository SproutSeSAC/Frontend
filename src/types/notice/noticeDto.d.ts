import { NoticeCategoryKey } from '@/types/notice';

export namespace NoticeDto {
  export type GetResponse = NoticeGetResponse;
  export type PostRequest = NoticePostRequest;
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
