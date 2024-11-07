// import { useNavigate } from 'react-router-dom';
import { useTechStackList } from '@/hooks/useTechStackList';

// import { usePostSignUpValue } from '@/services/auth/authMutations';
import {
  useGetCampusList,
  useGetCourseList,
} from '@/services/course/courseQueries';
import {
  useGetDomainList,
  useGetJobList,
} from '@/services/specifications/specificationsQueries';

import { verifiedCodeAtom } from '@/atoms/verificationCodeAtom';

import { getQuestionListByRole } from '@/constants';
import { KeyOfRole, UserProfileDto } from '@/types';
import { useAtom } from 'jotai';
import { SubmitHandler } from 'react-hook-form';

interface UseHandleSignUpProps {
  currentCampusList: { id: number; name: string }[];
  currentRole: KeyOfRole;
}

export const useHandleSignUp = ({
  currentCampusList,
  currentRole,
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

  const { data: courseList } = useGetCourseList(currentCampusList[0]?.id);

  // const navigate = useNavigate();

  // const { mutate } = usePostSignUpValue({
  //   onSuccess: () => navigate('/'),
  // });

  const onSubmit: SubmitHandler<UpdateSignUpValue> = formData => {
    if (!isVerifiedCode) return;
    
    const { verifyCode, ...rest } = formData;
    const marketingConsent = formData.marketingConsent === '동의';
    const data = { ...rest, marketingConsent };

    console.log(data);
    // mutate(rest);
  };

  const questionListByRole = getQuestionListByRole(currentRole);

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
