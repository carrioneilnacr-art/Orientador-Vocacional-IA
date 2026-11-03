import {describe,expect,it,vi} from 'vitest';
import {createPublicReadCache} from '@/lib/publicReadCache';
describe('bounded public read cache',()=>{
 it('coalesces forty concurrent reads and expires successful values after30seconds',async()=>{
  let now=0;const cache=createPublicReadCache<string>({maxEntries:64,ttlMs:30000,cacheable:Boolean,now:()=>now});
  const load=vi.fn(async()=> 'official context');
  expect(await Promise.all(Array.from({length:40},()=>cache.read('hash',load)))).toHaveLength(40);
  expect(load).toHaveBeenCalledTimes(1);now=29999;await cache.read('hash',load);expect(load).toHaveBeenCalledTimes(1);
  now=30000;await cache.read('hash',load);expect(load).toHaveBeenCalledTimes(2);
 });
 it('does not cache empty/failure responses and releases rejected singleflight entries',async()=>{
  const cache=createPublicReadCache<string>({maxEntries:64,ttlMs:30000,cacheable:Boolean});
  const empty=vi.fn(async()=> '');await cache.read('empty',empty);await cache.read('empty',empty);expect(empty).toHaveBeenCalledTimes(2);
  const fail=vi.fn(async()=>{throw new Error('DB unavailable');});
  await expect(cache.read('failed',fail)).rejects.toThrow();await expect(cache.read('failed',fail)).rejects.toThrow();expect(fail).toHaveBeenCalledTimes(2);
  expect(cache.size).toBe(0);
 });
 it('bounds entries at64 and reloads evicted public keys',async()=>{
  const cache=createPublicReadCache<string>({maxEntries:64,ttlMs:30000,cacheable:Boolean});
  const load=vi.fn(async()=> 'official');
  for(let key=0;key<65;key++)await cache.read(String(key),load);
  expect(cache.size).toBe(64);await cache.read('0',load);expect(load).toHaveBeenCalledTimes(66);expect(cache.size).toBe(64);
 });
});
