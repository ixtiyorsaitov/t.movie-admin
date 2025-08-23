export enum FilmType {
  SERIES = "series",
  MOVIE = "movie",
}
export enum ROLE {
  SUPERADMIN = "superAdmin",
  ADMIN = "admin",
  MEMBER = "member",
  USER = "user",
}
export enum MemberType {
  ACTOR = "actor",
  TRANSLATOR = "translator",
}
export interface ChildProps {
  children: React.ReactNode;
}

export interface IError extends Error {
  response: { data: { message: string } };
}

export interface IFilm {
  _id: string;
  title: string;
  description: string;
  type: FilmType;
  category: ICategory;
  rating: {
    avarage: number;
    total: number;
    count: number;
  };
  meta: {
    likes: number;
    watchList: number;
  };
  slug: string;
  published: boolean;
  images: {
    image: ImageType;
    additionImages?: ImageType[];
    backgroundImage: ImageType;
  };
  video: IVideo;
  genres: IGenre[];
  seasons: ISeason[];
  createdAt: Date;
  updatedAt: Date;
}

export interface INews {
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  image?: ImageType;
  tags?: string[];
  published: boolean;
  expireAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISlider {
  film: IFilm;
  _id: string;
}

export interface ISeason {
  _id: string;
  seasonNumber: number;
  title: string;
  description: string;
  episodes: IEpisode[];
  createdAt: Date;
  updatedAt: Date;
}
export interface IEpisode {
  _id: string;
  title: string;
  description: string;
  video: IVideo;
  season: string;
  episodeNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideo {
  _id: string;
  url: string;
  name: string;
  resolution: "360p" | "480p" | "720p" | "1080p" | "4k";
  size: string;
  duration: string;
}

type ImageType = {
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

export interface IComment {
  user: IUser;
  containSpoiler: boolean;
  film: IFilm;
  content: string;
  parent: IComment | null;
  likes: number;
  score: number;
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
}

export interface INotification {
  _id: string;
  film: IFilm;
  episode: number;
  season: number;
  read: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
}
export interface IGenre {
  _id: string;
  name: string;
  slug: string;
}

export enum BUCKETS {
  BACKGROUNDS = "backgrounds",
  IMAGES = "images",
  MOVIES = "movies",
  SERIES = "series",
  NEWS = "news",
}
