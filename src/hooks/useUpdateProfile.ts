import { useQueryClient } from '@tanstack/react-query';

import { useTechStackList } from '@/hooks/useTechStackList';

import { useUpdateUserProfile } from '@/services/auth/authMutations';
import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  useGetDomainList,
  useGetJobList,
} from '@/services/specifications/specificationsQueries';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

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
    isDomainListLoading ||
    isJobListLoading ||
    isTechStackListLoading ||
    isUserProfileLoading;

  const { mutateAsync } = useUpdateUserProfile({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetUserProfile'] });
    },
  });

  return {
    userProfile,
    userTechStackIdList,
    userJobIdList,
    userDomainIdList,
    isUserProfileLoading,
    jobList,
    domainList,
    techStackList,
    mutateAsync,
    isLoading,
  };
};
