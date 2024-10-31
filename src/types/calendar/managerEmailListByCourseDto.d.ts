export namespace ManagerEmailListByCourseDto {
  export type Get = ManagerEmailByCourse[];

  type ManagerEmailByCourse = {
    id: number;
    email: string;
    nickname: string;
    roleType: KeyOfRole;
  };
}
