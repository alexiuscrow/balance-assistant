import {NextResponse} from 'next/server';
import {NextApiRequest} from 'next';

export const dynamic = 'force-dynamic';

export async function GET(req: NextApiRequest) {
  const {account: accountId, type = 'account'} = req.query;

  if (!process.env.MONO_TOKEN || !accountId) {
    return NextResponse.error();
  }


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
