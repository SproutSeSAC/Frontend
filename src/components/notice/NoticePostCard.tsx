import { useCallback } from 'react';

import { Link } from 'react-router-dom';

import { dateFormat } from '@/utils/dateFormat';

import { RolesObj, noticeCategoryDisplay } from '@/constants';
import { NoticeDisplay } from '@/types';
import { getColorByRole } from '@/utils';
import { BsEye } from 'react-icons/bs';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';

interface NoticePostCardProps {
  notice: NoticeDisplay;
}

export default function NoticePostCard({ notice }: NoticePostCardProps) {
  const stripHTML = useCallback((htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '-';
  }, []);

  return (
    <Link
      to={`/notice/post/${notice.noticeId}`}
      className="flex w-full flex-col rounded-2xl bg-white p-4 px-6 py-4"
    >
      <div className="flex w-full items-center justify-between">
        <Tag
          color={getColorByRole(RolesObj[notice.roleType])}
          size="big"
          text={RolesObj[notice.roleType]}
          emphasisText
          className="px-[10px] py-[5px]"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray2">
            <BsEye size={20} />
            <span>{notice.viewCount || 0}</span>
          </div>
          <FavoriteButton
            isFavorite={notice.isScraped}
            onClick={() => {}}
            size={20}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xl font-semibold">{notice.title || '-'}</h4>
        <p className="mt-3 max-w-[960px] break-words text-lg text-gray1">
          {stripHTML(notice.content)}
        </p>

        <div className="mt-6 border-b border-solid border-gray4 pb-[18px]">
          <span className="notice-text-divider leading-4 text-text">
            {noticeCategoryDisplay[notice.noticeType]}
          </span>
          <span className="leading-4 text-gray2">
            {(notice?.targetCourse || []).map(target => {
              return <span key={target}>{target}</span>;
            })}
          </span>
        </div>

        <div className="mt-4 w-full text-right text-gray2">
          {dateFormat(notice.createdDateTime)}
        </div>
      </div>
    </Link>
  );
}
