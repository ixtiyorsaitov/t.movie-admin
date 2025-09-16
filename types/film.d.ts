export interface IFilm {
  _id: string;
  title: string;
  description: string;
  type: FilmType;
  category: ICategory;
  rating: {
    average: number;
    total: number;
    count: number;
  };
  meta: {
    likes: number;
    watchList: number;
    views: {
      total: number;
      unique: number;
    };
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
  episodes: IEpisode[];
  disableComments: boolean;
  createdAt: Date;
  updatedAt: Date;
}
