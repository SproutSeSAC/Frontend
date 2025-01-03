import { noticeCategoryList } from '@/constants';
import { NoticeCategoryDisplayKey } from '@/types';

export const findCurrNotice = (key: NoticeCategoryDisplayKey) => {
  return noticeCategoryList.find(option => key === option.key);
};
