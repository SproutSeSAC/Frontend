import { LoungeDto } from './loungeDto';

export namespace LoungeDtoResponse {
  export interface GetLoungeProject {
    projects: LoungeDto.Lounge[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    nextPage: number | null;
  }
}
