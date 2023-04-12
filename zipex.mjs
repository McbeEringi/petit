import*as zip from'./zip.mjs';
const
unzip=async(w=new ArrayBuffer())=>((
	w,e=w.reduce((a,_,i)=>([80,75,5,6].every((x,j)=>w[i+j]==x)&&a.push(i),a),[]).pop(),le=(o,l=2)=>[...Array(l)].reduce((b,_,i)=>b|w[o+i]<<8*i,0),td=new TextDecoder()
)=>[...Array(le(e+8))].reduce((a,i=le(a.i+42,4))=>(
	a.w.push({path:td.decode(new Uint8Array(w.buffer,i+30,le(i+26))),blob:new Blob([new Uint8Array(w.buffer,i+30+le(i+26)+le(i+28),le(i+18))]),date:(x=>new Date((x>>>25)+1980,(x>>>21&15)-1,x>>>16&31,x>>>11&31,x>>>5&63,(x&31)*2))(le(i+10,4))}),
	a.i+=46+le(a.i+28)+le(a.i+30)+le(a.i+32),a
),{i:le(e+16,4),w:[]}).w)(new Uint8Array(w.constructor.name='ArrayBuffer'?w:await new Response(w).arrayBuffer())),
sfx=(w,c)=>(async h=>new Blob([h,await zip.zip(w,{...c,offset:[new Blob([h]).size,3]}),'-->']))(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>onload=()=>(${
	async f=>document.body.append(f.x(f,'div',location.pathname.match(/[^\/]*$/)[0]||'root',(await f.u(await(await fetch('')).arrayBuffer())).reduce((a,x)=>(x.path.split('/').reduce((b,y,i,c)=>c.length-1==i?b[y]=x:(b[y]||(b[y]={})),a),a),{})))
})({z:${zip.zip},u:${unzip},d:${zip.dl},x:${(
	f,r,n,w,e=x=>document.createElement(x),ea=(x,...y)=>(x.append(...y),x),oa=(x,y)=>Object.assign(x,y),b=x=>x&&x.constructor.name=='Blob',
	c=(r,n,w)=>ea(oa(e(r),{textContent:n}),oa(e('button'),{textContent:'💾',onclick:async()=>f.d(b(w.blob)?{name:n,blob:w.blob}:{name:n+'.zip',blob:await f.z(((f,w)=>f(f,w))((f,w)=>Object.values(w).flatMap(x=>b(x.blob)?[x]:f(f,x)),w))})}))
)=>ea(e(r),ea(e('details'),c('summary',n,w),Object.entries(w).reduce((a,x)=>ea(a,b(x[1].blob)?c('li',...x):f.x(f,'li',...x)),e('ul'))))}});</script></body></html><!--`);
export{zip,unzip,sfx};