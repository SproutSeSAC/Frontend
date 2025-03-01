import { useCallback } from 'react';

import { Link } from 'react-router-dom';

import { usePostIncrementViewCount } from '@/services/post/loungeMutations';

import { progressDisplay, ptypeDisplay } from '@/constants';
import { useHandleScrap } from '@/hooks';
import { LoungeDto } from '@/types/lounge/loungeDto';
import { formatDate } from '@/utils';
import { BsEye } from 'react-icons/bs';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import Tag from '@/components/common/tag/Tag';

interface LoungePostCardProps {
  card: LoungeDto.GetProjectList['projects'][0];
}

export default function LoungePostCard({ card }: LoungePostCardProps) {
  const {
    id,
    postId,
    ptype,
    positionNames,
    techStacks,
    isScraped,
    viewCount,
    title,
    recruitmentStart,
    recruitmentEnd,
    recruitmentCount,
    meetingType,
  } = card;

  const { mutateAsync: postViewCount } = usePostIncrementViewCount();

  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId,
      isScraped,
      invalidateQueryKeys: [{ queryKey: ['useGetLoungeProjectList'] }],
    });

  const onViewCount = useCallback(async () => {
    await postViewCount({ projectId: id });
  }, [id, postViewCount]);

  return (
    <Link
      to={`/lounge/post/${postId}`}
      className="flex h-full w-[275px] flex-col items-start justify-between rounded-lg border border-solid border-lightGray bg-white p-4"
      onClick={onViewCount}
    >
      <div className="flex w-full items-center justify-between">
        <Tag postType={ptype} size="medium" text={`#${ptypeDisplay[ptype]}`} />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-mainGray">
            <BsEye size={20} />
            <span>{viewCount}</span>
          </div>
          <FavoriteButton
            isFavorite={isScraped}
            onClick={onScrapClick}
            size={20}
            disabled={isPostScrapPending || isDeleteScrapPending}
          />
        </div>
      </div>

      <h4
        className="mt-3 line-clamp-2 overflow-hidden text-ellipsis whitespace-normal font-medium"
        style={{ wordBreak: 'break-word' }}
      >
        {title}
      </h4>

      <ul className="my-4 flex gap-2">
        {techStacks?.map(techStack => (
          <img
            key={techStack.name}
            src={techStack.imageUrl}
            alt={techStack.name}
            className="size-5"
          />
        ))}
      </ul>

      <div className="flex flex-col gap-2 text-xs">
        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray">
            기간
          </span>

          <span>
            {formatDate(recruitmentStart)} ~ {formatDate(recruitmentEnd)}
          </span>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray">
            모집
          </span>

          <span>{recruitmentCount}</span>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray">
            직무
          </span>

          <ul className="flex flex-1 flex-wrap gap-1 overflow-hidden">
            {positionNames?.map(tag => (
              <Tag
                key={tag}
                text={tag}
                color="gray"
                size="small"
                className="text-xs"
              />
            ))}
          </ul>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray">
            유형
          </span>

          <span>{progressDisplay[meetingType]}</span>
        </div>
      </div>
    </Link>
  );
}
