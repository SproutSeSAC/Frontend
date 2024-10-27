import { PageableType } from './pageable';

export interface GetMealPostList extends PageableType {
  content: Content[];
}

export interface Content {
  id: number;
  title: string;
  appointmentTime: string;
  memberCount: number;
  meetingPlace: string;
  ordinalNumber: number;
}

export interface GetMealPostDetail extends PostMeal {
  mealPostId: number;
}

export interface PostMeal {
  title: string;
  appointmentTime: string;
  meetingPlace: string;
  memberCount: number;
  storeName: string;
}

export type PutMealPost = Pick<GetMealPostDetail, 'mealPostId'>;
