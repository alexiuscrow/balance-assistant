import {NextRequest, NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  if (!process.env.MONO_TOKEN || !searchParams.has('account')) {
    return NextResponse.error();
  }

  const accountId = searchParams.get('account');
  const type = searchParams.has('type') ? searchParams.get('type') : 'account';

  const headers: HeadersInit = {
    'X-Token': process.env.MONO_TOKEN
  };

  const monores = await fetch('https://api.monobank.ua/personal/client-info', {headers});
  const data = await monores.json();

  const item = data[`${type}s`]?.find(({id}: { id: string }) => id === accountId);

  if (!item) {
    return NextResponse.error();
  }

  const {balance, creditLimit} = item;
  const myOwnBalance = balance - creditLimit;

  return NextResponse.json({
    data: myOwnBalance / 100,
    date: new Date().toISOString()
  });
}
