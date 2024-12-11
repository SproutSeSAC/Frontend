import { PageableType } from './pageable';

export interface GetMealPostList extends PageableType {
  mealPosts: MealPosts[];
}

export interface MealPosts {
  id: number;
  title: string;
  appointmentTime: string;
  memberCount: number;
  meetingPlace: string;
  ordinalNumber: number;
  storeName: string;
  targetMemberCount: number;
  currentMemberCount: number;
  ownerNickname: string;
  ownerProfileImageUrl: string;
  isParticipant: boolean;
}

export interface GetMealPostDetail
  extends Omit<
    MealPosts,
    | 'id'
    | 'memberCount'
    | 'ordinalNumber'
    | 'ownerNickname'
    | 'ownerProfileImageUrl'
    | 'isParticipant'
  > {
  mealPostId: number;
  members: Array<Members>;
}

export interface Members {
  userId: number;
  nickname: string;
  imgUrl: string;
  isOwner: boolean;
}

export interface PostMeal {
  title: string;
  appointmentTime: string;
  meetingPlace: string;
  memberCount: number;
  storeName: string;
}

export type PutMealPost = Pick<GetMealPostDetail, 'mealPostId'>;
