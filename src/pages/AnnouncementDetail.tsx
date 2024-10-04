import { useNavigate } from 'react-router-dom';

import { FaChevronLeft } from 'react-icons/fa';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import ApplicationInfoTemplate from '@/components/common/post-template/ApplicationInfoTemplate';
import CommentTemplate from '@/components/common/post-template/CommentTemplate';
import PostDetailsTemplate from '@/components/common/post-template/PostDetailsTemplate';

export default function AnnouncementDetail() {
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
                국민 취업제도 관련 공지
              </h1>
              <FavoriteButton isFavorite={false} onClick={() => {}} size={24} />
            </div>

            <div className="mt-12 flex gap-2">
              <Tag
                color="yellow"
                size="medium"
                text="잡코디"
                className="w-fit"
              />
              <Tag color="gray" size="medium" text="특강" className="w-fit" />
            </div>
            <ApplicationInfoTemplate />
            <PostDetailsTemplate
              actions={[
                { label: 'Zoom', onClick: () => {}, className: 'bg-gray2' },
                {
                  label: '참여하기',
                  onClick: () => {},
                  className: 'bg-oliveGreen1',
                },
              ]}
            />
          </div>
        </div>
      </div>
      <CommentTemplate commentList={[]} onSubmit={() => {}} />
    </div>
  );
}
