import {
  STORE_MAIN_FILTER_ONLY_SCRAPED,
  STORE_MAIN_FILTER_OVER_FIVE_PERSON,
  STORE_MAIN_FILTER_UNDER_PRICE,
  STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES,
  STORE_MAIN_FILTER_ZERO_PAY,
  foodFilterDisplay,
} from '@/constants';

export * from '@/types/store/storeDto';
export * from '@/types/store/storeMealPostDto';

export type FoodFilterDisplay = typeof foodFilterDisplay;
export type FoodFilterDisplayKey = keyof FoodFilterDisplay;

export type StoreMainFilterType =
  | typeof STORE_MAIN_FILTER_ZERO_PAY
  | typeof STORE_MAIN_FILTER_UNDER_PRICE
  | typeof STORE_MAIN_FILTER_OVER_FIVE_PERSON
  | typeof STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES
  | typeof STORE_MAIN_FILTER_ONLY_SCRAPED;
