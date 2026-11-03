/** Per-instance cache for public verified reads only; never pass identities or private records. */
export function createPublicReadCache<T>(options:{maxEntries:number;ttlMs:number;cacheable:(value:T)=>boolean;now?:()=>number}){
 const now=options.now??(()=>Date.now());
 const entries=new Map<string,{promise:Promise<T>;expiresAt:number}>();
 return {
  get size(){return entries.size;},
  async read(key:string,load:()=>Promise<T>):Promise<T>{
   const existing=entries.get(key);
   if(existing&&existing.expiresAt>now())return existing.promise;
   if(existing)entries.delete(key);
   // Expired entries are removed before evicting the oldest active entry.
   for(const [entryKey,entry] of entries)if(entry.expiresAt<=now())entries.delete(entryKey);
   if(entries.size>=options.maxEntries)entries.delete(entries.keys().next().value!);
   const promise=Promise.resolve().then(load).then(value=>{
    if(entries.get(key)===entry){
     if(options.cacheable(value))entry.expiresAt=now()+options.ttlMs;
     else entries.delete(key);
    }
    return value;
   }).catch(error=>{
    if(entries.get(key)===entry)entries.delete(key);
    throw error;
   });
   const entry={promise,expiresAt:Infinity};
   entries.set(key,entry);
   return entry.promise;
  },
 };
}
