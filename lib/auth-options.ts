import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./mongoose";
import User from "@/models/user.model";
import { ROLE } from "@/types";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth",
    error: "/access-denied",
  },

  callbacks: {
    async signIn({ user }) {
      await connectToDatabase();

      const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL!;

      const existingUser = await User.findOne({ email: user.email });

      // Agar user mavjud bo‘lsa va roli ADMIN yoki SUPER_ADMIN bo‘lsa
      if (
        existingUser &&
        (existingUser.role === ROLE.ADMIN ||
          existingUser.role === ROLE.SUPERADMIN)
      ) {
        return true;
      }

      // Agar user mavjud bo'lmasa → ro‘yxatdan o‘tayapti
      if (!existingUser) {
        if (user.email === SUPER_ADMIN_EMAIL) {
          // SuperAdmin sifatida yaratish
          await User.create({
            email: user.email,
            name: user.name,
            avatar: user.image,
            role: ROLE.SUPERADMIN,
          });
          return true;
        } else {
          // Email mos kelmasa
          return "/access-denied";
        }
      }

      // Qolganlar uchun ruxsat yo'q
      return "/access-denied";
    },

    async session({ session }) {
      await connectToDatabase();
      const user = await User.findOne({ email: session.user?.email });
      session.currentUser = user;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_JWT_SECRET!,
  },

  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET!,

  debug: process.env.NODE_ENV === "development",
};
