// import { usePostUserInfo } from '@/services/auth/authMutations';
import {
  useGetCampusList,
  useGetCourseList,
} from '@/services/course/courseQueries';
import {
  useGetDomainList,
  useGetJobList,
  useGetTechStackList,
} from '@/services/specifications/specificationsQueries';

import { getQuestionListByRole } from '@/constants';
import { KeyOfRole, UserInfo, VerifyCode } from '@/types';
import { SubmitHandler } from 'react-hook-form';

export const useHandleSignUp = ({
  watchedCampusId,
  watchedRole,
}: {
  watchedCampusId?: number;
  watchedRole: KeyOfRole;
}) => {
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

  const questionListByRole = getQuestionListByRole(watchedRole);

  const getQuestionNumber = (index: number, idx: number) => {
    const previousQuestionsCount = questionListByRole
      .map(list => list.length)
      .slice(0, index)
      .reduce((acc, count) => acc + count, 0);
    return previousQuestionsCount + idx + 1;
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
    questionListByRole,
    getQuestionNumber,
  };
};
