import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/api/webhook(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/",
  "/dashboard(.*)",
  "/forum(.*)",
]);
export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();
  if (isProtectedRoute(req)) await auth.protect();
});
