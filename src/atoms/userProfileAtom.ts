import { UserProfile } from '@/types';
import { atom } from 'jotai';

export const userProfileAtom = atom<UserProfile | null>(null);
