export type Notification = {
  id: number;
  userId: number;
  fromId: number;
  type: number;
  content: string;
  isRead: boolean;
};
