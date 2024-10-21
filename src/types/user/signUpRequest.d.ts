export namespace SignUpDtoRequest {
  export interface SignUpData {
    step?: number;
    roles: KeyOfRole[];
    name: string;
    nickname: string;
    campusId: number[];
    courseId: number[];
    jobIdList: number[];
    domainIdList: number[];
    techStackIdList: number[];
    verifyCode: string;
    marketingConsent: ['동의', '동의하지 않음'];
  }
}
