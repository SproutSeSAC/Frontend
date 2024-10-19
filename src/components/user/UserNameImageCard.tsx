import { useGetUserProfile } from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';
import { UserProfile } from '@/types';

import CameraButton from '@/components/common/button/CameraButton';
import EditButton from '@/components/common/button/EditButton';
import UserImage from '@/components/user/UserImage';
import UserNameImageModal from '@/components/user/UserNameImageModal';

export default function UserNameImageCard() {
  const { data: userProfile } = useGetUserProfile();

  const { name, nickname, profileImageUrl } = userProfile as UserProfile;

  const { showDialog } = useDialogContext();

  const openModalClick = () => {
    showDialog({
      key: 'USERNAME-IMAGE-CARD-TYPE',
      element: <UserNameImageModal />,
    });
  };

  return (
    <div className="relative flex w-[45%] max-w-[305px] items-center gap-8 rounded-xl bg-oliveGreen1 px-6 py-10">
      <UserImage profileImageUrl={profileImageUrl} className="size-[100px] p-5">
        <CameraButton onClick={() => {}} />
      </UserImage>

      <div className="flex flex-col gap-2">
        <span className="text-2xl font-medium text-white">{name}</span>
        <span className="text-oliveGreen3">{nickname}</span>
      </div>

      <EditButton
        label="프로필 수정 버튼"
        className="absolute right-3 top-3 text-white"
        onClick={openModalClick}
      />
    </div>
  );
}
