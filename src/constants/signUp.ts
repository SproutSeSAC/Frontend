import { RoleKey, SignUpQuestionsByStep, SignUpUserFormValue } from '@/types';
import {
  isCampusLeader,
  isEduManager,
  isInstructor,
  isJobCoordinator,
  isOperationManager,
  isPreTrainee,
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

const marketingConsent: SignUpQuestionsByStep[] = [
  {
    title: { text: '마케팅 활용 및 정보 수신에 동의하시나요?' },
    marketingConsent: ['동의', '동의하지 않음'],
    additionalInfo:
      '스프라우트가 제공하는 이벤트, 혜택, 다양한 정보(뉴스레터, 취업, 교육 등) 안내 목적으로 이메일을 통한 정보수신을 위해 이용하고자 합니다. 마케팅 및 정보 수신을원하지 않는 경우, 동의하지 않아도 됩니다.',
  },
];

export const getFormStepsByRole = (
  role: RoleKey,
): SignUpQuestionsByStep[][] => {
  const restStep = () => {
    const lastStep = [...indentification, ...marketingConsent];

    if (isTrainee(role)) {
      return [sesacStudentStep, commonStudentStep, lastStep];
    }
    if (isPreTrainee(role)) {
      return [commonStudentStep, marketingConsent];
    }
    if (isOperationManager(role)) {
      return [adminCampusStep('isMultiple'), lastStep];
    }
    if (isCampusLeader(role) || isOperationManager(role)) {
      return [adminCampusStep('isMultiple'), lastStep];
    }
    if (isEduManager(role) || isInstructor(role)) {
      return [[...adminCampusStep(), ...adminCourseStep()], lastStep];
    }
    if (isJobCoordinator(role)) {
      return [
        [...adminCampusStep('isMultiple'), ...adminCourseStep('isMultiple')],
        lastStep,
      ];
    }
    return [];
  };

  return [commonFirstStep, ...restStep()];
};

export const defaultSignUpFormValues: SignUpUserFormValue = {
  name: '',
  nickname: '',
  role: 'TRAINEE',
  campusIdList: [],
  courseIdList: [],
  domainIdList: [1, 2],
  jobIdList: [1, 2],
  techStackIdList: [],
  marketingConsent: true,
  verifyCode: '',
};
