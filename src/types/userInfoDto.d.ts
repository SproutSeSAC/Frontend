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
  name: string;
  nickname: string;
  jobIdList: number[];
  domainIdList: number[];
  techStackIdList: number[];
  marketingConsent: '동의' | '동의하지 않음';
  courseId: number | undefined;
  campusId?: number | undefined;
};

export type UserProfile = {
  email: string;
  campusName: string;
  courseTitle: string;
  name: string;
  domainList: { id: number; domain: string }[];
  jobList: { id: number; job: string }[];
  techStackList: { id: number; techStack: string; iconImageUrl: string }[];
  nickname: string;
  profileImageUrl: string;
};

export type UpdateableUserProfile = {
  nickname: string;
  profileImageUrl: string;
  updatedDomainIdList: number[];
  updatedJobIdList: number[];
  updatedTechStackIdList: number[];
};