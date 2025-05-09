import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePatchUserPermission } from '@/services/admin/userToManageMutation';
import {
  useGetCampusList,
  useGetCourseListByCampus,
} from '@/services/campusCourse/campusCourseQueries';

import { modifyingPermissionTabList, rolesArr } from '@/constants';
import { useDialogContext } from '@/hooks';
import {
  ModifyingPermissionsTabType,
  RoleKey,
  UserManagementDto,
} from '@/types';
import { areArraysEqual } from '@/utils';

import TabNavigation from '@/components/common/TabNavigation';
import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';

interface UserManagementPermissionProps {
  user: UserManagementDto.GetUserList['content'][number];
  onMenuClose: () => void;
}

/**
 * 매니저별 교육과정
 *
 * - 최고 관리자와 캠퍼스 담당자, 운영 매니저
 *    - 다중 캠퍼스, 캠퍼스 내 교육과정 전체
 *
 * - 강사, 교육매니저
 *    - 단일 캠퍼스, 단일 교육과정
 *
 * - 잡코디
 *    - 다중 캠퍼스, 다중 교육과정
 *
 * => 현재 역할을 따져서 각 역할에 맞는 개수인지 평가
 */

export default function UserManagementPermission({
  user,
  onMenuClose,
}: UserManagementPermissionProps) {
  const { userId, role, campus: userCampusList, course: userCourseList } = user;

  const initialValueByType = {
    campus: userCampusList.map(({ campusId }) => campusId),
    course: userCourseList.map(({ courseId }) => courseId),
    role: role!,
  };

  const [currPermission, setCurrPermission] = useState<{
    tabType: ModifyingPermissionsTabType;
    campus: number[];
    course: number[];
    role: RoleKey;
  }>({ tabType: 'campus', ...initialValueByType });

  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { showToast, alert, hideDialog } = useDialogContext();

  const { mutateAsync: updateUserPermission } = usePatchUserPermission({
    onSuccess: async () => {
      const type = {
        role: '역할',
        campus: '캠퍼스 권한',
        course: '교육과정 권한',
      };
      showToast(
        `${user.name}님의 ${type[currPermission.tabType]}이 변경되었습니다.`,
      );
      await queryClient.invalidateQueries({
        queryKey: ['useGetInfiniteUserList'],
      });
    },
  });

  const { data: campusList } = useGetCampusList();

  const courseListByCampus = useGetCourseListByCampus(currPermission.campus);

  const isEqualValue = () => {
    const { tabType } = currPermission;

    const isEqual =
      tabType === 'role'
        ? currPermission.role === initialValueByType.role
        : areArraysEqual(currPermission[tabType], initialValueByType[tabType]);

    return isEqual;
  };

  const onChangePermissionTab = (currTab: ModifyingPermissionsTabType) => {
    if (!isEqualValue()) {
      return alert({
        text: '변경사항이 저장되지 않았습니다. 나가시겠습니까?',
        children: (
          <>
            <SquareButton
              name="취소"
              onClick={hideDialog}
              color="gray"
              type="button"
            />
            <SquareButton
              name="확인"
              onClick={() => {
                setCurrPermission(() => ({
                  tabType: currTab,
                  ...initialValueByType,
                }));
                setError('');
                hideDialog();
              }}
              type="button"
            />
          </>
        ),
      });
    }
    setError('');
    return setCurrPermission(prev => ({ ...prev, tabType: currTab }));
  };

  const checkHasItem = (
    tabType: ModifyingPermissionsTabType,
    value: number,
  ) => {
    if (tabType === 'role') return null;
    return currPermission[tabType].find((id: number) => id === value);
  };

  const onToggleClick = (
    tabType: ModifyingPermissionsTabType,
    checkedItem: RoleKey | number,
  ) => {
    if (tabType === 'role' || typeof checkedItem !== 'number') {
      return setCurrPermission(prev => ({
        ...prev,
        role: checkedItem as RoleKey,
      }));
    }

    const hasItem = checkHasItem(tabType, checkedItem);

    const checkedList = hasItem
      ? currPermission[tabType].filter(id => id !== checkedItem)
      : [...currPermission[tabType], checkedItem];

    if (checkedList.length > 0) {
      setError('');
    }
    return setCurrPermission(prev => {
      return { ...prev, [tabType]: checkedList };
    });
  };

  const onSubmitClick = () => {
    const { campus, course, tabType } = currPermission;

    if (campus.length === 0 || course.length === 0) {
      setError('하나 이상을 선택해야 합니다.');
      return;
    }

    if (isEqualValue()) {
      setError('수정된 사항이 없습니다.');
      return;
    }

    if (tabType === 'campus') {
      // const selectedCampusCourseList = courseListByCampus
      //   .map(({ data }) => data?.map(({ id, campusId }) => ({ id, campusId })))
      //   .flat();

      /** 만약 캠퍼스를 제거한 경우
       *  - 나의 교육과정에서 제거했던 캠퍼스의 교육과정 삭제
       */
      // const filteredCourseList = course.filter(courseId =>
      //   selectedCampusCourseList?.find(item => item?.id === courseId),
      // );

      // const addedCampusIdList = campus.filter(
      //   campusId => !initialValueByType.campus.includes(campusId),
      // );

      /** 만약 캠퍼스를 추가한 경우
       *  - 나의 교육과정에 추가했던 캠퍼스의 모든 교육과정 삭제
       */
      // const addedCampusAllCourseList = selectedCampusCourseList
      //   .filter(item => item && addedCampusIdList.includes(item.campusId!))
      //   .map(item => item?.id) as number[];

      // const updateCourseList = [
      //   ...filteredCourseList,
      //   ...addedCampusAllCourseList,
      // ];

      alert({
        text: '삭제한 캠퍼스의 모든 교육과정 권한은 삭제되고, 추가한 캠퍼스의 모든 교육과정 권한은 추가됩니다.',
        subText: '정말로 수정하시겠습니까?',
        subTextColor: 'green',
        children: (
          <>
            <SquareButton
              type="button"
              name="취소"
              onClick={hideDialog}
              color="gray"
            />
            <SquareButton
              type="button"
              name="수정"
              onClick={() => {
                // updateUserPermission({
                //   userId,
                //   requestBody: {
                //     role: currPermission.role,
                //     campusIdList: campus,
                //     courseIdList: updateCourseList,
                //   },
                // });
                setError('');
                hideDialog();
                onMenuClose();
              }}
            />
          </>
        ),
      });
      return;
    }

    updateUserPermission({
      userId,
      requestBody: {
        role: currPermission.role,
        campusIdList: campus,
        courseIdList: course,
      },
    });

    onMenuClose();
  };

  const disabledStyle = '!bg-lightGray-active !text-mainGray-hover';

  return (
    <div className="flex h-[50vh] flex-col">
      <TabNavigation<ModifyingPermissionsTabType>
        tabList={modifyingPermissionTabList}
        onChangeValue={onChangePermissionTab}
        selectValue={currPermission.tabType}
      />

      {currPermission.tabType === 'campus' && (
        <ul className="mb-3 mt-6 flex flex-wrap gap-3">
          {campusList?.map(({ name: campusName, id }) => (
            <li key={id}>
              <SquareButton
                name={campusName}
                className={!checkHasItem('campus', id) ? disabledStyle : ''}
                onClick={() => onToggleClick('campus', id)}
              />
            </li>
          ))}
        </ul>
      )}

      {currPermission.tabType === 'course' &&
        courseListByCampus.length !== 0 && (
          <ul className="mb-3 mt-6 flex flex-col gap-3 overflow-scroll pb-4 scrollbar-hide">
            {courseListByCampus
              .sort((a, b) =>
                a.data![0].campusName.localeCompare(b.data![0].campusName),
              )
              .map(({ data }) =>
                data?.map(({ id, title }) => (
                  <li key={id}>
                    <SquareButton
                      name={title}
                      className={`${
                        !checkHasItem('course', id) ? disabledStyle : ''
                      } w-full whitespace-pre text-start`}
                      onClick={() => onToggleClick('course', id)}
                    />
                  </li>
                )),
              )}
          </ul>
        )}

      {currPermission.tabType === 'role' && (
        <ul className="mb-3 mt-6 flex flex-wrap gap-3">
          {rolesArr?.map(({ key, label }) => (
            <li key={key}>
              <SquareButton
                name={label}
                className={currPermission.role !== key ? disabledStyle : ''}
                onClick={() => onToggleClick('role', key)}
              />
            </li>
          ))}
        </ul>
      )}

      {error !== '' && <ErrorMsg msg={error} className="mb-3" />}

      <SquareButton
        onClick={onSubmitClick}
        color="gray"
        name="변경하기"
        className="ml-auto mt-auto border"
      />
    </div>
  );
}
