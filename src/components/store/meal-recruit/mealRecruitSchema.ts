import * as z from 'zod';

export const mealRecruitSchema = z
  .object({
    title: z.union([
      z.string().min(1, '제목을 입력해 주세요.'),
      z.undefined().refine(() => false, '제목을 입력해 주세요.'),
    ]),
    date: z.union([
      z.string().min(1, '날짜를 선택해 주세요.'),
      z
        .undefined()
        .nullable()
        .refine(() => false, '날짜를 선택해 주세요.'),
    ]),
    hourTime: z.union([
      z.number().min(1, '시간 단위를 선택해 주세요.'),
      z.undefined().refine(() => false, '시간 단위를 선택해 주세요.'),
    ]),
    minuteTime: z.union([
      z.number().min(0, '분단위를 선택해 주세요.'),
      z
        .undefined()
        .nullable()
        .refine(() => false, '분단위를 선택해 주세요.'),
    ]),
    storeName: z.union([
      z.string().min(1, '식당이름을 입력해 주세요.'),
      z.undefined().refine(() => false, '식당이름을 입력해 주세요.'),
    ]),
    memberCount: z.union([
      z.number().min(1, '모집인원을 선택해 주세요.'),
      z.undefined().refine(() => false, '모집인원을 선택해 주세요.'),
    ]),
    meetingPlace: z.union([
      z.string().min(1, '모일 장소를 입력해 주세요.'),
      z.undefined().refine(() => false, '모일 장소를 입력해 주세요.'),
    ]),
  })
  .superRefine((data, ctx) => {
    if (!data.date || !data.hourTime || !data.minuteTime) return;

    const newDate = data.date;
    const appointmentDate = new Date(newDate);

    if (Number.isNaN(appointmentDate.getTime())) return;

    appointmentDate.setHours(data.hourTime, data?.minuteTime || 0, 0, 0);

    if (appointmentDate < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '한끼팟 모임 시간은 현재 시간 이후여야 합니다.',
        path: ['hourTime'],
      });
    }
  });
