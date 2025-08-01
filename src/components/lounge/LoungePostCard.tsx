import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { usePostAddViewCount } from '@/services/post/postMutation';

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

  const { mutateAsync: addViewCount } = usePostAddViewCount('project');

  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId,
      isScraped,
      invalidateQueryKeys: [{ queryKey: ['useGetLoungeProjectList'] }],
    });

  const navigate = useNavigate();

  const onViewCount = useCallback(async () => {
    await addViewCount({ linkedId: id });
    navigate(`/lounge/post/${postId}`);
  }, [addViewCount, id, navigate, postId]);

  return (
    <div
      role="link"
      tabIndex={0}
      className="flex h-full cursor-pointer flex-col items-start justify-between rounded-[20px] border border-solid border-lightGray bg-white p-4"
      onClick={onViewCount}
      onKeyDown={e => e.key === 'Enter' && onViewCount}
    >
      <div className="flex w-full items-center justify-between">
        <Tag postKey={ptype} size="medium" text={`#${ptypeDisplay[ptype]}`} />
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
        className="mt-3 line-clamp-2 flex-1 overflow-hidden text-ellipsis whitespace-normal font-medium"
        style={{ wordBreak: 'break-word' }}
      >
        {title}
      </h4>

      {techStacks?.length !== 0 ? (
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
      ) : (
        <span className="my-4 text-sm text-darkGray">스택 제한 없음</span>
      )}

      <div className="flex flex-col gap-2 text-xs">
        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray-active">
            기간
          </span>

          <span>
            {formatDate(recruitmentStart)} ~ {formatDate(recruitmentEnd)}
          </span>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray-active">
            모집
          </span>

          <span>{recruitmentCount}명</span>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray-active">
            직무
          </span>

          {positionNames.length !== 0 ? (
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
          ) : (
            <span>제한 없음</span>
          )}
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray-active">
            유형
          </span>

          <span>{progressDisplay[meetingType]}</span>
        </div>
      </div>
    </div>
  );
}
