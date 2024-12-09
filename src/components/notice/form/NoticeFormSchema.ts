import { z } from 'zod';

const meetingTypeEnum = z.enum(['ONLINE', 'OFFLINE']);

const noticeCategoryKeyEnum = z.enum([
  'ALL',
  'GENERAL',
  'SPECIAL_LECTURE',
  'EMPLOYMENT',
  'EVENT',
  'ETC',
]);

const session = z
  .object({
    sessionStartDateTime: z.string(),
    sessionEndDateTime: z.string(),
  })
  .refine(
    data =>
      new Date(data.sessionEndDateTime) >= new Date(data.sessionStartDateTime),
    {
      message: '종료 시간은 시작 시간 이후여야 합니다.',
      path: ['sessionEndDateTime'],
    },
  );
export type SessionSchemaType = z.infer<typeof session>;

export const NoticeRequiredFormSchema = z.object({
  targetCourseIdList: z //
    .array(z.number())
    .min(1, '최소 하나의 교육과정을 선택해야 합니다.'),

  noticeType: noticeCategoryKeyEnum.default('GENERAL'),

  title: z //
    .string()
    .min(1, '제목이 작성되지 않았습니다.'),

  content: z //
    .string()
    .min(1, '상세 내용이 작성되지 않았습니다.'),
});

export const NoticeConditionalFormSchema = NoticeRequiredFormSchema.extend({
  applicationStartDateTime: z
    .string()
    .min(1, '신청 시작 일시가 선택되지 않았습니다.')
    .optional(),

  applicationEndDateTime: z
    .string()
    .min(1, '신청 종료 일시가 선택되지 않았습니다.')
    .optional(),

  sessions: z
    .array(session)
    .superRefine((sessions, ctx) => {
      sessions.forEach((item, index) => {
        if (
          new Date(item.sessionEndDateTime) <
          new Date(item.sessionStartDateTime)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${index}회차에서 종료 시간이 시작 시간보다 이전일 수 없습니다.`,
            path: [index, 'sessionEndDateTime'],
          });
        }
      });
    })
    .optional(), //

  meetingType: meetingTypeEnum.default('ONLINE').optional(),

  meetingPlace: z.string().optional(),

  participantCapacity: z
    .union([z.number(), z.nan(), z.string()])
    .refine(value => !Number.isNaN(value), {
      message: '숫자를 입력해야 합니다.',
    })
    .refine(value => value !== '', {
      message: '숫자 입력해야 합니다.',
    })
    .optional(),

  satisfactionSurvey: z.string().optional(),

  isPhoneNumberRequired: z.boolean().optional(),
})
  .refine(
    data => {
      if (data.applicationStartDateTime && data.applicationEndDateTime) {
        return (
          new Date(data.applicationStartDateTime) <
          new Date(data.applicationEndDateTime)
        );
      }
      return true;
    },
    {
      message: '신청 종료 일시는 신청 시작 일시 이후여야 합니다.',
      path: ['applicationEndDateTime'],
    },
  )
  .refine(
    data => {
      if (data.meetingType === 'OFFLINE') {
        return data.meetingPlace !== '';
      }
      return true;
    },
    {
      message: '오프라인인 경우 장소를 입력해야 합니다.',
      path: ['meetingPlace'],
    },
  );

export type NoticeFormSchemaType = z.infer<typeof NoticeConditionalFormSchema>;
