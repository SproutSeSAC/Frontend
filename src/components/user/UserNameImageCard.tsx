import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';

import Icon from '@/components/common/Icon';
import EditButton from '@/components/common/button/EditButton';
import UserImage from '@/components/user/UserImage';
import UserNameImageModal from '@/components/user/UserNameImageModal';

export default function UserNameImageCard() {
  const { data = initialUserProfile, isLoading } = useGetUserProfile();

  const {
    courseList,
    name,
    phoneNumber,
    campusList,
    email,
    profileImageUrl,
    nickname,
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
        <div className="peer flex w-full flex-1 items-center truncate">
          {courseList.length > 1 ? (
            courseList.slice(0, 1).map(({ courseTitle }) => (
              <span
                className="w-full overflow-hidden truncate text-end"
                key={courseTitle}
              >
                {courseTitle}
              </span>
            ))
          ) : (
            <span className="w-full overflow-hidden truncate text-end">
              {courseList[0]?.courseTitle}
            </span>
          )}
          {courseList.length > 1 && (
            <Icon name="ChevronDown" className="size-5" />
          )}
        </div>
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
          <span className="text-darkGray">@{nickname}</span>
        </div>

        <EditButton
          label="프로필 수정 버튼"
          className="pb-10"
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

            {/*  교육과정 전체 목록  */}
            {label === '소속 교육과정' && courseList.length > 1 && (
              <div className="absolute -right-[50%] top-[100%] z-10 hidden rounded-[20px] bg-white px-8 pb-8 pt-6 shadow-card hover:block peer-hover:block">
                <header className="flex items-center justify-between border-b border-mainGray pb-4 text-black">
                  <h4>소속 교육과정 전체 목록</h4>
                  <span>총 {courseList.length}개</span>
                </header>

                <ul className="mt-4 flex flex-col gap-y-4">
                  {courseList.map(({ courseTitle }, index) => (
                    <li
                      className="w-full overflow-hidden truncate tracking-tight text-black"
                      key={courseTitle}
                    >
                      <span className="inline-block w-8 text-darkGray">
                        {index + 1}.
                      </span>{' '}
                      {courseTitle}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
