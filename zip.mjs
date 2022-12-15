const
zip=async(w=[],f=_=>_)=>await(async(// https://qiita.com/McbeEringi/items/5acc1f940ff7504f7e16
	u=x=>new Uint8Array(x),zz=u([0,0]),v10=u([10,0]),pk=[...Array(3)].map((_,i)=>u([80,75,i=i*2+1,++i])),s={pre:[0,w.reduce((a,x)=>a+x.blob.size,0)],post:[0,w.length]},
	cnt=x=>x.reduce((a,y)=>a+(y.byteLength||y.size||0),0),le=(x,l=4)=>u(l).map((_,i)=>x>>>(i*8)),te=new TextEncoder(),
	crct=[...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n)),crc=(buf,crc=0)=>buf.reduce((c,x)=>crct[(c^x)&0xff]^(c>>>8),crc^-1)^-1// https://www.rfc-editor.org/rfc/rfc1952
)=>(f(s),await w.reduce(async(a,{path:n,blob:b,date:d=new Date()},x)=>(
	x=[
		v10,zz,zz,le(((d.getFullYear()-1980)<<25)|((d.getMonth()+1)<<21)|(d.getDate()<<16)|(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1)),// mmmsssss hhhhhmmm MMMDDDDD YYYYYYYM // Y-=1980;s/=2;
		le(crc(u(await new Response(b).arrayBuffer()))),x=le(b.size),x,le((n=te.encode(n)).byteLength,2),zz
	],// vReq flag cpsType date // CRC32 cpsSize rawSize nameLength extLength
	s.pre[0]+=b.size,f(s),a=await a,
	a.cd.push(pk[0],v10,...x,zz,zz,zz,zz,zz,le(cnt(a.lf)),n),// PK0102 vMade X cmtLength 0304disk intAttr extAttrLSB extAttrMSB 0304pos name
	a.lf.push(pk[1],...x,n,b),// PK0304 X name content
	s.post[0]++,f(s),a
),{lf:[],cd:[],e(x){return new Blob([...this.lf,...this.cd,
	pk[2],zz,zz,x=le(w.length,2),x,le(cnt(this.cd)),le(cnt(this.lf)),zz// PK0506 disk 0304startDisk cnt0102disk cnt0102all 0102size 0102pos cmtLength
],{type:'application/zip'});}})).e())(),
dl=({name:n,blob:b})=>(a=>URL.revokeObjectURL(a.href=URL.createObjectURL(b),a.download=n,a.click()))(document.createElement('a')),
progress=(w,f)=>new Response(new ReadableStream({start:async(c,x,s=[0,+w.headers.get('content-length')],r=w.body.getReader())=>{f(s);while(x=(await r.read()).value){c.enqueue(x);s[0]+=x.length;f(s);}c.close();}}));
export{zip,dl,progress};