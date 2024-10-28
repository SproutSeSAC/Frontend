import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  TermsAndPolicyType,
  getPolicyContent,
} from '@/services/auth/termsAndPolicy';

export const useTermsAndPolicy = () => {
  const [contentType, setContentType] =
    useState<TermsAndPolicyType>('서비스 이용약관');

  const toggleContentType = (type: TermsAndPolicyType) => setContentType(type);

  const { data: htmlContent, isLoading: isContentLoading } = useQuery({
    queryKey: ['policyContent', contentType],
    queryFn: () => getPolicyContent(contentType),
  });

  return {
    contentType,
    toggleContentType,
    isContentLoading,
    htmlContent,
  };
};
