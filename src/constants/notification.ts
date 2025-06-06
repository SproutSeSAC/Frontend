import { NotificationCardInfo } from '@/types';

export const NOTIFICATION_TYPE: Record<number, NotificationCardInfo> = {
  0: {
    borderColor: '#FFC3E0',
    alertType: '한끼팟',
    alertMessage: '에 새로운 스프가 참여했습니다.',
  },
  1: {
    borderColor: '#FFC3E0',
    alertType: '한끼팟',
    alertMessage: '에 신청한 스프가 취소했습니다.',
  },
  2: {
    borderColor: '#FF8196',
    alertType: '라운지 / 댓글',
    alertMessage: '에 새로운 댓글이 등록되었습니다.',
    buttonText: '게시글 보러가기',
  },
  3: {
    borderColor: '#CDACFD',
    alertType: '공지사항 / 댓글',
    alertMessage: '에 새로운 댓글이 등록되었습니다.',
    buttonText: '공지사항 보러가기',
  },
  4: {
    borderColor: '#FFB48C',
    alertType: '특강 / 행사',
    alertMessage: '에 새로운 스프의 참여 신청이 있습니다.',
    buttonText: '참여자 관리 이동',
  },
  5: {
    borderColor: '#FFB48C',
    alertType: '특강 / 행사',
    alertMessage: '에 참여 취소가 있습니다.',
  },
  6: {
    borderColor: '#FFB48C',
    alertType: '특강 / 행사',
    alertMessage: '신청이 승인되었습니다! 🎉',
    buttonText: '이벤트 확인하기',
  },
  7: {
    borderColor: '#FFB48C',
    alertType: '특강 / 행사',
    alertMessage: '신청이 반려되었습니다.',
    buttonText: '이벤트 확인하기',
  },
  8: {
    borderColor: '#00AC49',
    alertType: '공지사항',
    alertMessage: '새로운 공지가 등록되었습니다.',
    buttonText: '공지사항 보러가기',
  },
  9: {
    borderColor: '#FFB48C',
    alertType: '특강 / 행사',
    alertMessage: '이 곧 시작됩니다!⏳',
    buttonText: 'Zoom 링크 열기',
  },
  10: {
    borderColor: '#FFB48C',
    alertType: '특강 / 행사',
    alertMessage: `은 어떠셨나요? 💭, \n 📌 만족도 조사에 참여해 주세요!`,
    buttonText: '설문 참여하기',
  },
  11: {
    borderColor: '#81E2FF',
    alertType: '일정 관리',
    alertMessage: '캘린더 권한이 부여되었습니다. 📅',
    buttonText: '일정 관리로 이동',
  },
  12: {
    borderColor: '#81E2FF',
    alertType: '일정 관리',
    alertMessage: '캘린더 권한 부여가 필요한 매니저가 있습니다.',
    buttonText: '캘린더 권한 부여 이동',
  },
  13: {
    borderColor: '#FFB48C',
    alertType: '특강 / 행사',
    alertMessage: '가 취소되었습니다.',
  },
};

// TODO '/' 로 표시된 부분은 이동 경로 확인 후, 수정 필요
export const NOTIFICATION_ROUTE: Record<number, string> = {
  2: '/lounge/post/{id}',
  3: '/notice/post/{id}',
  4: '/',
  6: '/notice/post/{id}',
  7: '/notice/post/{id}',
  8: '/notice/post/{id}',
  9: '/',
  10: '/',
  11: '/',
  12: '/',
};
