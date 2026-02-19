import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
//   const response = NextResponse.next();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name, value, options) {
//           response.cookies.set({ name, value, ...options });
//         },
//         remove(name, options) {
//           response.cookies.set({ name, value: "", ...options });
//         },
//       },
//     }
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const adminEmails = process.env.ADMIN_EMAILS
//     ?.split(",")
//     .map((e) => e.trim().toLowerCase());

//   if (request.nextUrl.pathname.startsWith("/admin")) {
//     if (!user || !adminEmails?.includes(user.email?.toLowerCase() || "")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   return response;
}

export const config = {
//   matcher: ["/admin/:path*"],
};
