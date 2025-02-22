import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  TermsConsentList,
  getPolicyContent,
} from '@/services/auth/termsAndPolicy';

export const useTermsAndPolicy = () => {
  const [contentType, setContentType] = useState<TermsConsentList>('이용약관');

  const toggleContentType = (type: TermsConsentList) => setContentType(type);

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
