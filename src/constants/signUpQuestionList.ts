type FormInputs = {
  step: number;
  roles: string[];
  name: string;
  nickname: string;
  courseId: string[];
  jobList: string[];
  domainList: string[];
  email: string;
  avatarImgUrl: string;
  campus: string[];
  keyword: string;
  marketingConsent: string[];
};

type Step = {
  [K in keyof FormInputs]: {
    title: { text: string; condition?: string };
  } & Pick<FormInputs, K>;
}[keyof FormInputs];

const commonFirstStep: Step[] = [
  {
    title: { text: '회원 유형을 선택해주세요.' },
    roles: [
      '새싹 교육생',
      '교육 매니저',
      '캠퍼스 매니저',
      '잡코디',
      '예비 수강생',
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

const commonStudentStep: Step[] = [
  {
    title: { text: '관심있는 직군을 선택해주세요.', condition: '*최대 5가지' },
    jobList: [
      '프론트엔드',
      '백엔드',
      '데이터 분석가',
      'AI 엔지니어',
      '안드로이드 개발',
      'iOS 개발',
      'PM/PO',
      '게임기획',
      '유니티 개발',
      '서비스 기획자',
      '콘텐츠 마케터',
      'UI/UX 디자이너',
      '브랜드 디자이너',
    ],
  },
  {
    title: {
      text: '관심있는 도메인을 선택해주세요.',
      condition: '*최대 3가지',
    },
    domainList: [
      '소셜/컨텐츠',
      '모빌리티',
      '패션',
      '여행',
      '푸드테크',
      '이커머스',
      '헬스케어',
      '금융/보험',
      '직장',
      '프롭테크',
      '인공지능 AI',
      '교육',
      '블록체인',
    ],
  },
];

const sesacStudentStep: Step[] = [
  {
    title: { text: '소속 캠퍼스를 선택해주세요.', condition: '' },
    campus: ['강북 캠퍼스', '도봉 캠퍼스', '성북 캠퍼스'],
  },
  {
    title: { text: '소속 교육과정을 선택해주세요.', condition: '*선택' },
    courseId: ['디지털헬스케어 서비스 기획 올라잇'],
  },
];

const indentification: Step[] = [
  {
    title: { text: '정보 확인을 위하여 키워드를 작성해주세요.' },
    keyword: '',
  },
];

const adminStep: Step[] = [
  {
    title: { text: '담당 캠퍼스는 무엇인가요?', condition: '*중복 가능' },
    campus: ['강북 캠퍼스', '도봉 캠퍼스', '성북 캠퍼스'],
  },
  {
    title: { text: '담당 교육 과정은 무엇인가요?', condition: '*선택' },
    courseId: ['디지털헬스케어 서비스 기획 올라잇'],
  },
];

const marketingConsent: Step[] = [
  {
    title: { text: '마케팅 활용 및 정보 수신에 동의하시나요?' },
    marketingConsent: ['동의', '동의하지 않음'],
  },
];

export const getQuestionListByRole = (role: string): Step[][] => {
  if (role === '새싹 교육생') {
    return [
      commonFirstStep,
      sesacStudentStep,
      commonStudentStep,
      [...indentification, ...marketingConsent],
    ];
  }
  if (role === '예비 수강생') {
    return [commonFirstStep, commonStudentStep, marketingConsent];
  }
  return [
    commonFirstStep,
    adminStep,
    [...indentification, ...marketingConsent],
  ];
};
