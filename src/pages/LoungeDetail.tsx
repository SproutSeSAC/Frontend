import { useNavigate } from 'react-router-dom';

import { FaChevronLeft } from 'react-icons/fa';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import ApplicationInfoTemplate from '@/components/common/postTemplate/ApplicationInfoTemplate';
import CommentTemplate from '@/components/common/postTemplate/CommentTemplate';
import PostDetailsTemplate from '@/components/common/postTemplate/PostDetailsTemplate';

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
            <Tag
              color="green"
              size="medium"
              text="프로젝트"
              className="mt-12 w-fit"
            />
            <ApplicationInfoTemplate />
            <PostDetailsTemplate
              actions={[{ label: '참여하기', onClick: () => {} }]}
            />
          </div>
        </div>
      </div>
      <CommentTemplate />
    </div>
  );
}
