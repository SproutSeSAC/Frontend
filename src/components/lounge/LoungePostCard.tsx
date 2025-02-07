import { useCallback } from 'react';

import { Link } from 'react-router-dom';

import {
  usePostIncrementViewCount,
  usePostScrapProject,
} from '@/services/lounge/loungeMutations';

import { PTYPE_STUDY, progressDisplay, ptypeDisplay } from '@/constants';
import { useHandleOnScrap } from '@/hooks';
import { Ptype } from '@/types';
import { Lounge } from '@/types/lounge/loungeDto';
import { formatDate } from '@/utils';
import { BsEye } from 'react-icons/bs';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import Tag from '@/components/common/tag/Tag';

interface LoungePostCardProps {
  card: Lounge;
}

const getTagColor = (tag: Ptype) => {
  switch (tag) {
    case PTYPE_STUDY:
      return 'blue';
    default:
      return 'green';
  }
};

export default function LoungePostCard({ card }: LoungePostCardProps) {
  const { mutateAsync: postViewCount } = usePostIncrementViewCount();
  const { mutateAsync: postScrapProject } = usePostScrapProject();

  const getScrapResult = useCallback(async () => {
    return postScrapProject({ projectId: card.id });
  }, [card.id, postScrapProject]);

  const { onScrapClick } = useHandleOnScrap({
    getScrapResult,
    invalidateQueryKeys: ['useGetLoungeProjects'],
  });

  const onViewCount = useCallback(async () => {
    try {
      await postViewCount({ projectId: card.id });
    } catch (err) {
      console.error(err);
    }
  }, [card.id, postViewCount]);

  return (
    <Link
      to={`/lounge/post/${card.id}`}
      className="flex w-[275px] max-w-[275px] flex-col items-start justify-between rounded-lg border border-solid border-lightGray bg-white p-4"
      onClick={onViewCount}
    >
      <div className="flex w-full items-center justify-between">
        <Tag
          color={getTagColor(card.ptype)}
          size="medium"
          text={ptypeDisplay[card.ptype]}
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-mainGray">
            <BsEye size={20} />
            <span>{card.viewCount}</span>
          </div>
          <FavoriteButton
            isFavorite={card.isScraped}
            onClick={onScrapClick}
            size={20}
          />
        </div>
      </div>

      <h4
        className="mt-3 line-clamp-2 overflow-hidden text-ellipsis whitespace-normal font-medium"
        style={{ wordBreak: 'break-word' }}
      >
        {card.title}
      </h4>

      <ul className="my-4 flex gap-2">
        <li className="size-5 rounded bg-mainGray-hover" />
        <li className="size-5 rounded bg-mainGray-hover" />
      </ul>

      <div className="flex flex-col gap-2 text-xs">
        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray">
            기간
          </span>

          <span>
            {formatDate(card.recruitmentStart)} ~{' '}
            {formatDate(card.recruitmentEnd)}
          </span>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray">
            모집
          </span>

          <span>3/{card.recruitmentCount}</span>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-mainGray">
            직무
          </span>

          <ul className="flex flex-1 flex-wrap gap-1 overflow-hidden">
            {card.positionNames.map(tag => (
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

          <span>{progressDisplay[card.meetingType]}</span>
        </div>
      </div>
    </Link>
  );
}
