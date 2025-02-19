import { Domain, Job, TechStack } from '@/types/specifications';

export namespace UserProfileDto {
  export type Post = SignUpUserProfile;
  export type Get = UserProfile;
  export type GetCard = UserProfileCard;
  export type Update = UpdateableUserProfile;
  export type UpdateProfileImage = UpdateableProfileImage;
}

type SignUpUserProfile = {
  role: RoleKey;
  name: string;
  nickname: string;
  courseIdList: number[];
  techStackIdList: number[];
  jobIdList: number[];
  domainIdList: number[];
  marketingConsent: boolean;
};

type UserCourse = {
  courseId: number;
  courseTitle: string;
  courseStartDate: string;
  courseEndDate: string;
};

type UserCampus = {
  id: number;
  campusName: string;
};

type UserProfile = {
  email: string;
  campusList: UserCampus[];
  courseList: UserCourse[];
  name: string;
  domainList: Domain[];
  jobList: Job[];
  techStackList: TechStack[];
  nickname: string;
  role: RoleKey;
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

type UserProfileCard = {
  profile: {
    name: string;
    nickname: string;
    profileUrl: string;
  };
  study: {
    email: string;
    campus: {
      id: number;
      name: string;
    };
    course: {
      id: number;
      name: string;
    };
  };
};
