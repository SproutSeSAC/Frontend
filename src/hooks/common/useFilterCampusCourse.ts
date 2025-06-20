import { useMemo } from 'react';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { useGetCourseListByCampus } from '@/services/campusCourse/campusCourseQueries';

interface UseFilterCampusCourseProps {
  selectedCampusId: number | null;
  selectedCourseId: number | null;
}

export const useFilterCampusCourse = ({
  selectedCampusId,
  selectedCourseId,
}: UseFilterCampusCourseProps) => {
  const { data: { campusList, courseList } = initialUserProfile } =
    useGetUserProfile();

  /**
   * 캠퍼스 목록
   * - 매니저가 '갖고 있는' 캠퍼스만 나타낸다.
   * */
  const campusOptionList = [
    { id: 0, campusName: '전체캠퍼스' },
    ...campusList,
  ]?.map(({ id, campusName }) => ({ id, name: campusName }));

  const currCampusId = selectedCampusId || campusOptionList[0]?.id;

  const selectedCampusOption = campusOptionList?.find(
    ({ id }) => id === currCampusId,
  );

  const courseListByCampusData = useGetCourseListByCampus(
    currCampusId === 0 || !currCampusId ? [] : [currCampusId],
  );

  /**
   * 캠퍼스별 교육과정 목록
   * - 매니저가 '갖고 있는' 캠퍼스별 교육과정만 나타낸다.
   */
  const courseOptionList = useMemo(() => {
    const selectAllCourseOption = { id: 0, name: '전체 교육과정' };

    if (selectedCampusId === 0 || !selectedCampusId) {
      return [selectAllCourseOption];
    }

    const courseListByCampus = courseListByCampusData[0]?.data;
    const allCourseList =
      courseListByCampus?.map(({ id, title: name }) => ({ id, name })) || [];

    return [selectAllCourseOption, ...allCourseList].filter(
      ({ id }) =>
        id === 0 || !!courseList.find(({ courseId }) => courseId === id),
    );
  }, [courseList, courseListByCampusData, selectedCampusId]);

  const selectedCourseOption =
    courseOptionList?.find(({ id }) => id === selectedCourseId) ||
    courseOptionList?.[0];

  return {
    campusOptionList,
    selectedCampusOption,
    courseOptionList,
    selectedCourseOption,
    courseListByCampusData,
  };
};
