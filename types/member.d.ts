import { IUser, MemberType } from ".";

export interface IMember {
  _id: string;
  user: IUser;
  type: MemberType[];
  createdAt: string;
  updatedAt: string;
}
