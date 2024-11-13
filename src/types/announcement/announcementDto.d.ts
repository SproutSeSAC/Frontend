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

type AnnouncementPostBaseRequest = {
  targetCourseList: {
    id: number;
    title: string;
    campusName: string;
  }[];
  noticeType: AnnouncementCategoryKey;
  title: string;
  content: string;
  writerId: number;
};

type SpecialLectureAndEventPostRequest = {
  applicationForm?: string; // 2024-11-13
  applicationStartDateTime?: string; // 2024-11-13T18:00:00.046Z
  applicationEndDateTime?: string; // 2024-11-13T18:00:00.046Z

  eventDate?: string; // 2024-11-13
  eventStartTime?: string; // 2024-11-13T18:00:00.046Z
  eventEndTime?: string; // 2024-11-13T18:00:00.046Z

  participantCapacity?: number;
  meetingType?: {
    type: MeetingTypeKey;
    detail: string;
  };
  satisfactionSurvey?: string;
};

type AnnouncementPostRequest = AnnouncementPostBaseRequest &
  SpecialLectureAndEventPostRequest;
