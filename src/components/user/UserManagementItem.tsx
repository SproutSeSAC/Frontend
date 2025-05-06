import { useState } from 'react';

import { Link } from 'react-router-dom';

import { usePatchUserToManagePhoneNumber } from '@/services/admin/userToManageMutation';

import { colorByCampusObj, modalSizeObj, rolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import {
  ColorByCampus,
  UserManagementTabType,
  UserManagingActionLabel,
  UserManagingActionMenu,
} from '@/types/admin';
import { UserManagementDto } from '@/types/admin/userToManageDto';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { BsThreeDotsVertical, BsX } from 'react-icons/bs';
import * as z from 'zod';

import SquareButton from '@/components/common/button/SquareButton';
import ControllerPhoneNumber from '@/components/common/input/ControllerPhoneNumber';
import Tag from '@/components/common/tag/Tag';
import MyCourseListWithHover from '@/components/user/MyCourseListWithHover';

interface UserManagementItemProps {
  user: UserManagementDto.GetUserList['content'][number];
  type: UserManagementTabType;
  className: string;
}

export const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, '번호가 없습니다.')
    .regex(/^010-\d{4}-\d{4}$/, '유효한 핸드폰 번호를 입력해 주세요'),
});

export default function UserManagementItem({
  user,
  type,
  className,
}: UserManagementItemProps) {
  const [currMenu, setCurrMenu] = useState<UserManagingActionMenu>({
    label: '권한 수정',
    email: '',
    isOpen: false,
  });

  const [showReconfirmMembershipLeave, setShowReconfirmMembershipLeave] =
    useState(false);

  const { showToast } = useDialogContext();

  const {
    campus: campusList,
    course: courseList,
    name: userName,
    nickname,
    email,
    role,
    userId,
  } = user;

  const methods = useForm({
    defaultValues: { phoneNumber: user.phoneNumber },
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit } = methods;

  const { mutateAsync: changePhoneNumber } = usePatchUserToManagePhoneNumber();

  const campusColor =
    colorByCampusObj[
      (campusList.length === 1
        ? campusList[0].name.slice(0, -3)
        : '다수') as ColorByCampus
    ];

  const actionLabelList: UserManagingActionLabel[] = [
    '권한 수정',
    '연락처 수정',
    '회원 탈퇴',
  ];

  const onMenuClose = () => {
    setCurrMenu(prev => ({ ...prev, isOpen: false }));
    setShowReconfirmMembershipLeave(false);
  };

  return (
    <div className={`${currMenu.isOpen ? 'cursor-default' : ''} relative`}>
      {/* 캠퍼스색상 */}
      <div className={`absolute h-full w-2 rounded-l-xl ${campusColor}`} />

      <Link
        key={user.userId}
        to={`/admin/user/${user.userId}`}
        onClick={e => {
          if (currMenu.isOpen) {
            e.preventDefault();
          }
        }}
        className={`h-[70px] items-center rounded-xl bg-white [&>div>div>span]:text-darkGray-hover [&>span]:text-darkGray-hover ${className}`}
      >
        <span>{userName}</span>
        <span>{nickname}</span>
        <span className="truncate">{email}</span>
        <span className="truncate">
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
          courseList={courseList.map(({ name }) => ({ courseTitle: name }))}
          className={type === 'trainee-list' ? 'col-span-2' : ''}
          hoverBoxClassName="left-0"
        />

        {type === 'user-list' && (
          <div className="group relative flex h-full items-center justify-center">
            <BsThreeDotsVertical className="size-5" />
            <div className="absolute -right-8 top-10 z-40 hidden py-4 hover:block group-hover:block">
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

      {type === 'user-list' && currMenu.isOpen && email === currMenu.email && (
        <div
          className={`absolute right-0 top-0 z-40 rounded-lg bg-white px-8 py-4 shadow-2xl ${modalSizeObj.md}`}
        >
          <header className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{currMenu.label}</h1>
            <button type="button" aria-label="모달 닫기" onClick={onMenuClose}>
              <BsX size={38} />
            </button>
          </header>

          {currMenu.label === '회원 탈퇴' &&
            (showReconfirmMembershipLeave ? (
              <>
                <p>
                  회원 정보를 삭제하시면 복구할 수 없습니다.
                  <br />{' '}
                  <span className="font-bold text-mainGreen">{user.name}</span>
                  님의 회원정보를 정말로 삭제하시겠습니까?
                </p>
                <div className="ml-auto mt-4 flex w-fit items-center gap-4">
                  <SquareButton
                    name="삭제"
                    color="mainGreen"
                    className="min-w-fit !rounded-xl"
                    onClick={onMenuClose}
                  />
                  <SquareButton
                    name="닫기"
                    color="gray"
                    className="min-w-fit !rounded-xl"
                    onClick={onMenuClose}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="mb-10 text-darkGray">
                  선택한 회원을 탈퇴 처리할 수 있어요.
                </p>

                <div className="flex items-center gap-6">
                  <div className="text-lg font-medium">
                    <span className="pr-2 text-mainGreen">{user.name}</span>{' '}
                    {rolesObj[role || 'CAMPUS_LEADER']}
                  </div>
                  <SquareButton
                    name="삭제"
                    color="gray"
                    className="min-w-fit !rounded-xl"
                    onClick={() =>
                      setShowReconfirmMembershipLeave(prev => !prev)
                    }
                  />
                </div>
              </>
            ))}

          {currMenu.label !== '회원 탈퇴' && (
            <>
              <p className="mb-10 text-darkGray">
                선택한 회원의{' '}
                {currMenu.label.includes('권한') ? '권한을' : '연락처를'} 수정할
                수 있어요.
              </p>

              {currMenu.label === '연락처 수정' && (
                <FormProvider {...methods}>
                  <form
                    onSubmit={handleSubmit(({ phoneNumber }) => {
                      if (phoneNumber !== user.phoneNumber) {
                        changePhoneNumber({ userId, phoneNumber });
                      }
                      showToast('전화번호가 수정되었습니다!');
                      return onMenuClose();
                    })}
                    className="mt-[26px]"
                  >
                    <div className="mb-2 text-lg font-medium">
                      <span className="text-mainGreen">{userName}</span>
                      님의 연락처!!!
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <ControllerPhoneNumber
                        name="phoneNumber"
                        className="!rounded-xl bg-lightGray-active"
                      />
                      <SquareButton
                        type="submit"
                        name="확인"
                        color="gray"
                        className="h-[50px] min-w-fit !rounded-xl"
                      />
                    </div>
                  </form>
                </FormProvider>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
