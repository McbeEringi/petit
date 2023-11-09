const
zip=(w=[],f=_=>_)=>((
	u=x=>new Uint8Array(x),zz=u([0,0]),vz=u([10,0]),pk=u([80,75]),_12=u([1,2]),_34=u([3,4]),le2=x=>u([x,x>>>8]),le4=x=>u([x,x>>>8,x>>>16,x>>>24]),
	cnt=x=>le4(x.reduce((a,y)=>a+(y.byteLength||y.size||0),0)),te=new TextEncoder(),i=0,
	ddt=x=>((x.getFullYear()-1980)<<25)|((x.getMonth()+1)<<21)|(x.getDate()<<16)|(x.getHours()<<11)|(x.getMinutes()<<5)|(x.getSeconds()>>1),// mmmsssss hhhhhmmm MMMDDDDD YYYYYYYM // Y-=1980;s/=2;
	crc=(t=>(buf,crc=0)=>~buf.reduce((c,x)=>t[(c^x)&0xff]^(c>>>8),~crc))([...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n)))// https://www.rfc-editor.org/rfc/rfc1952
)=>w.reduce(async(a,x,b,n)=>(
	b=x.buffer||x,n=te.encode(x.name),x=[
		vz,zz,zz,le4(ddt(new Date(x.lastModified))),le4(crc(u(b instanceof ArrayBuffer?b:await new Response(b).arrayBuffer()))),
		x=le4(b.byteLength||b.size),x,le2(n.byteLength),zz// vReq flag cpsType date CRC32 cpsSize rawSize nameLength extLength
	],f(++i/w.length/2),a=await a,f(++i/w.length/2),
	a.cd.push(pk,_12,vz,...x,zz,zz,zz,zz,zz,cnt(a.lf),n),a.lf.push(pk,_34,...x,n,b),a// PK0102 vMade x cmtLength 0304disk intAttr extAttrLSB extAttrMSB 0304pos name , PK0304 x name content
),{lf:[],cd:[]}).then((x,_=le2(w.length))=>new Blob([...x.lf,...x.cd,pk,u([5,6]),zz,zz,_,_,cnt(x.cd),cnt(x.lf),zz],{type:'application/zip'})))(),// PK0506 disk 0304startDisk cnt0102disk cnt0102all 0102size 0102pos cmtLength

dl=({name:n,buffer:b})=>(a=>URL.revokeObjectURL(a.href=URL.createObjectURL(b instanceof Blob?b:new Blob([b])),a.download=n,a.click()))(document.createElement('a')),
progress=(w,f)=>new Response(new ReadableStream({start:async(c,x,s=[0,+w.headers.get('content-length')],r=w.body.getReader())=>{f(s);while(x=(await r.read()).value){c.enqueue(x);s[0]+=x.length;f(s);}c.close();}}));
export{zip,dl,progress};