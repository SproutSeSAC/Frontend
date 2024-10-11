import { FoodFilterType } from '@/constants';

export namespace StoreDtoRequest {
  export interface GetStoreList {
    isZeropay?: boolean;
    underPrice?: boolean;
    overFivePerson?: boolean;
    walkTimeWithinFiveMinutes?: boolean;
    foodTypeList?: FoodFilterType[];
    page?: number;
    size?: number;
  }
}
