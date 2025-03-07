import { NextMiddleware, NextResponse } from "next/server";

export const middleware: NextMiddleware = () => {
  const response = NextResponse.next();
  response.cookies.set("csrfToken", (Math.random() * 100000000000000000).toString(), {
    secure: process.env.NODE_ENV === "production",
  });

  return response;
};
