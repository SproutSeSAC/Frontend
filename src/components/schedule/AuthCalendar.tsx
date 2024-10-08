import { useEffect } from 'react';

import { setCookie } from '@/utils';

import SquareButton from '@/components/common/button/SquareButton';

export default function AuthCalendar() {
  const onCalendarLoginClick = async () => {
    try {
      const clientId =
        '249724125506-bk9tr0ic63i0lud55abb498v5qo0lbv1.apps.googleusercontent.com';
      const redirectUri = 'http://localhost:3000/schedule';
      const scope = 'https://www.googleapis.com/auth/calendar';
      const responseType = 'token';
      const baseAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

      const authUrl = `${baseAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&prompt=consent`;
      window.location.href = authUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const getAccessTokenDetails = (
    detail: 'accessToken' | 'tokenType' | 'expiresIn' | 'scope',
  ) => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const tokenDetails = {
      accessToken: params.get('access_token'),
      tokenType: params.get('token_type'),
      expiresIn: params.get('expires_in'),
      scope: params.get('scope'),
    };

    return tokenDetails[detail];
  };

  useEffect(() => {
    const calendarAccessToken = getAccessTokenDetails('accessToken');
    if (calendarAccessToken) {
      setCookie('calendar_access_token', calendarAccessToken, 1);
    }
  }, []);

  return (
    <SquareButton
      name="캘린더 데이터 가져오기"
      onClick={onCalendarLoginClick}
      color="gray"
    />
  );
}
