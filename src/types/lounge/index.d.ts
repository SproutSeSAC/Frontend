import {
  STORE_MAIN_FILTER_OVER_FIVE_PERSON,
  STORE_MAIN_FILTER_UNDER_PRICE,
  STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES,
  STORE_MAIN_FILTER_ZERO_PAY,
  contactMethodDisplay,
  foodFilterDisplay,
  progressDisplay,
  ptypeDisplay,
  sortDisplay,
} from '@/constants';

export type ProgressDisplay = typeof progressDisplay;
export type Progress = keyof ProgressDisplay;

export type PtypeDisplay = typeof ptypeDisplay;
export type Ptype = keyof PtypeDisplay;

export type SortDisplay = typeof sortDisplay;
export type SortDisplayKey = keyof SortDisplay;

export type ContactMethodDisplay = typeof contactMethodDisplay;
export type ContactMethodDisplayKey = keyof ContactMethodDisplay;

export type FoodFilterDisplay = typeof foodFilterDisplay;
export type FoodFilterDisplayKey = keyof FoodFilterDisplay;

export type StoreMainFilterType =
  | typeof STORE_MAIN_FILTER_ZERO_PAY
  | typeof STORE_MAIN_FILTER_UNDER_PRICE
  | typeof STORE_MAIN_FILTER_OVER_FIVE_PERSON
  | typeof STORE_MAIN_FILTER_WALK_TIME_FIVE_MINUTES;
