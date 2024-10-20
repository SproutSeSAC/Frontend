import { z } from 'zod';

export type RegisterSchemaType = z.infer<typeof DomainJobTechStackSchema>;

export const DomainJobTechStackSchema = z.object({
  updatedJobList: z //
    .array(z.any())
    .min(1, '최소 하나의 직무를 선택해야 합니다.'),

  updatedTechStackList: z
    .array(z.any())
    .min(1, '최소 하나의 기술 스택을 선택해야 합니다.'),

  updatedDomainList: z
    .array(z.any())
    .min(1, '최소 하나의 도메인을 선택해야 합니다.'),
});
