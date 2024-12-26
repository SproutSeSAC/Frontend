import { Domain, Job, TechStack } from '@/types/specifications';

export namespace UserProfileDto {
  export type Post = SignUpUserProfile;
  export type Get = UserProfile;
  export type Update = UpdateableUserProfile;
  export type UpdateProfileImage = UpdateableProfileImage;
}

type SignUpUserProfile = {
  role: KeyOfRole;
  name: string;
  nickname: string;
  courseIdList: number[];
  techStackIdList: number[];
  jobIdList: number[];
  domainIdList: number[];
  marketingConsent: boolean;
};

type UserProfile = {
  email: string;
  campusList: {
    id: number;
    campusName: string;
  }[];
  courseList: {
    courseId: number;
    courseTitle: string;
    courseStartDate: string;
    courseEndDate: string;
  }[];
  name: string;
  domainList: Domain[];
  jobList: Job[];
  techStackList: TechStack[];
  nickname: string;
  imgUrl: string;
  role: KeyOfRole;
  userId: number;
  profileImageUrl: string;
};

type UpdateableUserProfile = Partial<{
  nickname: string;
  profileImageUrl: string;
  updatedDomainIdList: number[];
  updatedJobIdList: number[];
  updatedTechStackIdList: number[];
}>;

type UpdateableProfileImage = {
  profileUrl: string;
};
