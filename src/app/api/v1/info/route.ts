import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	const monores = await fetch('https://api.monobank.ua/personal/client-info', {
    headers: {
      'X-Token': process.env.MONO_TOKEN
    }
  });
  const data = await monores.json();

  const account = data.accounts.find(({id}) => id === process.env.MONO_ACCOUNT);

  if (!account) {
    return NextResponse.error();
  }

  const {balance, creditLimit} = account;
  const myOwnBalance = balance - creditLimit;

	return NextResponse.json({balance: myOwnBalance / 100});
}
