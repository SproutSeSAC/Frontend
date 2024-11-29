import { z } from 'zod';

export type RegisterSchemaType = z.infer<typeof NoticeFormSchema>;

export const NoticeFormSchema = z
  .object({
    targetCourseIdList: z //
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
        }),
      )
      .min(1, '최소 하나의 교육과정을 선택해야 합니다.'),

    noticeType: z //
      .string()
      .min(1, '공지 유형이 선택되지 않았습니다.'),

    applicationForm: z //
      .string()
      .min(1, '신청 폼이 작성되지 않았습니다.'),

    applicationStartDateTime: z
      .string()
      .min(1, '신청 시작 일시가 선택되지 않았습니다.'),

    applicationEndDateTime: z
      .string()
      .min(1, '신청 종료 일시가 선택되지 않았습니다.'),

    sessions: z.array(
      z.object({
        sessionStartDateTime: z.string(),
        sessionEndDateTime: z.string(),
      }),
    ),

    meetingType: z.enum(['ONLINE', 'OFFLINE']).default('ONLINE'),

    meetingPlace: z.string(),

    participantCapacity: z.number().min(0),

    title: z //
      .string()
      .min(1, '제목이 작성되지 않았습니다.'),

    content: z //
      .string()
      .min(1, '상세 내용이 작성되지 않았습니다.'),
  })
  .refine(
    data =>
      new Date(data.applicationStartDateTime) <
      new Date(data.applicationEndDateTime),
    {
      message: '신청 종료 일시는 신청 시작 일시 이후여야 합니다.',
      path: ['applicationEndDateTime'],
    },
  )
  .refine(
    data => {
      if (data.meetingType === 'OFFLINE') {
        return data.meetingPlace.trim().length > 0;
      }
      return true;
    },
    {
      message: '오프라인인 경우 장소를 입력해야 합니다.',
      path: ['meetingType'],
    },
  );
