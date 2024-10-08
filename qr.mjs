/*

thanks to
- [日本産業規格の簡易閲覧 - JISX0510:2018](https://kikakurui.com/x0/X0510-2018-01.html)
- [独極 - 独学QRコード](http://ik1-316-18424.vs.sakura.ne.jp/category/QRCode/index.html)
- [Thonky.com's QR Code Tutorial](https://www.thonky.com/qr-code-tutorial/)
- [Creating a QR Code step by step](https://www.nayuki.io/page/creating-a-qr-code-step-by-step)
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
		},
		v:[// ap:[6,...ap,l-7], ec[lv]:[short_data_l,short_blk_n(,long_blk_n)]
			{ec:[[19,1],[16,1],[13,1],[9,1]]},{ec:[[34,1],[28,1],[22,1],[16,1]]},
			{ec:[[55,1],[44,1],[17,2],[13,2]]},{ec:[[80,1],[32,2],[24,2],[9,4]]},
			{ec:[[108,1],[43,2],[15,2,2],[11,2,2]]},{ec:[[68,2],[27,4],[19,4],[15,4]]},
			{ap:[22],ec:[[78,2],[31,4],[14,2,4],[13,4,1]]},{ap:[24],ec:[[97,2],[38,2,2],[18,4,2],[14,4,2]]},
			{ap:[26],ec:[[116,2],[36,3,2],[16,4,4],[12,4,4]]},{ap:[28],ec:[[68,2,2],[43,4,1],[19,6,2],[15,6,2]]},
			{ap:[30],ec:[[81,4],[50,1,4],[22,4,4],[12,3,8]]},{ap:[32],ec:[[92,2,2],[36,6,2],[20,4,6],[14,7,4]]},
			{ap:[34],ec:[[107,4],[37,8,1],[20,8,4],[11,12,4]]},{ap:[26,46],ec:[[115,3,1],[40,4,5],[16,11,5],[12,11,5]]},
			{ap:[26,48],ec:[[87,5,1],[41,5,5],[24,5,7],[12,11,7]]},{ap:[26,50],ec:[[98,5,1],[45,7,3],[19,15,2],[15,3,13]]},
			{ap:[30,54],ec:[[107,1,5],[46,10,1],[22,1,15],[14,2,17]]},{ap:[30,56],ec:[[120,5,1],[43,9,4],[22,17,1],[14,2,19]]},
			{ap:[30,58],ec:[[113,3,4],[44,3,11],[21,17,4],[13,9,16]]},{ap:[34,62],ec:[[107,3,5],[41,3,13],[24,15,5],[15,15,10]]},
			{ap:[28,50,72],ec:[[116,4,4],[42,17],[22,17,6],[16,19,6]]},{ap:[26,50,74],ec:[[111,2,7],[46,17],[24,7,16],[13,34]]},
			{ap:[30,54,78],ec:[[121,4,5],[47,4,14],[24,11,14],[15,16,14]]},{ap:[28,54,80],ec:[[117,6,4],[45,6,14],[24,11,16],[16,30,2]]},
			{ap:[32,58,84],ec:[[106,8,4],[47,8,13],[24,7,22],[15,22,13]]},{ap:[30,58,86],ec:[[114,10,2],[46,19,4],[22,28,6],[16,33,4]]},
			{ap:[34,62,90],ec:[[122,8,4],[45,22,3],[23,8,26],[15,12,28]]},{ap:[26,50,74,98],ec:[[117,3,10],[45,3,23],[24,4,31],[15,11,31]]},
			{ap:[30,54,78,102],ec:[[116,7,7],[45,21,7],[23,1,37],[15,19,26]]},{ap:[26,52,78,104],ec:[[115,5,10],[47,19,10],[24,15,25],[15,23,25]]},
			{ap:[30,56,82,108],ec:[[115,13,3],[46,2,29],[24,42,1],[15,23,28]]},{ap:[34,60,86,112],ec:[[115,17],[46,10,23],[24,10,35],[15,19,35]]},
			{ap:[30,58,86,114],ec:[[115,17,1],[46,14,21],[24,29,19],[15,11,46]]},{ap:[34,62,90,118],ec:[[115,13,6],[46,14,23],[24,44,7],[16,59,1]]},
			{ap:[30,54,78,102,126],ec:[[121,12,7],[47,12,26],[24,39,14],[15,22,41]]},{ap:[24,50,76,102,128],ec:[[121,6,14],[47,6,34],[24,46,10],[15,2,64]]},
			{ap:[28,54,80,106,132],ec:[[122,17,4],[46,29,14],[24,49,10],[15,24,46]]},{ap:[32,58,84,110,136],ec:[[122,4,18],[46,13,32],[24,48,14],[15,42,32]]},
			{ap:[26,54,82,110,138],ec:[[117,20,4],[47,40,7],[24,43,22],[15,10,67]]},{ap:[30,58,86,114,142],ec:[[118,19,6],[47,18,31],[24,34,34],[15,20,61]]}
		].reduce((a,x,i)=>(
			x.l=21+i*4,// モジュール数/辺
			x.ap=i?[6,...(x.ap||[]),x.l-7]:[],// 位置合わせパターン座標
			x.dw=(x.l**2-(192+Math.max(0,x.ap.length**2-3)*25+(x.l-16-Math.max(0,x.ap.length-2)*5)*2)-(31+(5<i)*36))>>3,// データ容量 (size-(pos+align-timing)-info)/8 cf.p17表1
			x.ec=x.ec.map(y=>(y=y.slice(1).reduce((a,c,i)=>(a.b.push({l:y[0]+i,c}),a.e-=(y[0]+i)*c,a.n+=c,a),{b:[],e:x.dw,n:0}),{b:y.b,l:y.e/y.n})),// エラー訂正 cf.p36表9
			a[x.v=i+1]=x,a
		),{})
	},
	mode=(w)=>(w=[...w].reduce((a,x)=>(Object.keys(a).forEach(i=>(x in d.m[i])||(a[i]=0)),a),{n:1,a:1,k:1}),w=w.n?0:w.a?1:w.k?3:2,{x:1<<w,l:4,s:w}),
	rse=(w,n)=>((
		{exp,log}=[...Array(255)].reduce((a,_,i)=>(a.exp[i]=a.x,a.log[a.x]=i,a.x*=2,(a.x>255)&&(a.x^=0x11d),a),{x:1,exp:[],log:[]}),
		mul=(x,y)=>x&&y&&(x=log[x]+log[y],exp[x]||exp[x-255]),pow=(x,y)=>exp[(log[x]*y)%255],
		g=[...Array(n)].reduce((b,_,k)=>[1,pow(2,k)].reduce((a,y,j)=>(b.forEach((x,i)=>a[i+j]^=mul(x,y)),a),[]),[1])
	)=>[...w,...w.reduce((a,_,i)=>(a[i]&&g.slice(1).forEach((x,j)=>a[i+j+1]^=mul(x,a[i])),a),w).slice(-n)])()	
)=>(
	w={
		d:w.map(w=>(
			w={w,m:mode(w)},
			// console.log('mode',['NUM','ALPHANUM','BYTE','KANJI'][w.m.s]),
			w.d=([
				_=>[...Array(Math.ceil(w.w.length/3))].map((x,i)=>(x=w.w.slice(i*3,++i*3),{x:+x,l:[0,4,7,10][x.length]})),// NUM
				_=>[...Array(Math.ceil(w.w.length/2))].map((x,i)=>(x=w.w.slice(i*2,++i*2),{x:[...x].reduce((a,x)=>a=a*45+d.m.a[x],0),l:[0,6,11][x.length]})),// ALPHANUM
				_=>[...te.encode(w.w)].map(x=>({x,l:8})),// BYTE
				_=>[...w.w].map(x=>({x:d.m.k[x],l:13}))// KANJI
			][w.m.s])(),
			w.c=v=>({x:(w['wd'[w.m.s>>1]].length),l:[[10,12,14],[9,11,13],[8,16,16],[8,10,12]][w.m.s][(9<v)+(26<v)]}),
			w.l=v=>w.m.l+w.c(v).l+w.d.reduce((a,x)=>a+x.l,0),
			w
		)),
		l:v=>w.d.reduce((a,x)=>a+x.l(v),0),
		x:v=>(b=>[...Array(Math.ceil(b.length/8))].map((_,i)=>+('0b'+b.slice(i*=8,i+8).padEnd(8,0))))(
			w.d.flatMap(w=>[w.m,w.c(v),...w.d].map(({x,l})=>x.toString(2).padStart(l,0))).join('')
		)
	},
	console.log(w.x(1).map(x=>x.toString(16).padStart(2,0))),
	w
))();

export{qr};

// console.log(rse([0x40,0xd2,0x75,0x47,0x76,0x17,0x32,0x06,0x27,0x26,0x96,0xc6,0xc6,0x96,0x70,0xec],10).map(x=>x.toString(16)));
// console.log(rse([0x41,0x14,0x86,0x56,0xC6,0xC6,0xF2,0xC2,0x07,0x76,0xF7,0x26,0xC6,0x42,0x12,0x03,0x13,0x23,0x30],7).map(x=>x.toString(16)));
