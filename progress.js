(function(){
  const SUPABASE_URL='https://uuviurwvkbbeiyvpzugz.supabase.co';
  const SUPABASE_KEY='sb_publishable_ySXIhJQLsI63sshp3mX_pg_15o4dEwL';
  const QUEUE_KEY='hannahPendingAttempts';
  const inflight=new Map();
  function isTestMode(){return localStorage.getItem('hannahParentTestMode')==='1'}
  function readQueue(){try{return JSON.parse(localStorage.getItem(QUEUE_KEY)||'[]')}catch(_){return []}}
  function writeQueue(rows){try{localStorage.setItem(QUEUE_KEY,JSON.stringify(rows))}catch(_){}}
  function enqueue(row){const rows=readQueue();if(!rows.some(x=>x.id===row.id)){rows.push(row);writeQueue(rows)}}
  function removeQueued(id){writeQueue(readQueue().filter(x=>x.id!==id))}
  async function send(row){
    if(inflight.has(row.id))return inflight.get(row.id);
    const task=(async()=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
      try{
        const response=await fetch(SUPABASE_URL+'/rest/v1/learning_attempts',{
          method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
          body:JSON.stringify(row),signal:controller.signal
        });
        if(!response.ok){const error=await response.json();
          // A retry after an interrupted response must not create a duplicate session.
          if(error.code!=='23505')throw new Error(error.message||'Could not save result');
        }
        removeQueued(row.id);return {ok:true};
      }catch(error){console.warn('Progress reporting unavailable:',error.message);return {ok:false,error}}
      finally{clearTimeout(timer)}
    })();inflight.set(row.id,task);try{return await task}finally{inflight.delete(row.id)}
  }
  async function recordAttempt(data){
    if(isTestMode())return {skipped:true,reason:'parent-test-mode'};
    data.id=data.id||crypto.randomUUID();
    const row={id:data.id,game:data.game,skill:String(data.skill||'all'),mode:String(data.mode||'practice'),
      score:Number(data.score||0),total:Number(data.total||1),answers:Array.isArray(data.answers)?data.answers:[],
      session_label:data.session_label||null,source_version:data.source_version||'2026-10-01'};
    enqueue(row);return send(row);
  }
  async function flushPending(){if(isTestMode())return;for(const row of readQueue())await send(row)}
  window.addEventListener('online',flushPending);
  setTimeout(flushPending,0);
  function addBadge(){
    if(!isTestMode()) return;
    const badge=document.createElement('div');
    badge.textContent='🧪 Parent Test Mode — results are not recorded';
    badge.style.cssText='position:sticky;top:0;z-index:9999;background:#fff4cc;color:#6d5200;border-bottom:1px solid #e6ca67;padding:8px 12px;text-align:center;font:700 14px system-ui,sans-serif';
    document.body.prepend(badge);
  }
  window.HannahProgress={recordAttempt,isTestMode,flushPending};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addBadge); else addBadge();
})();
