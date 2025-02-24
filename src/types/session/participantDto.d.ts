export type ParticipantTitleData = string[];

export type ParticipantDetail = {
  id: number;
  participantId: number;
  postId: number;
  linkedId: number;
  createdAt: string;
  updatedAt: string;
  comments: Array<{
    id: number;
    content: string;
    user: {
      nickname: string;
      email: string;
      profileImageUrl: string;
      role: string;
      status: string;
      isEssential: boolean;
      createdAt: string;
      updatedAt: string;
      id: number;
      name: string;
      refreshToken: string;
      lastLoginDateTime: string;
      marketingConsent: boolean;
      userJobList: Array<{
        job: {
          name: string;
          isActive: boolean;
          id: number;
        };
        user: string;
        createdAt: string;
        updatedAt: string;
        id: number;
      }>;
      userDomainList: Array<{
        domain: {
          name: string;
          isActive: boolean;
          id: number;
          userDomainList: string[];
        };
        user: string;
        createdAt: string;
        updatedAt: string;
        id: number;
      }>;
      userTechStackList: Array<{
        techStack: {
          id: number;
          name: string;
          isActive: boolean;
          path: string;
          jobName: string;
        };
        user: string;
        createdAt: string;
        updatedAt: string;
        id: number;
      }>;
      userCourseList: Array<{
        course: {
          title: string;
          startDate: string;
          endDate: string;
          campus: {
            name: string;
            address: string;
            createdAt: string;
            updatedAt: string;
            id: number;
          };
        };
        user: string;
        createdAt: string;
        updatedAt: string;
        id: number;
      }>;
      userCampusList: Array<{
        campus: {
          name: string;
          address: string;
          createdAt: string;
          updatedAt: string;
          id: number;
        };
        user: string;
        createdAt: string;
        updatedAt: string;
        id: number;
      }>;
    };
  }>;
};

export interface Participant {
  id: number;
  name: string;
  nickName: string;
  profileImageUrl: string;
  status: SessionStatus;
}
interface ParticipantListModalProps {
  onClose: () => void;
  sessionId: number;
}

export type ParticipantDetailsData = ParticipantDetail[];
