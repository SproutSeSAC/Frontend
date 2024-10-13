import { useTechStackList } from '@/hooks/useTechStackList';

import { useUpdateUserProfile } from '@/services/auth/authMutations';
import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  useGetDomainList,
  useGetJobList,
} from '@/services/specifications/specificationsQueries';

import { UpdateableUserProfile } from '@/types';
import { SubmitHandler } from 'react-hook-form';

export const useUpdateProfile = () => {
  const {
    data: jobList,
    isLoading: isJobListLoading, //
  } = useGetJobList();

  const {
    data: domainList,
    isLoading: isDomainListLoading, //
  } = useGetDomainList();

  const {
    techStackList,
    isTechStackListLoading, //
  } = useTechStackList();

  const {
    data: userProfile,
    isLoading: isUserProfileLoading, //
  } = useGetUserProfile();

  const userTechStackIdList = userProfile?.techStackList?.map(({ id }) => id);
  const userJobIdList = userProfile?.jobList?.map(({ id }) => id);
  const userDomainIdList = userProfile?.domainList?.map(({ id }) => id);

  const isLoading =
    isDomainListLoading || isJobListLoading || isTechStackListLoading;

  const { mutate } = useUpdateUserProfile({
    onError: error => console.log(error),
  });

  const onSubmit: SubmitHandler<Partial<UpdateableUserProfile>> = formData => {
    // const data = {
    //   updatedDomainIdList: [1, 2],
    //   updatedJobIdList: [1, 2],
    //   updatedTechStackIdList: [8, 9],
    // };
    mutate(formData);
  };

  return {
    userProfile,
    userTechStackIdList,
    userJobIdList,
    userDomainIdList,
    isUserProfileLoading,
    jobList,
    domainList,
    techStackList,
    onSubmit,
    isLoading,
  };
};
