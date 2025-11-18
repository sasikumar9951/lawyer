import { withAuth } from "next-auth/middleware";

// export default withAuth(function middleware() {}, {
//   callbacks: {
//     authorized: ({ token, req }) => {
//       const pathname = req.nextUrl.pathname;
//       // console.log(pathname);
//       if (pathname === "/admin" || pathname === "/admin/") return true;
//       return token?.role === "admin";
//     },
//   },
// });

export default withAuth(function middleware() {}, {
  pages: { signIn: "/admin" },
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      if (pathname === "/admin" || pathname === "/admin/") return true;
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
