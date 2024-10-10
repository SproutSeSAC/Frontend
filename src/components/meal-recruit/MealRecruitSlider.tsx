import VerticalSlider from '../common/slider/VerticalSlider';
import MealRecruitCard from './MealRecruitCard';
import MealRecruitModal from './MealRecruitModal';

import { useDialogContext } from '@/hooks';
import { BsPlus } from 'react-icons/bs';

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface MealRecruitSliderProps {
  sideViewOpen: boolean;
}

export default function MealRecruitSlider({
  sideViewOpen,
}: MealRecruitSliderProps) {
  const { showDialog } = useDialogContext();

  return (
    <>
      {sideViewOpen && (
        <button
          className={`mb-7 flex w-full flex-col items-center rounded-lg bg-gray5 px-5 shadow-card ${list.length > 0 ? 'h-[105px] py-6' : 'h-full py-8'}`}
          onClick={async () => {
            await showDialog({
              key: 'MEAL-RECRUIT-TYPE',
              element: <MealRecruitModal />,
            });
          }}
        >
          <div className="w-fit rounded-full bg-vividGreen1 text-white">
            <BsPlus size={30} />
          </div>

          <p
            className={`text-base font-semibold ${list.length > 0 ? 'mt-2' : 'mb-2 mt-4'}`}
          >
            한끼팟 만들기
          </p>
          {list.length === 0 && (
            <p className="text-xs">
              다른 사람들의 이야기가 궁금한가요?
              <br />
              함께 식사할 사람을 찾아봐요!
            </p>
          )}
        </button>
      )}
      <div className="mb-10">
        <VerticalSlider
          slideList={list}
          spaceBetween={24}
          slideItemHeight={224}
          containerHeightOffset={360}
          paginationHeightOffset={380}
        >
          {item => <MealRecruitCard slideItem={item} />}
        </VerticalSlider>
      </div>
    </>
  );
}
