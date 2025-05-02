import { MyCollection } from '@/types';
import { atom } from 'jotai';

export const myCollectionAtom = atom<MyCollection>('내가 쓴 게시글');
