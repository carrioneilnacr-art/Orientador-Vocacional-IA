import {NextRequest,NextResponse} from 'next/server';
import {getActiveStaffSessionFromRequest} from '@/lib/staffAuth';
import {listExplorations} from '@/modules/school-portal/application/listExplorations';
import {explorationReader} from '@/modules/school-portal/infrastructure/explorationReader';
import {mayReadIndividualExplorations} from '@/modules/school-portal/domain/explorationAccess';
export async function GET(req:NextRequest){
 const identity=await getActiveStaffSessionFromRequest(req);
 if(!identity)return NextResponse.json({error:'Sesión no iniciada.'},{status:401});
 if(!mayReadIndividualExplorations(identity.role))return NextResponse.json({error:'Tu rol no permite consultar respuestas individuales.'},{status:403});
 const cursor=req.nextUrl.searchParams.get('before');
 if(cursor&&(!/^\d{4}-\d{2}-\d{2}T/.test(cursor)||!Number.isFinite(Date.parse(cursor))))return NextResponse.json({error:'Cursor inválido.'},{status:400});
 try{const entries=await listExplorations(explorationReader,identity,cursor?new Date(cursor):undefined);return NextResponse.json({entries,nextBefore:entries.length===20?entries[entries.length-1].createdAt:null},{headers:{'Cache-Control':'private, no-store'}});}
 catch{return NextResponse.json({error:'No se pudieron consultar las exploraciones.'},{status:503});}
}
