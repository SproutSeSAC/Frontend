import { SortDisplayKey } from '@/types/lounge';
import { AppliedSessionStatusValue } from '@/types/session';

export interface Option {
  id: number;
  name: string;
  key?: string;
}

export type PaginationFilter = {
  page: number;
  size: number;
  sort?: SortDisplayKey | string[];
};

export type NoticeParticipantParams = PaginationFilter & {
  sessionId: number;
  searchParticipantStatus: AppliedSessionStatusValue;
};

export type SessionFilter = {
  page: number;
  size: number;
  keyword: string;
  applicationStatus?: 'ACTIVE' | 'INACTIVE' | undefined;
};

/* NOTE: Store 필터 */
/* NOTE: MyPage 필터 */
