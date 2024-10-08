import { atom } from 'jotai';

export const calendarAtom = atom<null | {
  id: string;
  title: string;
}>(null);
