import { NextResponse } from 'next/server';

export async function DELETE() {
  const response = NextResponse.json(
    {
      message: 'Success',
    },
    { status: 200 }
  );
  response.cookies.set({
    name: 'msg_id',
    value: '',
    maxAge: -1,
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
}
