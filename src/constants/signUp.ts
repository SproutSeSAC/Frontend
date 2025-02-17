import { RoleKey, SignUpFormValue, SignUpQuestionsByStep } from '@/types';
import {
  isCampusLeader,
  isEduManager,
  isInstructor,
  isJobCoordinator,
  isOperationManager,
  isTrainee,
} from '@/utils';

const commonFirstStep: SignUpQuestionsByStep[] = [
  {
    title: { text: '회원 유형을 선택해주세요.' },
    roles: [
      'TRAINEE',
      'EDU_MANAGER',
      'OPERATION_MANAGER',
      'CAMPUS_LEADER',
      'JOB_COORDINATOR',
      'INSTRUCTOR',
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
    techStackList: [],
  },
  {
    title: { text: '관심있는 직군을 선택해주세요.', condition: '*최대 5가지' },
    jobList: [],
  },
  {
    title: {
      text: '관심있는 도메인을 선택해주세요.',
      condition: '*최대 3가지',
    },
    domainList: [],
  },
];

const sesacStudentStep: SignUpQuestionsByStep[] = [
  {
    title: { text: '소속 캠퍼스를 선택해주세요.', condition: '' },
    campusList: [],
  },
  {
    title: { text: '소속 교육과정을 선택해주세요.', condition: '' },
    courseList: [],
  },
];

const adminCampusStep: (condition?: 'isMultiple') => SignUpQuestionsByStep[] = (
  condition?: 'isMultiple',
) => {
  return [
    {
      title: {
        text: '담당 캠퍼스는 무엇인가요?',
        condition: condition === 'isMultiple' ? '*다중선택가능' : '',
      },
      campusList: [],
    },
  ];
};

const adminCourseStep: (condition?: 'isMultiple') => SignUpQuestionsByStep[] = (
  condition?: 'isMultiple',
) => {
  return [
    {
      title: {
        text: '담당 교육 과정은 무엇인가요?',
        condition: condition === 'isMultiple' ? '*다중선택가능' : '',
      },
      courseList: [],
    },
  ];
};

const indentification: SignUpQuestionsByStep[] = [
  {
    title: { text: '정보 확인을 위하여 인증코드를 입력해주세요.' },
    verifyCode: '',
  },
];

const termsConsent: SignUpQuestionsByStep[] = [
  {
    title: { text: '이용약관 및 개인정보 수집이용에 동의하시나요?' },
    termList: ['이용약관', '개인정보 수집이용'],
  },
];

const phoneNumber: SignUpQuestionsByStep = {
  title: { text: '전화번호를 입력해주세요.', condition: '' },
  phoneNumber: '',
};

export const getFormStepsByRole = (
  role: RoleKey,
): SignUpQuestionsByStep[][] => {
  const restStep = () => {
    const lastStep = [...indentification, ...termsConsent];

    if (isTrainee(role)) {
      return [[...sesacStudentStep, phoneNumber], commonStudentStep, lastStep];
    }
    if (isCampusLeader(role) || isOperationManager(role)) {
      return [[...adminCampusStep('isMultiple'), phoneNumber], lastStep];
    }
    if (isEduManager(role) || isInstructor(role)) {
      return [
        [...adminCampusStep(), ...adminCourseStep(), phoneNumber],
        lastStep,
      ];
    }
    if (isJobCoordinator(role)) {
      return [
        [
          ...adminCampusStep('isMultiple'),
          ...adminCourseStep('isMultiple'),
          phoneNumber,
        ],
        lastStep,
      ];
    }
    return [];
  };

  return [commonFirstStep, ...restStep()];
};

export const defaultSignUpFormValues: SignUpFormValue = {
  name: '',
  nickname: '',
  role: 'TRAINEE',
  campusIdList: [],
  courseIdList: [],
  domainIdList: [1, 2],
  jobIdList: [1, 2],
  techStackIdList: [],
  termsAgree: false,
  dataConsent: false,
  verifyCode: '',
  phoneNumber: '',
};
