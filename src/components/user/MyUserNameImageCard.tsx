import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { rolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';

import EditButton from '@/components/common/button/EditButton';
import Tag from '@/components/common/tag/Tag';
import MyCourseListWithHover from '@/components/user/MyCourseListWithHover';
import UserImage from '@/components/user/UserImage';
import UserNameImageModal from '@/components/user/UserNameImageModal';

export default function MyUserNameImageCard() {
  const { data = initialUserProfile, isLoading } = useGetUserProfile();

  const {
    courseList,
    name,
    phoneNumber,
    campusList,
    email,
    profileImageUrl,
    nickname,
    role,
  } = data;

  const userInfoList = [
    {
      label: 'Email',
      value: <span>{email}</span>,
    },
    {
      label: '소속 캠퍼스',
      value: (
        <span className="truncate">
          {campusList
            .map(({ campusName }) => campusName.slice(0, 2))
            .join(', ')}{' '}
          캠퍼스
        </span>
      ),
    },
    {
      label: '소속 교육과정',
      value: (
        <MyCourseListWithHover
          courseList={courseList}
          hoverBoxClassName="w-[450px] -right-6"
        />
      ),
    },
    {
      label: '전화번호',
      value: phoneNumber,
    },
  ];

  const { showDialog } = useDialogContext();

  const openModalClick = () => {
    showDialog({
      key: 'USERNAME-IMAGE-CARD-TYPE',
      element: <UserNameImageModal profile={data} />,
    });
  };

  if (isLoading) return null;

  return (
    <div className="grid grid-cols-2 gap-x-9">
      <div className="relative flex h-[200px] items-center justify-between gap-7 rounded-[20px] bg-white px-9 py-10">
        <UserImage imageNameSegment={profileImageUrl} className="size-[70px]" />

        <div className="flex flex-1 flex-col gap-2">
          <span className="font-medium">{name}</span>
          <div className="inline">
            <span className="break-all text-darkGray">@{nickname}</span>
            <Tag
              className="mt-2 inline h-fit w-fit py-0.5"
              text={rolesObj[role]}
              roleKey={role}
            />
          </div>
        </div>

        <EditButton
          label="프로필 수정 버튼"
          className="absolute right-6 top-8 pb-10"
          onClick={openModalClick}
        />
      </div>

      <ul className="relative flex h-[200px] flex-col justify-center gap-4 rounded-[20px] bg-white px-7 py-2 peer-hover:cursor-pointer">
        {userInfoList.map(({ value, label }) => (
          <li
            key={label}
            className={`relative flex w-full items-start justify-between ${label === '소속 교육과정' ? 'peer' : ''}`}
          >
            <span className="mr-3 w-28 whitespace-nowrap text-darkGray-active">
              {label}
            </span>

            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
