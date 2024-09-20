import * as z from 'zod';

export const loungeEditorSchema = z.object({
  모집구분: z.union([
    z.string().min(1, '모집구분을 선택해 주세요.'),
    z.undefined().refine(() => false, '모집구분을 선택해 주세요.'),
  ]),

  모집기간1: z.union([
    z.string().min(1, '모집기간을 선택해 주세요.'),
    z.undefined().refine(() => false, '모집기간을 선택해 주세요.'),
  ]),

  모집기간2: z.union([
    z.string().min(1, '모집기간을 선택해 주세요.'),
    z.undefined().refine(() => false, '모집기간을 선택해 주세요.'),
  ]),

  모집인원: z.union([
    z.string().min(1, '모집인원을 선택해 주세요.'),
    z.undefined().refine(() => false, '모집인원을 선택해 주세요.'),
  ]),

  모집직무: z
    .array(z.string().min(1, '모집직무를 선택해 주세요.'))
    .min(1, '모집직무를 선택해 주세요.'),

  모집유형: z.union([
    z.string().min(1, '모집유형을 선택해 주세요.'),
    z.undefined().refine(() => false, '모집유형을 선택해 주세요.'),
  ]),

  필요스택: z
    .array(z.string().min(1, '필요스택을 선택해 주세요.'))
    .min(1, '필요스택을 선택해 주세요.'),

  연락방법: z.union([
    z.string().min(1, '연락방법을 입력해 주세요.'),
    z.undefined().refine(() => false, '연락방법을 입력해 주세요.'),
  ]),

  제목: z.union([
    z.string().min(1, '제목을 입력해 주세요.'),
    z.undefined().refine(() => false, '제목을 입력해 주세요.'),
  ]),

  모집기간: z.union([
    z.string().min(1, '모집기간을 입력해 주세요.'),
    z.undefined().refine(() => false, '모집기간을 입력해 주세요.'),
  ]),
});
