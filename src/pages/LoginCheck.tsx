import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { loginCheck } from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';
import { setCookie } from '@/utils';
import axios from 'axios';

import LoopLoading from '@/components/common/LoopLoading';
import SquareButton from '@/components/common/button/SquareButton';

export default function LoginCheck() {
  const { hideDialog, alert } = useDialogContext();

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
        if (response.status === 200) {
          navigate('/');
          window.location.reload();
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.status === 304) {
          navigate('/signup');
        }
      }
    };

    if (accessToken && refreshToken) {
      handleLoginPost();
    } else {
      alert({
        showDim: true,
        className: 'z-30',
        text: '로그인에 실패했습니다. 다시 시도해주세요.',
        children: (
          <SquareButton
            name="확인"
            onClick={hideDialog}
            type="button"
            className="mt-5"
          />
        ),
      });
    }
  }, [accessToken, refreshToken, navigate, alert, hideDialog]);

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center gap-4">
      <LoopLoading size={200} />
    </div>
  );
}
