import {
  ContactMethodDisplayKey,
  Progress,
  Ptype,
  SortDisplayKey,
  StoreMainFilterType,
} from '@/types';
import { StoreOptionCount } from '@/types/store/storeDto';

// 진행방식
export const progressDisplay = {
  ALL: '',
  HYBRID: '전체',
  ONLINE: '온라인',
  OFFLINE: '오프라인',
} as const;
export const progressList: Array<{ id: number; name: string; key: Progress }> =
  [
    { id: 0, name: '', key: 'ALL' },
    { id: 1, name: '전체', key: 'HYBRID' },
    { id: 2, name: '온라인', key: 'ONLINE' },
    { id: 3, name: '오프라인', key: 'OFFLINE' },
  ];

// 프로젝트 타입
export const PTYPE_STUDY = 'STUDY';
export const PTYPE_PROJECT = 'PROJECT';
export const ptypeDisplay = {
  STUDY: '스터디',
  PROJECT: '프로젝트',
} as const;
export const PtypeList: Array<{
  id: number;
  name: string;
  key: Ptype;
}> = [
  { id: 1, name: '스터디', key: PTYPE_STUDY },
  { id: 2, name: '프로젝트', key: PTYPE_PROJECT },
];

// 프로젝트 정렬
export const SORT_POPULARITY = 'popularity';
export const SORT_LATEST = 'latest';
export const sortDisplay = {
  popularity: '인기순',
  latest: '최신순',
} as const;
export const sortList: Array<{
  id: number;
  name: string;
  key: SortDisplayKey;
}> = [
  { id: 1, name: '인기순', key: SORT_POPULARITY },
  { id: 2, name: '최신순', key: SORT_LATEST },
];

// 연락방법
export const CONTACT_METHOD_EMAIL = 'EMAIL';
export const CONTACT_METHOD_PHONE = 'PHONE';
export const CONTACT_METHOD_MESSENGER = 'MESSENGER';
export const contactMethodDisplay = {
  EMAIL: '이메일',
  PHONE: '휴대폰',
  MESSENGER: '메신저',
} as const;
export const contactMethodList: Array<{
  id: number;
  name: string;
  key: ContactMethodDisplayKey;
}> = [
  { id: 1, name: '이메일', key: CONTACT_METHOD_EMAIL },
  { id: 2, name: '휴대폰', key: CONTACT_METHOD_PHONE },
  { id: 3, name: '메신저', key: CONTACT_METHOD_MESSENGER },
];

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
];
