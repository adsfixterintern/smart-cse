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
        if (!credentials?.email) {
          throw new Error("Email required");
        }

        try {
          //  Check user exists (GET /users with token লাগবে না এখানে)
          const usersRes = await fetch("http://localhost:5001/users");
          const users = await usersRes.json();

          const existingUser = users.find(
            (u: any) => u.email === credentials.email,
          );

          if (!existingUser) {
            throw new Error("User not found");
          }

          //  Password verify backend এ হচ্ছে না
          // চাইলে এখানে credentials.password === existingUser.password দিয়ে মিলাতে পারো

          //  2️Get JWT token
          const jwtRes = await fetch("http://localhost:5001/jwt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: existingUser.email,
              role: existingUser.role || "user",
            }),
          });

          const jwtData = await jwtRes.json();

          if (!jwtRes.ok) {
            throw new Error("Token generation failed");
          }

          return {
            id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role || "user",
            accessToken: jwtData.token,
          };
        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
