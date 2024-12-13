import { dateFormat } from '@/utils/dateFormat';

import 'quill/dist/quill.snow.css';
import { BsEye } from 'react-icons/bs';

import UserNicknameImageBox from '@/components/user/UserNicknameImageBox';

interface PostDetailsTemplateProps {
  actions?: Array<{
    label: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
  }>;
  // imgUrl?: string;
  nickname: string;
  createdAt?: string;
  viewCount?: number;
  description?: string;
}

export default function PostDetailsTemplate({
  actions,
  // imgUrl,
  nickname,
  createdAt,
  viewCount,
  description,
}: PostDetailsTemplateProps) {
  return (
    <>
      <header className="mt-12 flex items-center justify-between border-b border-b-gray5 pb-6">
        <div>
          <UserNicknameImageBox imgUrl="" nickname={nickname} />

          <ul className="mt-3 flex items-center gap-10 text-lg text-gray1">
            <li className="flex items-center gap-3">
              <span>작성일</span>
              <span>
                {createdAt ? dateFormat(createdAt, 'yyyy.MM.dd HH:mm') : '-'}
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
              className={`rounded-lg px-4 py-2 tracking-tight text-white ${item.className}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <article
        id="quill-content"
        className="ql-editor mt-6 text-lg"
        dangerouslySetInnerHTML={{ __html: description || '' }}
      />
    </>
  );
}
