import { useState } from 'react';

import { Link } from 'react-router-dom';

import { actionLabelList, colorByCampusObj, rolesObj } from '@/constants';
import {
  ColorByCampus,
  UserManagementTabType,
  UserManagingActionMenu,
} from '@/types/admin';
import { UserManagementDto } from '@/types/admin/userToManageDto';
import { BsThreeDotsVertical } from 'react-icons/bs';

import UserManagementModal from '@/components/admin/UserManagementModal';
import Tag from '@/components/common/tag/Tag';
import MyCourseListWithHover from '@/components/user/MyCourseListWithHover';

interface UserManagementListProps {
  type: UserManagementTabType;
  className: string;
  userList: UserManagementDto.GetUserList['content'];
}

const initialCurrMenu: UserManagingActionMenu = {
  label: '권한 수정',
  email: '',
  isOpen: false,
};

export default function UserManagementList({
  type,
  className,
  userList,
}: UserManagementListProps) {
  const [currMenu, setCurrMenu] =
    useState<UserManagingActionMenu>(initialCurrMenu);

  const onMenuClose = () => setCurrMenu(prev => ({ ...prev, isOpen: false }));

  return (
    <ul className="mb-16 mt-4 flex w-full flex-col gap-4">
      {userList.map(
        (
          {
            campus: campusList,
            course: courseList,
            name: userName,
            nickname,
            email,
            role,
            userId,
            ...rest
          },
          index,
        ) => (
          <div key={userId} className="relative">
            {/* 아이템별 모달 */}
            {type === 'user-list' &&
              currMenu.isOpen &&
              email === currMenu.email && (
                <UserManagementModal
                  currMenu={currMenu}
                  onMenuClose={onMenuClose}
                  className={index < 3 ? 'top-0 !pb-16' : 'bottom-0'}
                  user={{
                    ...rest,
                    campus: campusList,
                    course: courseList,
                    name: userName,
                    nickname,
                    email,
                    role,
                    userId,
                  }}
                />
              )}

            {/* 캠퍼스색상 */}
            <div
              className={`absolute h-full w-2 rounded-l-xl ${
                colorByCampusObj[
                  (campusList.length === 1
                    ? campusList[0].name.slice(0, -3)
                    : '다수') as ColorByCampus
                ]
              }`}
            />

            <Link
              key={userId}
              to={`/admin/user/${userId}`}
              onClick={e => {
                if (currMenu.isOpen) {
                  e.preventDefault();
                }
              }}
              className={`h-[70px] items-center rounded-xl bg-white [&>div>div>span]:text-darkGray-hover [&>span]:text-darkGray-hover ${currMenu.isOpen ? 'cursor-default' : ''} ${className}`}
            >
              <span className={userName}>{userName}</span>
              <span className={nickname}>{nickname}</span>
              <span className="truncate" title={email}>
                {email}
              </span>
              <span
                className="truncate"
                title={campusList
                  .map(({ name }) => name.slice(0, -3))
                  .join(', ')}
              >
                {campusList.map(({ name }) => name.slice(0, -3)).join(', ')}
              </span>
              {type === 'user-list' && (
                <Tag
                  text={rolesObj[role!]}
                  roleKey={role}
                  size="medium"
                  className="w-fit"
                />
              )}

              <MyCourseListWithHover
                courseList={courseList.map(({ name }) => ({
                  courseTitle: name,
                }))}
                className={type === 'trainee-list' ? 'col-span-2' : ''}
                hoverBoxClassName={`right-0 !min-w-[500px] ${currMenu.isOpen ? 'hover:hidden peer-hover:hidden' : ''}`}
              />

              {type === 'user-list' && (
                <div className="group relative flex h-full items-center justify-center">
                  <BsThreeDotsVertical className="size-5" />

                  <div
                    className={`absolute -right-8 top-10 z-40 hidden py-4 ${!currMenu.isOpen ? 'hover:block group-hover:block' : ''}`}
                  >
                    <ul className="flex w-[120px] flex-col items-center gap-1.5 rounded-md bg-black bg-opacity-90 p-2 shadow-2xl">
                      {actionLabelList.map(label => (
                        <li key={label} className="relative w-full">
                          <button
                            onClick={event => {
                              event.preventDefault();
                              setCurrMenu({ label, email, isOpen: true });
                            }}
                            className="w-full rounded-md py-2 font-medium text-white hover:bg-darkGray-hover hover:bg-opacity-30"
                          >
                            {label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Link>
          </div>
        ),
      )}
    </ul>
  );
}
