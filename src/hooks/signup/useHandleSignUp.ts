import { useNavigate } from 'react-router-dom';

import { usePostSignUpValue } from '@/services/auth/authMutations';
import {
  CourseListData,
  useGetCampusList,
  useGetCourseListByCampus,
} from '@/services/campusCourse/campusCourseQueries';
import {
  useGetDomainList,
  useGetJobList,
} from '@/services/specifications/specificationsQueries';

import { authenticationCodeAtom } from '@/atoms/authenticationCodeAtom';
import { initialLogin } from '@/atoms/initialLoginAtom';

import { getFormStepsByRole } from '@/constants';
import { useDialogContext, useTechStackList } from '@/hooks';
import { RoleKey, SignUpFormValue, UserProfileDto } from '@/types';
import {
  hasAdmin,
  isCampusLeader,
  isOperationManager,
  isTrainee,
} from '@/utils';
import { useAtom, useSetAtom } from 'jotai';
import { SubmitHandler } from 'react-hook-form';

interface UseHandleSignUpProps {
  currCampusIdList: number[];
  currRole: RoleKey;
}

export const useHandleSignUp = ({
  currCampusIdList,
  currRole,
}: UseHandleSignUpProps) => {
  const [isVerifiedCode] = useAtom(authenticationCodeAtom);
  const setIsInitialLogin = useSetAtom(initialLogin);

  const { showToast } = useDialogContext();

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

  const onSubmit: SubmitHandler<SignUpFormValue> = submittedValue => {
    if (!isVerifiedCode) return;

    try {
      const { verifyCode, campusIdList, ...formData } = submittedValue;

      if (hasAdmin(formData.role)) {
        const { jobIdList, techStackIdList, domainIdList, ...rest } = formData;
        const initializeValue = {
          jobIdList: [],
          techStackIdList: [],
          domainIdList: [],
        };
        const adminData: UserProfileDto.Post = {
          ...rest,
          ...initializeValue,
        };

        if (
          isCampusLeader(formData.role) ||
          isOperationManager(formData.role)
        ) {
          const courseIdList = courseList.map(({ id }) => id);
          const result = { ...adminData, courseIdList, campusIdList };
          mutate(result);
        } else {
          mutate(adminData);
        }
      }

      if (isTrainee(formData.role)) {
        mutate(formData);
      }
    } catch (error) {
      showToast('오류가 발생했습니다. 다시 시도해주세요.');
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
