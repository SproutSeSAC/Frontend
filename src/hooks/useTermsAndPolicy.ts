import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  TermsAndPolicyType,
  getPolicyContent,
} from '@/services/api/auth/terms-and-policy';

type ModalState = {
  type: TermsAndPolicyType;
  isOpen: boolean;
};

const initialModalState: ModalState = {
  type: '서비스 이용약관',
  isOpen: false,
};

export const useTermsAndPolicy = () => {
  const [modalState, setModalState] = useState<ModalState>(initialModalState);

  const { data: htmlContent, isLoading } = useQuery({
    queryKey: ['policyContent'],
    queryFn: () => getPolicyContent(modalState.type),
    enabled: modalState.isOpen,
  });

  const toggleModal = (type?: TermsAndPolicyType) => {
    setModalState(({ isOpen, type: prevType }) => {
      return {
        isOpen: !isOpen,
        type: type || prevType,
      };
    });
  };

  return {
    modalState,
    toggleModal,
    isLoading,
    htmlContent,
  };
};
