(function(){
  const SUPABASE_URL='https://uuviurwvkbbeiyvpzugz.supabase.co';
  const SUPABASE_KEY='sb_publishable_ySXIhJQLsI63sshp3mX_pg_15o4dEwL';
  let clientPromise;
  function client(){
    if(!clientPromise){
      clientPromise=import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm')
        .then(m=>m.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}}));
    }
    return clientPromise;
  }
  function isTestMode(){return localStorage.getItem('hannahParentTestMode')==='1'}
  async function recordAttempt(data){
    if(isTestMode()) return {skipped:true,reason:'parent-test-mode'};
    try{
      const c=await client();
      const row={
        game:data.game,
        skill:String(data.skill||'all'),
        mode:String(data.mode||'practice'),
        score:Number(data.score||0),
        total:Number(data.total||1),
        answers:Array.isArray(data.answers)?data.answers:[],
        session_label:data.session_label||null,
        source_version:data.source_version||'2026-08-30'
      };
      const {error}=await c.from('learning_attempts').insert(row);
      if(error) throw error;
      return {ok:true};
    }catch(error){
      console.warn('Progress reporting unavailable:',error?.message||error);
      return {ok:false,error};
    }
  }
  function addBadge(){
    if(!isTestMode()) return;
    const badge=document.createElement('div');
    badge.textContent='🧪 Parent Test Mode — results are not recorded';
    badge.style.cssText='position:sticky;top:0;z-index:9999;background:#fff4cc;color:#6d5200;border-bottom:1px solid #e6ca67;padding:8px 12px;text-align:center;font:700 14px system-ui,sans-serif';
    document.body.prepend(badge);
  }
  window.HannahProgress={recordAttempt,isTestMode};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addBadge); else addBadge();
})();