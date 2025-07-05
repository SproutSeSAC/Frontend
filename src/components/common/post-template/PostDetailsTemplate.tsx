import { formatDate } from '@/utils';
import 'quill/dist/quill.snow.css';
import { BsEye } from 'react-icons/bs';

import UserImage from '@/components/user/UserImage';

interface PostDetailsTemplateProps {
  actions?: Array<{
    label: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
  }>;
  imageNameSegment?: string;
  name?: string;
  nickname?: string;
  createdAt?: string;
  viewCount?: number;
  description?: string;
}

export default function PostDetailsTemplate({
  actions,
  imageNameSegment,
  name,
  nickname,
  createdAt,
  viewCount,
  description,
}: PostDetailsTemplateProps) {
  return (
    <>
      <header className="mb-5 mt-7 flex items-center justify-between border-b border-b-mainGray pb-5">
        <div>
          <div className="flex items-center gap-2">
            <UserImage imageNameSegment={imageNameSegment} />
            <span className="text-xl">{nickname ? `@${nickname}` : name}</span>
          </div>

          <ul className="mt-3 flex items-center gap-10 text-lg text-darkGray-hover">
            <li className="flex items-center gap-3">
              <span>작성일</span>
              <span>
                {createdAt ? formatDate(createdAt, 'yyyy.MM.dd HH:mm') : '-'}
              </span>
            </li>
            <li className="ml-10 flex items-center gap-1">
              <BsEye className="h-[18px] w-[18px]" />
              <span>{viewCount || 0}</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          {actions?.map(item => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              className={`rounded-lg px-4 py-2 tracking-tight ${item.className}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <article
        id="quill-content"
        className="ql-editor !mt-0 !p-0"
        dangerouslySetInnerHTML={{ __html: description || '' }}
      />
    </>
  );
}
