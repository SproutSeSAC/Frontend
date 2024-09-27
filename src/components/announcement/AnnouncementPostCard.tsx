import { Link } from 'react-router-dom';

import { BsEye } from 'react-icons/bs';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';

// interface AnnouncementPostCardProps {
//   card?: number;
// }

const getTagColor = (tag: string) => {
  switch (tag) {
    case '잡코디':
      return 'yellow';
    case '기관매니저':
      return 'pink';
    default:
      return 'purple';
  }
};

export default function AnnouncementPostCard() {
  return (
    <Link
      to="/announcement/post/1"
      className="flex w-full flex-col rounded-2xl bg-white p-4 px-6 py-4"
    >
      <div className="flex w-full items-center justify-between">
        <Tag
          color={getTagColor('기관매니저')}
          size="medium"
          text="기관 매니저"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray2">
            <BsEye size={20} />
            <span>99</span>
          </div>
          <FavoriteButton isFavorite onClick={() => {}} size={20} />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xl font-semibold">개발관련 취업 꿀팁 공지</h4>

        <div className="mt-3 text-lg text-gray1">
          점점 더 높아지는 취업의 벽 앞에 꿈꾸던 회사로의 입사는 요원해 보이기만
          합니다. 이런 막막함 속에서 먼저 입사한 선배의 조언은 취준생에게
          길잡이가 되어주기도 하죠. 오늘은 카카오에서 3년 차 백엔드 개발자로
          근무 중인 강승현 님과 함께 취업 이야기를 나눠보았습니다. 승현 님은
          자신의 취업 준비 시절을 회고하며 유용한 취업 팁을 아낌없이
          공유해주셨습니다.
        </div>

        <div className="mt-6 border-b border-solid border-gray4 pb-[18px]">
          <span className="announcement-text-divider leading-4 text-text">
            기간
          </span>
          <span className="leading-4 text-gray2">
            프론트엔드, 백엔드, 서버 개발
          </span>
        </div>

        <div className="mt-4 w-full text-right text-gray2">2024.08.27</div>
      </div>
    </Link>
  );
}
