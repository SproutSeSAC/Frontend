import { useNavigate } from 'react-router-dom';

import { usePostUserInfo } from '@/services/auth/authMutations';
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

  const navigate = useNavigate();

  const { mutate } = usePostUserInfo({
    onSuccess: () => navigate('/'),
    onError: error => console.log(error),
  });

  const onSubmit: SubmitHandler<UserInfo & VerifyCode> = formData => {
    const marketingConsent = formData.marketingConsent === '동의';
    const data = { ...formData, marketingConsent };

    const { verifyCode, campusId, ...rest } = data as unknown as UserInfo &
      VerifyCode;

    mutate(rest);
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
