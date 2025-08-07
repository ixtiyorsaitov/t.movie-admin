import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Admin from "@/database/admin.model";
import { connectToDatabase } from "./mongoose";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await connectToDatabase();

      const allowedAdminEmail = process.env.ALLOWED_ADMIN_EMAIL!;

      // Faqat shu bitta emailga ruxsat beramiz
      if (user.email !== allowedAdminEmail) {
        // Bu avtomatik `/api/auth/error?error=AccessDenied` ga redirect qiladi
        throw new Error("AccessDenied");
      }

      // Ma'lumotlar bazasida yo'q bo'lsa ham faqat shu email bo'lsa yaratamiz
      const existingUser = await Admin.findOne({ email: user.email });

      if (!existingUser) {
        await Admin.create({
          email: user.email,
          name: user.name || "",
          profileImage: user.image,
        });
      }

      return true;
    },

    async session({ session }) {
      await connectToDatabase();
      const admin = await Admin.findOne({ email: session.user?.email });

      session.currentAdmin = admin;

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET!,
  },

  secret: process.env.NEXTAUTH_SECRET!,

  debug: process.env.NODE_ENV === "development",
};
