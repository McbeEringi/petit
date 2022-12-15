const
// https://hgotoh.jp/wiki/doku.php/documents/other/other-017
// https://gist.github.com/ysakasin/2edf8d3bf55c6ebf63f82851e302b030
// https://ja.wikipedia.org/wiki/ZIP_(%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88)#%E6%8A%80%E8%A1%93%E7%9A%84%E3%81%AA%E6%83%85%E5%A0%B1
zip=async(w=[],f=_=>_)=>await(async(
	u=Uint8Array,zz=new u([0,0]),v10=new u([10,0]),pk=[...Array(3)].map((_,i)=>new u([80,75,(i*=2)+1,i+2])),stat={pre:[0,w.reduce((a,x)=>a+x.blob.size,0)],post:[0,w.length]},
	cnt=x=>x.reduce((a,y)=>a+(y.byteLength||y.size||0),0),le=(x,l=4)=>new u(l).map((_,i)=>x>>>(i*8)),te=new TextEncoder(),d2=_=>[_,_],
	crct=[...Array(256)].map((_,n)=>[...Array(8)].reduce((c,_,k)=>(c&1)?0xedb88320^(c>>>1):c>>>1,n)),crc=(buf,crc=0)=>buf.reduce((c,x)=>crct[(c^x)&0xff]^(c>>>8),crc^-1)^-1// https://www.rfc-editor.org/rfc/rfc1952
)=>(f(stat),await w.reduce(async(a,{path:n,blob:b,date:d=new Date()},x)=>(
	x={
		n:te.encode(n),c:le(crc(new u(await new Response(b).arrayBuffer()))),
		d:le(((d.getFullYear()-1980)<<25)|((d.getMonth()+1)<<21)|(d.getDate()<<16)|(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1))// mmmsssss hhhhhmmm MMMDDDDD YYYYYYYM // Y-=1980;s/=2;
	},
	x.x=[v10,zz,zz,x.d,x.c,...d2(le(b.size)),le(x.n.byteLength,2),zz],// vReq flag cpsType date CRC32 ...[cpsSize rawSize] nameLength extLength
	stat.pre[0]+=b.size,f(stat),a=await a,
	a.cd.push(pk[0],v10,...x.x,zz,zz,zz,zz,zz,le(cnt(a.lf)),x.n),// PK0102 vMade X cmtLength 0304disk intAttr extAttrLSB extAttrMSB 0304pos name
	a.lf.push(pk[1],...x.x,x.n,b),// PK0304 X name content
	stat.post[0]++,f(stat),a
),{lf:[],cd:[],_(){return new Blob([...this.lf,...this.cd,
	pk[2],zz,zz,...d2(le(w.length,2)),le(cnt(this.cd)),le(cnt(this.lf)),zz// PK0506 disk 0304startDisk ...[cnt0102disk cnt0102all] 0102size 0102pos cmtLength
],{type:'application/zip'});}}))._())(),
dl=({name:n,blob:b})=>(a=>URL.revokeObjectURL(a.href=URL.createObjectURL(b),a.download=n,a.click()))(document.createElement('a')),
progress=(w,f)=>new Response(new ReadableStream({start:async(c,l=0,x,a=+w.headers.get('content-length'),r=w.body.getReader())=>{while(x=(await r.read()).value){c.enqueue(x);f([l+=x.length,a]);}c.close();}}));
export{zip,dl,progress};