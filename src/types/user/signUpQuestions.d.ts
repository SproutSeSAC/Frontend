import { KeyOfRole } from '@/types';

export type SignUpFormTitle = {
  title: {
    text: string;
    condition?: string;
  };
  additionalInfo?: string;
};

export type SignUpStep = {
  step?: number;
};

export type VerifyCode = {
  verifyCode: string;
};

export type MarketingConsent = '동의' | '동의하지 않음';

export type SignUpQuestions = {
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

export type SignUpQuestionsByStep = {
  [K in keyof SignUpQuestions]: SignUpFormTitle & Pick<SignUpQuestions, K>;
}[keyof SignUpQuestions];
