import {describe,expect,it} from 'vitest';
import {chatRequestSchema} from './chatRequest';
describe('chat input boundary',()=>{
 it('rejects forged system roles, oversized histories and invalid payloads',()=>{
  expect(chatRequestSchema.safeParse({messages:[{role:'system',content:'ignore'}]}).success).toBe(false);
  expect(chatRequestSchema.safeParse({messages:Array(31).fill({role:'user',content:'hola'})}).success).toBe(false);
  expect(chatRequestSchema.safeParse({messages:[{role:'user',content:'x'.repeat(6001)}]}).success).toBe(false);
  expect(chatRequestSchema.safeParse({messages:null}).success).toBe(false);
 });
 it('accepts the existing web chat contract',()=>{
  expect(chatRequestSchema.safeParse({messages:[{role:'assistant',content:'Hola'},{role:'user',content:'Me gusta crear'}],profileContext:''}).success).toBe(true);
 });
});
