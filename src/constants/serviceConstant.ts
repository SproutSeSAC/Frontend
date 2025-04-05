// status
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'INACTIVE';
export const STATUS_END = 'END';

export type StatusBase =
  | typeof STATUS_ACTIVE
  | typeof STATUS_INACTIVE
  | typeof STATUS_END;

// 인원 "제한 없음" 기준
export const LIMITLESS_CAPACITY_NUM = 10000;

// 서비스 종류
export const postTypeObj = {
  MEAL: '한끼팟',
  NOTICE: '공지사항',
  PROJECT: '프로젝트',
  STUDY: '스터디',
  STORE: '맛집',
} as const;
