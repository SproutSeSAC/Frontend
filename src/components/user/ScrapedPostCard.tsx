import { useCallback } from 'react';

import { serviceType } from '@/constants/serviceConstant';
import { MyScrapedPost } from '@/types/mypage/myPostDto';
import { getColorByPostType } from '@/utils';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import Tag from '@/components/common/tag/Tag';
import UserImage from '@/components/user/UserImage';

interface ScrapedPostCardProps {
  card: MyScrapedPost;
}

export default function ScrapedPostCard({ card }: ScrapedPostCardProps) {
  const stripHTML = useCallback((htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '-';
  }, []);

  return (
    <li className="h-[238px] w-full rounded-3xl border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <Tag
          size="big"
          color={getColorByPostType(card.postType)}
          text={`#${serviceType[card.postType]}`}
          className="py-1.5"
        />
        <FavoriteButton size={20} isFavorite onClick={() => {}} />
      </div>
      <h3 className="mb-2 tracking-tight">{card.title}</h3>
      <p className="line-clamp-2 flex-1 tracking-tight text-mainGray-active">
        {stripHTML(card.content)} Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Animi in totam sit, optio architecto vel eos assumenda
        sunt impedit accusamus molestiae incidunt facere vitae quis reiciendis,
        error itaque deleniti et!
      </p>

      <div className="mt-6 flex items-center gap-x-3">
        <UserImage
          className="size-12"
          imageNameSegment={card.writer.profileImg}
        />
        <div className="flex flex-col">
          <span className="text-sm">{card.writer.name}</span>
          <span className="text-xs opacity-60">@{card.writer.nickname}</span>
        </div>
      </div>
    </li>
  );
}
