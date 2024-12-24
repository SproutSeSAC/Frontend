import { z } from 'zod';

export const noticeModalFormSchema = z
  .object({
    sessionIdList: z.array(z.number()).min(1, '회차를 선택해 주세요.'),
    isPhoneNumberRequired: z.boolean().optional(),
    phoneNumber: z
      .string()
      .optional()
      .superRefine((value, ctx) => {
        if (value) {
          const phoneRegex = /^010\d{7,8}$/;
          const sanitizedValue = value.replace(/\D/g, '');

          if (!phoneRegex.test(sanitizedValue)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: '올바른 연락처 형식이 아닙니다',
              path: ['phoneNumber'],
            });
          }
        }
      }),
  })
  .refine(
    data => {
      if (data.isPhoneNumberRequired && !data.phoneNumber) {
        return false;
      }
      return true;
    },
    {
      message: '연락처를 입력해주세요',
      path: ['phoneNumber'],
    },
  );
