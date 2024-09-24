import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { loginCheck } from '@/services/auth/authQueries';

import { setCookie } from '@/utils';

export default function LoginCheck() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  useEffect(() => {
    const handleLoginPost = async () => {
      if (accessToken && refreshToken) {
        setCookie('access_token', accessToken, 1);
        setCookie('refresh_token', refreshToken, 1);
      }

      try {
        const response = await loginCheck();

        switch (response?.status) {
          case 200:
            navigate('/');
            break;
          case 304:
            navigate('/signup');
            break;
          default:
            break;
        }

        window.location.reload();
      } catch (error) {
        alert('문제가 발생했습니다!');
      }
    };

    if (accessToken && refreshToken) {
      handleLoginPost();
    } else {
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  }, [accessToken, refreshToken, navigate]);

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center gap-4">
      <div className="h-20 w-20 animate-spin rounded-full border-[7px] border-gray3 border-b-gray1" />
      <span className="text-sm text-gray1">로그인 검증중...</span>
    </div>
  );
}
