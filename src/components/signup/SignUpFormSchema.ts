import { z } from 'zod';

// Jotai 상태 파일 가져오기

export type RegisterSchemaType = z.infer<typeof SignUpFormSchema>;

export enum Role {
  CAMPUS_LEADER = 'CAMPUS_LEADER',
  OPERATION_MANAGER = 'OPERATION_MANAGER',
  EDU_MANAGER = 'EDU_MANAGER',
  JOB_COORDINATOR = 'JOB_COORDINATOR',
  INSTRUCTOR = 'INSTRUCTOR',
  TRAINEE = 'TRAINEE',
}

export const SignUpFormSchema = z
  .object({
    role: z
      .enum([
        Role.CAMPUS_LEADER,
        Role.OPERATION_MANAGER,
        Role.EDU_MANAGER,
        Role.INSTRUCTOR,
        Role.JOB_COORDINATOR,
        Role.TRAINEE,
      ])
      .default(Role.TRAINEE),

    name: z
      .string()
      .min(1, '성함이 작성되지 않았습니다.')
      .regex(/^[가-힣a-zA-Z]+$/, '국문, 영문만 입력 가능합니다.'),

    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요.')
      .regex(
        /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]+$/,
        '국문, 영문, 숫자만 입력 가능합니다.',
      )
      .max(20, '닉네임은 20자 이내로 입력해주세요.'),

    campusIdList: z.array(z.number()),

    courseIdList: z.array(z.number()),

    techStackIdList: z.array(z.number()),

    jobIdList: z
      .array(z.number())
      .min(1, '최소 하나의 도메인을 선택해야 합니다.'),

    domainIdList: z
      .array(z.number())
      .min(1, '최소 하나의 도메인을 선택해야 합니다.'),

    verifyCode: z.string(),

    marketingConsent: z.boolean().refine(val => val === true || val === false, {
      message: '마케팅 동의를 선택해야 합니다.',
    }),
  })
  .refine(
    data => {
      if (
        data.role !== Role.CAMPUS_LEADER &&
        data.role !== Role.OPERATION_MANAGER &&
        data.role !== Role.EDU_MANAGER &&
        data.role !== Role.JOB_COORDINATOR &&
        data.role !== Role.INSTRUCTOR
      ) {
        return data.techStackIdList.length > 0;
      }
      return true;
    },
    {
      message: '최소 하나의 기술스택을 선택해야 합니다.',
      path: ['techStackIdList'],
    },
  )
  .refine(
    data => {
      return data.campusIdList.length > 0;
    },
    {
      message: '캠퍼스를 선택해주세요.',
      path: ['campusIdList'],
    },
  )
  .refine(
    data => {
      return data.verifyCode.length > 0;
    },
    {
      message: '인증코드를 입력해주세요.',
      path: ['verifyCode'],
    },
  )
  .refine(
    data => {
      if (
        data.role !== Role.CAMPUS_LEADER &&
        data.role !== Role.OPERATION_MANAGER
      ) {
        return data.courseIdList.length > 0;
      }
      return true;
    },
    {
      message: '교육과정을 선택해주세요.',
      path: ['courseIdList'],
    },
  );
