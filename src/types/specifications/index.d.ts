export * from './specificationsDto';

export type Domain = { id: number; domain: string };

export type Job = { id: number; job: string };

export type TechStack = {
  id: number;
  techStack: string;
  iconImageUrl: string;
  jobName: string;
};

export type TechStackTab = '프론트엔드' | '백엔드' | 'PM';
