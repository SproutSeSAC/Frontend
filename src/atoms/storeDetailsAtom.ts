import { atom } from 'jotai';

export type StoreMapDetail = {
  storeId: number | 'CAMPUS_MARKER';
  lat: number;
  lng: number;
};

export const storeMapDetailsAtom = atom<StoreMapDetail | null>(null);

const modalOpenInitValue = {
  open: false,
  storeId: 0,
};

export const storeModalOpenAtom = atom(modalOpenInitValue);
