import { FoodFilterType } from '@/constants';

export interface Store {
  id: number;
  name: string;
  storeImage: string;
  workingDay: string;
  foodType: FoodFilterType;
  breakTime: string;
  walkTime: number;
  overFivePerson: boolean;
  underPrice: boolean;
  address: string;
  campusName: string;
  contact: string;
  tagList: string[];
  mapSchemaUrl: string;
}
export interface StoreMenu {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface GetStoreListResponse {
  storeList: Store[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  nextPage: number | null;
}
export interface GetFilterCountResponse {
  zeropayCount: number;
  underPriceCount: number;
  overPersonCount: number;
  walkTimeCount: number;
  koreanFoodCount: number;
  chineseFoodCount: number;
  japanesesFoodCount: number;
  westernFoodCount: number;
  asianFoodCount: number;
  snackCount: number;
  cafeCount?: number;
}
export interface GetStoreDetailResponse
  extends Omit<Store, 'id' | 'storeImage' | 'overFivePerson' | 'underPrice'> {
  storeMenuList: StoreMenu[];
  mapSchemaUrl?: string;
  storeImageList: string[];
  storeReviewList: {
    nickname: string;
    review: string;
    profileImageUrl: string;
    rating: number;
    createdAt: string;
  }[];
}
