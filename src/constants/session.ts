export const SESSION_TABLE_HEADERS = [
  '이름',
  '캠퍼스',
  '교육과정',
  '메일주소',
  '연락처',
  '신청 시간',
  '상태',
];

export const appliedSessionStatusObj = {
  WAIT: '대기',
  PARTICIPANT: '승인',
  REJECT: '반려',
  END: '종료',
  UNKNOWN: '알 수 없는 상태',
} as const;

export const sessionStatusObj = {
  ACTIVE: '모집 중',
  INACTIVE: '모집 종료',
  END: '종료',
  UNKNOWN: '알 수 없는 상태',
} as const;
