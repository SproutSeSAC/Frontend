import { z } from 'zod';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CAMPUS_LEADER = 'CAMPUS_LEADER',
  OPERATION_MANAGER = 'OPERATION_MANAGER',
  EDU_MANAGER = 'EDU_MANAGER',
  JOB_COORDINATOR = 'JOB_COORDINATOR',
  INSTRUCTOR = 'INSTRUCTOR',
  TRAINEE = 'TRAINEE',
}

export const userPermissionSchema = z.object({
  role: z
    .enum([
      Role.SUPER_ADMIN,
      Role.CAMPUS_LEADER,
      Role.OPERATION_MANAGER,
      Role.EDU_MANAGER,
      Role.INSTRUCTOR,
      Role.JOB_COORDINATOR,
      Role.TRAINEE,
    ])
    .default(Role.TRAINEE),

  campusIdList: z
    .array(z.number())
    .nonempty('최소 하나의 캠퍼스가 선택되어야 합니다.'),

  courseIdList: z
    .array(z.number())
    .nonempty('최소 하나의 교육과정이 선택되어야 합니다.'),
});
