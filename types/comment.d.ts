export interface IComment {
  user: IUser;
  containSpoiler: boolean;
  film: IFilm;
  content: string;
  parent: IComment | null;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
}
