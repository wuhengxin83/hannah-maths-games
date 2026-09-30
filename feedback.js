window.HannahFeedback={show(content,label='I understand — continue'){
let dialog=document.getElementById('wrongAnswerDialog');
if(!dialog){dialog=document.createElement('dialog');dialog.id='wrongAnswerDialog';dialog.setAttribute('aria-labelledby','wrongAnswerTitle');dialog.innerHTML='<h2 id="wrongAnswerTitle">❌ That answer is incorrect</h2><p>Let’s work through it together.</p><div class="explanation"></div><button class="btn primary" type="button"></button>';document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('cancel',e=>e.preventDefault());const style=document.createElement('style');style.textContent='#wrongAnswerDialog{border:3px solid #ef8590;border-radius:24px;padding:24px;width:min(600px,92vw);max-height:85dvh;overflow:auto;color:#25324a;font:inherit;background:#fffdf8;box-shadow:0 20px 80px #0004}#wrongAnswerDialog::backdrop{background:#18213bb8}#wrongAnswerDialog h2{color:#a53232;margin-top:0}#wrongAnswerDialog .explanation{line-height:1.6;margin:16px 0;white-space:pre-line}#wrongAnswerDialog button{width:100%;padding:14px;background:#7557ff;color:white;border:0;border-radius:14px;font:inherit;font-weight:800}';document.head.append(style)}
const box=dialog.querySelector('.explanation');box.replaceChildren();if(typeof content==='string')box.textContent=content;else box.append(content.cloneNode(true));dialog.querySelector('button').textContent=label;document.activeElement?.blur();if(!dialog.open)dialog.showModal();dialog.querySelector('button').focus();
}};
/* Familiar written methods, rendered as accessible SVGs and stacked fractions. */
(function(){
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=(w,h,body,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const txt=(x,y,s,color='#25324a',size=25)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${size}" font-family="Arial,sans-serif">${esc(s)}</text>`;
const line=(x,y,x2,y2,color='#25324a')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"/>`;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const frac=(n,d)=>`<span class="written-frac"><span>${esc(n)}</span><span>${esc(d)}</span></span>`;
function columnStages(a,b,op){
 const ans=op==='+'?a+b:op==='−'?a-b:a*b;
 const width=Math.max(String(a).length,String(b).length,String(ans).length),w=44+width*35;
 const original=Array.from({length:width},(_,c)=>Math.floor(a/10**c)%10),digits=[...original],carries=Array(width).fill(0),result=Array(width).fill(''),cards=[];
 let carry=0;
 const x=c=>w-24-c*35;
 const count=op==='×'?String(a).length:Math.max(String(a).length,String(b).length);
 for(let c=0;c<count;c++){
 const av=digits[c],bv=Math.floor(b/10**c)%10;let note;
 if(op==='−'){
 if(av<bv){let j=c+1;while(digits[j]===0)j++;digits[j]--;for(let k=j-1;k>c;k--)digits[k]=9;digits[c]+=10;note=`Regroup, then ${digits[c]} − ${bv} = ${digits[c]-bv}.`}else note=`${av} − ${bv} = ${av-bv}.`;
 result[c]=digits[c]-bv;
 }else{
 const n=op==='+'?av+bv+carry:av*b+carry;
 note=op==='+'?`${av} + ${bv}${carry?' + '+carry+' carried':''} = ${n}.`:`${av} × ${b}${carry?' + '+carry+' carried':''} = ${n}.`;
 result[c]=n%10;carry=Math.floor(n/10);if(c+1<width)carries[c+1]=carry||0;
 if(c===count-1&&carry){let extra=carry,k=c+1;while(extra){result[k++]=extra%10;extra=Math.floor(extra/10)}}
 if(carry&&c<count-1)note+=` Write ${n%10}, carry ${carry}.`;
 }
 let body='';
 for(let k=width-1;k>=0;k--){
 if(op==='−'&&digits[k]!==original[k])body+=txt(x(k),22,digits[k],'#d33645',17);
 else if(op!=='−'&&carries[k])body+=txt(x(k),22,carries[k],'#d33645',17);
 if(k<String(a).length){body+=txt(x(k),54,original[k]);if(op==='−'&&digits[k]!==original[k])body+=line(x(k)-10,39,x(k)+10,55,'#d33645')}
 if(k<String(b).length)body+=txt(x(k),87,Math.floor(b/10**k)%10);
 if(result[k]!==''&&(k<String(ans).length||ans===0&&k===0))body+=txt(x(k),130,result[k],'#d33645');
 }
 body+=txt(16,87,op)+line(8,98,w-9,98);
 cards.push(`<div class="written-card"><b>${['Ones','Tens','Hundreds','Thousands'][c]||'Next place'}</b>${svg(w,148,body,`${a} ${op} ${b}. ${note}`)}<p>${esc(note)}</p></div>`);
 }
 return `<div class="written-stages">${cards.join('')}</div>`;
}
function division(a,b){
 const digits=String(a).split('').map(Number),quotient=Math.floor(a/b),w=100+digits.length*38,x=c=>90+c*38;
 let body=txt(42,72,b)+line(66,43,w-8,43)+line(66,43,66,80),remainder=0,y=104,started=false;
 for(let c=0;c<digits.length;c++)body+=txt(x(c),72,digits[c]);
 for(let c=0;c<digits.length;c++){
 const part=remainder*10+digits[c],qd=Math.floor(part/b);remainder=part%b;
 if(!started&&qd===0)continue;started=true;body+=txt(x(c),32,qd,'#d33645');
 const product=qd*b,ps=String(product);
 
 for(let k=0;k<ps.length;k++)body+=txt(x(c)-(ps.length-1-k)*38,y,ps[k]);
 body+=txt(x(c)-ps.length*38,y,'−', '#25324a',20)+line(x(c)-Math.max(ps.length, String(part).length)*38+17,y+8,x(c)+18,y+8);
 body+=txt(x(c),y+35,remainder,'#d33645');
 if(c<digits.length-1){body+=txt(x(c+1),y+35,digits[c+1],'#7557ff');body+=txt(x(c+1),y+9,'↓','#7557ff',18)}
 y+=90;
 }
 return `<div class="long-division">${svg(w,y-30,body,`${a} divided by ${b} equals ${quotient}, remainder ${remainder}`)}</div><p class="written-note">Divide → multiply → subtract → bring down.</p><div class="written-equation">${a} ÷ ${b} = <strong>${quotient}</strong></div><p class="written-note">Check: ${b} × ${quotient} = ${a}</p>`;
}
function fractionWork(q,mode){
 if(mode==='common'){
 const common=q.c;return `<p class="written-note">Find the first matching multiple.</p>${[q.a,q.b].map(n=>`<div class="multiple-row"><b>${n}:</b> ${Array.from({length:common/n},(_,k)=>(k+1)*n).map(v=>`<span class="${v===common?'match-multiple':''}">${v}</span>`).join(' ')}</div>`).join('')}<p class="written-note">Common denominator: <strong>${common}</strong></p>`;
 }
 if(mode==='rename')return `<div class="written-equation">${frac(q.n,q.d)} = ${frac(`${q.n} × ${q.m}`,`${q.d} × ${q.m}`)} = ${frac(q.newN,q.newD)}</div><p class="written-note">Multiply top and bottom by ${q.m}.</p>`;
 const same=mode==='same'||q.kind==='fractions';
 const d=same?q.d:q.c,a=same?q.a:q.a,b=same?q.b:q.b,raw=q.op==='+'?a+b:a-b,g=gcd(raw,d),n=raw/g,den=d/g;
 let html='';
 if(!same){html+=`<p class="written-note">1. Make the denominators match.</p><div class="written-equation">${frac(q.n1,q.d1)} = ${frac(`${q.n1} × ${d/q.d1}`,`${q.d1} × ${d/q.d1}`)} = ${frac(a,d)}</div><div class="written-equation">${frac(q.n2,q.d2)} = ${frac(`${q.n2} × ${d/q.d2}`,`${q.d2} × ${d/q.d2}`)} = ${frac(b,d)}</div>`}
 html+=`<p class="written-note">${same?'': '2. '}${q.op==='+'?'Add':'Subtract'} the top numbers. Keep the bottom number.</p><div class="written-equation">${frac(a,d)} ${q.op} ${frac(b,d)} = ${frac(`${a} ${q.op} ${b}`,d)} = ${frac(raw,d)}</div>`;
 if(g>1)html+=`<p class="written-note">${same?'':'3. '}Simplify: divide top and bottom by ${g}.</p><div class="written-equation">${frac(raw,d)} = ${frac(`${raw} ÷ ${g}`,`${d} ÷ ${g}`)} = ${frac(n,den)}</div>`;
 return html;
}
function longMultiplication(a,b){
 const ans=a*b,ones=b%10,tens=Math.floor(b/10),w=44+String(ans).length*35,x=c=>w-24-c*35;
 const row=(n,y,color='#25324a')=>String(n).split('').reverse().map((v,c)=>txt(x(c),y,v,color)).join('');
 const body=row(a,36)+row(b,70)+txt(16,70,'×')+line(8,81,w-8,81)+row(a*ones,114)+row(a*tens*10,148)+txt(16,148,'+')+line(8,160,w-8,160)+row(ans,194,'#d33645');
 return `<div class="long-division">${svg(w,215,body,`${a} times ${b}: ${a*ones} plus ${a*tens*10} equals ${ans}`)}</div><p class="written-note">Ones: ${a} × ${ones} = ${a*ones}<br>Tens: ${a} × ${tens*10} = ${a*tens*10}</p>`;
}
function render(q,kind,mode){if(kind==='division')return division(q.dividend??q.a,q.d??q.b);if(kind==='fractions')return fractionWork(q,mode);if(kind==='multiplication'&&q.b>=10){if(q.a<10)return columnStages(q.b,q.a,'×');return longMultiplication(q.a,q.b)}return columnStages(q.a,q.b,kind==='multiplication'?'×':q.op)}
const style=document.createElement('style');style.textContent=`#wrongAnswerDialog{width:min(740px,94vw)}#wrongAnswerDialog .explanation{white-space:normal}.written-stages{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px}.written-card{background:#f7f6ff;border:1px solid #dedaf4;border-radius:14px;padding:12px;text-align:center}.written-card svg{display:block;width:100%;max-width:220px;margin:8px auto}.written-card p{font-size:.95rem;margin:0;line-height:1.4}.written-card b{color:#6550b8}.written-equation{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;font-size:clamp(1.2rem,4vw,1.65rem);padding:12px 6px;background:#f7f6ff;border-radius:14px;margin:8px 0}.written-frac{display:inline-flex;vertical-align:middle;flex-direction:column;text-align:center;line-height:1.4;min-width:24px}.written-frac>span:first-child{border-bottom:2px solid #25324a;padding:0 5px 3px}.written-frac>span:last-child{padding:3px 5px 0}.written-note{text-align:center;font-size:1rem}.long-division svg{display:block;width:230px;max-width:100%;margin:auto}.multiple-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:12px 0}.multiple-row span{background:#f1efff;border-radius:8px;padding:5px 9px}.multiple-row .match-multiple{background:#d7f5e6;color:#12603f;border:2px solid #32b67a;font-weight:bold}.working-key{text-align:center;color:#a53232;font-size:.9rem}`;document.head.append(style);
window.HannahFeedback.renderWorking=render;
window.HannahFeedback.showWorking=function(q,kind,mode,label){
 const box=document.createElement('div');box.innerHTML=render(q,kind,mode);
 if(kind!=='fractions'&&kind!=='division'){const key=document.createElement('p');key.className='working-key';key.textContent=q.op==='−'?'Red numbers show regrouping and the answer.':'Red numbers show carrying and the answer.';box.prepend(key)}
 this.show(box,label);
};
})();
