import { TermsConsentList } from '@/services/auth/termsAndPolicy';

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

export type SignUpQuestions = {
  roles: RoleKey[];
  name: string;
  nickname: string;
  jobList: Job[];
  domainList: Domain[];
  techStackList: TechStack[];
  courseList?: { id: number; name: string }[];
  campusList: { id: number; name: string }[];
  phoneNumber?: string;
  verifyCode: string;
  termList: TermsConsentList[];
};

export type SignUpFormValue = UserProfileDto.Post & {
  campusIdList: number[];
  verifyCode: string;
};

export type SignUpQuestionsByStep = {
  [K in keyof SignUpQuestions]: SignUpFormTitle & Pick<SignUpQuestions, K>;
}[keyof SignUpQuestions];
