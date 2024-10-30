import { KeyOfRole } from '@/types/userInfoDto';

export type SignUpFormTitle = {
  title: { text: string; condition?: string };
  additionalInfo?: string;
};

export type SignUpStep = {
  step?: number;
};

export type VerifyCode = {
  verifyCode: string;
};

export type MarketingConsent = '동의' | '동의하지 않음';

// form 문항을 위한 데이터
export type SignUpFormValue = {
  roles: KeyOfRole[];
  name: string;
  nickname: string;
  jobList: Job[];
  domainList: Domain[];
  techStackList: TechStack[];
  courseList?: { id: number; name: string }[];
  campusList: { id: number; name: string }[];
  marketingConsent: MarketingConsent[];
  verifyCode: string;
};

// form 제출을 위한 데이터
export type UpdateSignUpValue = {
  role: KeyOfRole;
  name: string;
  nickname: string;
  jobList: Job[];
  domainList: Domain[];
  techStackList: TechStack[];
  courseList?: { id: number; name: string }[];
  campusList: { id: number; name: string }[];
  marketingConsent: MarketingConsent;
  verifyCode: string;
};

export type SignUpQuestionsByStep = {
  [K in keyof SignUpFormValue]: SignUpFormTitle & Pick<SignUpFormValue, K>;
}[keyof SignUpFormValue];
