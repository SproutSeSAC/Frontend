import { StoreMainFilterType } from '@/types';
import { StoreOptionCount } from '@/types/store/storeDto';

// food type filter
export const FOOD_FILTER_KOREAN = 'KOREAN';
export const FOOD_FILTER_CHINESE = 'CHINESE';
export const FOOD_FILTER_JAPANESE = 'JAPANESE';
export const FOOD_FILTER_WESTERN = 'WESTERN';
export const FOOD_FILTER_ASIAN = 'ASIAN';
export const FOOD_FILTER_SNACK = 'SNACK';
export const FOOD_FILTER_CAFE = 'CAFE';
export const foodFilterDisplay = {
  KOREAN: '한식',
  WESTERN: '양식',
  CHINESE: '중식',
  JAPANESE: '일식',
  ASIAN: '아시아',
  SNACK: '분식',
  CAFE: '카페',
} as const;

// store main filter
export const STORE_MAIN_FILTER_ZERO_PAY = 'isZeropay';
export const STORE_MAIN_FILTER_UNDER_PRICE = 'underPrice';
export const STORE_MAIN_FILTER_OVER_FIVE_PERSON = 'overFivePerson';
export const STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES =
  'walkTimeWithinFiveMinutes';
export const STORE_MAIN_FILTER_ONLY_SCRAPED = 'onlyScraped';

export const storeMainFilterList: Array<{
  key: string;
  value: StoreMainFilterType;
  countKey: keyof StoreOptionCount;
}> = [
  {
    key: '제로페이',
    value: STORE_MAIN_FILTER_ZERO_PAY,
    countKey: 'isZeropayCount',
  },
  {
    key: '만원이하',
    value: STORE_MAIN_FILTER_UNDER_PRICE,
    countKey: 'isLessThan10000Price',
  },
  {
    key: '5인 이상',
    value: STORE_MAIN_FILTER_OVER_FIVE_PERSON,
    countKey: 'isOverPerson',
  },
  {
    key: '도보 5분 이내',
    value: STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES,
    countKey: 'isVoucherCount',
  },
  {
    key: '찜한 식당',
    value: STORE_MAIN_FILTER_ONLY_SCRAPED,
    countKey: 'isScrapedCount',
  },
];
