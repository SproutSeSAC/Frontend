import { useEffect, useRef } from 'react';

import { notificationServerSentEventAtom } from '@/atoms/notificationAtom';

import { useAtom } from 'jotai';

export default function NotificationSSEListener() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [, setIsNotificationServerSentEventData] = useAtom(
    notificationServerSentEventAtom,
  );

  useEffect(() => {
    const baseURL = import.meta.env.VITE_SERVER_API_URL;
    const sseUrl = `${baseURL}/sse/subscribe`;

    const eventSource = new EventSource(sseUrl, { withCredentials: true });
    eventSourceRef.current = eventSource;

    eventSource.onmessage = event => {
      console.log('[SSE] 데이터 수신:', event.data);
      if (
        event.data.trim() !== 'data: check' &&
        event.data.trim() !== 'data: welcome'
      ) {
        setIsNotificationServerSentEventData(true);
      }
    };

    eventSource.onerror = e => {
      console.warn('[SSE] 오류:', e);
    };

    return () => {
      eventSource.close();
      console.log('[SSE] 연결 종료.');
    };
  }, [setIsNotificationServerSentEventData]);

  return null;
}
