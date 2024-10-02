import {
  KeyOfRole,
  Role,
  SignUpQuestionsByStep,
  UserInfo,
  VerifyCode,
} from '@/types';

const commonFirstStep: SignUpQuestionsByStep[] = [
  {
    title: { text: '회원 유형을 선택해주세요.' },
    roles: [
      'TRAINEE',
      'EDU_MANAGER',
      'CAMPUS_MANAGER',
      'JOB_COORDINATOR',
      'PRE_TRAINEE',
    ],
  },
  {
    title: { text: '성함을 입력해주세요.' },
    name: '',
  },
  {
    title: { text: '사용하실 닉네임을 입력해주세요.' },
    nickname: '',
  },
];

const commonStudentStep: SignUpQuestionsByStep[] = [
  {
    title: {
      text: '본인의 스택을 선택해주세요.',
      condition: '',
    },
    techStackIdList: [],
  },
  {
    title: { text: '관심있는 직군을 선택해주세요.', condition: '*최대 5가지' },
    jobIdList: [],
  },
  {
    title: {
      text: '관심있는 도메인을 선택해주세요.',
      condition: '*최대 3가지',
    },
    domainIdList: [],
  },
];

const sesacStudentStep: SignUpQuestionsByStep[] = [
  {
    title: { text: '소속 캠퍼스를 선택해주세요.', condition: '' },
    campusId: [],
  },
  {
    title: { text: '소속 교육과정을 선택해주세요.', condition: '' },
    courseId: [],
  },
];

const adminStep: SignUpQuestionsByStep[] = [
  {
    title: { text: '담당 캠퍼스는 무엇인가요?', condition: '*중복 가능' },
    campusId: [],
  },
  {
    title: { text: '담당 교육 과정은 무엇인가요?', condition: '' },
    courseId: [],
  },
];

const indentification: SignUpQuestionsByStep[] = [
  {
    title: { text: '정보 확인을 위하여 확인 코드를 입력해주세요.' },
    verifyCode: '',
  },
];

const marketingConsent: SignUpQuestionsByStep[] = [
  {
    title: { text: '마케팅 활용 및 정보 수신에 동의하시나요?' },
    marketingConsent: ['동의', '동의하지 않음'],
    additionalInfo:
      '스프라우트가 제공하는 이벤트, 혜택, 다양한 정보(뉴스레터, 취업, 교육 등) 안내 목적으로 이메일을 통한 정보수신을 위해 이용하고자 합니다. 마케팅 및 정보 수신을원하지 않는 경우, 동의하지 않아도 됩니다.',
  },
];

export const getQuestionListByRole = (
  role: KeyOfRole,
): SignUpQuestionsByStep[][] => {
  if (role === 'TRAINEE') {
    return [
      commonFirstStep,
      sesacStudentStep,
      commonStudentStep,
      [...indentification, ...marketingConsent],
    ];
  }
  if (role === 'PRE_TRAINEE') {
    return [commonFirstStep, commonStudentStep, marketingConsent];
  }
  return [
    commonFirstStep,
    adminStep,
    [...indentification, ...marketingConsent],
  ];
};

export const matchedRoleName: Role = {
  ADMIN: '관리자',
  TRAINEE: '새싹 교육생',
  EDU_MANAGER: '교육 매니저',
  CAMPUS_MANAGER: '캠퍼스 매니저',
  JOB_COORDINATOR: '잡코디',
  PRE_TRAINEE: '예비 수강생',
};

export const defaultSignUpFormValues: UserInfo & VerifyCode = {
  name: '',
  nickname: '',
  role: 'TRAINEE',
  campusId: 1,
  courseId: 1,
  domainIdList: [1, 2],
  jobIdList: [1, 2],
  techStackIdList: [1, 2],
  marketingConsent: '동의',
  verifyCode: '',
};
