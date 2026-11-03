function integerSetting(env:Record<string,string|undefined>,key:string,fallback:number,min:number,max:number){
 const raw=env[key];
 if(raw===undefined||raw==='')return fallback;
 const value=Number(raw);
 if(!Number.isInteger(value)||value<min||value>max)throw new Error(`Invalid ${key}: expected integer ${min}..${max}`);
 return value;
}
export function postgresPoolConfig(env:Record<string,string|undefined>=process.env){
 return {
  prepare:false as const,
  max:integerSetting(env,'DB_POOL_MAX',6,1,20),
  idle_timeout:integerSetting(env,'DB_IDLE_TIMEOUT_SECONDS',20,1,300),
  connect_timeout:integerSetting(env,'DB_CONNECT_TIMEOUT_SECONDS',10,1,30),
 };
}
