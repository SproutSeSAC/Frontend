import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export default function LoginCheck() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  useEffect(() => {
    const handleLoginPost = async () => {
      localStorage.setItem(
        'sproutToken',
        JSON.stringify({ accessToken, refreshToken }),
      );

      try {
        await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/login/check`, {
          headers: {
            'Access-Token': accessToken,
            'Refresh-Token': refreshToken,
          },
        });

        // if (response.status === 200) {
        navigate('/');
        // } else if (response.status === 304) {
        //   navigate('/signup');
        // }

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };

    if (accessToken) {
      handleLoginPost();
    } else {
      alert('로그인에 실패했습니다.');
    }
  }, [accessToken, refreshToken, navigate]);

  return <div>로그인 체크 중...</div>;
}
