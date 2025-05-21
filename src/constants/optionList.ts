import { Option } from '@/types';

/** 전체 페이지에서 사용 가능한 공통 옵션 목록 상수 정의 파일
 * - 시간선택 option
 * - 분선택 option
 * - 인원수 선택 option
 * - 작성자 글 모음 테이블 포스트 타입 option
 * - 작성자 댓글 모음 테이블 포스트 타입 option
 */

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
  { length: 9 },
  (_, index) => {
    if (index === 8) {
      return {
        id: 10000,
        name: '제한 없음',
      };
    }
    return {
      id: index + 2,
      name: `${index + 2}명`,
    };
  },
);

// 매니저 작성 글 모음 테이블 포스트 타입 option
export const adminCategoryOptionList: Option[] = [
  { id: 1, name: '공지사항', key: 'NOTICE' },
  { id: 2, name: '한끼팟', key: 'MEAL' },
  { id: 3, name: '프로젝트', key: 'PROJECT' },
  { id: 4, name: '스터디', key: 'STUDY' },
];

// 작성자 글 모음 테이블 포스트 타입 option
export const traineePostTableCategoryOptionList: Option[] = [
  { id: 1, name: '한끼팟', key: 'MEAL' },
  { id: 2, name: '프로젝트', key: 'PROJECT' },
  { id: 3, name: '스터디', key: 'STUDY' },
];

// 작성자 댓글 모음 테이블 포스트 타입 option
export const commentTableCategoryOptionList: Option[] = [
  { id: 1, name: '프로젝트', key: 'PROJECT' },
  { id: 2, name: '스터디', key: 'STUDY' },
  { id: 3, name: '공지사항', key: 'NOTICE' },
  { id: 4, name: '맛집', key: 'STORE' },
];
