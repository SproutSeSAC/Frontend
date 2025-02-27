import { useDialogContext } from '@/hooks';
import { UserProfileDto } from '@/types';

import EditButton from '@/components/common/button/EditButton';
import UserImage from '@/components/user/UserImage';
import UserNameImageModal from '@/components/user/UserNameImageModal';

interface UserNameImageProps {
  data: UserProfileDto.GetCard['profile'];
}

export default function UserNameImageCard({ data }: UserNameImageProps) {
  const { name, nickname, profileUrl } = data;

  const { showDialog } = useDialogContext();

  const openModalClick = () => {
    showDialog({
      key: 'USERNAME-IMAGE-CARD-TYPE',
      element: <UserNameImageModal />,
    });
  };

  return (
    <div className="relative flex h-[172px] items-center justify-between gap-7 rounded-[20px] bg-white px-6 py-10">
      <UserImage imageNameSegment={profileUrl} className="size-[100px]" />

      <div className="flex flex-1 flex-col gap-2">
        <span className="text-2xl font-medium">{name}</span>
        <span className="text-mainGreen">@{nickname}</span>
      </div>

      <EditButton
        label="프로필 수정 버튼"
        className="pb-10"
        onClick={openModalClick}
      />
    </div>
  );
}
