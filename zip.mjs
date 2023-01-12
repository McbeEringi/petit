const
zip=(w=[],{progress:f=_=>_,offset:[_o=0,o_=0]=[]}={})=>(async(// https://qiita.com/McbeEringi/items/5acc1f940ff7504f7e16
	u=x=>new Uint8Array(x),zz=u([0,0]),v10=u([10,0]),pk=[...Array(3)].map((_,i)=>u([80,75,i=i*2+1,++i])),s={pre:[0,w.reduce((a,x)=>a+x.blob.size,0)],post:[0,w.length]},
	cnt=x=>x.reduce((a,y)=>a+(y.byteLength||y.size||0),0),le=(x,l=4)=>u(l).map((_,i)=>x>>>(i*8)),te=new TextEncoder(),
	crct=[...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n)),crc=(buf,crc=0)=>buf.reduce((c,x)=>crct[(c^x)&0xff]^(c>>>8),crc^-1)^-1// https://www.rfc-editor.org/rfc/rfc1952
)=>(f(s),await w.reduce(async(a,{path:n,blob:b,date:d=new Date()},x)=>(
	x=[
		v10,zz,zz,le(((d.getFullYear()-1980)<<25)|((d.getMonth()+1)<<21)|(d.getDate()<<16)|(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1)),// mmmsssss hhhhhmmm MMMDDDDD YYYYYYYM // Y-=1980;s/=2;
		le(crc(u(await new Response(b).arrayBuffer()))),x=le(b.size),x,le((n=te.encode(n)).byteLength,2),zz
	],// vReq flag cpsType date // CRC32 cpsSize rawSize nameLength extLength
	s.pre[0]+=b.size,f(s),a=await a,
	a.cd.push(pk[0],v10,...x,zz,zz,zz,zz,zz,le(cnt(a.lf)+_o),n),// PK0102 vMade X cmtLength 0304disk intAttr extAttrLSB extAttrMSB 0304pos name
	a.lf.push(pk[1],...x,n,b),// PK0304 X name content
	s.post[0]++,f(s),a
),{lf:[],cd:[],e(x){return new Blob([...this.lf,...this.cd,
	pk[2],zz,zz,x=le(w.length,2),x,le(cnt(this.cd)),le(cnt(this.lf)+_o),le(o_,2)// PK0506 disk 0304startDisk cnt0102disk cnt0102all 0102size 0102pos cmtLength
],{type:'application/zip'});}})).e())(),
unzip=async(w=new ArrayBuffer())=>((
	w,e=w.reduce((a,_,i)=>([80,75,5,6].every((x,j)=>w[i+j]==x)&&a.push(i),a),[]).pop(),le=(o,l=2)=>[...Array(l)].reduce((b,_,i)=>b|w[o+i]<<8*i,0),td=new TextDecoder()
)=>[...Array(le(e+8))].reduce((a,i=le(a.i+42,4))=>(
	a.w.push({path:td.decode(new Uint8Array(w.buffer,i+30,le(i+26))),blob:new Blob([new Uint8Array(w.buffer,i+30+le(i+26)+le(i+28),le(i+18))]),date:(x=>new Date((x>>>25)+1980,(x>>>21&15)-1,x>>>16&31,x>>>11&31,x>>>5&63,(x&31)*2))(le(i+10,4))}),
	a.i+=46+le(a.i+28)+le(a.i+30)+le(a.i+32),a
),{i:le(e+16,4),w:[]}).w)(new Uint8Array(w.constructor.name='ArrayBuffer'?w:await new Response(w).arrayBuffer())),
sfx=(w,c)=>(async h=>new Blob([h,await zip(w,{...c,offset:[new Blob([h]).size,3]}),'-->']))(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>onload=()=>(${
	async f=>document.body.append(f.x(f,'div',location.pathname.match(/[^\/]*$/)[0]||'root',(await f.u(await(await fetch('')).arrayBuffer())).reduce((a,x)=>(x.path.split('/').reduce((b,y,i,c)=>c.length-1==i?b[y]=x:(b[y]||(b[y]={})),a),a),{})))
})({z:${zip},u:${unzip},d:${dl},x:${(
	f,r,n,w,e=x=>document.createElement(x),ea=(x,...y)=>(x.append(...y),x),oa=(x,y)=>Object.assign(x,y),b=x=>x&&x.constructor.name=='Blob',
	c=(r,n,w)=>ea(oa(e(r),{textContent:n}),oa(e('button'),{textContent:'💾',onclick:async()=>f.d(b(w.blob)?{name:n,blob:w.blob}:{name:n+'.zip',blob:await f.z(((f,w)=>f(f,w))((f,w)=>Object.values(w).flatMap(x=>b(x.blob)?[x]:f(f,x)),w))})}))
)=>ea(e(r),ea(e('details'),c('summary',n,w),Object.entries(w).reduce((a,x)=>ea(a,b(x[1].blob)?c('li',...x):f.x(f,'li',...x)),e('ul'))))}});</script></body></html><!--`),
dl=({name:n,blob:b})=>(a=>URL.revokeObjectURL(a.href=URL.createObjectURL(b),a.download=n,a.click()))(document.createElement('a')),
progress=(w,f)=>new Response(new ReadableStream({start:async(c,x,s=[0,+w.headers.get('content-length' )],r=w.body.getReader())=>{f(s);while(x=(await r.read()).value){c.enqueue(x);s[0]+=x.length;f(s);}c.close();}}));
export{zip,unzip,sfx,dl,progress};