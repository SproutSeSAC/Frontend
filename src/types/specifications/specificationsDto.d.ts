import { Domain, Job, TechStack } from '@/types/specifications';

export namespace SpecificationsDto {
  export type GetJobList = {
    jobList: Job[];
  };
  export type GetDomainList = {
    domainList: Domain[];
  };
  export type GetTechStack = {
    techStackList: TechStack[];
  };
}
