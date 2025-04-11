/** 관리자 페이지 탭 */

// 교육과정 관리 탭
export type CourseManagementTabType = 'course' | 'calendar';
export const COURSE_MANAGEMENT_TAB_LIST: {
  text: string;
  type: CourseManagementTabType;
}[] = [
  { text: '캘린더 관리', type: 'calendar' },
  { text: '교육과정 관리', type: 'course' },
];

// 사용자 관리 탭
export type UserManagementTabType = 'trainee-list' | 'user-list';
export const USER_MANAGEMENT_TAB_LIST: {
  text: string;
  type: UserManagementTabType;
}[] = [
  { text: '학생 목록', type: 'trainee-list' },
  { text: '사용자 목록', type: 'user-list' },
];

// 특강 / 행사 신청 현황 탭
export type SessionStatusTabType = 'all' | 'recruit-completed';
export const SESSION_STATUS_TAB_LIST: {
  text: string;
  type: SessionStatusTabType;
}[] = [
  { text: '전체', type: 'all' },
  { text: '모집 완료', type: 'recruit-completed' },
];

export const userLabelList = [
  '이름',
  '닉네임',
  '이메일',
  '소속 캠퍼스',
  '역할',
  '교육과정',
];

export const traineeLabelList = [
  '이름',
  '닉네임',
  '이메일',
  '소속 캠퍼스',
  '교육과정',
];
