import {
  contactMethodDisplay,
  progressDisplay,
  ptypeDisplay,
  sortDisplay,
} from '@/constants';
import { PaginationFilter } from '@/types/serviceType';

export type ProgressDisplay = typeof progressDisplay;
export type Progress = keyof ProgressDisplay;

export type PtypeDisplay = typeof ptypeDisplay;
export type Ptype = keyof PtypeDisplay;

export type SortDisplay = typeof sortDisplay;
export type SortDisplayKey = keyof SortDisplay;

export type ContactMethodDisplay = typeof contactMethodDisplay;
export type ContactMethodDisplayKey = keyof ContactMethodDisplay;

export type DetailPostTechStack = {
  id: number;
  name: string;
  isActive: boolean;
  path: string;
  jobName: string;
};

/** Lounge 프로젝트 필터 */
export type LoungeProjectFilter = PaginationFilter & {
  sort?: SortDisplayKey;
  pType?: Ptype;
  onlyScraped?: boolean;
  techStack?: number[];
  position?: number[];
  meetingType?: Progress;
  keyword?: string;
};
