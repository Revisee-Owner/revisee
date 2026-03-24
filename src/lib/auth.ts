import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        await db.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name || undefined,
            image: user.image || undefined,
          },
          create: {
            email: user.email,
            name: user.name || "Student",
            image: user.image || null,
          },
        });
      } catch (error) {
        console.error("Error saving user:", error);
      }
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        try {
          const dbUser = await db.user.findUnique({
            where: { email: token.email },
          });
          if (dbUser) {
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};