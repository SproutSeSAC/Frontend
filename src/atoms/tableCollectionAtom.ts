import { Collection } from '@/types';
import { atom } from 'jotai';

export const collectionAtom = atom<Collection>('내가 쓴 게시글');
