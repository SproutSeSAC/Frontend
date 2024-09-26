// import { usePostUserInfo } from '@/services/auth/authQueries';
import {
  useGetCampusList,
  useGetCourseList,
} from '@/services/course/courseQueries';
import {
  useGetDomainList,
  useGetJobList,
  useGetTechStackList,
} from '@/services/specifications/specificationsQueries';

import { UserInfo, VerifyCode } from '@/types';
import { SubmitHandler } from 'react-hook-form';

export const useHandleSignUp = (watchedCampusId?: number) => {
  const {
    data: jobList,
    isLoading: isJobListLoading, //
  } = useGetJobList();

  const {
    data: domainList,
    isLoading: isDomainListLoading, //
  } = useGetDomainList();

  const {
    data: techStackList,
    isLoading: isTechStackListLoading, //
  } = useGetTechStackList();

  const {
    data: campusList,
    isLoading: isCampusListLoading, //
  } = useGetCampusList();

  const { data: courseList } = useGetCourseList(watchedCampusId);

  // const { mutate } = usePostUserInfo();

  const onSubmit: SubmitHandler<UserInfo> = formData => {
    const data = {
      ...formData,
      courseId: +formData.courseId,
      marketingConsent:
        (formData.marketingConsent as unknown as string) === 'true',
    };
    const { verifyCode, campusId, ...rest } = data as UserInfo & VerifyCode;
    console.log(rest);
    // mutate(rest);
  };

  const isLoading =
    isCampusListLoading ||
    isDomainListLoading ||
    isJobListLoading ||
    isTechStackListLoading;

  return {
    jobList,
    domainList,
    campusList,
    courseList,
    techStackList,
    onSubmit,
    isLoading,
  };
};
