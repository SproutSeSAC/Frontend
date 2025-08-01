import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { usePostAddViewCount } from '@/services/post/postMutation';

import { noticeCategoryDisplay, rolesObj } from '@/constants';
import { useHandleScrap } from '@/hooks';
import { NoticeDisplay } from '@/types';
import { formatDate } from '@/utils';
import { BsEye } from 'react-icons/bs';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import Tag from '@/components/common/tag/Tag';
import MyCourseListWithHover from '@/components/user/MyCourseListWithHover';

interface NoticePostCardProps {
  notice: NoticeDisplay;
}

export default function NoticePostCard({
  notice: {
    postId,
    isScraped,
    noticeId,
    roleType,
    viewCount,
    title,
    content,
    noticeType,
    targetCourse,
    createdDateTime,
  },
}: NoticePostCardProps) {
  const stripHTML = useCallback((htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '-';
  }, []);

  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId,
      isScraped,
      invalidateQueryKeys: [{ queryKey: ['useGetInfiniteNoticeList'] }],
    });

  const { mutateAsync: addViewCount } = usePostAddViewCount('notices');

  const navigate = useNavigate();

  const onViewCount = useCallback(async () => {
    await addViewCount({ linkedId: noticeId });
    navigate(`/notice/post/${postId}`);
  }, [navigate, noticeId, postId, addViewCount]);

  return (
    <div
      role="link"
      tabIndex={0}
      className="flex w-full cursor-pointer flex-col rounded-2xl bg-white p-4 px-6 py-4"
      onClick={onViewCount}
      onKeyDown={e => e.key === 'Enter' && onViewCount()}
    >
      <div className="flex w-full items-center justify-between">
        <Tag
          roleKey={roleType}
          size="big"
          text={rolesObj[roleType]}
          className="text-base"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-mainGray">
            <BsEye size={20} />
            <span>{viewCount || 0}</span>
          </div>
          <FavoriteButton
            isFavorite={isScraped}
            onClick={onScrapClick}
            size={20}
            disabled={isPostScrapPending || isDeleteScrapPending}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xl font-semibold">{title || '-'}</h4>
        <p className="mt-3 max-w-[960px] break-words text-lg text-darkGray-active">
          {stripHTML(content)}
        </p>

        <div className="mt-6 flex">
          <span className="notice-text-divider min-w-fit">
            {noticeCategoryDisplay[noticeType]}
          </span>

          <MyCourseListWithHover
            courseList={targetCourse.map(courseTitle => ({ courseTitle }))}
            hoverBoxClassName="min-w-[550px]"
          />
        </div>

        <div className="mt-4 w-full text-right text-mainGray">
          {formatDate(createdDateTime)}
        </div>
      </div>
    </div>
  );
}
