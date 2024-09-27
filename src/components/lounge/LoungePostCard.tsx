import { useCallback } from 'react';

import { Link } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import {
  usePostIncrementViewCount,
  usePostScrapProject,
} from '@/services/lounge/loungeMutations';

import { dateFormat } from '@/utils/dateFormat';

import { PTYPE_STUDY, Ptype, progressDisplay, ptypeDisplay } from '@/constants';
import { LoungeDto } from '@/types/lounge/loungeDto';
import { BsEye } from 'react-icons/bs';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';

interface LoungePostCardProps {
  card: LoungeDto.Lounge;
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
  const queryClient = useQueryClient();

  const { mutateAsync: postViewCount } = usePostIncrementViewCount();
  const { mutateAsync: postScrapProject } = usePostScrapProject();

  const onScrapProject = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        await postScrapProject({ projectId: card.id });
        console.log('성공');
        queryClient.invalidateQueries({
          queryKey: ['useGetLoungeProjects', {}],
        });
      } catch (err) {
        console.error(err);
      }
    },
    [card.id, postScrapProject, queryClient],
  );

  const onViewCount = useCallback(async () => {
    try {
      await postViewCount({ projectId: card.id });
      console.log('성공');
    } catch (err) {
      console.error(err);
    }
  }, [card.id, postViewCount]);

  return (
    <Link
      to={`/lounge/post/${card.id}`}
      className="flex w-[275px] flex-col items-start justify-between rounded-lg border border-solid border-gray5 bg-white p-4"
      onClick={onViewCount}
    >
      <div className="flex w-full items-center justify-between">
        <Tag
          color={getTagColor(card.ptype)}
          size="medium"
          text={ptypeDisplay[card.ptype]}
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray2">
            <BsEye size={20} />
            <span>{card.viewCount}</span>
          </div>
          <FavoriteButton
            isFavorite={card.isScraped}
            onClick={onScrapProject}
            size={20}
          />
        </div>
      </div>

      <span className="mt-3 text-sm text-gray2">여긴 어떤값이 들어가나요?</span>
      <h4
        className="line-clamp-2 overflow-hidden text-ellipsis whitespace-normal font-medium"
        style={{ wordBreak: 'break-word' }}
      >
        {card.title}
      </h4>

      <ul className="my-4 flex gap-2">
        <li className="size-5 rounded bg-vividGreen2" />
        <li className="size-5 rounded bg-vividGreen2" />
      </ul>

      <div className="flex flex-col gap-2 text-xs">
        <div className="flex">
          <span className="lounge-text-divider leading-4 text-gray2">기간</span>

          <span>
            {dateFormat(card.recruitmentStart)} ~{' '}
            {dateFormat(card.recruitmentEnd)}
          </span>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-gray2">모집</span>

          <span>3/{card.recruitmentCount}</span>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-gray2">직무</span>

          <ul className="flex gap-1 overflow-hidden">
            {card.positionNames.map(tag => (
              <Tag
                key={tag}
                text={tag}
                color="black"
                size="small"
                className="text-xs"
              />
            ))}
          </ul>
        </div>

        <div className="flex">
          <span className="lounge-text-divider leading-4 text-gray2">유형</span>

          <span>{progressDisplay[card.meetingType]}</span>
        </div>
      </div>
    </Link>
  );
}
