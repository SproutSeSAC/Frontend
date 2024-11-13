import { z } from 'zod';

export type RegisterSchemaType = z.infer<typeof AnnouncementFormSchema>;

export const AnnouncementFormSchema = z
  .object({
    targetCourseList: z //
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

    eventDate: z //
      .string()
      .min(1, '일시가 선택되지 않았습니다.'),

    eventStartTime: z //
      .string()
      .min(1, '시간이 선택되지 않았습니다.'),

    eventEndTime: z //
      .string()
      .min(1, '시간이 선택되지 않았습니다.'),

    meetingType: z.object({
      type: z.string().min(1, '온오프라인이 선택되지 않았습니다.'),
      detail: z.string().min(1, '온오프라인 내용이 작성되지 않았습니다.'),
    }),

    participantCapacity: z.string().min(1, '인원제한이 작성되지 않았습니다.'),

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
  );
