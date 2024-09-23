import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useLoginCheck } from '@/services/auth/authQueries';

export default function LoginCheck() {
  const navigate = useNavigate();
  const { data } = useLoginCheck();

  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  useEffect(() => {
    const handleLoginPost = async () => {
      try {
        localStorage.setItem(
          'sproutToken',
          JSON.stringify({ accessToken, refreshToken }),
        );

        if (accessToken && refreshToken) {
          console.log(data?.status);

          switch (data?.status) {
            case 200:
              navigate('/');
              break;
            case 304:
              navigate('/signup');
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (accessToken) {
      handleLoginPost();
    } else {
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  }, [accessToken, refreshToken, data?.status, navigate]);

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center gap-4">
      <div className="h-20 w-20 animate-spin rounded-full border-[7px] border-gray3 border-b-gray1" />
      <span className="text-sm text-gray1">로그인 검증중...</span>
    </div>
  );
}
