import {
  ContactMethodDisplayKey,
  Progress,
  Ptype,
  SortDisplayKey,
} from '@/types';

// 진행방식
export const progressDisplay = {
  HYBRID: '전체',
  ONLINE: '온라인',
  OFFLINE: '오프라인',
} as const;
export const progressList: Array<{ id: number; name: string; key: Progress }> =
  [
    { id: 1, name: '전체', key: 'HYBRID' },
    { id: 2, name: '온라인', key: 'ONLINE' },
    { id: 3, name: '오프라인', key: 'OFFLINE' },
  ];

// 프로젝트 타입
export const PTYPE_STUDY = 'STUDY';
export const PTYPE_PROJECT = 'PROJECT';
export const ptypeDisplay = {
  STUDY: '스터디',
  PROJECT: '프로젝트',
} as const;
export const ptypeList: Array<{
  id: number;
  name: string;
  key: Ptype;
}> = [
  { id: 1, name: '스터디', key: PTYPE_STUDY },
  { id: 2, name: '프로젝트', key: PTYPE_PROJECT },
];

// 프로젝트 정렬
export const SORT_POPULARITY = 'popularity';
export const SORT_LATEST = 'latest';

export const sortDisplay = {
  popularity: '인기순',
  latest: '최신순',
} as const;

export const sortList: Array<{
  id: number;
  name: string;
  key: SortDisplayKey;
}> = [
  { id: 1, name: '인기순', key: SORT_POPULARITY },
  { id: 2, name: '최신순', key: SORT_LATEST },
];

// 연락방법
export const CONTACT_METHOD_EMAIL = 'EMAIL';
export const CONTACT_METHOD_PHONE = 'PHONE';
export const CONTACT_METHOD_MESSENGER = 'MESSENGER';

export const contactMethodDisplay = {
  EMAIL: '이메일',
  PHONE: '휴대폰',
  MESSENGER: '오픈채팅방',
} as const;

export const contactMethodList: Array<{
  id: number;
  name: string;
  key: ContactMethodDisplayKey;
}> = [
  { id: 1, name: '이메일', key: CONTACT_METHOD_EMAIL },
  { id: 2, name: '휴대폰', key: CONTACT_METHOD_PHONE },
  { id: 3, name: '오픈채팅방', key: CONTACT_METHOD_MESSENGER },
];
