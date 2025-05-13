import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePatchUserPermission } from '@/services/admin/userToManageMutation';
import {
  useGetCampusList,
  useGetCourseListByCampus,
} from '@/services/campusCourse/campusCourseQueries';

import { modifyingPermissionStepList, rolesArr, rolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { RoleKey, UserManagementDto } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { userPermissionSchema } from '@/components/admin/userPermissionScheme';
import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import Tag from '@/components/common/tag/Tag';

interface UserManagementPermissionProps {
  user: UserManagementDto.GetUserList['content'][number];
  onMenuClose: () => void;
}

interface FormValue {
  role: RoleKey;
  campusIdList: number[];
  courseIdList: number[];
}

export default function UserManagementPermission({
  user,
  onMenuClose,
}: UserManagementPermissionProps) {
  const [currStep, setCurrStep] = useState<number>(1);

  const { userId, role, campus: userCampusList, course: userCourseList } = user;

  const initialUserCourseIdList = userCourseList.map(
    ({ courseId }) => courseId,
  );

  const methods = useForm<FormValue>({
    defaultValues: {
      role,
      campusIdList: userCampusList.map(({ campusId }) => campusId),
      courseIdList: userCourseList.map(({ courseId }) => courseId),
    },
    resolver: zodResolver(userPermissionSchema),
  });

  const { handleSubmit, control, setValue, trigger } = methods;

  const currRole = useWatch({ control, name: 'role' });
  const currCampusIdList = useWatch({ control, name: 'campusIdList' });
  const currCourseIdList = useWatch({ control, name: 'courseIdList' });

  const queryClient = useQueryClient();

  const { showToast, alert, hideDialog } = useDialogContext();

  const { data: campusList } = useGetCampusList();

  const allCurrCourseList = useGetCourseListByCampus(currCampusIdList);

  const courseListByCampus = allCurrCourseList.map(({ data }) => ({
    campusId: data?.[0].campusId,
    campusName: data?.[0].campusName,
    data,
  }));

  const { mutateAsync: updateUserPermission } = usePatchUserPermission({
    onSuccess: async () => {
      showToast(`${user.name}님의 권한이 수정되었습니다.`);
      await queryClient.invalidateQueries({
        queryKey: ['useGetInfiniteUserList'],
      });
    },
  });

  const onSubmit = async (requestBody: FormValue) => {
    const selectedCampusList = campusList
      ?.filter(campus => requestBody.campusIdList.includes(campus.id))
      .map(campus => campus.name)
      .join(', ');

    const selectedCourseList = courseListByCampus
      .map(({ data }) => data)
      .flat()
      .filter(course =>
        course ? requestBody.courseIdList.includes(course.id!) : false,
      )
      .map(course => course?.title);

    alert({
      text: `${user.name}님의 권한을 다시 한번 확인해주세요.`,
      subText: '정말로 변경하시겠습니까?',
      subTextColor: 'green',
      className: '!max-w-[700px]',
      children: (
        <ul className="mb-8 flex flex-col justify-center gap-3.5">
          <li className="flex items-center gap-2">
            <span className="min-w-16 text-darkGray-hover">역할: </span>
            <Tag
              text={rolesObj[requestBody.role]}
              roleKey={requestBody.role}
              size="medium"
            />
          </li>

          <li className="flex items-center gap-2">
            <span className="min-w-16 text-darkGray-hover">캠퍼스: </span>
            {selectedCampusList}
          </li>

          <li className="flex items-start gap-2">
            <span className="min-w-16 text-darkGray-hover">교육과정: </span>
            <div className="flex flex-col">
              <span className="mb-2">
                총 {selectedCourseList.length}개의 교육과정
              </span>
              <ul className="flex max-h-[270px] w-[520px] flex-col gap-1 overflow-scroll rounded-xl bg-lightGray-active px-5 py-4 scrollbar-hide">
                {selectedCourseList.map((courseTitle, index) => (
                  <li
                    key={courseTitle}
                    className="flex min-h-fit w-full items-start truncate text-darkGray-active"
                  >
                    <span className="min-w-7">{index + 1}.</span>
                    <span className="whitespace-pre-line">{courseTitle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      ),
      buttonList: [
        {
          name: '취소',
          color: 'gray',
          onClick: hideDialog,
        },
        {
          name: '확인',
          onClick: () => {
            updateUserPermission({ userId, requestBody });
            hideDialog();
            onMenuClose();
          },
        },
      ],
    });
  };

  const toggleItemInArr = (arr: number[], id: number) => {
    return arr.includes(id)
      ? arr.filter(itemId => itemId !== id)
      : [...arr, id];
  };

  const lastStep = modifyingPermissionStepList.length;

  useEffect(() => {
    const courseListByCurrCampus = courseListByCampus
      .map(({ data }) => data)
      .flat()
      .map(item => item?.id);

    if (currStep === lastStep) {
      const filteredCourseList = currCourseIdList.filter(userCourseId => {
        return courseListByCurrCampus.includes(userCourseId);
      });
      setValue('courseIdList', filteredCourseList);
    } else if (currCampusIdList.length !== userCampusList.length) {
      setValue('courseIdList', initialUserCourseIdList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currStep]);

  const disabledStyle = '!bg-lightGray-active !text-mainGray-hover';
  const activeStyle = '!bg-mainBlue !text-darkGray-active font-medium';

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <ul className="flex w-full">
          {modifyingPermissionStepList.map(({ step, text }) => (
            <li
              key={step}
              className="flex w-full flex-col items-center justify-center"
            >
              <button
                type="button"
                onClick={async () => {
                  const isValid = await trigger([
                    'role',
                    'campusIdList',
                    'courseIdList',
                  ]);
                  if (isValid) {
                    setCurrStep(step);
                  }
                }}
                className={`w-full py-3 text-lg font-medium ${step <= currStep ? 'text-mainBlue-active' : 'text-mainGray'}`}
              >
                {step}. {text}
              </button>
              <div
                className={`${step <= currStep ? 'bg-mainBlue' : 'bg-mainGray'} h-[6px] w-full`}
              />
            </li>
          ))}
        </ul>

        <div>
          {currStep === 1 && (
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange } }) => {
                return (
                  <div className="mb-6 mt-4 h-[300px]">
                    <ul className="flex flex-wrap gap-3">
                      {rolesArr?.map(({ key, label }) => (
                        <li key={key}>
                          <SquareButton
                            name={label}
                            className={
                              currRole !== key ? disabledStyle : activeStyle
                            }
                            onClick={() => onChange(key)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }}
            />
          )}

          {currStep === 2 && (
            <Controller
              control={control}
              name="campusIdList"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="mb-6 mt-4 h-[300px]">
                    <ul className="flex flex-wrap gap-3">
                      {campusList?.map(({ name: campusName, id }) => (
                        <li key={id}>
                          <SquareButton
                            name={campusName}
                            onClick={() => {
                              onChange(toggleItemInArr(currCampusIdList, id));
                            }}
                            className={
                              !currCampusIdList.includes(id)
                                ? disabledStyle
                                : activeStyle
                            }
                          />
                        </li>
                      ))}
                    </ul>
                    {error?.message && <ErrorMsg msg={error.message} />}
                  </div>
                );
              }}
            />
          )}

          {currStep === 3 &&
            courseListByCampus &&
            courseListByCampus.length !== 0 && (
              <Controller
                control={control}
                name="courseIdList"
                render={({ field: { onChange }, fieldState: { error } }) => {
                  return (
                    <div className="mb-6 mt-4 h-[300px]">
                      <ul className="flex max-h-[300px] flex-col gap-9 overflow-scroll scrollbar-hide">
                        {courseListByCampus?.map(({ data, campusName }) => (
                          <li key={campusName}>
                            <div className="flex justify-between pb-2 text-sm font-medium text-darkGray-active">
                              <span>{campusName} 교육과정</span>{' '}
                              <span>
                                {
                                  data?.filter(item =>
                                    currCourseIdList.includes(item.id),
                                  ).length
                                }{' '}
                                / {data?.length}
                              </span>
                            </div>
                            <ul className="flex flex-col gap-2">
                              {data?.map(({ id, title }) => (
                                <li key={id}>
                                  <SquareButton
                                    name={title}
                                    className={`${
                                      !currCourseIdList.includes(id)
                                        ? disabledStyle
                                        : activeStyle
                                    } w-full truncate whitespace-pre !px-3 text-start`}
                                    onClick={() =>
                                      onChange(
                                        toggleItemInArr(currCourseIdList, id),
                                      )
                                    }
                                  />
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                      {error?.message && <ErrorMsg msg={error.message} />}
                    </div>
                  );
                }}
              />
            )}
        </div>

        {currStep === lastStep && (
          <div className="ml-auto mt-auto flex gap-3">
            <SquareButton
              type="button"
              name="이전"
              color="gray"
              onClick={async () => {
                const isValid = await trigger([
                  'role',
                  'campusIdList',
                  'courseIdList',
                ]);
                if (isValid) {
                  setCurrStep(prev => {
                    if (prev === 1) return 1;
                    return prev - 1;
                  });
                }
              }}
            />
            <SquareButton type="submit" name="수정하기" color="mainGreen" />
          </div>
        )}
      </form>

      {currStep < lastStep && (
        <div className="ml-auto mt-auto flex gap-3">
          <SquareButton
            type="button"
            name="이전"
            color="gray"
            onClick={async () => {
              const isValid = await trigger([
                'role',
                'campusIdList',
                'courseIdList',
              ]);
              if (isValid) {
                setCurrStep(prev => {
                  if (prev === 1) return 1;
                  return prev - 1;
                });
              }
            }}
          />
          <SquareButton
            type="button"
            name="다음"
            color="gray"
            onClick={async () => {
              const isValid = await trigger([
                'role',
                'campusIdList',
                'courseIdList',
              ]);
              if (isValid) {
                setCurrStep(prev => prev + 1);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
