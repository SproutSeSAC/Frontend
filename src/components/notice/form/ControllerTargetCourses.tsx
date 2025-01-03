import { useNavigate } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { useCalendarList, useDialogContext, useGetUserAclList } from '@/hooks';
import { Option } from '@/types';
import { Controller, useFormContext } from 'react-hook-form';

import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';

export default function ControllerTargetCourses() {
  const { control } = useFormContext();

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { alert, hideDialog } = useDialogContext();

  const { hasNotAclCalendarList } = useGetUserAclList();

  const { allCourseCalendarList } = useCalendarList();

  const navigate = useNavigate();

  const onTargetCourseIdChange = (
    data: Option[],
    onChange: (event: number[]) => void,
  ) => {
    const courseIds = data.map(({ id }) => id);

    const selectedCourseCalendarList = allCourseCalendarList.filter(
      ({ courseId }) => courseIds?.includes(courseId),
    );

    // 캘린더 비생성 확인 Alert
    const isNotCreatedCalendarCourseTitle = selectedCourseCalendarList
      .filter(calendar => calendar.accessRole !== 'owner')
      .map(({ courseTitle }) => courseTitle);

    if (isNotCreatedCalendarCourseTitle.length > 0) {
      return alert({
        text: `${isNotCreatedCalendarCourseTitle.join(', ')} 캘린더가 아직 생성되어 있지 않습니다!`,
        subText: '일정 관리 페이지에서 캘린더를 먼저 생성해주세요.',
        subTextColor: 'green',
        className: 'max-w-[600px]',
        buttonList: [
          {
            name: '나가기',
            color: 'gray',
            onClick: () => hideDialog(),
          },
          {
            name: '바로 이동하기',
            onClick: () => {
              hideDialog();
              navigate('/schedule');
            },
          },
        ],
      });
    }

    // 캘린더 권한 확인 Alert
    const hasNotAclCourse = hasNotAclCalendarList?.find(({ courseId }) =>
      courseIds.includes(courseId),
    );

    if (hasNotAclCourse) {
      return alert({
        text: `${hasNotAclCourse.courseTitle} 교육과정 캘린더에 일정관리 권한이 부여되지 않았습니다.`,
        subText:
          '잠시만 기다려주시면 바로 관리자가 확인 후 권한을 부여해드리겠습니다.',
        subTextColor: 'green',
        className: 'max-w-[600px]',
        buttonList: [
          {
            name: '확인',
            onClick: hideDialog,
          },
        ],
      });
    }
    return onChange(courseIds);
  };

  return (
    <Controller
      control={control}
      name="targetCourseIdList"
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const courseListOption = userProfile?.courseList
          ?.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle))
          .map(({ courseId, courseTitle }) => ({
            id: courseId,
            name: courseTitle,
          }));

        return (
          <MultiSelectDropdown
            defaultLabel="교육과정을 선택해주세요."
            options={courseListOption}
            value={value}
            onChangeValue={data => {
              onTargetCourseIdChange(data, onChange);
            }}
            errorMsg={error?.message}
            hasFullCheck={courseListOption.length > 1}
          />
        );
      }}
    />
  );
}
