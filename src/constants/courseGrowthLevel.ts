import growthCharacter1 from '@/assets/images/growth-character/growth-character1.png';
import growthCharacter2 from '@/assets/images/growth-character/growth-character2.png';
import growthCharacter3 from '@/assets/images/growth-character/growth-character3.png';
import growthCharacter4 from '@/assets/images/growth-character/growth-character4.png';
import growthCharacter5 from '@/assets/images/growth-character/growth-character5.png';
import growthCharacter6 from '@/assets/images/growth-character/growth-character6.png';
import { CourseGrowthLevel } from '@/types';

export const courseGrowthLevelList: CourseGrowthLevel[] = [
  {
    level: 1,
    label: '두잎 새싹',
    maxProgress: 17,
    image: growthCharacter1,
  },
  {
    level: 2,
    label: '두잎 새싹',
    maxProgress: 34,
    image: growthCharacter2,
  },
  {
    level: 3,
    label: '세잎 새싹',
    maxProgress: 51,
    image: growthCharacter3,
  },
  {
    level: 4,
    label: '어린 나무',
    maxProgress: 68,
    image: growthCharacter4,
  },
  {
    level: 5,
    label: '꽃핀 나무',
    maxProgress: 85,
    image: growthCharacter5,
  },
  {
    level: 6,
    label: '열매 나무',
    maxProgress: 100,
    image: growthCharacter6,
  },
];
