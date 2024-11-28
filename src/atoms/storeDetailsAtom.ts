import { atom } from 'jotai';

const initData = {
  latitude: '',
  longitude: '',
  id: 0,
  zoom: 0,
};

export const storeDetailsAtom = atom(initData);
export const zoomBehaviorFlagAtom = atom(false);

export const resetStoreDetailsAtom = atom(null, (_, set) =>
  set(storeDetailsAtom, initData),
);
