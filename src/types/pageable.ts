import { PostTypeKey } from '@/types/serviceType';

export interface Pageable {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type PaginationFilter = {
  page: number;
  size: number;
};

export type SortPostTypeFilter = {
  postTypes?: PostTypeKey[];
};
