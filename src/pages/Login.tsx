import { useNavigate } from 'react-router-dom';

import { getCalendarToken } from '@/services/auth/authQueries';
import { TermsAndPolicyType } from '@/services/auth/termsAndPolicy';
import { axiosInstance } from '@/services/axiosInstance';

import Logo2 from '@/assets/images/sprout-logo2.png';
import {
  ACCESS_TOKEN_KEY,
  CALENDAR_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/constants';
import { useDialogContext } from '@/hooks';
import Logo from '@/layouts/Logo';
import styles from '@/policy.module.css';
import { setCookie } from '@/utils';
import { FcGoogle } from 'react-icons/fc';

import Modal from '@/components/common/modal/Modal';

export default function Login() {
  const navigate = useNavigate();
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

  const handleTestAdminLogin = async () => {
    try {
      const response = await axiosInstance.get('test/getAdminCookie', {
        withCredentials: true,
      });

      const { access_token: accessToken, refresh_token: refreshToken } =
        response.data;

      if (!accessToken || !refreshToken) {
        alert('로그인에 실패했습니다.');
        return;
      }
      setCookie(ACCESS_TOKEN_KEY, accessToken, 1);
      setCookie(REFRESH_TOKEN_KEY, refreshToken, 1);

      const calendarToken = await getCalendarToken();

      if (calendarToken.status === 200) {
        const newCalendarAccessToken = calendarToken.data.access_token;
        setCookie(CALENDAR_TOKEN_KEY, newCalendarAccessToken, 1);
      }

      navigate('/');
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-lightGreen-active to-lightGreen-hover">
      <div className="absolute bottom-4 left-20 opacity-20">
        <img src={Logo2} className="w-[30vw]" alt="Sprout 로고" />
      </div>
      <div className="z-10 flex h-[80vh] flex-col items-center justify-center gap-[60px] rounded-xl border border-white bg-white/70 px-11 py-20 shadow-[0px_4px_20px_0px_rgba(85,128,20,0.20)]">
        <div className="inline-flex flex-col items-center justify-start gap-10 self-stretch">
          <Logo size="large" />
          <div className="flex flex-col items-start justify-start gap-10 self-stretch">
            <div className="flex flex-col items-start justify-start gap-10 self-stretch">
              <div className="flex flex-col items-start justify-start gap-[22px] self-stretch">
                <h1 className="self-stretch text-center">
                  <span className="text-2xl font-semibold leading-tight text-mainGreen">
                    SPROUT
                  </span>
                  <span className="text-lg font-semibold leading-tight text-black">
                    에 오신것을 환영합니다.
                  </span>
                </h1>
                <div className="self-stretch text-center text-sm font-medium leading-snug text-darkerGray">
                  편리한 일정관리를 위해 <br />
                  구글 아이디를 사용하여 구글 캘린더를 연동합니다.
                </div>
              </div>
              <div className="w-full gap-1">
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-black py-2.5 text-sm font-medium tracking-tight text-white"
                >
                  <FcGoogle className="text-lg" />
                  구글 계정으로 시작하기
                </button>
                <button
                  type="button"
                  onClick={handleTestAdminLogin}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-mainGreen py-2.5 text-sm font-medium tracking-tight text-white"
                >
                  로그인 없이 체험하기
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 self-stretch text-base text-black">
              <div className="inline-flex items-start justify-center gap-1.5 self-stretch">
                <div className="leading-snug">서비스 가입 시 </div>
                <button
                  type="button"
                  className="leading-snug text-inherit underline"
                  onClick={() => onContentClick('서비스 이용약관')}
                >
                  이용약관
                </button>
                <div className="leading-snug">에 동의하며</div>
              </div>
              <div className="inline-flex items-start justify-center gap-1.5 self-stretch">
                <button
                  type="button"
                  className="leading-snug text-inherit underline"
                  onClick={() => onContentClick('개인정보 처리방침')}
                >
                  개인정보 처리 방침
                </button>
                <div className="leading-snug">
                  의 내용을 확인한 것으로 간주합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="inline-flex h-6 items-center justify-end gap-[332px] self-stretch">
          <div className="text-xs font-normal leading-none text-darkGray-active">
            © Team Sprout 2024
          </div>
        </div>
      </div>
    </div>
  );
}
