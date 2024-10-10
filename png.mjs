const// https://qiita.com/McbeEringi/items/9928a9bc05798924e68c
png=({data:d,width:w,height:h,palette:p,alpha:a})=>((
	crc=(t=>(buf,crc=0)=>~buf.reduce((c,x)=>t[(c^x)&0xff]^(c>>>8),~crc))([...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n))),// https://www.rfc-editor.org/rfc/rfc1952
	adler=data=>{let a=1,b=0,len=data.length,tlen,i=0;while(len>0){len-=(tlen=Math.min(1024,len));do{b+=(a+=data[i++]);}while(--tlen);a%=65521;b%=65521;}return(b<<16)|a;},
	be4=x=>[x>>>24&255,x>>>16&255,x>>>8&255,x>>>0&255],ch=x=>[...be4(x.length-4),...x,...be4(crc(x))],bd=[1,2,4,8][p?Math.ceil(Math.log2(Math.ceil(Math.log2(p.length)))):3],bdi=8/bd
)=>Object.assign([
	137,80,78,71,13,10,26,10,// header
	...ch([73,72,68,82, ...be4(w),...be4(h), bd,p?3:alpha?6:2, 0,0,0]),// IHDR: w h bitDepth colType 0,0,0
	...p?ch([80,76,84,69,...p.flatMap(x=>be4(a?x>>>8:x).slice(1))]):[],// PLTE: ...RGB
	...p&&a?ch([116,82,78,83,...p.map(x=>x&255)]):[],// tRNS: ...alpha
	...ch([73,68,65,84, 8,29, ...(x=>[...[...Array(Math.ceil(x.length/65535))].flatMap((y,i,{length:a},l)=>(y=x.slice(65535*i++,65535*i),l=y.length,[i==a,l>>>0&255,l>>>8&255,~l>>>0&255,~l>>>8&255,...y])),...be4(adler(x))])(
		[...Array(h)].flatMap((_,i)=>(i=d.slice(w*i,w*++i),[0,...p?[...Array(Math.ceil(w/bdi))].map((_,j)=>[...Object.assign(i.slice(bdi*j,bdi*++j),{length:bdi})].reduce((a,x)=>a<<bd|(x&2**bd-1),0)):i]))
	)]),// DATA
	0,0,0,0,73,69,78,68,174,66,96,130// IEND
],{toDataURL(){return'data:image/png;base64,'+btoa(String.fromCharCode(...this));},toBlob(){return new Blob([new Uint8Array(this)],{type:'image/png'})}}))();

export{png};