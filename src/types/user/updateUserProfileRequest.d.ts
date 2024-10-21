export namespace UpdateUserProfileDtoRequest {
  export interface UpdateableUserProfile {
    nickname: string;
    profileImageUrl: string;
    updatedDomainIdList: number[];
    updatedJobIdList: number[];
    updatedTechStackIdList: number[];
  }
}
