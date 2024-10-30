import { TermsAndPolicyType } from '@/services/auth/termsAndPolicy';

import { useDialogContext } from '@/hooks';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import styles from '@/policy.module.css';
import { FcGoogle } from 'react-icons/fc';

import Modal from '@/components/common/modal/Modal';

export default function Login() {
  const handleGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/oauth2/authorization/google`;
  };

  const { showDialog, hideDialog } = useDialogContext();

  const onContentClick = async (type: TermsAndPolicyType) => {
    const filename =
      type === '서비스 이용약관'
        ? 'termsAndConditionsOfService'
        : 'policyOfHandlingPersonalInformation';

    const response = await fetch(`/terms-and-policy/${filename}.html`);

    return response.text().then(content => {
      showDialog({
        key: 'POLICY_TERM_KEY',
        element: (
          <Modal
            title={type}
            onToggleClick={hideDialog}
            className="rounded-xl p-4"
          >
            <div
              className={`h-[70vh] w-[500px] overflow-auto ${styles.policyContainer}`}
              dangerouslySetInnerHTML={{ __html: content ?? '' }}
            />
          </Modal>
        ),
      });
    });
  };

  return (
    <AuthPageLayout>
      <img src="/sprout_logo.png" alt="sprout 로고" className="size-10" />
      <div className="mt-[20%]">
        <h1 className="text-lg font-medium">
          <span className="mr-0.5 text-2xl font-medium text-oliveGreen1">
            SPROUT
          </span>
          에 오신 것을 환영합니다
        </h1>

        <p className="mt-[4%] tracking-tight text-gray1">
          편리한 일정 관리를 위해 <br />
          구글 아이디를 사용하여 구글 캘린더를 연동합니다.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="my-[14%] flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 text-sm font-medium tracking-tight text-white"
      >
        <FcGoogle className="text-lg" />
        구글 계정으로 시작하기
      </button>

      <p className="mb-4 text-gray1">
        서비스 가입 시{' '}
        <button
          type="button"
          className="underline"
          onClick={() => onContentClick('서비스 이용약관')}
        >
          이용약관
        </button>
        에 동의하며 <br />
        <button
          type="button"
          className="underline"
          onClick={() => onContentClick('개인정보 처리방침')}
        >
          개인정보 처리방침
        </button>
        의 내용을 확인한 것으로 간주합니다
      </p>

      <span className="mt-[55%] self-end text-sm text-gray1">
        © Team Sprout 2024
      </span>
    </AuthPageLayout>
  );
}
