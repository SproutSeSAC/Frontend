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
  const campusOptionList = campusList?.map(({ id, campusName }) => ({
    id,
    name: campusName,
  }));

  const currCampusId = selectedCampusId || campusList[0]?.id;

  const selectedCampusOption = campusOptionList?.find(
    ({ id }) => id === currCampusId,
  );

  const courseListByCampusData = useGetCourseListByCampus([currCampusId]);

  const courseListByCampus = courseListByCampusData[0].data;

  /**
   * 캠퍼스별 교육과정 목록
   * - 매니저가 '갖고 있는' 캠퍼스별 교육과정만 나타낸다.
   */
  const courseOptionList = (courseListByCampus || [])
    .map(({ id, title: name }) => ({ id, name }))
    .filter(({ id }) => !!courseList.find(({ courseId }) => courseId === id));

  const selectedCourseOption =
    courseOptionList?.find(({ id }) => id === selectedCourseId) ||
    courseOptionList?.[0];

  return {
    campusOptionList,
    selectedCampusOption,
    courseOptionList,
    selectedCourseOption,
    courseListByCampus,
  };
};
