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
