import { Domain, Job, RoleKey, TechStack, UserProfileDto } from '@/types';

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

export type MarketingConsent = '동의' | '동의하지 않음';

// SignUp Form의 형식
export type SignUpQuestions = {
  roles: RoleKey[];
  name: string;
  nickname: string;
  jobList: Job[];
  domainList: Domain[];
  techStackList: TechStack[];
  courseList?: { id: number; name: string }[];
  marketingConsent: MarketingConsent[];
  campusList: { id: number; name: string }[];
  verifyCode: string;
  phoneNumber: string;
};

export type SignUpUserFormValue = UserProfileDto.Post & {
  campusIdList: number[];
  verifyCode: string;
};

export type SignUpQuestionsByStep = {
  [K in keyof SignUpQuestions]: SignUpFormTitle & Pick<SignUpQuestions, K>;
}[keyof SignUpQuestions];
