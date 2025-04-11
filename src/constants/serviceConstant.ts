/** status */
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'INACTIVE';
export const STATUS_END = 'END';

export type StatusBase =
  | typeof STATUS_ACTIVE
  | typeof STATUS_INACTIVE
  | typeof STATUS_END;

/**  인원 "제한 없음" 기준 */
export const LIMITLESS_CAPACITY_NUM = 10000;

/** 서비스 종류 */
export const postTypeObj = {
  MEAL: '한끼팟',
  NOTICE: '공지사항',
  PROJECT: '프로젝트',
  STUDY: '스터디',
  STORE: '맛집',
} as const;

/** 캠퍼스별 색상 */
export const colorByCampusObj = {
  성북: 'bg-[#FFEEAB]',
  도봉: 'bg-[#CDACFD]',
  강북: 'bg-mainBlue',
  노원: 'bg-mainGreen',
  다수: 'bg-[#00AC49]',
} as const;

/** 모달 크기 */
export const modalSizeObj = {
  sm: 'w-[320px] p-8',
  md: 'w-[556px] py-9 px-12',
  lg: 'w-[90vw] max-w-[1162px] py-14 px-[50px]',
};
