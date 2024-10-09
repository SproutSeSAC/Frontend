import VerticalSlider from '../common/slider/VerticalSlider';
import MealRecruitCard from './MealRecruitCard';
import MealRecruitModal from './MealRecruitModal';

import { useToggleModal } from '@/hooks';
import { BsPlus } from 'react-icons/bs';

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface MealRecruitSliderProps {
  sideViewOpen: boolean;
}

export default function MealRecruitSlider({
  sideViewOpen,
}: MealRecruitSliderProps) {
  const { modalOpen, toggleModal } = useToggleModal();
  return (
    <>
      {sideViewOpen && (
        <button
          className={`mb-7 flex w-full flex-col items-center rounded-lg bg-gray5 px-5 shadow-card ${list.length > 0 ? 'h-[105px] py-6' : 'h-full py-8'}`}
          onClick={toggleModal}
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
      <VerticalSlider slideList={list} spaceBetween={84} slideItemHeight={224}>
        <MealRecruitCard />
      </VerticalSlider>

      {modalOpen && <MealRecruitModal toggleModal={toggleModal} />}
    </>
  );
}
