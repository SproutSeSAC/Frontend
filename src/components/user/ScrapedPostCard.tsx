import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { usePostAddViewCount } from '@/services/post/postMutation';

import { postTypeObj } from '@/constants';
import { useHandleScrap } from '@/hooks';
import { UserScrap } from '@/types/mypage/myPostDto';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import Tag from '@/components/common/tag/Tag';
import UserImage from '@/components/user/UserImage';

interface ScrapedPostCardProps {
  card: Omit<UserScrap, 'ptype'>;
  className?: string;
  hasScrapBtn?: boolean;
}

export default function ScrapedPostCard({
  card: { postId, postType, title, content, writer, linkedId },
  className,
  hasScrapBtn = true,
}: ScrapedPostCardProps) {
  const stripHTML = useCallback((htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '-';
  }, []);

  const { onScrapClick, isDeleteScrapPending, isIdle } = useHandleScrap({
    postId,
    isScraped: true,
    invalidateQueryKeys: [{ queryKey: ['useGetMyScrapedPostList'] }],
  });

  const postLink =
    postType === 'PROJECT' || postType === 'STUDY' ? 'lounge' : postType;

  const { mutateAsync: addViewCount } = usePostAddViewCount(
    postType === 'NOTICE' ? 'notices' : 'project',
  );

  const navigate = useNavigate();

  const onViewCount = useCallback(async () => {
    await addViewCount({ linkedId });
    navigate(`/${postLink.toLocaleLowerCase()}/post/${postId}`);
  }, [addViewCount, linkedId, navigate, postLink, postId]);

  return (
    <li
      className={`flex h-[238px] w-full flex-col justify-between rounded-3xl bg-white ${className}`}
    >
      <div
        role="link"
        tabIndex={0}
        className="flex w-full cursor-pointer flex-col rounded-2xl bg-white p-4 px-6 py-4"
        onClick={onViewCount}
        onKeyDown={e => e.key === 'Enter' && onViewCount()}
      >
        <div className="flex items-center justify-between">
          <Tag
            size="medium"
            postKey={postType}
            text={`#${postTypeObj[postType]}`}
            className="py-1.5"
          />
          <FavoriteButton
            size={20}
            isFavorite
            onClick={onScrapClick}
            disabled={isDeleteScrapPending || !isIdle || !hasScrapBtn}
          />
        </div>
        <h3 className="my-2 tracking-tight">{title}</h3>

        <p className="line-clamp-2 h-14 py-1 tracking-tight text-mainGray-active">
          {stripHTML(content)}
        </p>

        <div className="mt-3 flex items-center gap-x-3">
          <UserImage className="size-12" imageNameSegment={writer.profileImg} />
          <div className="flex flex-col">
            <span className="text-sm">{writer.name}</span>
            <span className="text-xs opacity-60">@{writer.nickname}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
