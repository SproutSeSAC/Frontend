import { Option } from '@/types';

// 시간선택 option
export const hours: Option[] = Array.from({ length: 23 }, (_, i) => ({
  id: Number(String(i + 1).padStart(2, '0')),
  name: `${String(i + 1).padStart(2, '0')}시`,
}));

// 분선택 option
export const minutes: Option[] = Array.from({ length: 6 }, (_, i) => ({
  id: Number(String(i * 10).padStart(2, '0')),
  name: `${String(i * 10).padStart(2, '0')}분`,
}));

// 인원수 선택 option
export const recruitmentCountList: Option[] = Array.from(
  { length: 10 },
  (_, index) => {
    if (index === 9) {
      return {
        id: index + 1,
        name: `${index + 1}명 이상`,
      };
    }
    return {
      id: index + 1,
      name: `${index + 1}명`,
    };
  },
);

// 내가 쓴 테이블 포스트 타입 option
export const myPostTypeOptionList: Option[] = [
  { id: 1, name: '한끼팟', key: 'MEAL' },
  { id: 2, name: '프로젝트', key: 'PROJECT' },
  { id: 3, name: '스터디', key: 'STUDY' },
];

export const myCommentTypeOptionList: Option[] = [
  { id: 1, name: '프로젝트', key: 'PROJECT' },
  { id: 2, name: '스터디', key: 'STUDY' },
  { id: 3, name: '공지사항', key: 'NOTICE' },
  { id: 4, name: '맛집', key: 'STORE' },
];
