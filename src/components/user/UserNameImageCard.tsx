import { useDialogContext } from '@/hooks';
import { UserProfileDto } from '@/types';

import EditButton from '@/components/common/button/EditButton';
import UserImage from '@/components/user/UserImage';
import UserNameImageModal from '@/components/user/UserNameImageModal';

interface UserNameImageProps {
  profile: UserProfileDto.Get;
}

export default function UserNameImageCard({ profile }: UserNameImageProps) {
  const { name, nickname, profileImageUrl } = profile;

  const { showDialog } = useDialogContext();

  const openModalClick = () => {
    showDialog({
      key: 'USERNAME-IMAGE-CARD-TYPE',
      element: <UserNameImageModal profile={profile} />,
    });
  };

  return (
    <div className="relative flex h-[200px] items-center justify-between gap-7 rounded-[20px] bg-white px-9 py-10">
      <UserImage imageNameSegment={profileImageUrl} className="size-[70px]" />

      <div className="flex flex-1 flex-col gap-2">
        <span className="font-medium">{name}</span>
        <span className="text-darkGray">@{nickname}</span>
      </div>

      <EditButton
        label="프로필 수정 버튼"
        className="pb-10"
        onClick={openModalClick}
      />
    </div>
  );
}
