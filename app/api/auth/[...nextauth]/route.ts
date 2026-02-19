import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch("http://localhost:5001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          // যদি রেসপন্স ওকে হয় এবং ইউজার ডাটা থাকে
          if (res.ok && data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              role: data.user.role || "student",
              accessToken: data.token,
              name: data.user.name || "User"
            };
          }
          
          // এরর থ্রো না করে সরাসরি null রিটার্ন করা নিরাপদ অথবা এরর অবজেক্ট পাঠানো
          return null; 
        } catch (error: any) {
          console.error("Auth Fetch Error:", error);
          return null;
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.id = (user as any).id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", 
  },

  // নিশ্চিত করুন আপনার .env ফাইলে NEXTAUTH_SECRET আছে
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
});

export { handler as GET, handler as POST };