import { Calendar } from '@/types/calendarDto';
import { atom } from 'jotai';

export const calendarAtom = atom<null | Calendar>(null);
