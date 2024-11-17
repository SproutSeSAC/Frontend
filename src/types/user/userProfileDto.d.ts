import { MarketingConsent } from '@/types/user/signUpQuestions';

export namespace UserProfileDto {
  export type Post = SignUpUserValue;
  export type Get = UserProfile;
  export type Update = UpdateableUserProfile;
}

type SignUpUserValue = {
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

type UserProfile = {
  email: string;
  campusList: string[];
  courseList: {
    courseTitle: string;
    courseStartDate: string;
    courseEndDate: string;
  }[];
  name: string;
  domainList: Domain[];
  jobList: Job[];
  techStackList: TechStack[];
  nickname: string;
  profileImageUrl: string;
  role: KeyOfRole;
};

type UpdateableUserProfile = Partial<{
  nickname: string;
  profileImageUrl: string;
  updatedDomainIdList: number[];
  updatedJobIdList: number[];
  updatedTechStackIdList: number[];
}>;
