import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePatchUserPermission } from '@/services/admin/userToManageMutation';
import {
  useGetCampusList,
  useGetCourseListByCampus,
} from '@/services/campusCourse/campusCourseQueries';

import { modifyingPermissionStepList, rolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { RoleKey, UserManagementDto } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import ControllerCampusList from '@/components/admin/form/ControllerCampusList';
import ControllerCourseList from '@/components/admin/form/ControllerCourseList';
import ControllerRole from '@/components/admin/form/ControllerRole';
import { userPermissionSchema } from '@/components/admin/userPermissionScheme';
import SquareButton from '@/components/common/button/SquareButton';
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
      courseIdList: initialUserCourseIdList,
    },
    resolver: zodResolver(userPermissionSchema),
  });

  const { handleSubmit, control, setValue, trigger, setError } = methods;

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
    const hasCourseListByCampus = courseListByCampus.map(courseList =>
      courseList.data?.some(item => currCourseIdList.includes(item.id)),
    );

    if (hasCourseListByCampus.includes(false)) {
      return setError('courseIdList', {
        type: 'manual',
        message: '캠퍼스별로 최소 하나의 교육과정을 선택해주세요.',
      });
    }

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

    return alert({
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

  const changeStep = async (step: 'prev' | 'next' | number) => {
    const isValid = await trigger(['role', 'campusIdList', 'courseIdList']);

    if (isValid) {
      if (typeof step === 'number') {
        setCurrStep(step);
      } else {
        setCurrStep(prev => {
          if (step === 'prev') {
            if (prev === 1) return 1;
            return prev - 1;
          }
          return prev + 1;
        });
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* 폼 스텝 */}
      <ul className="flex w-full">
        {modifyingPermissionStepList.map(({ step, text }) => (
          <li
            key={step}
            className="flex w-full flex-col items-center justify-center"
          >
            <button
              type="button"
              onClick={() => changeStep(step)}
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

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {currStep === 1 && <ControllerRole />}

          {currStep === 2 && <ControllerCampusList />}

          {currStep === 3 &&
            courseListByCampus &&
            courseListByCampus.length !== 0 && <ControllerCourseList />}

          {currStep === lastStep && (
            <div className="ml-auto mt-auto flex gap-3">
              <SquareButton
                type="button"
                name="이전"
                color="gray"
                onClick={() => changeStep('prev')}
              />
              <SquareButton type="submit" name="수정하기" color="mainGreen" />
            </div>
          )}
        </form>
      </FormProvider>

      {currStep < lastStep && (
        <div className="ml-auto mt-auto flex gap-3">
          <SquareButton
            type="button"
            name="이전"
            color="gray"
            onClick={() => changeStep('prev')}
          />
          <SquareButton
            type="button"
            name="다음"
            color="gray"
            onClick={() => changeStep('next')}
          />
        </div>
      )}
    </div>
  );
}
