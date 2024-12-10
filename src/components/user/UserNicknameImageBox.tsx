import UserImage from '@/components/user/UserImage';

interface UserNicknameImageBoxProps {
  nickname: string;
  imgUrl?: string;
  imgClassName?: string;
  nicknameClassName?: string;
}

export default function UserNicknameImageBox({
  imgUrl,
  nickname,
  imgClassName,
  nicknameClassName,
}: UserNicknameImageBoxProps) {
  return (
    <div className="flex items-center gap-2">
      <UserImage imgUrl={imgUrl} className={imgClassName} />
      <span className={`text-[22px] ${nicknameClassName}`}>{nickname}</span>
    </div>
  );
}
