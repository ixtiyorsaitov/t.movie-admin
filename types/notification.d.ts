import { IEpisode, IUser, NotificationSendingType, NotificationType } from ".";
import { IComment } from "./comment";
import { IFilm } from "./film";
import { IReview } from "./review";

export interface INotification {
  _id: string;
  sender: string | null;
  film: IFilm | null;
  episode: IEpisode | null;
  reviewReply: IReview | null;
  commentReply: IComment | null;
  type: NotificationType;
  link: string | null;
  title: string;
  message: string;

  sending: {
    type: NotificationSendingType;
    user: string | null;
    film: string | null;
  };

  stats: {
    totalSent: number;
    totalRead: number;
    readPercentage: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IUserNotification {
  _id: string;
  user: IUser;
  notification: INotification;
  isRead: boolean;
  readAt: string;
  createdAt: string;
  updatedAt: string;
}
