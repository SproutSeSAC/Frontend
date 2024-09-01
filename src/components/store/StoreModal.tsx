import { useState } from 'react';

import StoreCard from '@/components/store/StoreCard';
import StoreModalHeader from '@/components/store/StoreModalHeader';
import StoreModalMenuList from '@/components/store/StoreModalMenuList';
import StoreModalTabList from '@/components/store/StoreModalTabList';

interface StoreModalProps {
  onClose: () => void;
}

export default function StoreModal({ onClose }: StoreModalProps) {
  const [tab, setTab] = useState('menu');

  return (
    <div className="absolute top-0 m-[15px] h-[calc(100%-30px)] w-[420px] overflow-y-auto rounded bg-white px-5 pt-[15px] shadow-modal scrollbar-hide">
      <StoreModalHeader onClose={onClose} />

      <StoreCard
        showFavoriteButton={false}
        width="w-full"
        height="h-[269px]"
        phoneNumber="02-111-2222"
      />

      <StoreModalTabList tab={tab} setTab={setTab} />

      {tab === 'menu' && <StoreModalMenuList />}
    </div>
  );
}
