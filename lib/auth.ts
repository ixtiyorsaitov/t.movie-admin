import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectToDatabase } from "./mongoose";
import User from "@/models/user.model";
import { ROLE } from "@/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

      // Agar user mavjud bo'lsa va roli ADMIN yoki SUPER_ADMIN bo'lsa
      if (
        existingUser &&
        (existingUser.role === ROLE.ADMIN ||
          existingUser.role === ROLE.SUPERADMIN)
      ) {
        return true;
      }

      // Agar user mavjud bo'lmasa → ro'yxatdan o'tayapti
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
          return false; // v5 da faqat boolean qaytarish kerak
        }
      }

      // Qolganlar uchun ruxsat yo'q
      return false;
    },
    async session({ session, token }) {
      await connectToDatabase();

      const user = await User.findOne({ email: session.user?.email });

      if (user) {
        session.currentUser = user;
      }

      return session;
    },
    async jwt({ token, user }) {
      // Birinchi marta login qilganda user ma'lumotlarini tokenga qo'shish
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NODE_ENV === "development",
});
