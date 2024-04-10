import { verifyJwt } from "@/libs/auth";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/profile", "/homepage", "/chat", "/chat/[id]"];
const isProtectedPath = (path: string) => PROTECTED_PATHS.includes(path);

export async function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  const { value: token } = cookies.get("token") || { value: null };
  const hasVerifiedToken = token && (await verifyJwt(token));
  const isProtected = isProtectedPath(request.nextUrl.pathname);

  if (isProtected && !hasVerifiedToken) {
    const response = NextResponse.redirect(new URL("/sign-in", nextUrl));
    response.cookies.delete("token");
    return response;
  }

  if (!hasVerifiedToken) {
    const response = NextResponse.next();
    response.cookies.delete("token");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("x-user-id", hasVerifiedToken.id as string);
  return response;
}
