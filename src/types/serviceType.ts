import { postTypeObj } from '@/constants';

export interface Option {
  id: number;
  name: string;
  key?: string;
  isDisabled?: boolean;
}

export type PostTypeKey = keyof typeof postTypeObj;
