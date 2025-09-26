import { IUser } from ".";
import { IFilm } from "./film";

export interface IComment {
  user: IUser;
  film: IFilm;
  content: string;
  parent: IComment | null | string;
  likes: number;
  reply: {
    comment: IComment;
    user: IUser;
    asAdmin: boolean;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export type ReplyFilterTypeComments = "all" | "replied" | "not-replied";
export type RatingFilterTypeComments = "all" | "high" | "medium" | "low";
export type SortByTypeComments = "newest" | "oldest" | "popular";
