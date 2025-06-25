import { StatusBase } from '@/constants';
import {
  ContactMethodDisplayKey,
  DetailPostTechStack,
  Option,
  Progress,
  Ptype,
} from '@/types';

export namespace LoungeDto {
  export type GetProjectList = GetLoungeProjectList;
  export type GetProjectDetail = GetLoungeProjectDetail;
  export type PostProjectParams = PostLoungeProjectParams;
  export type PutProjectParams = Partial<PutLoungeProjectParams>;
  export type GetEndingTomorrowList = GetEndingTomorrowProject[];
  export type GetProjectComment = GetLoungeProjectComment[];
}

interface LoungeCommonFields {
  recruitmentCount: number;
  meetingType: Progress;
  contactMethod: ContactMethodDisplayKey;
  contactDetail: string;
}

interface LoungeProjectDisplay extends LoungeCommonFields {
  id: number;
  postId: number;
  isScraped: boolean;
  title: string;
  description: string;
  recruitmentStart: string;
  recruitmentEnd: string;
  viewCount: number;
  positionNames: string[];
  techStacks: { name: string; imageUrl }[];
  ptype: Ptype;
}

interface GetLoungeProjectList {
  projects: LoungeProjectDisplay[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  nextPage: number | null;
}

interface GetLoungeProjectDetail extends LoungeCommonFields {
  id: number;
  title: string;
  writerId: number;
  writerNickName: string;
  imgUrl: string;
  description: string;
  recruitmentStart: string;
  recruitmentEnd: string;
  isScraped: boolean;
  viewCount: number;
  projectStatus: StatusBase;
  createdAt: string;
  position: (Option & { isActive: boolean })[];
  ptype: Ptype;
  techStack: DetailPostTechStack[];
}

interface PostLoungeProjectParams extends LoungeCommonFields {
  recruitmentType: string;
  startDate: string;
  endDate: string;
  positions: number[];
  requiredStacks: number[];
  projectTitle: string;
  projectDescription: string;
}

interface PutLoungeProjectParams {
  projectId: number;
  params: PostLoungeProjectParams;
}

interface GetLoungeProjectComment {
  id: number;
  content: string;
  createdAt: string;
  writer: string;
  projectId: number;
  imgUrl: string | null;
}

interface GetEndingTomorrowProject {
  projectId: number;
  postId: number;
  title: string;
  content: string;
  userNickname: string;
  imgUrl: string;
}

export {};
