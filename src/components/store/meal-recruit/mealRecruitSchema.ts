import * as z from 'zod';

export const mealRecruitSchema = z.object({
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
    z.number().min(1, '분단위를 선택해 주세요.'),
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
    z.string().min(1, '모일위치를 입력해 주세요.'),
    z.undefined().refine(() => false, '모일위치를 입력해 주세요.'),
  ]),
});
