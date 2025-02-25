import {
  useGetAdminEmailListByCourse,
  useGetCourseCalendarStatus,
} from '@/services/schedule/calendarQueries';

export const useCourseData = ({ courseId }: { courseId: number }) => {
  const {
    data: adminList = [], //
    isLoading: isAdminListLoading,
  } = useGetAdminEmailListByCourse(courseId);

  const {
    data: courseCalendar = { calendarId: '' },
    isLoading: isCourseCalendarLoading,
  } = useGetCourseCalendarStatus(courseId);

  return {
    adminList,
    isAdminListLoading,
    courseCalendar,
    isCourseCalendarLoading,
  };
};
