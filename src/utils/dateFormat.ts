import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const dateFormat = (date: string | Date, formatStr?: string): string => {
  return format(date ? new Date(date) : new Date(), formatStr || 'yyyy.MM.dd', {
    locale: ko,
  });
};
