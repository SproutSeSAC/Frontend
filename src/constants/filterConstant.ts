// 포지션
import { GetFilterCountResponse } from '@/types/store/storeDto';

// 진행방식
export const PROGRESS_ONLINE = 'ONLINE';
export const PROGRESS_OFFLINE = 'OFFLINE';
export const PROGRESS_HYBRID = 'HYBRID';

export type Progress =
  | typeof PROGRESS_ONLINE
  | typeof PROGRESS_OFFLINE
  | typeof PROGRESS_HYBRID;
export const progressList: Array<{ id: number; name: string; key: Progress }> =
  [
    { id: 1, name: '전체', key: PROGRESS_HYBRID },
    { id: 2, name: '온라인', key: PROGRESS_ONLINE },
    { id: 3, name: '오프라인', key: PROGRESS_OFFLINE },
  ];
export const progressDisplay: { [key in Progress]: string } = {
  HYBRID: '전체',
  ONLINE: '온라인',
  OFFLINE: '오프라인',
};

export const PTYPE_STUDY = 'STUDY';
export const PTYPE_PROJECT = 'PROJECT';
export type Ptype = typeof PTYPE_STUDY | typeof PTYPE_PROJECT;
export const PtypeList: Array<{ id: number; name: string; key: Ptype }> = [
  { id: 1, name: '스터디', key: PTYPE_STUDY },
  { id: 2, name: '프로젝트', key: PTYPE_PROJECT },
];
export const ptypeDisplay: { [key in Ptype]: string } = {
  STUDY: '스터디',
  PROJECT: '프로젝트',
};
// sort
export const SORT_POPULARITY = 'popularity';
export const SORT_LATEST = 'latest';
export type SortType = typeof SORT_POPULARITY | typeof SORT_LATEST;
export const sortList: Array<{ id: number; name: string; key: SortType }> = [
  { id: 1, name: '인기순', key: SORT_POPULARITY },
  { id: 2, name: '최신순', key: SORT_LATEST },
];
export const sortDisplay: { [key in SortType]: string } = {
  popularity: '인기순',
  latest: '최신순',
};

// 연락방법
export const CONTACT_METHOD_EMAIL = 'EMAIL';
export const CONTACT_METHOD_PHONE = 'PHONE';
export const CONTACT_METHOD_MESSENGER = 'MESSENGER';
export type ContactMethodType =
  | typeof CONTACT_METHOD_EMAIL
  | typeof CONTACT_METHOD_PHONE
  | typeof CONTACT_METHOD_MESSENGER;
export const contactMethodList: Array<{
  id: number;
  name: string;
  key: ContactMethodType;
}> = [
  { id: 1, name: '이메일', key: CONTACT_METHOD_EMAIL },
  { id: 2, name: '휴대폰', key: CONTACT_METHOD_PHONE },
  { id: 2, name: '메신저', key: CONTACT_METHOD_MESSENGER },
];
export const contactMethodDisplay: { [key in ContactMethodType]: string } = {
  EMAIL: '이메일',
  PHONE: '휴대폰',
  MESSENGER: '메신저',
};

// food type filter
export const FOOD_FILTER_KOREAN = 'KOREAN';
export const FOOD_FILTER_CHINESE = 'CHINESE';
export const FOOD_FILTER_JAPANESE = 'JAPANESE';
export const FOOD_FILTER_WESTERN = 'WESTERN';
export const FOOD_FILTER_ASIAN = 'ASIAN';
export const FOOD_FILTER_SNACK = 'SNACK';
export const FOOD_FILTER_CAFE = 'CAFE';
export type FoodFilterType =
  | typeof FOOD_FILTER_KOREAN
  | typeof FOOD_FILTER_CHINESE
  | typeof FOOD_FILTER_JAPANESE
  | typeof FOOD_FILTER_WESTERN
  | typeof FOOD_FILTER_JAPANESE
  | typeof FOOD_FILTER_ASIAN
  | typeof FOOD_FILTER_SNACK
  | typeof FOOD_FILTER_CAFE;

export const foodFilterDisplay: { [key in FoodFilterType]: string } = {
  KOREAN: '한식',
  WESTERN: '양식',
  CHINESE: '중식',
  JAPANESE: '일식',
  ASIAN: '아시아',
  SNACK: '분식',
  CAFE: '카페',
};

export const foodFilterList: Array<{
  key: string;
  value: FoodFilterType;
  countKey: keyof Pick<
    GetFilterCountResponse,
    | 'koreanFoodCount'
    | 'westernFoodCount'
    | 'chineseFoodCount'
    | 'japanesesFoodCount'
    | 'asianFoodCount'
    | 'snackCount'
    | 'cafeCount'
  >;
}> = [
  { key: '한식', value: FOOD_FILTER_KOREAN, countKey: 'koreanFoodCount' },
  { key: '양식', value: FOOD_FILTER_WESTERN, countKey: 'westernFoodCount' },
  { key: '중식', value: FOOD_FILTER_CHINESE, countKey: 'chineseFoodCount' },
  { key: '일식', value: FOOD_FILTER_JAPANESE, countKey: 'japanesesFoodCount' },
  { key: '아시아', value: FOOD_FILTER_ASIAN, countKey: 'asianFoodCount' },
  { key: '분식', value: FOOD_FILTER_SNACK, countKey: 'snackCount' },
  { key: '카페', value: FOOD_FILTER_CAFE, countKey: 'cafeCount' },
];

// store main filter
export const STORE_MAIN_FILTER_ZERO_PAY = 'isZeropay';
export const STORE_MAIN_FILTER_UNDER_PRICE = 'underPrice';
export const STORE_MAIN_FILTER_OVER_FIVE_PERSON = 'overFivePerson';
export const STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES =
  'walkTimeWithinFiveMinutes';
export type StoreMainFilterType =
  | typeof STORE_MAIN_FILTER_ZERO_PAY
  | typeof STORE_MAIN_FILTER_UNDER_PRICE
  | typeof STORE_MAIN_FILTER_OVER_FIVE_PERSON
  | typeof STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES;

export const storeMainFilterList: Array<{
  key: string;
  value: StoreMainFilterType;
  countKey: keyof Pick<
    GetFilterCountResponse,
    'overPersonCount' | 'underPriceCount' | 'walkTimeCount' | 'zeropayCount'
  >;
}> = [
  {
    key: '제로페이',
    value: STORE_MAIN_FILTER_ZERO_PAY,
    countKey: 'zeropayCount',
  },
  {
    key: '만원이하',
    value: STORE_MAIN_FILTER_UNDER_PRICE,
    countKey: 'underPriceCount',
  },
  {
    key: '5인 이상',
    value: STORE_MAIN_FILTER_OVER_FIVE_PERSON,
    countKey: 'overPersonCount',
  },
  {
    key: '도보 5분 이내',
    value: STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES,
    countKey: 'walkTimeCount',
  },
];
