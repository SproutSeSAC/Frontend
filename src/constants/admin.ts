/** 관리자 페이지 관련 상수 정의 파일 */

/**
 * 관리자 페이지 탭 설정 모음
 *
 * 일반 유저와 슈퍼 어드민 권한 유저의 탭 구성이 다릅니다.
 * - 슈퍼 어드민 권한용 탭은 변수명 뒤에 `ForHasSuperAdmin`이 붙습니다.
 *
 * 탭 종류:
 * - 교육과정 관리
 * - 사용자 관리
 * - 사용자 관리의 유저별 권한 변경
 * - 특강/행사 모집 현황 탭
 * - 특강/행사 신청자 현황 탭
 */

/**
 * - 교육과정 관리 탭
 * - 기본: '교육과정 관리'
 * - 슈퍼 어드민: '캘린더 관리' + 기본 탭
 */
export const courseManagementTabList = [
  { text: '교육과정 관리', type: 'course' },
] as const;

export const courseManagementTabListForHasSuperAdmin = [
  ...courseManagementTabList,
  { text: '캘린더 관리', type: 'calendar' },
] as const;

/**
 * - 사용자 관리 탭
 * - 기본: '학생 목록'
 * - 슈퍼 어드민: + '사용자 목록'
 * - 사용자별 권한 변경 모달 탭
 */
export const userManagementTabList = [
  { text: '학생 목록', type: 'trainee-list' },
] as const;

export const userManagementTabListForHasSuperAdmin = [
  ...userManagementTabList,
  { text: '사용자 목록', type: 'user-list' },
] as const;

export const modifyingPermissionStepList = [
  {
    step: 1,
    text: '역할',
    type: 'role',
  },
  {
    step: 2,
    text: '캠퍼스',
    type: 'campus',
  },
  {
    step: 3,
    text: '교육과정',
    type: 'course',
  },
] as const;

/**
 * - 특강/행사 모집 현황 탭
 * - 기본: 전체 / 모집 중 / 모집 종료
 */
export const sessionStatusTabList = [
  { text: '전체', type: 'ALL' },
  { text: '모집 중', type: 'ACTIVE' },
  { text: '모집 종료', type: 'INACTIVE' },
] as const;

/**
 * - 특강/행사 신청자 현황 탭
 * - 기본: 전체 / 대기 / 승인 / 반려
 */
export const sessionApplicantsStatusTabList = [
  { text: '전체', type: 'ALL' },
  { text: '대기', type: 'WAIT' },
  { text: '승인', type: 'PARTICIPANT' },
  { text: '반려', type: 'REJECT' },
] as const;

/**
 * 사용자 관리 페이지 표 라벨 목록
 * 1. 교육생 목록 표 라벨
 * 2. 사용자 목록 라벨
 */
export const userLabelList = [
  '이름',
  '닉네임',
  '이메일',
  '소속 캠퍼스',
  '역할',
  '교육과정',
] as const;

export const traineeLabelList = [
  '이름',
  '닉네임',
  '이메일',
  '소속 캠퍼스',
  '교육과정',
] as const;

export const actionLabelList = [
  '권한 수정',
  '연락처 수정',
  '회원 탈퇴',
] as const;

/**
 * 특강/행사 신청 현황 페이지 표 라벨 목록
 */
export const sessionApplicantsTableHeaderList = [
  '이름',
  '캠퍼스',
  '교육과정',
  '메일주소',
  '연락처',
  '신청 시간',
  '상태',
];
