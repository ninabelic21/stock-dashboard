import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // This is the actual security boundary: only one Google account may
      // ever get a session, independent of any platform-level protection.
      return user.email === process.env.ALLOWED_EMAIL;
    },
  },
});
