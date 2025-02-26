import { useNavigate } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { useCalendarList, useDialogContext } from '@/hooks';
import { Option } from '@/types';
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
        subText: '일정 관리 페이지에서 캘린더를 먼저 생성해주세요.',
        subTextColor: 'green',
        className: '!max-w-[500px]',
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
              navigate('/admin');
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
        subText:
          '나의 캘린더 목록에 추가되지 않았거나 캘린더 권한이 부여되지 않았습니다. 일정관리페이지에서 확인 후 조치를 취하실 수 있습니다.',
        subTextColor: 'green',
        className: '!max-w-[500px]',
        buttonList: [
          {
            name: '확인',
            color: 'gray',
            onClick: hideDialog,
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
