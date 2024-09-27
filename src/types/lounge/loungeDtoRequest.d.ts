import { LoungeDto } from './loungeDto';

export namespace LoungeDtoRequest {
  export interface PostLoungeProject
    extends Pick<
      LoungeDto.Lounge,
      'recruitmentCount' | 'meetingType' | 'contactMethod'
    > {
    recruitmentType: string;
    startDate: string;
    endDate: string;
    positions: number[];
    requiredStacks: number[];
    projectTitle: string;
    projectDescription: string;
  }

  export interface GetLoungeProjects {
    techStack?: number[];
    position?: number[];
    keyword?: string;
    onlyScraped?: boolean;
    meetingType?: string;
    sort?: string;
    search?: string;
    page?: number;
    size?: number;
  }
}
