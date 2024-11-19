import { useNavigate } from 'react-router-dom';

import { useTechStackList } from '@/hooks/useTechStackList';

import { usePostSignUpValue } from '@/services/auth/authMutations';
import {
  CourseListData,
  useGetCampusList,
  useGetCourseListByCampus,
} from '@/services/course/courseQueries';
import {
  useGetDomainList,
  useGetJobList,
} from '@/services/specifications/specificationsQueries';

import { verifiedCodeAtom } from '@/atoms/verificationCodeAtom';

import { getFormStepsByRole } from '@/constants';
import { KeyOfRole, SignUpUserFormValue, UserProfileDto } from '@/types';
import { useAtom } from 'jotai';
import { SubmitHandler } from 'react-hook-form';

interface UseHandleSignUpProps {
  currCampusIdList: number[];
  currRole: KeyOfRole;
}

export const useHandleSignUp = ({
  currCampusIdList,
  currRole,
}: UseHandleSignUpProps) => {
  const [isVerifiedCode] = useAtom(verifiedCodeAtom);

  const {
    data: jobList,
    isLoading: isJobListLoading, //
  } = useGetJobList();

  const {
    data: domainList,
    isLoading: isDomainListLoading, //
  } = useGetDomainList();

  const { techStackList, isTechStackListLoading } = useTechStackList();

  const {
    data: campusList,
    isLoading: isCampusListLoading, //
  } = useGetCampusList();

  const courseListByCampusData = useGetCourseListByCampus(currCampusIdList);

  const courseList = courseListByCampusData
    .map(courseByCampus => {
      return courseByCampus.isLoading ? [] : courseByCampus.data;
    })
    .flat() as CourseListData['courseList'];

  const navigate = useNavigate();

  const { mutate } = usePostSignUpValue({
    onSuccess: () => navigate('/'),
  });

  const onSubmit: SubmitHandler<SignUpUserFormValue> = formData => {
    if (!isVerifiedCode && formData.role !== 'PRE_TRAINEE') return;

    const { verifyCode, campusIdList, ...rest } = formData;

    if (
      rest.role === 'EDU_MANAGER' ||
      rest.role === 'CAMPUS_MANAGER' ||
      rest.role === 'JOB_COORDINATOR'
    ) {
      const initializeValue = {
        jobIdList: [],
        techStackIdList: [],
        domainIdList: [],
      };
      const { jobIdList, techStackIdList, domainIdList, ...restOfRest } = rest;
      const data: UserProfileDto.Post = { ...restOfRest, ...initializeValue };
      mutate(data);
      return;
    }

    if (rest.role === 'PRE_TRAINEE') {
      const { courseIdList, ...restOfRest } = rest;
      const data: UserProfileDto.Post = { ...restOfRest, courseIdList: [] };
      mutate(data);
      return;
    }

    mutate(rest);
  };

  const questionListByRole = getFormStepsByRole(currRole);

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
