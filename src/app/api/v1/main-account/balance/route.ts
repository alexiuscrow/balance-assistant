import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.MONO_TOKEN || !process.env.MONO_ACCOUNT) {
    return NextResponse.error();
  }

  const headers: HeadersInit = {
    'X-Token': process.env.MONO_TOKEN
  };

	const monores = await fetch('https://api.monobank.ua/personal/client-info', { headers });
  const data = await monores.json();

  const account = data.accounts.find(({id} : {id: string}) => id === process.env.MONO_ACCOUNT);

  if (!account) {
    return NextResponse.error();
  }

  const {balance, creditLimit} = account;
  const myOwnBalance = balance - creditLimit;

	return NextResponse.json({data: myOwnBalance / 100});
}
