/*

thanks to
- [独極 - 独学QRコード](http://ik1-316-18424.vs.sakura.ne.jp/category/QRCode/index.html)
- [Thonky.com's QR Code Tutorial](https://www.thonky.com/qr-code-tutorial/)
- [wikiversity - Reed–Solomon codes for coders](https://en.wikiversity.org/wiki/Reed–Solomon_codes_for_coders)

*/
const
qr=(w)=>((
	te=new TextEncoder(),td_sjis=new TextDecoder('sjis'),
	d={
		m:{
			n:[...Array(10)].reduce((a,_,i)=>(a[i]=i,a),{}),
			a:[...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'].reduce((a,x,i)=>(a[x]=i,a),{}),
			k:[...Array(86)].reduce((a,y,_y)=>(y=(_y/2|0)+0x81+0x40*(61<_y),[...Array(_y==85?33:94)].forEach((_,x)=>(x+=_y&1?0x9f:0x40+(62<x),
				a[td_sjis.decode(new Uint8Array([y,x]))]=(y-(0x9f<y?0xc1:0x81))*0xc0+x-0x40
			)),a),{})
		}
	},
	mode=(w)=>(w=[...w].reduce((a,x)=>(Object.keys(a).forEach(i=>(x in d.m[i])||(a[i]=0)),a),{n:1,a:1,k:1}),w.n?0:w.a?1:w.k?3:2),
	rse=(w,n)=>((
		{exp,log}=[...Array(255)].reduce((a,_,i)=>(a.exp[i]=a.x,a.log[a.x]=i,a.x*=2,(a.x>255)&&(a.x^=0x11d),a),{x:1,exp:[],log:[]}),
		mul=(x,y)=>x&&y&&(x=log[x]+log[y],exp[x]||exp[x-255]),pow=(x,y)=>exp[(log[x]*y)%255],
		g=[...Array(n)].reduce((b,_,k)=>[1,pow(2,k)].reduce((a,y,j)=>(b.forEach((x,i)=>a[i+j]^=mul(x,y)),a),[]),[1])
	)=>[...w,...w.reduce((a,_,i)=>(a[i]&&g.slice(1).forEach((x,j)=>a[i+j+1]^=mul(x,a[i])),a),w).slice(-n)])()	
)=>(
	console.log('mode',['NUM','ALPHANUM','BYTE','KANJI'][mode(w)]),
	w=([
		_=>[...Array(Math.ceil(w.length/3))].map((x,i)=>(x=w.slice(i*3,++i*3),{x:d.m.n[x],l:[0,4,7,10][x.length]})),// NUM
		_=>[...Array(Math.ceil(w.length/2))].map((x,i)=>(x=w.slice(i*2,++i*2),{x:[...x].reduce((a,x)=>a=a*45+d.m.a[x],0),l:[0,6,11][x.length]})),// ALPHANUM
		_=>[...te.encode(w)].map(x=>({x,l:8})),// BYTE
		_=>[...w].map(x=>({x:d.m.k[x],l:13}))// KANJI
	][mode(w)])(),
	w
))();

export{qr};

// console.log(rse([0x40,0xd2,0x75,0x47,0x76,0x17,0x32,0x06,0x27,0x26,0x96,0xc6,0xc6,0x96,0x70,0xec],10).map(x=>x.toString(16)));
// console.log(rse([0x41,0x14,0x86,0x56,0xC6,0xC6,0xF2,0xC2,0x07,0x76,0xF7,0x26,0xC6,0x42,0x12,0x03,0x13,0x23,0x30],7).map(x=>x.toString(16)));
