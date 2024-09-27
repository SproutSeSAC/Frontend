import * as z from 'zod';

export const loungeEditorSchema = z.object({
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
    z.string().min(1, '모집인원을 선택해 주세요.'),
    z.undefined().refine(() => false, '모집인원을 선택해 주세요.'),
  ]),

  positions: z
    .array(z.number().min(1, '모집직무를 선택해 주세요.'))
    .min(1, '모집직무를 선택해 주세요.'),

  meetingType: z.union([
    z.string().min(1, '모집유형을 선택해 주세요.'),
    z.undefined().refine(() => false, '모집유형을 선택해 주세요.'),
  ]),

  requiredStacks: z
    .array(z.number().min(1, '필요스택을 선택해 주세요.'))
    .min(1, '필요스택을 선택해 주세요.'),

  contactMethod: z.union([
    z.string().min(1, '연락방법을 입력해 주세요.'),
    z.undefined().refine(() => false, '연락방법을 입력해 주세요.'),
  ]),

  projectTitle: z.union([
    z.string().min(1, '제목을 입력해 주세요.'),
    z.undefined().refine(() => false, '제목을 입력해 주세요.'),
  ]),

  projectDescription: z.union([
    z.string().min(1, '모집기간을 입력해 주세요.'),
    z.undefined().refine(() => false, '모집기간을 입력해 주세요.'),
  ]),
});
