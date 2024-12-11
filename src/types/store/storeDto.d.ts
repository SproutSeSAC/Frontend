import { FoodFilterDisplayKey } from '@/types/lounge';

export interface Store {
  id: number;
  name: string;
  workingDay: string;
  foodType: FoodFilterDisplayKey;
  breakTime: string;
  walkTime: number;
  underPrice: boolean;
  address: string;
  campusName: string;
  contact: string;
  holiday: string;
  isZeropay: boolean;
  isOverPerson: boolean;
  longitude: string;
  latitude: string;
  scrapCount: number;
  isScrap: boolean;
  storeImageList: StoreImage[];
  storeMenuList: StoreMenu[];
  isLessThan10000Menu: boolean;
}
export interface StoreMenu {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface StoreImage {
  id?: number;
  path: string;
}

export interface StoreReviewList {
  nickname: string;
  review: string;
  imgUrl: string;
  rating: number;
  createdAt: string;
}

export interface GetStoreListResponse {
  stores: Store[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  nextPage: number | null;
}
export interface GetFilterCountResponse {
  foodTypeCount: {
    foodType: FoodFilterDisplayKey;
    count: number;
  }[];

  storeOptionCount: StoreOptionCount;
}

export interface StoreOptionCount {
  isZeropayCount: number;
  isVoucherCount: number;
  isOverPerson: number;
  isLessThan10000Price: number;
}
export interface GetStoreDetailResponse
  extends Omit<
    Store,
    | 'scrapCount'
    | 'underPrice'
    | 'storeImageList'
    | 'id'
    | 'holiday'
    | 'longitude'
    | 'latitude'
  > {
  storeImageList: string[];
  storeReviewList: StoreReviewList[];
}

export interface PostStoreReviewRequest {
  rating: number;
  review: string;
  storeId: number;
}
