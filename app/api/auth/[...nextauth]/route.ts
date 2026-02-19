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
  if (!credentials?.email || !credentials?.password) return null;

  try {
    const res = await fetch("http://localhost:5001/login", { // পোর্ট ঠিক আছে কি না দেখুন
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await res.json();

    if (res.ok && data.user) {
      return {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        accessToken: data.token,
      };
    }
    
    // যদি ব্যাকএন্ড থেকে এরর আসে
    throw new Error(data.message || "Invalid credentials");
  } catch (error: any) {
    throw new Error(error.message);
  }
}
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // ৩০ দিন (আপনার 'Remember Me' এর সাথে সামঞ্জস্য রেখে)
  },

  callbacks: {
    async jwt({ token, user }) {
      // লগইন করার সময় ইউজার ডাটা টোকেনে সেট করা
      if (user) {
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // ক্লায়েন্ট সাইডে সেশন এক্সেস করার সময় ডাটাগুলো পাস করা
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
    error: "/login", // এরর হলে লগইন পেজেই পাঠাবে
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };