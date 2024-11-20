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

import { initialLogin } from '@/atoms/initialLoginAtom';
import { verifiedCodeAtom } from '@/atoms/verificationCodeAtom';

import { getFormStepsByRole } from '@/constants';
import { KeyOfRole, SignUpUserFormValue, UserProfileDto } from '@/types';
import { isCampusManager, isManager, isPreTrainee } from '@/utils';
import { useAtom, useSetAtom } from 'jotai';
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
  const setIsInitialLogin = useSetAtom(initialLogin);

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
    onSuccess: () => {
      navigate('/');
      setIsInitialLogin(true);
    },
  });

  const onSubmit: SubmitHandler<SignUpUserFormValue> = submittedValue => {
    if (!isVerifiedCode && submittedValue.role !== 'PRE_TRAINEE') return;

    const { verifyCode, campusIdList, ...formData } = submittedValue;

    if (isManager(formData.role)) {
      const initializeValue = {
        jobIdList: [],
        techStackIdList: [],
        domainIdList: [],
      };
      const { jobIdList, techStackIdList, domainIdList, ...rest } = formData;
      const data: UserProfileDto.Post = { ...rest, ...initializeValue };

      if (isCampusManager(formData.role)) {
        const courseIdList = courseList.map(({ id }) => id);
        const campusManangerData = { ...data, courseIdList };
        mutate(campusManangerData);
      } else {
        mutate(data);
      }
    } else if (isPreTrainee(formData.role)) {
      const { courseIdList, ...rest } = formData;
      const data: UserProfileDto.Post = { ...rest, courseIdList: [] };
      mutate(data);
    } else {
      mutate(formData);
    }
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
