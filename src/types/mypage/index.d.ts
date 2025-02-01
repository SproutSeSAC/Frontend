import { myPostType } from '@/constants';

export { myPostDto } from '@/types/mypage/myPostDto';

export type Collection = '내가 쓴 게시글' | '내가 쓴 댓글' | '내가 찜한 글';

export type MyPostType = typeof myPostType;
