import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import AuthPageLayout from '@/layouts/AuthPageLayout';
import styles from '@/policies/policy.module.css';
import { FcGoogle } from 'react-icons/fc';

import Modal from '@/components/common/modal/Modal';

type PolicyAndTermsType = '개인정보 처리방침' | '서비스 이용약관';

type ModalState = {
  type: PolicyAndTermsType;
  isOpen: boolean;
};

const initialModalState: ModalState = {
  type: '서비스 이용약관',
  isOpen: false,
};

async function fetchPolicyContent(type: PolicyAndTermsType) {
  const filename =
    type === '서비스 이용약관'
      ? 'termsAndConditionsOfService'
      : 'policyOfHandlingPersonalInformation';

  const response = await fetch(`/src/policies/${filename}.html`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text();
}

export default function Login() {
  const [modalState, setModalState] = useState<ModalState>(initialModalState);

  const { data: htmlContent, isLoading } = useQuery({
    queryKey: ['policyContent'],
    queryFn: () => fetchPolicyContent(modalState.type),
    enabled: modalState.isOpen,
  });

  const toggleModal = (type?: PolicyAndTermsType) => {
    setModalState(({ isOpen, type: prevType }) => {
      return {
        isOpen: !isOpen,
        type: type || prevType,
      };
    });
  };

  return (
    <AuthPageLayout>
      <h1 className="mb-[10%] text-lg font-medium">
        <span className="text-3xl font-medium text-oliveGreen1">SPROUT</span>에
        오신 것을 환영합니다
      </h1>

      <p className="tracking-tight text-gray1">
        편리한 일정 관리를 위해 <br />
        구글 아이디를 사용하여 구글 캘린더를 연동합니다.
      </p>

      <button
        type="button"
        className="my-[25%] flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 text-sm font-medium tracking-tight text-white"
      >
        <FcGoogle className="text-lg" />
        구글 계정으로 시작하기
      </button>

      <p className="text-gray1">
        서비스 가입 시{' '}
        <button
          type="button"
          className="underline"
          onClick={() => toggleModal('서비스 이용약관')}
        >
          이용약관
        </button>
        에 동의하며 <br />
        <button
          type="button"
          className="underline"
          onClick={() => toggleModal('개인정보 처리방침')}
        >
          개인정보 처리방침
        </button>
        의 내용을 확인한 것으로 간주합니다
      </p>

      {modalState.isOpen && (
        <Modal
          title={modalState.type}
          onToggleClick={toggleModal}
          className="rounded-xl px-5 pb-5 pt-2"
        >
          <div
            className={`h-[70vh] w-[500px] overflow-auto ${styles.policyContainer}`}
            dangerouslySetInnerHTML={{
              __html: !isLoading && htmlContent ? htmlContent : '',
            }}
          />
        </Modal>
      )}
    </AuthPageLayout>
  );
}
