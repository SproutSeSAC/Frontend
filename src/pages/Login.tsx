import { useNavigate } from 'react-router-dom';

import { getCalendarToken } from '@/services/auth/authQueries';
import { axiosInstance } from '@/services/axiosInstance';

import Logo2 from '@/assets/images/sprout-logo2.png';
import {
  ACCESS_TOKEN_KEY,
  CALENDAR_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/constants';
import Logo from '@/layouts/Logo';
import { setCookie } from '@/utils';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const navigate = useNavigate();
  const handleGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/oauth2/authorization/google`;
  };

  const handleTestAdminLogin = async () => {
    try {
      const response = await axiosInstance.get(
        'test/getAdminCookie',

        {
          withCredentials: true,
        },
      );

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
        <main className="inline-flex flex-col items-center justify-start gap-10 self-stretch">
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
                <span className="self-stretch text-center text-sm font-medium leading-snug text-darkerGray">
                  편리한 일정관리를 위해 <br />
                  구글 아이디를 사용하여 구글 캘린더를 연동합니다.
                </span>
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
          </div>
        </main>
        <footer className="inline-flex h-6 items-center justify-end gap-[332px] self-stretch">
          <span className="text-xs font-normal leading-none text-darkGray-active">
            © Team Sprout 2024
          </span>
        </footer>
      </div>
    </div>
  );
}
