import { PTYPE_PROJECT, PTYPE_STUDY } from '@/constants';

export const LOUNGE_TAB_LIST = [
  { text: '전체', type: 'ALL' },
  { text: '프로젝트', type: PTYPE_PROJECT },
  { text: '스터디', type: PTYPE_STUDY },
  { text: '찜 모아보기', type: 'onlyScraped' },
];
