import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';

import EditButton from '@/components/common/button/EditButton';
import UserImage from '@/components/user/UserImage';
import UserNameImageModal from '@/components/user/UserNameImageModal';

export default function UserNameImageCard() {
  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { name, nickname, imgUrl } = userProfile;

  const { showDialog } = useDialogContext();

  const openModalClick = () => {
    showDialog({
      key: 'USERNAME-IMAGE-CARD-TYPE',
      element: <UserNameImageModal />,
    });
  };

  return (
    <div className="relative flex items-center gap-8 rounded-xl bg-oliveGreen1 px-6 py-10 shadow-card">
      <UserImage imgUrl={imgUrl} className="size-[100px]" />

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
