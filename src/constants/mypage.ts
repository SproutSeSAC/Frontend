import { Collection } from '@/types/mypage';

export const myCollectionList: Collection[] = [
  '내가 쓴 게시글',
  '내가 쓴 댓글',
  '내가 찜한 글',
];

export const myPostType = {
  MEAL: '한끼팟',
  PROJECT: '프로젝트',
  STUDY: '스터디',
} as const;
