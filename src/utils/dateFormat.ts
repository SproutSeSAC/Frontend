import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const dateFormat = (
  date?: string | number | Date,
  formatStr?:
    | 'yyyy.MM.dd'
    | 'yyyy년 MM월 dd일'
    | 'yyyy.MM.dd HH:mm'
    | 'HH:mm'
    | 'yyyy년 M월 d일 EEEE'
    | 'yyyy.MM.dd a h시'
    | 'yyyy-MM-dd HH:mm:ss'
    | "yyyy-MM-dd'T'HH:mm:ss",
): string => {
  const dateToFormat = date ? new Date(date) : new Date();
  const currFormat = formatStr || 'yyyy.MM.dd';
  return format(dateToFormat, currFormat, {
    locale: ko,
  });
};
