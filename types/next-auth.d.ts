import { IUser } from ".";

declare module "next-auth" {
  interface Session {
    currentUser: IUser;
    isDeleted: boolean;
  }
}
