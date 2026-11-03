import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
const spy=vi.hoisted(()=>({check:vi.fn(async(buckets:unknown[])=>{void buckets;return {allowed:true,status:200};})}));
vi.mock('@/lib/rateLimit',()=>({checkRateLimits:spy.check}));
import {checkRequestRateLimit,quotaIdentity,RATE_COOKIE} from '@/lib/requestRateLimit';
import {signGuestTestSession,signStudentSession,STUDENT_COOKIE_NAME} from '@/lib/studentAuth';
beforeEach(()=>{vi.stubEnv('STUDENT_AUTH_SECRET','test-only-shared-quota-secret-with-32-characters');spy.check.mockClear();});
afterEach(()=>vi.unstubAllEnvs());
const request=(cookie='')=>new Request('https://school.example/api/chat',{headers:{cookie,'x-forwarded-for':'192.0.2.1, 10.0.0.1'}});
describe('Verified session quota identity',()=>{
 it('issues signed anonymous cookies and reuses them across requests',async()=>{
  const first=await checkRequestRateLimit(request(),'chat');
  expect(first.setCookie).toContain(`${RATE_COOKIE}=`);
  const cookie=first.setCookie!.split(';')[0];
  await checkRequestRateLimit(request(cookie),'chat');
  const [firstBuckets]=spy.check.mock.calls[0] as unknown as [{key:string;max:number}[]];
  const [secondBuckets]=spy.check.mock.calls[1] as unknown as [{key:string;max:number}[]];
  expect(firstBuckets).toEqual(secondBuckets);
  expect(firstBuckets.map(bucket=>bucket.max)).toEqual([600,12]);
  expect(firstBuckets[0].key).toBe('chat:ip:192.0.2.1');
 });
 it('uses verified student and adventure identities and rejects tampered cookies',()=>{
  const token=signStudentSession({studentId:'s',schoolId:'school',studentCode:'code',fullName:'Test',consentStatus:'GRANTED'});
  expect(quotaIdentity(request(`${STUDENT_COOKIE_NAME}=${token}`))?.id).toBe('student:school:s');
  const adventure=signGuestTestSession('ADV-test');
  expect(quotaIdentity(request(`chaski_adventure_session=${adventure}`))?.id).toBe('guest:ADV-test');
  expect(quotaIdentity(request(`${RATE_COOKIE}=${adventure}tampered`))?.id).toMatch(/^guest:RL-/);
 });
 it('does not silently downgrade to per-IP limits when signing configuration is missing',async()=>{
  vi.stubEnv('STUDENT_AUTH_SECRET','');
  expect(await checkRequestRateLimit(request(),'chat')).toEqual({allowed:false,status:503,retryAfter:5});
  expect(spy.check).not.toHaveBeenCalled();
 });
});
