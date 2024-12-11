import { SessionStatus } from '@/constants/serviceConstant';
import { GetLoungeProjects } from '@/types/lounge/loungeDto';
import { NoticeCategoryDisplayKey, NoticeTabDisplayKey } from '@/types/notice';

export interface Option {
  id: number;
  name: string;
  key?: string;
}

/* Lounge 필터 */
export interface LoungeProjectFilters extends GetLoungeProjects {
  modify?: boolean;
}

export type PaginationFilter = {
  page: number;
  size: number;
  sort?: string[];
};

/* Notice 필터 */
export type NoticeFilter = PaginationFilter & {
  noticeType?: NoticeCategoryDisplayKey;
  roleType?: NoticeTabDisplayKey;
  keyword?: string;
  onlyScraped?: boolean;
  offset?: boolean;
};

export type NoticeParticipantParams = PaginationFilter & {
  sessionId: number;
  searchParticipantStatus: SessionStatus;
};

/* NOTE: Store 필터 */
/* NOTE: MyPage 필터 */
