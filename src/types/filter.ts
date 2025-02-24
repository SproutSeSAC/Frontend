import { SessionStatus } from '@/constants/serviceConstant';
import { SortDisplayKey } from '@/types/lounge';

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
  searchParticipantStatus: SessionStatus;
};

/* NOTE: Store 필터 */
/* NOTE: MyPage 필터 */
