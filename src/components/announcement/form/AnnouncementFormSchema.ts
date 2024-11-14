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

    meetingType: z
      .object({
        type: z.enum(['ONLINE', 'OFFLINE'], {
          errorMap: () => ({ message: '온오프라인이 선택되지 않았습니다.' }),
        }),
        detail: z.string(), // detail은 기본적으로 선택 사항으로 설정
      })
      .refine(
        data => {
          // type이 ONLINE일 때 detail은 빈 문자열이어야 하고,
          // type이 OFFLINE일 때 detail은 비어있지 않아야 함
          if (data.type === 'ONLINE') {
            return data.detail === '';
          }
          if (data.type === 'OFFLINE') {
            return data.detail.trim().length > 0;
          }
          return true;
        },
        {
          message: 'OFFLINE인 경우 장소를 입력해야 합니다.',
          path: ['meetingType'],
        },
      ),

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
