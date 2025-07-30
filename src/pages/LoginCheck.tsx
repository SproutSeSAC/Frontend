import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { loginCheck } from '@/services/auth/authQueries';

import { HEADER_ACCESS_TOKEN_KEY } from '@/constants';
import { useDialogContext } from '@/hooks';
import { getCookie } from '@/utils';
import axios from 'axios';

import LoopLoading from '@/components/common/LoopLoading';
import SquareButton from '@/components/common/button/SquareButton';

export default function LoginCheck() {
  const { hideDialog, alert } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    const handleLoginPost = async () => {
      try {
        const response = await loginCheck();

        if (response.status === 200) {
          navigate('/');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.status === 304) {
          navigate('/signup');
        }
      }
    };

    const accessToken = !!getCookie(HEADER_ACCESS_TOKEN_KEY);
    // 아 여기 프론트에서 저장하는거랑 서버에서 저장하거랑 이름이 똑같아서 프론트에서 저장한 이전 쿠키를 쓰는건가???? 같은 이름이라서?

    if (accessToken) {
      handleLoginPost();
    } else {
      navigate('/login');
      alert({
        text: '로그인에 실패했습니다. 다시 시도해주세요.',
        children: (
          <SquareButton name="확인" onClick={hideDialog} type="button" />
        ),
      });
    }
  }, [navigate, alert, hideDialog]);

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center gap-4">
      <LoopLoading size={200} />
    </div>
  );
}
