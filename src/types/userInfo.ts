export type Role =
  | 'ADMIN'
  | 'TRAINEE'
  | 'PRE_TRAINEE'
  | 'CAMPUS_MANAGER'
  | 'EDU_MANAGER'
  | 'JOB_COORDINATOR';

export type UserInfo = {
  role: Role;
  courseId: number;
  name: string;
  nickname: string;
  jobIdList: number[];
  domainIdList: number[];
  techStackIdList: number[];
  marketingConsent: boolean;
  campusId?: number;
};

export type FormTitle = {
  title: { text: string; condition?: string };
  additionalInfo?: string;
};

type FormData = {
  step: number;
  roles: Role[];
  name: string;
  nickname: string;
  campusId: number[];
  courseId: number[];
  jobIdList: number[];
  domainIdList: number[];
  techStackIdList: number[];
  verifyCode: string;
  marketingConsent: [true, false];
};

export type QuestionsByStep = {
  [K in keyof FormData]: FormTitle & Pick<FormData, K>;
}[keyof FormData];
