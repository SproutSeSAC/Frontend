import type { LoungeDtoResponse } from './LoungeDtoResponse';
import type { LoungeDtoRequest } from './loungeDtoRequest';

import { Progress, Ptype } from '@/constants';

export namespace LoungeDto {
  export interface Lounge {
    isScraped: boolean;
    id: number;
    title: string;
    description: string;
    recruitmentCount: number;
    meetingType: Progress;
    contactMethod: string;
    recruitmentStart: string;
    recruitmentEnd: string;
    viewCount: number;
    positionNames: string[];
    ptype: Ptype;
  }

  export import Request = LoungeDtoRequest;
  export import Response = LoungeDtoResponse;
}
