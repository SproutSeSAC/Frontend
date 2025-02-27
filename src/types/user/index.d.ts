export * from '@/types/user/userProfileDto';
export * from '@/types/user/role';
export * from '@/types/user/courseGrowthLevel';
export * from '@/types/user/signUpQuestions';

export type UserCourse = {
  courseId: number;
  courseTitle: string;
  courseStartDate: string;
  courseEndDate: string;
};

export type UserCampus = {
  id: number;
  campusName: string;
};
