import { IEpisode, IUser, NotificationType } from ".";
import { IComment } from "./comment";
import { IFilm } from "./film";
import { IReview } from "./review";

export interface INotification {
  _id: string;
  user: IUser | null;
  film: IFilm | null;
  episode: IEpisode | null;
  reviewReply: IReview | null;
  commentReply: IComment | null;
  isRead: boolean;
  isReadBy: string[];
  isGlobal: boolean;
  type: NotificationType;
  link: string | null;
  sender: string | null;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
