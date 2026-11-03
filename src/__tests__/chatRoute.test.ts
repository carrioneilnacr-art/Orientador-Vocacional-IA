import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({context:vi.fn(),providers:vi.fn(),stream:vi.fn(),quota:vi.fn()}));
vi.mock('@/lib/requestRateLimit',()=>({checkRequestRateLimit:mocks.quota,quotaHeaders:(limit:{retryAfter?:number;setCookie?:string})=>({...limit.retryAfter?{'Retry-After':String(limit.retryAfter)}:{},...limit.setCookie?{'Set-Cookie':limit.setCookie}:{}})}));
vi.mock('@/modules/chaski-ai/infrastructure/careerContext',()=>({fetchCareerContext:mocks.context}));
vi.mock('@/modules/chaski-ai/infrastructure/chatProviders',()=>({configuredChatProviders:mocks.providers,safeProviderError:()=>({name:'Error'})}));
vi.mock('@/modules/chaski-ai/infrastructure/streamChatResponse',()=>({streamChatResponse:mocks.stream}));
import {POST} from '@/app/api/chat/route';
const request=()=>new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({messages:[{role:'user',content:'Carreras de ingeniería'}]})});
afterEach(()=>{vi.useRealTimers();vi.restoreAllMocks();vi.clearAllMocks();});
beforeEach(()=>mocks.quota.mockResolvedValue({allowed:true,status:200}));
describe('chat request boundary',()=>{
 it('reports quota infrastructure failure as unavailable, without calling GPT',async()=>{
  mocks.quota.mockResolvedValue({allowed:false,status:503,retryAfter:5});
  const response=await POST(request());
  expect(response.status).toBe(503);expect(response.headers.get('Retry-After')).toBe('5');expect(mocks.stream).not.toHaveBeenCalled();
 });
 it('returns session quota and its cookie on a rejected request',async()=>{
  mocks.quota.mockResolvedValue({allowed:false,status:429,retryAfter:20,setCookie:'chaski_usage_session=signed; HttpOnly'});
  const response=await POST(request());
  expect(response.status).toBe(429);expect(response.headers.get('Set-Cookie')).toContain('HttpOnly');expect(mocks.stream).not.toHaveBeenCalled();
 });
 it('reports unavailable without making provider/context calls when no keys are configured',async()=>{
  mocks.providers.mockReturnValue([]);const response=await POST(request());
  expect(response.status).toBe(503);expect(response.headers.get('x-request-id')).toBeTruthy();expect(mocks.context).not.toHaveBeenCalled();expect(mocks.stream).not.toHaveBeenCalled();
 });
 it('fails closed when verified context times out, without invoking a model',async()=>{
  vi.useFakeTimers();vi.spyOn(console,'error').mockImplementation(()=>{});
  mocks.providers.mockReturnValue([{name:'openai'}]);mocks.context.mockImplementation(()=>new Promise(()=>{}));
  const pending=POST(request());await vi.advanceTimersByTimeAsync(10001);const response=await pending;
  expect(response.status).toBe(503);expect(mocks.stream).not.toHaveBeenCalled();expect(await response.text()).not.toContain('CONTEXT_TIMEOUT');
 });
 it('passes validated messages and grounded context into the bounded stream',async()=>{
  mocks.providers.mockReturnValue([{name:'openai'}]);mocks.context.mockResolvedValue('Official context');mocks.stream.mockReturnValue(new Response('stream'));
  const response=await POST(request());expect(await response.text()).toBe('stream');
  expect(mocks.stream.mock.calls[0][0].system).toContain('Official context');expect(mocks.stream.mock.calls[0][0].signal).toBeInstanceOf(AbortSignal);
 });
});
