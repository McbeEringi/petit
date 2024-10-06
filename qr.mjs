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
		v:[...Array(40)].reduce((a,x={},i)=>(
			// JISX0510:2018 p17 表1
			x.l=21+i*4,// モジュール数/辺
			x.fpm=(_=>(// 機能パターンモジュール
				_.ap=Math.max(0,_.apps**2-3)*25,// 位置合わせパターンモジュール
				_.tp=(x.l-16-Math.max(0,_.apps-2)*5)*2,// タイミングパターンモジュール
				_.pp+_.ap+_.tp
			))({
				pp:192,// 位置検出及び分離パターンモジュール
				apps:i?((i+1)/7|0)+2:0// 位置合わせパターン/辺
			}),
			x.im=31+(5<i)*18*2,// 形式情報及び型番情報モジュール
			x.dm=x.l**2-x.fpm-x.im,// データモジュール
			x.dw=x.dm>>3,// データ容量
			x.dr=x.dm&7,// 残余ビット

			a[x.ver=i+1]=x,a
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
		x:v=>w.d.flatMap(x=>[x.m,x.c(v),...x.d],0).reduce((a,{x,l})=>(a),{a:[],x:0,i:0})
	},
	w
))();

export{qr};

// console.log(rse([0x40,0xd2,0x75,0x47,0x76,0x17,0x32,0x06,0x27,0x26,0x96,0xc6,0xc6,0x96,0x70,0xec],10).map(x=>x.toString(16)));
// console.log(rse([0x41,0x14,0x86,0x56,0xC6,0xC6,0xF2,0xC2,0x07,0x76,0xF7,0x26,0xC6,0x42,0x12,0x03,0x13,0x23,0x30],7).map(x=>x.toString(16)));
