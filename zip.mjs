const
zip=(w=[],f=_=>_,cs)=>((// Version Made by: UNIX cf.ExtFileAttrHIGH...<bits/stat.h> le2(reguler644=0x81a4)=ea
	u=x=>new Uint8Array(x),zz=u([0,0],cs=cs&&globalThis.CompressionStream),vr=u([cs?20:10,0]),vm=u([20,3]),ea=u([164,129]),pk=u([80,75]),_12=u([1,2]),_34=u([3,4]),gf=u([0,8]),cm=cs?u([8,0]):zz,
	le2=x=>u([x,x>>>8]),le4=x=>u([x,x>>>8,x>>>16,x>>>24]),l=x=>x.byteLength||x.size||0,cnt=x=>le4(x.reduce((a,y)=>a+l(y),0)),te=new TextEncoder(),i=0,
	iab=x=>x instanceof ArrayBuffer,dfl=b=>cs?new Response((iab(b)?new Blob([b]):b).stream().pipeThrough(new cs('deflate-raw'))).blob():b,
	ddt=x=>((x.getFullYear()-1980)<<25)|((x.getMonth()+1)<<21)|(x.getDate()<<16)|(x.getHours()<<11)|(x.getMinutes()<<5)|(x.getSeconds()>>1),// mmmsssss hhhhhmmm MMMDDDDD YYYYYYYM // Y-=1980;s/=2;
	crc=(t=>(buf,crc=0)=>~buf.reduce((c,x)=>t[(c^x)&0xff]^(c>>>8),~crc))([...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n)))// https://www.rfc-editor.org/rfc/rfc1952
)=>w.reduce(async(a,x,b,cb,n)=>(cb=await dfl(b=x.buffer||x),f(++i/w.length/3),n=te.encode(x.name),
	x=[vr,gf,cm,le4(ddt(new Date(x.lastModified||Date.now()))),le4(crc(u(iab(b)?b:await new Response(b).arrayBuffer()))),le4(l(cb)),le4(l(b)),le2(l(n)),zz],// vReq flag cpsType date CRC32 cpsSize rawSize nameLength extLength
	f(++i/w.length/3),a=await a,f(++i/w.length/3),a.cd.push(pk,_12,vm,...x,zz,zz,zz,zz,ea,cnt(a.lf),n),a.lf.push(pk,_34,...x,n,cb),a// PK0102 vMade x cmtLength 0304disk intAttr extAttrLSB extAttrMSB 0304pos name , PK0304 x name content
),{lf:[],cd:[]}).then((x,_=le2(w.length))=>new Blob([...x.lf,...x.cd,pk,u([5,6]),zz,zz,_,_,cnt(x.cd),cnt(x.lf),zz],{type:'application/zip'})))(),// PK0506 disk 0304startDisk cnt0102disk cnt0102all 0102size 0102pos cmtLength

unzip=async(w=new Blob())=>((
	w,e=[...{[Symbol.iterator]:(p=w.length-21)=>({next:_=>({done:[80,75,5,6].every((x,i)=>w[p+i]==x)||!~p,value:--p})})}].pop(),
	le=(p,l=2)=>[...Array(l)].reduce((a,_,i)=>a|w[p+i]<<8*i,0),td=new TextDecoder(),
	ddt=x=>new Date((x>>>25)+1980,(x>>>21&15)-1,x>>>16&31,x>>>11&31,x>>>5&63,(x&31)*2).getTime()
)=>Promise.all([...Array(le(e+8))].reduce((a,p=a.p,n)=>(
	n=[...{[Symbol.iterator]:(q=p+46+le(p+28),e=q+le(p+30))=>({next:_=>({done:e<=q,value:[le(q),[q+4,le(q+2)]],_:q+=4+le(q+2)})})}].reduce((a,[i,x])=>(a[i]=x,a),{})[0x7075],// Info-ZIP Unicode Path Extra Field
	n=td.decode(new Uint8Array(w.buffer,...n?[n[0]+5,n[1]-5]:[p+46,le(p+28)])),n[n.length-1]!='/'&&a.a.push((async()=>new File([await{
		0:_=>_,8:async(x,_)=>(_=globalThis.DecompressionStream)?await new Response(new Blob([x]).stream().pipeThrough(new _('deflate-raw'))).blob():globalThis.Bun?Bun.inflateSync(x):(console.warn('inflate impl not found!'),x)
	}[le(p+10)](new Uint8Array(w.buffer,(l=>l+30+le(l+26)+le(l+28))(le(p+42,4)),le(p+20,4)))],n,{lastModified:ddt(le(p+12,4))}))()),a.p+=46+le(p+28)+le(p+30)+le(p+32),a
),{p:le(e+16,4),a:[]}).a))((w=w.buffer||w,new Uint8Array(w instanceof ArrayBuffer?w:await new Response(w).arrayBuffer()))),

dl=({name:n,buffer:b})=>(a=>URL.revokeObjectURL(a.href=URL.createObjectURL(b instanceof Blob?b:new Blob([b])),a.download=n,a.click()))(document.createElement('a')),
progress=(w,f)=>new Response(new ReadableStream({start:async(c,x,s=[0,+w.headers.get('content-length')],r=w.body.getReader())=>{f(s);while(x=(await r.read()).value){c.enqueue(x);s[0]+=x.length;f(s);}c.close();}}));
// progress=(w,f,s)=>((r=w.body.getReader(),p=[0,+w.headers.get('content-length')],b,c=_=>(b=1,r.cancel()))=>Array.fromAsync({[Symbol.asyncIterator]:_=>(
// 	s.addEventListener('abort',c),f(p),{next:async x=>(x=(await r.read()).value,b&&await Promise.reject('Load aborted.'),x?(p[0]+=x.length,f(p)):s.removeEventListener('abort',c),{done:!x,value:x})}
// )}))();
export{zip,unzip,dl,progress};
