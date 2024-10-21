export namespace UserProfileDtoResponse {
  export interface UserProfile {
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
  }
}
