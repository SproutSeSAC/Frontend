// import { useNavigate } from 'react-router-dom';
import { useTechStackList } from '@/hooks/useTechStackList';

// import { usePostUserInfo } from '@/services/auth/authMutations';
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
import { KeyOfRole, UpdateSignUpValue } from '@/types';
import { useAtom } from 'jotai';
import { SubmitHandler } from 'react-hook-form';

export const useHandleSignUp = ({
  watchedCampusList,
  watchedRole,
}: {
  watchedCampusList: { id: number; name: string }[];
  watchedRole: KeyOfRole;
}) => {
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

  const { data: courseList } = useGetCourseList(watchedCampusList[0]?.id);

  // const navigate = useNavigate();

  // const { mutate } = usePostUserInfo({
  //   onSuccess: () => navigate('/'),
  // });

  const onSubmit: SubmitHandler<UpdateSignUpValue> = formData => {
    const marketingConsent = formData.marketingConsent === '동의';
    const data = { ...formData, marketingConsent };
    // const { verifyCode, campusList, ...rest } = data;
    if (!isVerifiedCode) {
      console.log('인증 안된 상태');
      return;
    }
    console.log(data);
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
