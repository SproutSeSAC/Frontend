import { z } from 'zod';

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, '번호가 없습니다.')
    .regex(/^010-\d{4}-\d{4}$/, '유효한 핸드폰 번호를 입력해 주세요'),
});
