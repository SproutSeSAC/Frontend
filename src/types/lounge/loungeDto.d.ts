import { Progress, Ptype } from '@/constants';

export interface Lounge {
  isScraped: boolean;
  id: number;
  title: string;
  description: string;
  recruitmentCount: number;
  meetingType: Progress;
  contactMethod: string;
  recruitmentStart: string;
  recruitmentEnd: string;
  viewCount: number;
  positionNames: string[];
  ptype: Ptype;
}
export interface PostLoungeProject
  extends Pick<Lounge, 'recruitmentCount' | 'meetingType' | 'contactMethod'> {
  recruitmentType: string;
  startDate: string;
  endDate: string;
  positions: number[];
  requiredStacks: number[];
  projectTitle: string;
  projectDescription: string;
}

export interface GetLoungeProjects {
  techStack?: number[];
  position?: number[];
  keyword?: string;
  onlyScraped?: boolean;
  meetingType?: string;
  sort?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface GetLoungeProject {
  projects: Lounge[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  nextPage: number | null;
}
export interface GetLoungeProjectDetail {
  id: number;
  title: string;
  writerId: number;
  writerNickName: string;
  description: string;
  recruitmentCount: number;
  contactMethod: ContactMethodType;
  recruitmentStart: string;
  recruitmentEnd: string;
  viewCount: number;
  projectStatus: ProjectStatusType;
  meetingType: Progress;
  createdAt: string;
  positionNames: string[];
  ptype: Ptype;
}

export interface GetLoungeProjectComment {
  id: number;
  content: string;
  createdAt: string;
  writer: string;
  projectId: number;
}
