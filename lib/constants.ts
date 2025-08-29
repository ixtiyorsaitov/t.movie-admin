import {
  ClipboardList,
  CreditCard,
  FilmIcon,
  GalleryHorizontal,
  Home,
  Layers,
  LayoutGrid,
  MessageSquare,
  Newspaper,
  Star,
  Tag,
  Users,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: Home,
  },
  {
    title: "Barcha filmlar",
    url: "/dashboard/films",
    icon: FilmIcon,
  },
  {
    title: "Janrlar",
    url: "/dashboard/genres",
    icon: Layers,
  },
  {
    title: "Kategoriyalar",
    url: "/dashboard/categories",
    icon: LayoutGrid,
  },
  {
    title: "Sliderlar",
    url: "/dashboard/sliders",
    icon: GalleryHorizontal,
  },
  {
    title: "Yangiliklar",
    url: "/dashboard/news",
    icon: Newspaper,
  },
  {
    title: "Yo'riqnomalar",
    icon: ClipboardList,
    url: "/dashboard/annotations",
  },
  {
    title: "Izohlar",
    icon: MessageSquare,
    url: "/dashboard/comments",
  },
  {
    title: "Sharhlar",
    icon: Star,
    url: "/dashboard/reviews",
  },
  {
    title: "Foydalanuvchilar",
    icon: Users,
    url: "/dashboard/users",
  },
  {
    title: "Narxlar",
    icon: Tag,
    url: "/dashboard/prices",
  },
  {
    title: "To'lovlar",
    icon: CreditCard,
    url: "/dashboard/payments",
  },
];
