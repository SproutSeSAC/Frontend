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

interface NoticePostCardProps {
  notice: NoticeDisplay;
}

export default function NoticePostCard({ notice }: NoticePostCardProps) {
  const stripHTML = useCallback((htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '-';
  }, []);

  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId: notice.postId,
      isScraped: notice.isScraped,
      invalidateQueryKeys: [{ queryKey: ['useGetInfiniteNoticeList'] }],
    });

  const { mutateAsync: addViewCount } = usePostAddViewCount('notices');

  const navigate = useNavigate();

  const onViewCount = useCallback(async () => {
    await addViewCount({ linkedId: notice.noticeId });
    navigate(`/notice/post/${notice.postId}`);
  }, [navigate, notice.noticeId, notice.postId, addViewCount]);

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
          roleKey={notice.roleType}
          size="big"
          text={rolesObj[notice.roleType]}
          className="text-base"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-mainGray">
            <BsEye size={20} />
            <span>{notice.viewCount || 0}</span>
          </div>
          <FavoriteButton
            isFavorite={notice.isScraped}
            onClick={onScrapClick}
            size={20}
            disabled={isPostScrapPending || isDeleteScrapPending}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xl font-semibold">{notice.title || '-'}</h4>
        <p className="mt-3 max-w-[960px] break-words text-lg text-darkGray-active">
          {stripHTML(notice.content)}
        </p>

        <div className="mt-6 border-b border-solid border-lightGray pb-[18px]">
          <span className="notice-text-divider leading-4 text-black">
            {noticeCategoryDisplay[notice.noticeType]}
          </span>
          <span className="leading-4 text-mainGray">
            {(notice?.targetCourse || []).map(target => {
              return <span key={target}>{target}</span>;
            })}
          </span>
        </div>

        <div className="mt-4 w-full text-right text-mainGray">
          {formatDate(notice.createdDateTime)}
        </div>
      </div>
    </div>
  );
}
