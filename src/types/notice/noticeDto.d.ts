import { NoticeFormSchemaType } from '@/components/notice/form/NoticeFormSchema';

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
