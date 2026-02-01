import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { compare } from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { UserRole } from "@/lib/validations";

async function getUser(email) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  return data;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.id && session.user) {
        session.user.id = token.id; // Correctly use UUID from DB if available
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUser(token.email);
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const supabase = getSupabaseAdmin();
        
        // Check if user exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          // If this is a new user, we'll create them during onboarding
          // or we can create them here with a default role if needed
          // For now, allow sign in to proceed to onboarding
          return true;
        }
      }
      return true;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user) return null;
          if (!user.password_hash) return null; // OAuth user

          const passwordsMatch = await compare(password, user.password_hash);
          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
