import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token || body.idToken;

    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing Firebase authentication token.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Firebase Admin Session established successfully.',
    });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Authentication session error' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Admin session terminated successfully.',
  });

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
