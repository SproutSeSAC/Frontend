import { useNavigate } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { useCalendarList, useDialogContext } from '@/hooks';
import { Option } from '@/types';
import { isSuperAdmin } from '@/utils';
import { Controller, useFormContext } from 'react-hook-form';

import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';

export default function ControllerTargetCourses() {
  const { control } = useFormContext();

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { alert, hideDialog } = useDialogContext();

  const { courseCalendarList } = useCalendarList();

  const navigate = useNavigate();

  const onTargetCourseIdChange = (
    data: Option[],
    onChange: (event: number[]) => void,
  ) => {
    const courseIds = data.map(({ id }) => id);

    const selectedCourseCalendarList = courseCalendarList.filter(
      ({ courseId }) => courseIds?.includes(courseId),
    );

    const isNotCreatedCalendarCourseTitle = selectedCourseCalendarList
      .filter(calendar => !calendar.calendarId)
      .map(({ courseTitle }) => courseTitle);

    if (isNotCreatedCalendarCourseTitle.length > 0) {
      return alert({
        text: `${isNotCreatedCalendarCourseTitle.join(', ')} 캘린더가 아직 생성되어 있지 않습니다!`,
        subText: isSuperAdmin(userProfile?.role)
          ? '교육과정 캘린더를 먼저 생성해주세요.'
          : '교육과정 캘린더가 먼저 생성되어 있어야 합니다. 관리자가 생성중이니 잠시만 기다려주세요.',
        subTextColor: 'green',
        className: '!max-w-[500px] max-h-[80vh] overflow-scroll',
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
              navigate('/admin/course');
            },
          },
        ],
      });
    }

    // 캘린더 권한 확인 Alert
    const hasNotAclCourse = selectedCourseCalendarList
      .filter(calendar => calendar.calendarId)
      .filter(item => !item.accessRole)
      .map(({ courseTitle }) => courseTitle);

    if (hasNotAclCourse.length > 0) {
      return alert({
        text: `<${hasNotAclCourse.join(', ')}> 교육과정을 선택할 수 없습니다.`,
        subText: `나의 캘린더 목록에 추가하지 않았거나 캘린더 권한이 부여되지 않았습니다.${isSuperAdmin(userProfile?.role) ? '' : ' 일정관리 페이지에서 캘린더 상태를 확인하실 수 있으며 권한이 없는 경우 관리자가 부여중이니 잠시만 기다려주세요.'}`,
        subTextColor: 'green',
        className: '!max-w-[500px]',
        buttonList: [
          {
            name: '확인',
            color: 'gray',
            onClick: hideDialog,
          },
          {
            name: '일정관리 페이지 이동',
            onClick: () => {
              hideDialog();
              navigate('/schedule');
            },
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
        const courseListOption = courseCalendarList.map(
          ({ courseId, courseTitle, calendarId }) => ({
            id: courseId,
            name: courseTitle,
            isDisabled: !calendarId,
          }),
        );

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
