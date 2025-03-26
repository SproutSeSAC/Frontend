import { atom } from 'jotai';

const initData = {
  latitude: '',
  longitude: '',
  id: 0,
  zoom: 0,
};

export const storeMapDetailsAtom = atom(initData);
export const zoomBehaviorFlagAtom = atom(false);

export const resetStoreMapDetailsAtom = atom(null, (_, set) =>
  set(storeMapDetailsAtom, initData),
);
