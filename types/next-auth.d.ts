import { IUser } from "@/interfaces/user.interface";

declare module "next-auth" {
  interface Session {
    currentAdmin: IUser;
  }
}
