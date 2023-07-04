import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const cookieTheme = 'theme';

  const theme = req.cookies.get(cookieTheme)?.value;

  const response = NextResponse.next();

  if (!theme) {
    response.cookies.set(cookieTheme, 'light', {
      maxAge: 24 * 60 * 60 * 7,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  return response;
}
