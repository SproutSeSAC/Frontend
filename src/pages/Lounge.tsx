import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import LoungePostCard from '@/components/lounge/LoungePostCard';

export default function Lounge() {
  return (
    <>
      <MainView>
        <Header
          title="나에게 딱 맞는 프로젝트를 만나보세요!"
          highlight="프로젝트"
        />
        <ul className="grid grid-cols-3 gap-4 sm:!grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(card => (
            <li key={card} className="[&>div]:w-full">
              <LoungePostCard />
            </li>
          ))}
        </ul>
      </MainView>
      <SideView>사이드뷰</SideView>
    </>
  );
}
