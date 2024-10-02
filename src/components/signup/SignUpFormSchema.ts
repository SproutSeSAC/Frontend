import { z } from 'zod';

export type RegisterSchemaType = z.infer<typeof SignUpFormSchema>;

export enum Role {
  ADMIN = 'ADMIN',
  TRAINEE = 'TRAINEE',
  EDU_MANAGER = 'EDU_MANAGER',
  CAMPUS_MANAGER = 'CAMPUS_MANAGER',
  JOB_COORDINATOR = 'JOB_COORDINATOR',
  PRE_TRAINEE = 'PRE_TRAINEE',
}

export const SignUpFormSchema = z.object({
  name: z
    .string()
    .min(1, '성함이 작성되지 않았습니다.')
    .regex(/^[가-힣a-zA-Z]+$/, '국문, 영문만 입력 가능합니다.'),

  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요.')
    .regex(/^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]+$/, '국문, 영문, 숫자만 입력 가능합니다.')
    .max(20, '닉네임은 20자 이내로 입력해주세요.'),

  verifyCode: z.string().min(1, '코드를 입력해주세요.'),

  jobIdList: z //
    .array(z.number())
    .min(1, '최소 하나의 직무를 선택해야 합니다.'),

  techStackIdList: z
    .array(z.number())
    .min(1, '최소 하나의 기술 스택을 선택해야 합니다.'),

  domainIdList: z
    .array(z.number())
    .min(1, '최소 하나의 도메인을 선택해야 합니다.'),

  courseId: z.number().int('코스 ID는 숫자여야 합니다.'),

  role: z
    .enum([
      Role.ADMIN,
      Role.CAMPUS_MANAGER,
      Role.EDU_MANAGER,
      Role.JOB_COORDINATOR,
      Role.PRE_TRAINEE,
      Role.TRAINEE,
    ])
    .default(Role.TRAINEE),

  marketingConsent: z
    .string()
    .refine(val => val === '동의' || val === '동의하지 않음', {
      message: '마케팅 동의를 선택해야 합니다.',
    }),
});
