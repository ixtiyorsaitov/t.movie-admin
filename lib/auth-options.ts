import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./mongoose";
import Admin from "@/models/admin.model";

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

      const allowedAdminEmails =
        process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS?.split(",").map((email) =>
          email.trim()
        );

      if (!allowedAdminEmails?.includes(user.email!)) {
        // false qaytarsa -> pages.error ga yo‘naltiriladi
        return "/access-denied";
      }

      const existingUser = await Admin.findOne({ email: user.email });

      if (!existingUser) {
        await Admin.create({
          email: user.email,
          fullName: user.name || "",
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
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_JWT_SECRET!,
  },

  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET!,

  debug: process.env.NODE_ENV === "development",
};
