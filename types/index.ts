import { IFilm } from "./film";

export enum FilmType {
  SERIES = "series",
  MOVIE = "movie",
}

export enum NotificationType {
  SYSTEM = "system",
  FILM = "film",
  EPISODE = "episode",
  COMMENT_REPLY = "comment_reply",
  REVIEW_REPLY = "review_reply",
  PRIVATE='private'
}

export enum PeriodType {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}
export enum ROLE {
  SUPERADMIN = "superAdmin",
  ADMIN = "admin",
  USER = "user",
}
export enum MemberType {
  ACTOR = "actor",
  TRANSLATOR = "translator",
}
export const MemberTypes = [MemberType.ACTOR, MemberType.TRANSLATOR];
export interface ChildProps {
  children: React.ReactNode;
}

export interface IResponse<T> {
  success: boolean;
  data?: T;
  datas?: T[];
  error?: string;
  pagination?: PaginationType;
}

export interface IError extends Error {
  response: { data: { message: string } };
}

export interface IEpisode {
  _id: string;
  title: string;
  description: string;
  video: IVideo;
  film: IFilm;
  episodeNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationType {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface INews {
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  image: ImageType | null;
  tags?: string[];
  published: boolean;
  expireAt?: Date | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISlider {
  film: IFilm;
  _id: string;
}

export interface IVideo {
  _id: string;
  url: string;
  name: string;
  resolution: "360p" | "480p" | "720p" | "1080p" | "4k";
  size: string;
  duration: string;
}

export type ImageType = {
  url: string;
  name: string;
};

export interface IUser {
  _id: string;
  name: string;
  meta: {
    likes: string[];
    watchedList: string[];
    submitList: string[];
  };
  role: ROLE;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
export interface IGenre {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export enum BUCKETS {
  BACKGROUNDS = "backgrounds",
  IMAGES = "images",
  EPISODES = "episodes",
  NEWS = "news",
}
