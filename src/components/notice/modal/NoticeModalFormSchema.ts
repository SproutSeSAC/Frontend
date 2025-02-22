import { z } from 'zod';

export const noticeModalFormSchema = z.object({
  sessionIdList: z.array(z.number()).min(1, '회차를 선택해 주세요.'),
});
