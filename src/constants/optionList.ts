import { Option } from '@/types';

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
export const recruitmentCountList = Array.from({ length: 10 }, (_, index) => {
  if (index === 9) {
    return {
      id: index + 1,
      name: `${index + 1}명 이상`,
    };
  }
  return {
    id: index + 1,
    name: `${index + 1}명`,
  };
});
