import { useRef, useState } from 'react';

import { axiosInstance } from '@/services/axiosInstance';

import { ACCESS_TOKEN_KEY } from '@/constants';
import { getCookie } from '@/utils';
import { AxiosError } from 'axios';
import { EventSourcePolyfill } from 'event-source-polyfill';

/**
 * SSE 구독, 취소, 메세지 발행 기능 hook
 * 서버로부터 SSE 메세지 정상적으로 수신받을 때 사용 예정
 */

export const useSSE = () => {
  const accessToken = getCookie(ACCESS_TOKEN_KEY);

  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  /** ---구독 취소 */
  const unsubscribe = async () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    try {
      await axiosInstance.delete('/sse/unsubscribe');
      setIsConnected(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('SSE 구독 취소 중 에러 발생', error);
      }
    }
  };

  /** --구독 시작 */
  const subscribe = () => {
    if (eventSourceRef.current) return;

    const eventSource = new EventSourcePolyfill(
      `${import.meta.env.VITE_SERVER_API_URL}/sse/subscribe`,
      {
        headers: {
          'Access-Token': accessToken,
          // 'Refresh-Token': refreshToken, NOTE:여기 보내야하는지 백엔드 문의
        },
        // 서버가 정해진 시간 안에 데이터를 보내지 않을 경우 연결이 끊어지고 재연결하도록 설정하는 클라이언트 측 타이머
        // 90초 동안 서버 응답 없으면 연결 종료(onerror 로직) 및 자동 재연결 시도
        heartbeatTimeout: 90000,
      },
    );

    // 연결이 열렸을 때
    eventSource.onopen = () => {
      console.log('SSE 연결 열림');
      console.log('📡 readyState:', eventSource.readyState); // 1이면 OPEN 상태, 0(CONNECTING)이면 연결 중
      setIsConnected(true);
    };

    // 서버에서 데이터를 보냈을 때
    eventSource.onmessage = event => {
      console.log('새로운 데이터:', event.data);
    };

    // 오류가 발생했을 때 또는 연결이 끊어졌을 때
    eventSource.onerror = error => {
      console.error('SSE 오류 발생', error);
      console.error('Connection lost. Reconnecting...');
      setIsConnected(false);
    };

    eventSourceRef.current = eventSource;
  };

  /** --메세지 publish */
  const publishMessage = async (clientID: number) => {
    const message = '🥪 한끼팟에 신청자가 있습니다.'; // TODO 알림케이스에 맞는 메세지 발행

    try {
      await axiosInstance.post(
        `${import.meta.env.VITE_SERVER_API_URL}/sse/publish/${clientID}`,
        `0::${message}`,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      );
      console.log('SSE 메세지 발송');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('SSE 메세지 발송 중 에러 발생', error);
      }
    }
  };

  return {
    isConnected,
    unsubscribe,
    subscribe,
    publishMessage,
  };
};
