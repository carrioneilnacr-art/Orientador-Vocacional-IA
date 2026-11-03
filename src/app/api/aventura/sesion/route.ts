import {randomUUID} from 'node:crypto';
import {NextRequest,NextResponse} from 'next/server';
import {signGuestTestSession} from '@/lib/studentAuth';
import {ADVENTURE_COOKIE,adventureToken} from '@/modules/adventure/infrastructure/requestIdentity';
import {checkRequestRateLimit,quotaJson} from '@/lib/requestRateLimit';
export async function POST(req:NextRequest){
 if(req.headers.get('origin')!==new URL(req.url).origin)return NextResponse.json({error:'Origen no permitido.'},{status:403});
 const quota=await checkRequestRateLimit(req,'adventure-start');
 const json=(body:unknown,init?:ResponseInit)=>quotaJson(body,quota,init);
 if(!quota.allowed)return json({error:'Intenta más tarde.'},{status:quota.status});
 let restart=false;
 try{const text=await req.text();if(text.length>100)return json({error:'Demasiados datos.'},{status:413});if(text)restart=JSON.parse(text).restart===true;}catch{return json({error:'JSON inválido.'},{status:400});}
 const token=(!restart&&adventureToken(req))||`ADV-${randomUUID()}`;
 const signed=signGuestTestSession(token);
 if(!signed)return json({error:'El guardado del servidor no está configurado.'},{status:503});
 const response=json({ready:true});
 response.cookies.set(ADVENTURE_COOKIE,signed,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:30*86400});
 return response;
}
