import {
  colorByCampusObj,
  courseManagementTabListForHasSuperAdmin,
  sessionApplicantsStatusTabList,
  sessionStatusTabList,
  userManagementTabListForHasSuperAdmin,
} from '@/constants';

export * from '@/types/admin/userToManageDto';

export type UserManagementTab = typeof userManagementTabListForHasSuperAdmin;
export type UserManagementTabType = UserManagementTab[number]['type'];

export type CourseManagementTab =
  typeof courseManagementTabListForHasSuperAdmin;
export type CourseManagementTabType = CourseManagementTab[number]['type'];

export type SessionStatusTab = typeof sessionStatusTabList;
export type SessionStatusTabType = SessionStatusTab[number]['type'];

export type SessionApplicantsStatusTab = typeof sessionApplicantsStatusTabList;
export type SessionApplicantsStatusTabType =
  SessionApplicantsStatusTab[number]['type'];

export type ColorByCampus = keyof typeof colorByCampusObj;

export type UserManagingActionLabel = '권한 수정' | '연락처 수정' | '회원 탈퇴';

export type UserManagingActionMenu = {
  label: UserManagingActionLabel;
  email: string;
  isOpen: boolean;
};
