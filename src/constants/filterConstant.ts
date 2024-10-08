// 포지션
// TODO : api spec 나오면 타입지정 필요.
export const POSITION_FRONTEND = 'FRONTEND';
export const POSITION_BACKEND = 'BACKEND';
export const POSITION_데이터분석가 = '데이터분석가';
export const POSITION_데이터엔지니어 = '데이터엔지니어';
export const POSITION_AI엔지니어 = 'AI엔지니어';
export const POSITION_안드로이드개발자 = '안드로이드개발자';
export const POSITION_IOS개발자 = 'iOS개발자';
export const POSITION_유니티개발자 = '유니티개발자';
export const POSITION_UIUX디자이너 = 'UI/UX디자이너';
export const POSITION_일러스트레이터 = '일러스트레이터';
export const POSITION_PMPO = 'PM/PO';
export const POSITION_서비스기획자 = '서비스기획자';
export const POSITION_게임기획자 = '게임기획자';
export const POSITION_콘텐츠마케터 = '콘텐츠마케터';
export const POSITION_브랜드마케터 = '브랜드마케터';
export const POSITION_디지털마케터 = '디지털마케터';
export type Position =
  | typeof POSITION_FRONTEND
  | typeof POSITION_BACKEND
  | typeof POSITION_데이터분석가
  | typeof POSITION_데이터엔지니어
  | typeof POSITION_AI엔지니어
  | typeof POSITION_안드로이드개발자
  | typeof POSITION_IOS개발자
  | typeof POSITION_유니티개발자
  | typeof POSITION_UIUX디자이너
  | typeof POSITION_일러스트레이터
  | typeof POSITION_PMPO
  | typeof POSITION_서비스기획자
  | typeof POSITION_게임기획자
  | typeof POSITION_콘텐츠마케터
  | typeof POSITION_브랜드마케터
  | typeof POSITION_디지털마케터;
export const positionList: Array<{ key: Position; name: string; id: number }> =
  [
    { key: POSITION_FRONTEND, id: 1, name: '프론트엔드' },
    { key: POSITION_BACKEND, id: 2, name: '백엔드' },
    { key: POSITION_데이터분석가, id: 3, name: '데이터분석가' },
    { key: POSITION_데이터엔지니어, id: 4, name: '데이터엔지니어' },
    { key: POSITION_AI엔지니어, id: 5, name: 'AI엔지니어' },
    { key: POSITION_안드로이드개발자, id: 6, name: '안드로이드개발자' },
    { key: POSITION_IOS개발자, id: 7, name: 'iOS개발자' },
    { key: POSITION_유니티개발자, id: 8, name: '유니티개발자' },
    { key: POSITION_UIUX디자이너, id: 9, name: 'UI/UX디자이너' },
    { key: POSITION_일러스트레이터, id: 10, name: '일러스트레이터' },
    { key: POSITION_PMPO, id: 11, name: 'PM/PO' },
    { key: POSITION_서비스기획자, id: 12, name: '서비스기획자' },
    { key: POSITION_게임기획자, id: 13, name: '게임기획자' },
    { key: POSITION_콘텐츠마케터, id: 14, name: '콘텐츠마케터' },
    { key: POSITION_브랜드마케터, id: 15, name: '브랜드마케터' },
    { key: POSITION_디지털마케터, id: 16, name: '디지털마케터' },
  ];

// 진행방식
export const PROGRESS_ONLINE = 'ONLINE';
export const PROGRESS_OFFLINE = 'OFFLINE';
export const PROGRESS_HYBRID = 'HYBRID';

export type Progress =
  | typeof PROGRESS_ONLINE
  | typeof PROGRESS_OFFLINE
  | typeof PROGRESS_HYBRID;
export const progressList: Array<{ id: number; name: string; key: Progress }> =
  [
    { id: 1, name: '전체', key: PROGRESS_HYBRID },
    { id: 2, name: '온라인', key: PROGRESS_ONLINE },
    { id: 3, name: '오프라인', key: PROGRESS_OFFLINE },
  ];
export const progressDisplay: { [key in Progress]: string } = {
  HYBRID: '전체',
  ONLINE: '온라인',
  OFFLINE: '오프라인',
};

export const PTYPE_STUDY = 'STUDY';
export const PTYPE_PROJECT = 'PROJECT';
export type Ptype = typeof PTYPE_STUDY | typeof PTYPE_PROJECT;
export const PtypeList: Array<{ id: number; name: string; key: Ptype }> = [
  { id: 1, name: '스터디', key: PTYPE_STUDY },
  { id: 2, name: '프로젝트', key: PTYPE_PROJECT },
];
export const ptypeDisplay: { [key in Ptype]: string } = {
  STUDY: '스터디',
  PROJECT: '프로젝트',
};
// sort
export const SORT_POPULARITY = 'popularity';
export const SORT_LATEST = 'latest';
export type SortType = typeof SORT_POPULARITY | typeof SORT_LATEST;
export const sortList: Array<{ id: number; name: string; key: SortType }> = [
  { id: 1, name: '인기순', key: SORT_POPULARITY },
  { id: 2, name: '최신순', key: SORT_LATEST },
];
export const sortDisplay: { [key in SortType]: string } = {
  popularity: '인기순',
  latest: '최신순',
};

// 연락방법
export const CONTACT_METHOD_EMAIL = 'EMAIL';
export const CONTACT_METHOD_PHONE = 'PHONE';
export const CONTACT_METHOD_MESSENGER = 'MESSENGER';
export type ContactMethodType =
  | typeof CONTACT_METHOD_EMAIL
  | typeof CONTACT_METHOD_PHONE
  | typeof CONTACT_METHOD_MESSENGER;
export const contactMethodList: Array<{
  id: number;
  name: string;
  key: ContactMethodType;
}> = [
  { id: 1, name: '이메일', key: CONTACT_METHOD_EMAIL },
  { id: 2, name: '휴대폰', key: CONTACT_METHOD_PHONE },
  { id: 2, name: '메신저', key: CONTACT_METHOD_MESSENGER },
];
export const contactMethodDisplay: { [key in ContactMethodType]: string } = {
  EMAIL: '이메일',
  PHONE: '휴대폰',
  MESSENGER: '메신저',
};
