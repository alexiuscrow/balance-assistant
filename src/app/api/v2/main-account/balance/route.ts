import {NextRequest, NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  if (!process.env.MONO_TOKEN) {
    return new Response(
      JSON.stringify({ error: `The MONO_TOKEN not found.` }), {
        status: 500,
      });
  } else if (!searchParams.has('account')) {
    return new Response(
      JSON.stringify({ error: `The account params is not defined.` }), {
      status: 400,
    });
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
    console.log('Searching for', `'${type}s'`, `'${accountId}'`);
    console.log('Account not found in', data[`${type}s`]);
    console.log('Data', data);
    return new Response(
      JSON.stringify({ error: `Account not found. Searched for the ${accountId}.`, available: data[`${type}s`] }), {
      status: 400,
    });
  }

  let myOwnBalance: number;

  if (type === 'account') {
    const {balance, creditLimit} = item;
    myOwnBalance = balance - creditLimit;
  } else {
    const {balance} = item;
    myOwnBalance = balance;
  }

  return NextResponse.json({
    data: myOwnBalance / 100,
    date: new Date().toISOString()
  });
}
