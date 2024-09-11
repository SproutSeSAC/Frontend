import { useNavigate } from 'react-router-dom';

import { FaChevronLeft } from 'react-icons/fa';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import LoungeApplicationInfo from '@/components/lounge/detail/LoungeApplicationInfo';
import LoungeComment from '@/components/lounge/detail/LoungeComment';
import LoungePostDetails from '@/components/lounge/detail/LoungePostDetails';

export default function LoungeDetail() {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className="mt-[26px] flex gap-[42px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-10 h-[38px] w-[38px] items-center justify-center rounded bg-vividGreen2 text-white"
        >
          <FaChevronLeft />
        </button>

        <div className="w-full">
          <div className="w-full px-6 pb-[45px] pt-5">
            <div className="flex items-center justify-between">
              <h1 className="text-[32px] font-semibold">
                React 프로젝트 하실 분 모집합니다.
              </h1>
              <FavoriteButton isFavorite={false} onClick={() => {}} size={24} />
            </div>
            <LoungeApplicationInfo />
            <LoungePostDetails />
          </div>
        </div>
      </div>
      <LoungeComment />
    </div>
  );
}
