import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { db } from "@/lib/db"; // Apnar database connection code ekhane thakbe
// import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. Database theke user khujun
        // const user = await db.user.findUnique({ where: { email: credentials.email } });
        // if (!user) throw new Error("No user found");

        // 2. Password check korun
        // const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        // if (!isPasswordCorrect) throw new Error("Invalid password");

        // Temporary return for testing
        return { id: "1", name: "Imam", email: credentials.email, role: "student" };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };