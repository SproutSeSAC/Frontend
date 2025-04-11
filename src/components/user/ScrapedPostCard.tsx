import { useCallback } from 'react';

import { Link } from 'react-router-dom';

import { postTypeObj } from '@/constants';
import { useHandleScrap } from '@/hooks';
import { MyScrapedPost } from '@/types/mypage/myPostDto';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import Tag from '@/components/common/tag/Tag';
import UserImage from '@/components/user/UserImage';

interface ScrapedPostCardProps {
  card: Omit<MyScrapedPost, 'ptype'>;
}

export default function ScrapedPostCard({ card }: ScrapedPostCardProps) {
  const stripHTML = useCallback((htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '-';
  }, []);

  const { onScrapClick, isDeleteScrapPending, isIdle } = useHandleScrap({
    postId: card.postId,
    isScraped: true,
    invalidateQueryKeys: [{ queryKey: ['useGetMyScrapedPostList'] }],
  });

  return (
    <li className="flex h-[238px] w-full flex-col justify-between rounded-3xl bg-white">
      <Link
        to={`/${card.postType.toLocaleLowerCase()}/post/${card.postId}`}
        className="flex h-full flex-col justify-between p-5"
      >
        <div className="flex items-center justify-between">
          <Tag
            size="medium"
            postKey={card.postType}
            text={`#${postTypeObj[card.postType]}`}
            className="py-1.5"
          />
          <FavoriteButton
            size={20}
            isFavorite
            onClick={onScrapClick}
            disabled={isDeleteScrapPending || !isIdle}
          />
        </div>
        <h3 className="my-2 tracking-tight">{card.title}</h3>

        <p className="line-clamp-2 h-14 py-1 tracking-tight text-mainGray-active">
          {stripHTML(card.content)}
        </p>

        <div className="mt-3 flex items-center gap-x-3">
          <UserImage
            className="size-12"
            imageNameSegment={card.writer.profileImg}
          />
          <div className="flex flex-col">
            <span className="text-sm">{card.writer.name}</span>
            <span className="text-xs opacity-60">@{card.writer.nickname}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
