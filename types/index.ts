export enum FilmType {
  SERIES = "series",
  MOVIE = "movie",
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
  genres: IGenre[];
  seasons: ISeason[];
  createdAt: Date;
  updatedAt: Date;
}

interface ISeason {
  _id: string;
  seasonNumber: number;
  title: string;
  description: string;
  episodes: IEpisode[];
  createdAt: Date;
  updatedAt: Date;
}
interface IEpisode {
  _id: string;
  title: string;
  description: string;
  video: {
    url: string;
    resolution: "360p" | "480p" | "720p" | "1080p" | "4k";
    size: string;
    duration: string;
  };
  episodeNumber: number;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
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
}
