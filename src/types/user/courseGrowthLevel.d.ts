export type CourseGrowthLevelLabel =
  | '두잎 새싹'
  | '세잎 새싹'
  | '튼튼 줄기'
  | '어린 나무'
  | '꽃핀 나무'
  | '열매 나무';

export type CourseGrowthLevel = {
  level: number;
  label: CourseGrowthLevelLabel;
  maxProgress: number;
  image: string;
};
