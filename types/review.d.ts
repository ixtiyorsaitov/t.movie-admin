import { IUser } from ".";
import { IFilm } from "./film";

export interface IReview {
  _id: string;
  user: IUser;
  film: IFilm;
  rating: number;
  text?: string;
  createdAt: Date;
  updatedAt: Date;
}
