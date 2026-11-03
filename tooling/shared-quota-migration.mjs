import {readFile} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config({path:'.env.local',quiet:true});
dotenv.config({path:'.env',quiet:true});
const connection=process.env.DATABASE_URL||process.env.SUPABASE_DB_URL;
if(!connection)throw new Error('Missing database connection');
const sql=postgres(connection,{prepare:false,max:process.argv.includes('--verify-atomic')?4:1,connect_timeout:10,idle_timeout:5});
try{
 const file='docs/architecture/ADD_SHARED_RATE_LIMIT.sql';
 const ddl=await readFile(file,'utf8');
 if(process.argv.includes('--apply')){
  if(/\b(drop|truncate|delete)\s+(table|from|database|schema)\b/i.test(ddl))throw new Error('Unexpected destructive migration');
  await sql.unsafe(ddl);
  console.log(JSON.stringify({applied:file,sha256:createHash('sha256').update(ddl).digest('hex')}));
 }
 const [table]=await sql`select c.relrowsecurity as rls, pg_get_userbyid(c.relowner) as owner from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='rate_limit_buckets'`;
 const grants=await sql`select grantee,privilege_type from information_schema.role_table_grants where table_schema='public' and table_name='rate_limit_buckets' and grantee in ('PUBLIC','anon','authenticated')`;
 const policies=await sql`select policyname,roles,cmd from pg_policies where schemaname='public' and tablename='rate_limit_buckets'`;
 console.log(JSON.stringify({exists:!!table,rls:table?.rls,publicGrants:grants,policies}));
 if(!table?.rls||grants.length||policies.length)throw new Error('Unexpected quota security configuration');
 if(process.argv.includes('--verify-atomic')){
  const key=createHash('sha256').update('capacity-verification:'+randomUUID()).digest('hex');
  await Promise.all(Array.from({length:40},()=>sql`insert into public.rate_limit_buckets (bucket_key,hits,expires_at) values (${key},1,current_timestamp+interval '1 minute') on conflict (bucket_key) do update set hits=public.rate_limit_buckets.hits+1`));
  const [result]=await sql`select hits from public.rate_limit_buckets where bucket_key=${key}`;
  console.log(JSON.stringify({atomicRequests:40,counted:result.hits,passed:result.hits===40}));
  if(result.hits!==40)throw new Error('Lost quota increments');
 }
}catch(error){console.error(JSON.stringify({failed:true,name:error?.name,code:error?.code}));process.exitCode=1;}
finally{await sql.end({timeout:5});}
