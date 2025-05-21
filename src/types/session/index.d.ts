import { appliedSessionStatusObj, sessionStatusObj } from '@/constants';

export * from '@/types/session/participantDto';
export * from '@/types/session/sessionDto';

/** 세션의 상태 */
export type SessionStatus = typeof sessionStatusObj;
export type SessionStatusKey = keyof SessionStatus;
export type SessionStatusValue = SessionStatus[SessionStatusKey];

/** 훈련생의 신청 세션 상태 */
export type AppliedSessionStatusObj = typeof appliedSessionStatusObj;
export type AppliedSessionStatusKey = keyof AppliedSessionStatusObj;
export type AppliedSessionStatusValue =
  AppliedSessionStatusObj[AppliedSessionStatusKey];

export type SessionFilter = {
  page: number;
  size: number;
  keyword: string;
  applicationStatus?: 'ACTIVE' | 'INACTIVE';
};
