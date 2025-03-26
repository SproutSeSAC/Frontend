// status
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'INACTIVE';
export const STATUS_END = 'END';

export type StatusBase =
  | typeof STATUS_ACTIVE
  | typeof STATUS_INACTIVE
  | typeof STATUS_END;

export const STATUS_WAIT = 'WAIT';
export const STATUS_PARTICIPANT = 'PARTICIPANT';
export const STATUS_REJECT = 'REJECT';

export type SessionStatus =
  | typeof STATUS_WAIT
  | typeof STATUS_PARTICIPANT
  | typeof STATUS_REJECT;

// 서비스 종류
export const postTypeObj = {
  MEAL: '한끼팟',
  NOTICE: '공지사항',
  PROJECT: '프로젝트',
  STUDY: '스터디',
  STORE: '맛집',
} as const;

export type PostType = typeof postTypeObj;
