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
    <div className="relative flex items-center gap-7 rounded-xl bg-mainGreen px-6 py-10 shadow-card">
      <UserImage imageNameSegment={profileUrl} className="size-[100px]" />

      <div className="flex flex-col gap-2">
        <span className="text-2xl font-medium text-white">{name}</span>
        <span className="text-lightGreen-active">{nickname}</span>
      </div>

      <EditButton
        label="프로필 수정 버튼"
        className="absolute right-3 top-3 text-white"
        onClick={openModalClick}
      />
    </div>
  );
}
