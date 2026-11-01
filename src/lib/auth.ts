import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const inputEmail = credentials.email.trim().toLowerCase();
        const inputPassword = credentials.password;

        const envAdminEmail = (process.env.ADMIN_EMAIL || "sabazulfiqar926@gmail.com").trim().toLowerCase();
        const envAdminPassword = process.env.ADMIN_PASSWORD || "AdminPassword2026!";

        // 1. Check against environment variables directly
        if (inputEmail === envAdminEmail && inputPassword === envAdminPassword) {
          return {
            id: "admin_env",
            email: envAdminEmail,
            name: "Saba Zulfiqar",
            role: "admin",
          };
        }

        // 2. Check against Database AdminUser record
        try {
          const user = await prisma.adminUser.findUnique({
            where: { email: inputEmail },
          });

          if (user && user.passwordHash) {
            const isValid = await bcrypt.compare(inputPassword, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: "admin",
              };
            }
          }
        } catch {
          // Database connection fallback
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role?: string }).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "portfolio-super-secret-key-change-this-in-production-min-32-chars",
};
