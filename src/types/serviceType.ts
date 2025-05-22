import { postTypeObj } from '@/constants';

export interface Option {
  id: number;
  name: string;
  key?: string;
}

export type PostTypeKey = keyof typeof postTypeObj;
