import { AnnouncementCategoryKey } from '@/types/announcement';

export namespace AnnouncementDto {
  export type GetResponse = AnnouncementGetResponse;
  export type PostRequest = AnnouncementPostRequest;
}

type Status = 'ACTIVE' | 'INACTIVE' | 'END';

type AnnouncementGetResponse = {
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

type AnnouncementPostRequiredParams = {
  targetCourseIdList: number[];
  noticeType: AnnouncementCategoryKey;
  title: string;
  content: string;
};

type AnnouncementPostExtraParams = {
  applicationForm?: string;
  applicationStartDateTime?: string;
  applicationEndDateTime?: string;
  sessions: Session[];
  meetingType: MeetingTypeKey;
  meetingPlace: string;
  participantCapacity?: number;
  satisfactionSurvey?: string;
};

type AnnouncementPostRequest = AnnouncementPostRequiredParams &
  Partial<AnnouncementPostExtraParams>;
