// status
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'INACTIVE';
export const STATUS_END = 'END';

export type StatusBase =
  | typeof STATUS_ACTIVE
  | typeof STATUS_INACTIVE
  | typeof STATUS_END;

export const STATUS_WAIT = 'WAIT';
export const STATUS_PARTICIPANT = 'PARTICIPANT';
export const STATUS_REJECT = 'REJECT';

export type SessionStatus =
  | typeof STATUS_WAIT
  | typeof STATUS_PARTICIPANT
  | typeof STATUS_REJECT;

// 캠퍼스 정보
export const CAMPUS_SEONGBUK = 'SEONGBUK';
export const CAMPUS_DOBONG = 'DOBONG';
export const CAMPUS_GANGBUK = 'GANGBUK';
export const CAMPUS_DONGDAEMUN = 'DONGDAEMUN';

export type CampusType =
  | typeof CAMPUS_SEONGBUK
  | typeof CAMPUS_DOBONG
  | typeof CAMPUS_GANGBUK
  | typeof CAMPUS_DONGDAEMUN;

// NOTE: 위의 캠퍼스 정보와 아래 리스트 삭제
export const campusList: Array<{
  id: number;
  name: string;
  key: CampusType;
  latitude: string;
  longitude: string;
}> = [
  {
    id: 1,
    name: '성북캠퍼스',
    key: CAMPUS_SEONGBUK,
    latitude: '37.6043803',
    longitude: '127.0366509',
  },
  {
    id: 2,
    name: '도봉캠퍼스',
    key: CAMPUS_DOBONG,
    latitude: '37.6544068',
    longitude: '127.0497957',
  },
  {
    id: 3,
    name: '강북캠퍼스',
    key: CAMPUS_GANGBUK,
    latitude: '37.6558908',
    longitude: '127.0135631',
  },
  {
    id: 4,
    name: '동대문캠퍼스',
    key: CAMPUS_DONGDAEMUN,
    latitude: '37.5773150',
    longitude: '127.0430027',
  },
];

// 서비스 종류
export const serviceType = {
  MEAL: '한끼팟',
  NOTICE: '공지사항',
  PROJECT: '프로젝트',
  STUDY: '스터디',
  STORE: '맛집',
} as const;

export type ServiceType = typeof serviceType;
