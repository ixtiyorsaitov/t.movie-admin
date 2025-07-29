import { FilmType, IFilm } from "@/types";

export const user = {
  imageUrl: "https://github.com/shadcn.png",
  fullName: "Ixtiyor Saitov",
  email: "info@ixtiyor.com",
};

export const FILMS: IFilm[] = [
  {
    _id: "1",
    title: "Attack on Titan",
    description:
      "In a world where humanity is on the brink of extinction from Titans, Eren and his friends fight back.",
    type: FilmType.SERIES,
    rating: {
      avarage: 8.9,
      total: 4450,
      count: 500,
    },
    meta: {
      likes: 1200,
      watchList: 350,
    },
    slug: "attack-on-titan",
    published: true,
    image: "/assests/aot.png",
    additionImages: ["/assests/aot1.jpg", "/assests/aot2.jpg"],
    backgroundImage: "/assests/aot-bg.jpg",
    genres: [
      {
        id: 1,
        name: "Action",
        slug: "action",
      },
      {
        id: 17,
        name: "Drama",
        slug: "drama",
      },
    ],
  },
  {
    _id: "2",
    title: "Jujutsu Kaisen",
    description:
      "A high school student joins a secret organization to fight curses and save people from supernatural threats.",
    type: FilmType.SERIES,
    rating: {
      avarage: 8.7,
      total: 3900,
      count: 450,
    },
    meta: {
      likes: 950,
      watchList: 410,
    },
    slug: "jujutsu-kaisen",
    published: true,
    image: "/assests/jjk.jpg",
    additionImages: ["/assests/jjk1.jpg"],
    backgroundImage: "/assests/jjk-bg.jpg",
    genres: [
      {
        id: 1,
        name: "Action",
        slug: "action",
      },
      {
        id: 11,
        name: "Animation",
        slug: "animation",
      },
    ],
  },
  {
    _id: "3",
    title: "Demon Slayer",
    description:
      "Tanjiro Kamado becomes a demon slayer after demons attack his family.",
    type: FilmType.SERIES,
    rating: {
      avarage: 8.6,
      total: 3600,
      count: 420,
    },
    meta: {
      likes: 1120,
      watchList: 500,
    },
    slug: "demon-slayer",
    published: true,
    image: "/assests/ds.jpg",
    backgroundImage: "/assests/ds-bg.jpg",
    genres: [
      {
        id: 3,
        name: "Fantasy",
        slug: "fantasy",
      },
      {
        id: 6,
        name: "Adventure",
        slug: "adventure",
      },
    ],
  },
  {
    _id: "4",
    title: "Naruto",
    description:
      "Tanjiro Kamado becomes a demon slayer after demons attack his family.",
    type: FilmType.SERIES,
    rating: {
      avarage: 8.6,
      total: 3600,
      count: 420,
    },
    meta: {
      likes: 1120,
      watchList: 500,
    },
    slug: "naruto",
    published: true,
    image: "/assests/naruto.jpg",
    backgroundImage: "/assests/naruto-bg.jpg",
    genres: [
      {
        id: 3,
        name: "Fantasy",
        slug: "fantasy",
      },
      {
        id: 6,
        name: "Adventure",
        slug: "adventure",
      },
    ],
  },
  {
    _id: "5",
    title: "Your name",
    description:
      "Tanjiro Kamado becomes a demon slayer after demons attack his family.",
    type: FilmType.MOVIE,
    rating: {
      avarage: 8.6,
      total: 3600,
      count: 420,
    },
    meta: {
      likes: 1120,
      watchList: 500,
    },
    slug: "your-name",
    published: true,
    image: "/assests/yn.jpg",
    backgroundImage: "/assests/yn-bg.jpg",
    genres: [
      {
        id: 3,
        name: "Fantasy",
        slug: "fantasy",
      },
      {
        id: 6,
        name: "Adventure",
        slug: "adventure",
      },
    ],
  },
  {
    _id: "6",
    title: "One Piece",
    description:
      "Monkey D. Luffy sails the Grand Line in search of the ultimate treasure, the One Piece.",
    type: FilmType.SERIES,
    rating: {
      avarage: 9.1,
      total: 6200,
      count: 700,
    },
    meta: {
      likes: 2000,
      watchList: 600,
    },
    slug: "one-piece",
    published: true,
    image: "/assests/op.jpg",
    backgroundImage: "/assests/op-bg.jpg",
    genres: [
      {
        id: 6,
        name: "Adventure",
        slug: "adventure",
      },
      {
        id: 2,
        name: "Comedy",
        slug: "comedy",
      },
    ],
  },
];
