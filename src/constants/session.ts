export const appliedSessionStatusObj = {
  WAIT: '대기',
  PARTICIPANT: '승인',
  REJECT: '반려',
  COMPLETE: '종료',
  UNKNOWN: '알 수 없는 상태',
} as const;

export const sessionStatusObj = {
  ACTIVE: '모집 중',
  INACTIVE: '모집 종료',
  UNKNOWN: '알 수 없는 상태',
} as const;
