export interface SessionCardProps {
  session: {
    id: number;
    title: string;
    location: string;
    date: string;
    meetingType: string;
    currentStatus: string;
    startTime: date;
    endTime: date;
    participantId: number;
    applicationStartDateTime: date;
    applicationEndDateTime: date;
  };
  showToast: (message: string, duration?: number) => void;
}

export interface Session {
  id: number;
  title: string;
  content: string;
  noticeType: string;
  viewCount: number;
  status: string;
  createdAt: string;
  applicationStartDateTime: string;
  applicationEndDateTime: string;
  meetingPlace: string;
  meetingType: string;
  satisfactionSurvey: string;
  participantCapacity: number;
  writer: {
    userId: number;
    userName: string;
    profileUrl: string;
    role: string;
  };
  targetCourses: Array<{
    courseId: number;
    courseName: string;
  }>;
  sessions: Array<{
    sessionId: number;
    sessionStartDateTime: string;
    sessionEndDateTime: string;
    participantCount: number;
    currentStatus: SessionStatus;
  }>;
}
