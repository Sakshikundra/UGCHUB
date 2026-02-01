export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnSignup = nextUrl.pathname.startsWith("/signup");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && (isOnLogin || isOnSignup)) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Configured in lib/auth.js
  secret: process.env.NEXTAUTH_SECRET,
};
