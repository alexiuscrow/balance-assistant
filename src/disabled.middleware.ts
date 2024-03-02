import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
	matcher: ['/api/v1/(.*)']
};

export const middleware = async (req: NextRequest) => {
	const token = (req.headers.get('authorization') || '').replace('Bearer ', '');

  if (token !== process.env.APP_TOKEN) {
    return Response.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }

  return NextResponse.next();
};
