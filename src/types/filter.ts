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
  sort?: SortDisplayKey;
};

export type NoticeParticipantParams = PaginationFilter & {
  sessionId: number;
  searchParticipantStatus: AppliedSessionStatusValue;
};

/* NOTE: Store 필터 */
/* NOTE: MyPage 필터 */
