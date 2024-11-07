export * from './specificationsDto';

export type Domain = { id: number; domain: string };

export type Job = { id: number; job: string };

export type TechStack = {
  id: number;
  techStack: string;
  iconImageUrl: string;
  jobName: string;
};
