export type Role = {
  ADMIN: '관리자';
  TRAINEE: '새싹 교육생';
  EDU_MANAGER: '교육 매니저';
  CAMPUS_MANAGER: '캠퍼스 매니저';
  JOB_COORDINATOR: '잡코디';
  PRE_TRAINEE: '예비 수강생';
};

export type KeyOfRole = keyof Role;

export type RoleValues = Role[keyof Role];

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

export type Domain = { id: number; domain: string };
export type Job = { id: number; job: string };
export type TechStack = { id: number; techStack: string; iconImageUrl: string };

export type UserProfile = {
  email: string;
  campusName: string;
  courseTitle: string;
  courseStartDate: string;
  courseEndDate: string;
  name: string;
  domainList: Domain[];
  jobList: Job[];
  techStackList: TechStack[];
  nickname: string;
  profileImageUrl: string;
  role: KeyOfRole;
};

export type UpdateableUserProfile = {
  nickname: string;
  profileImageUrl: string;
  updatedDomainIdList: number[];
  updatedJobIdList: number[];
  updatedTechStackIdList: number[];
};

export type CourseGrowthLevelLabel =
  | '두잎 새싹'
  | '세잎 새싹'
  | '튼튼 줄기'
  | '어린 나무'
  | '꽃핀 나무'
  | '열매 나무';

export type CourseGrowthLevel = {
  level: number;
  label: CourseGrowthLevelLabel;
  maxProgress: number;
  image: string;
};
