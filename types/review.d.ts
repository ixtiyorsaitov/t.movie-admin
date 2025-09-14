import { IUser } from ".";
import { IFilm } from "./film";

export interface IReview {
  _id: string;
  user: IUser;
  film: IFilm;
  rating: number;
  text?: string;
  reply: {
    text: string;
    user: IUser | undefined;
    asAdmin: boolean
  };
  createdAt: Date;
  updatedAt: Date;
}
