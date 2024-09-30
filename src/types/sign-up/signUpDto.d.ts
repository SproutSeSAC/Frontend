export type SignUpFormTitle = {
  title: { text: string; condition?: string };
  additionalInfo?: string;
};

export type SignUpFormData = {
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
  marketingConsent: [true, false];
};

export type SignUpQuestionsByStep = {
  [K in keyof SignUpFormData]: SignUpFormTitle & Pick<SignUpFormData, K>;
}[keyof SignUpFormData];

export type VerifyCode = {
  verifyCode: string;
};
