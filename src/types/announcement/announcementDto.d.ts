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

type AnnouncementPostRequest = {
  targetCourseList: {
    id: number;
    title: string;
    campusName: string;
  }[];
  noticeType: string;
  applicationForm: string;
  applicationStartDateTime: string;
  applicationEndDateTime: string;
  eventSchedule: string;
  eventTime: string;
  meetingType: {
    type: MeetingTypeKey;
    detail: '';
  };
  satisfactionSurvey: string;
  title: string;
  content: string;
  writerId: number;
};
