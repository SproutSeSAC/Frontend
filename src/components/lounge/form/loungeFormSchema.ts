import * as z from 'zod';

export const loungeFormSchema = z
  .object({
    recruitmentType: z.union([
      z.string().min(1, '모집구분을 선택해 주세요.'),
      z.undefined().refine(() => false, '모집구분을 선택해 주세요.'),
    ]),

    startDate: z.union([
      z.string().min(1, '모집기간을 선택해 주세요.'),
      z.undefined().refine(() => false, '모집기간을 선택해 주세요.'),
    ]),

    endDate: z.union([
      z.string().min(1, '모집기간을 선택해 주세요.'),
      z.undefined().refine(() => false, '모집기간을 선택해 주세요.'),
    ]),

    recruitmentCount: z.union([
      z.number().min(1, '모집인원을 선택해 주세요.'),
      z.undefined().refine(() => false, '모집인원을 선택해 주세요.'),
    ]),

    positions: z
      .array(z.number().min(1, '모집직무를 선택해 주세요.'))
      .min(1, '모집직무를 선택해 주세요.'),

    meetingType: z.string().min(1, '모집유형을 선택해주세요.'),

    requiredStacks: z
      .array(z.number().min(1, '필요스택을 선택해 주세요.'))
      .min(1, '필요스택을 선택해 주세요.'),

    contactMethod: z.union([
      z.string().min(1, '연락방법을 선택해 주세요.'),
      z.undefined().refine(() => false, '연락방법을 선택해 주세요.'),
    ]),

    contactDetail: z.string(),

    projectTitle: z.union([
      z.string().min(1, '제목을 입력해 주세요.'),
      z.undefined().refine(() => false, '제목을 입력해 주세요.'),
    ]),

    projectDescription: z.union([
      z.string().min(1, '상세내용을 입력해 주세요.'),
      z.undefined().refine(() => false, '상세내용을 입력해 주세요.'),
    ]),
  })
  .superRefine(({ contactMethod, contactDetail }, ctx) => {
    if (
      contactMethod === 'EMAIL' &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contactDetail)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactDetail'],
        message: '유효한 이메일 주소를 입력해 주세요.',
      });
    }

    if (contactMethod === 'PHONE' && !/^010-\d{4}-\d{4}$/.test(contactDetail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactDetail'],
        message: '유효한 핸드폰 번호를 입력해 주세요',
      });
    }

    if (
      contactMethod === 'MESSENGER' &&
      !/^https?:\/\/[\w.-]+(?:\.[\w-]+)+[/#?]?.*$/.test(contactDetail)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactDetail'],
        message: '유효한 링크 주소를 입력해 주세요.',
      });
    }
  });
