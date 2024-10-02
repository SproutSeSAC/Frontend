import type { StoreDtoRequest } from './storeDtoRequest';
import type { StoreDtoResponse } from './storeDtoResponse';

export namespace StoreDto {
  export interface Store {}

  export import Request = StoreDtoRequest;
  export import Response = StoreDtoResponse;
}
