import { dateFormat, timeFormat } from '@/utils/dateFormat';

import { BsEye } from 'react-icons/bs';

import UserImage from '@/components/user/UserImage';

interface PostDetailsTemplateProps {
  actions?: Array<{ label: string; onClick: () => void; className?: string }>;
  nickName?: string;
  createdAt?: string;
  viewCount?: number;
  description?: string;
  // imgUrl?: string | null;
}

export default function PostDetailsTemplate({
  actions,
  nickName,
  createdAt,
  viewCount,
  description,
  // imgUrl,
}: PostDetailsTemplateProps) {
  return (
    <>
      <div className="border-b-solid mt-12 flex items-center justify-between border-b border-b-gray5 pb-6">
        <div>
          <div className="mt-2 flex items-center gap-2 text-[22px]">
            <UserImage
              className="size-[30px] p-0.5"
              // TODO: img 수정
              // profileImageUrl={imgUrl || ''}
            />
            <div>{nickName || '-'}</div>
          </div>

          <div className="mt-3 flex items-center gap-10 text-lg text-gray1">
            <div className="flex items-center gap-3">
              <div>작성일</div>
              <div>{dateFormat(createdAt)}</div>
              <div>{timeFormat(createdAt, 'HH:mm')}</div>
            </div>
            <div className="ml-10 flex items-center gap-1">
              <BsEye className="h-[18px] w-[18px]" />
              <div>{viewCount || 0}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {actions?.map(item => (
            <button
              key={item.label}
              type="button"
              className={`rounded-lg px-4 py-2 tracking-tight text-white ${item.className}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mt-6 text-lg"
        dangerouslySetInnerHTML={{ __html: description || '' }}
      />
    </>
  );
}
