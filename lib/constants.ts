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
  Users2,
  Bell,
} from "lucide-react";

export const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN_URI!;
export const fiveMinutes = 5 * 60 * 1000;
export const fiveMinutesInSeconds = 5 * 60;

export const sidebarItems = [
  {
    title: "Umumiy",
    url: "/dashboard/overview",
    icon: Home,
  },
  {
    title: "Barcha filmlar",
    url: "/dashboard/films",
    icon: FilmIcon,
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
    title: "Bildirishnomalar",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Sharhlar",
    icon: Star,
    url: "/dashboard/reviews",
  },
  {
    title: "Izohlar",
    icon: MessageSquare,
    url: "/dashboard/comments",
  },
  {
    title: "Anotatsiyalar",
    icon: ClipboardList,
    url: "/dashboard/annotations",
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
    title: "Foydalanuvchilar",
    icon: Users,
    url: "/dashboard/users",
  },
  {
    title: "Hodimlar",
    icon: Users2,
    url: "/dashboard/members",
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
