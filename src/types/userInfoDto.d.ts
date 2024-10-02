export type Role = {
  ADMIN: '관리자';
  TRAINEE: '새싹 교육생';
  EDU_MANAGER: '교육 매니저';
  CAMPUS_MANAGER: '캠퍼스 매니저';
  JOB_COORDINATOR: '잡코디';
  PRE_TRAINEE: '예비 수강생';
};

export type KeyOfRole = keyof Role;

export type UserInfo = {
  role: KeyOfRole;
  courseId: number;
  name: string;
  nickname: string;
  jobIdList: number[];
  domainIdList: number[];
  techStackIdList: number[];
  marketingConsent: boolean;
  campusId?: number;
};

export type UserProfile = {
  name: string;
  domainList: number[];
  jobList: number[];
  techStackList: number[];
  nickname: string;
  profileImageUrl: string;
};

export type UpdateableUserProfile = {
  nickname: string;
  profileImageUrl: string;
  domainList: number[];
  jobList: number[];
  techStackList: number[];
};
