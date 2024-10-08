import{png}from'./png.mjs';
/*

thanks to
- [日本産業規格の簡易閲覧 - JISX0510:2018](https://kikakurui.com/x0/X0510-2018-01.html)
- [独極 - 独学QRコード](http://ik1-316-18424.vs.sakura.ne.jp/category/QRCode/index.html)
- [Thonky.com's QR Code Tutorial](https://www.thonky.com/qr-code-tutorial/)
- [Creating a QR Code step by step](https://www.nayuki.io/page/creating-a-qr-code-step-by-step)
- [wikiversity - Reed–Solomon codes for coders](https://en.wikiversity.org/wiki/Reed–Solomon_codes_for_coders)

*/
const
qr=(w,{ecl=0,v=0}={})=>((
	te=new TextEncoder(),td_sjis=new TextDecoder('sjis'),oa=Object.assign,
	d={
		m:{
			enum:['NUM','ALPHANUM','BYTE','KANJI'],
			n:[...Array(10)].reduce((a,_,i)=>(a[i]=i,a),{}),
			a:[...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'].reduce((a,x,i)=>(a[x]=i,a),{}),
			k:[...Array(86)].reduce((a,y,_y)=>(y=(_y/2|0)+0x81+0x40*(61<_y),[...Array(_y==85?33:94)].forEach((_,x)=>(x+=_y&1?0x9f:0x40+(62<x),
				a[td_sjis.decode(new Uint8Array([y,x]))]=(y-(0x9f<y?0xc1:0x81))*0xc0+x-0x40
			)),a),{})
		},
		v:[// [...ec,...ap] ec[lv=0~3]:[short_data_l,short_blk_n(,long_blk_n)], ap:[6,...ap,l-7]
			[[19,1],[16,1],[13,1],[9,1]],[[34,1],[28,1],[22,1],[16,1]],
			[[55,1],[44,1],[17,2],[13,2]],[[80,1],[32,2],[24,2],[9,4]],
			[[108,1],[43,2],[15,2,2],[11,2,2]],[[68,2],[27,4],[19,4],[15,4]],
			[[78,2],[31,4],[14,2,4],[13,4,1],22],[[97,2],[38,2,2],[18,4,2],[14,4,2],24],
			[[116,2],[36,3,2],[16,4,4],[12,4,4],26],[[68,2,2],[43,4,1],[19,6,2],[15,6,2],28],
			[[81,4],[50,1,4],[22,4,4],[12,3,8],30],[[92,2,2],[36,6,2],[20,4,6],[14,7,4],32],
			[[107,4],[37,8,1],[20,8,4],[11,12,4],34],[[115,3,1],[40,4,5],[16,11,5],[12,11,5],26,46],
			[[87,5,1],[41,5,5],[24,5,7],[12,11,7],26,48],[[98,5,1],[45,7,3],[19,15,2],[15,3,13],26,50],
			[[107,1,5],[46,10,1],[22,1,15],[14,2,17],30,54],[[120,5,1],[43,9,4],[22,17,1],[14,2,19],30,56],
			[[113,3,4],[44,3,11],[21,17,4],[13,9,16],30,58],[[107,3,5],[41,3,13],[24,15,5],[15,15,10],34,62],
			[[116,4,4],[42,17],[22,17,6],[16,19,6],28,50,72],[[111,2,7],[46,17],[24,7,16],[13,34],26,50,74],
			[[121,4,5],[47,4,14],[24,11,14],[15,16,14],30,54,78],[[117,6,4],[45,6,14],[24,11,16],[16,30,2],28,54,80],
			[[106,8,4],[47,8,13],[24,7,22],[15,22,13],32,58,84],[[114,10,2],[46,19,4],[22,28,6],[16,33,4],30,58,86],
			[[122,8,4],[45,22,3],[23,8,26],[15,12,28],34,62,90],[[117,3,10],[45,3,23],[24,4,31],[15,11,31],26,50,74,98],
			[[116,7,7],[45,21,7],[23,1,37],[15,19,26],30,54,78,102],[[115,5,10],[47,19,10],[24,15,25],[15,23,25],26,52,78,104],
			[[115,13,3],[46,2,29],[24,42,1],[15,23,28],30,56,82,108],[[115,17],[46,10,23],[24,10,35],[15,19,35],34,60,86,112],
			[[115,17,1],[46,14,21],[24,29,19],[15,11,46],30,58,86,114],[[115,13,6],[46,14,23],[24,44,7],[16,59,1],34,62,90,118],
			[[121,12,7],[47,12,26],[24,39,14],[15,22,41],30,54,78,102,126],[[121,6,14],[47,6,34],[24,46,10],[15,2,64],24,50,76,102,128],
			[[122,17,4],[46,29,14],[24,49,10],[15,24,46],28,54,80,106,132],[[122,4,18],[46,13,32],[24,48,14],[15,42,32],32,58,84,110,136],
			[[117,20,4],[47,40,7],[24,43,22],[15,10,67],26,54,82,110,138],[[118,19,6],[47,18,31],[24,34,34],[15,20,61],30,58,86,114,142]
		].reduce((a,x,i)=>(
			x={_:x},x.l=21+i*4,x.ap=i?[6,...x._.slice(4),x.l-7]:[],// モジュール数/辺 位置合わせパターン座標
			x.de=(x.l**2-(192+Math.max(0,x.ap.length**2-3)*25+(x.l-16-Math.max(0,x.ap.length-2)*5)*2)-(31+(5<i)*36))>>3,// データ容量 (size-(pos+align-timing)-info)/8 cf.p17表1
			x.lv=x._.slice(0,4).map((y,lv)=>(y=y.slice(1).reduce((a,n,i)=>(a.b.push(Array(n).fill(y[0]+i)),a.d+=(y[0]+i)*n,a),{b:[],d:0}),y.b=y.b.flat(),{lv,b:y.b,d:y.d,e:(x.de-y.d)/y.b.length})),// エラー訂正 cf.p36表9
			delete x._,a[x.v=i+1]=x,a
		),{})
	},
	mode=(w)=>(w=[...w].reduce((a,x)=>(Object.keys(a).forEach(i=>(x in d.m[i])||(a[i]=0)),a),{n:1,a:1,k:1}),w=w.n?0:w.a?1:w.k?3:2,{x:1<<w,l:4,s:w}),
	rse=(w,n)=>((
		{exp,log}=[...Array(255)].reduce((a,_,i)=>(a.exp[i]=a.x,a.log[a.x]=i,a.x*=2,(a.x>255)&&(a.x^=0x11d),a),{x:1,exp:[],log:[]}),
		mul=(x,y)=>x&&y&&(x=log[x]+log[y],exp[x]||exp[x-255]),pow=(x,y)=>exp[(log[x]*y)%255],
		g=[...Array(n)].reduce((b,_,k)=>[1,pow(2,k)].reduce((a,y,j)=>(b.forEach((x,i)=>a[i+j]^=mul(x,y)),a),[]),[1]).slice(1)
	)=>w.reduce((a,_,i)=>(a[i]&&g.forEach((x,j)=>a[i+j+1]^=mul(x,a[i])),a),w.slice()).slice(-n))(),
	bch=({x:x,l:a},{x:y,l:b})=>[...Array(a)].reduce((e,_,i)=>(i++,((e>>(a+b-i))&1)?e^(y<<(a-i)):e),x<<b),
	// bcha=(a,b)=>[...((a.x<<b.l)|bch(a,b)).toString(2).padStart(a.l+b.l,0)],
	flatTr=w=>w[w.length-1].flatMap((_,i)=>w.reduce((a,x)=>(i in x&&a.push(x[i]),a),[])),
	a2px=w=>w.reduce((a,[x,y,f])=>(~f&&(a[[x,y]]={p:[x,y],x:f}),a),{}),
	px=({x,y,f})=>(~f?{[[x,y]]:{p:[x,y],x:f}}:{}),
	rect=({x,y=x,w,h=w,f,s=f})=>[...Array(h)].reduce((a,_x,j)=>([...Array(w)].forEach((_y,i,_)=>(_=(!i||i==w-1||!j||j==h-1)?s:f,~_&&(a[[_x=x+i,_y=y+j]]={p:[_x,_y],x:_}))),a),{})
)=>(
	w={
		d:w.map(w=>(
			w={w,m:mode(w)},
			w.d=([
				_=>[...Array(Math.ceil(w.w.length/3))].map((x,i)=>(x=w.w.slice(i*3,++i*3),{x:+x,l:[0,4,7,10][x.length]})),// NUM
				_=>[...Array(Math.ceil(w.w.length/2))].map((x,i)=>(x=w.w.slice(i*2,++i*2),{x:[...x].reduce((a,x)=>a=a*45+d.m.a[x],0),l:[0,6,11][x.length]})),// ALPHANUM
				_=>[...te.encode(w.w)].map(x=>({x,l:8})),// BYTE
				_=>[...w.w].map(x=>({x:d.m.k[x],l:13}))// KANJI
			][w.m.s])(),
			w.c=v=>({x:(w['wd'[w.m.s>>1]].length),l:[[10,12,14],[9,11,13],[8,16,16],[8,10,12]][w.m.s][(9<v)+(26<v)]}),
			w.l=v=>w.m.l+w.c(v).l+w.d.reduce((a,x)=>a+x.l,0),
			w
		))
	},
	w.v=d.v[Math.max(v,Object.values(d.v).find(x=>(w.d.reduce((a,y)=>a+y.l(x.v),0)<=x.lv[ecl].d<<3)).v)],
	w.lv=w.v.lv[ecl],
	w.m=w.d.map(x=>d.m.enum[x.m.s]),
	w.d=(b=>[...Array(w.lv.d)].reduce((a,x,i)=>(x=b.slice(i*=8,i+8),a.a.push(x?+('0b'+x.padEnd(8,0)):(a.i^=1)?236:17),a),{a:[],i:0}).a)(
		w.d.flatMap(x=>[x.m,x.c(w.v.v),...x.d].map(({x,l})=>x.toString(2).padStart(l,0))).join('')+'0000'
	),
	w.d=(({d,e})=>[d,e].flatMap(flatTr))(w.lv.b.reduce((a,x)=>(a.d.push(x=w.d.slice(a.p,a.p+=x)),a.e.push(rse(x,w.lv.e)),a),{d:[],e:[],p:0})),
	
	console.log(w.d.map(x=>x.toString(16).padStart(2,0))),

	w.a=oa(
		a2px([...Array(8)].flatMap((_,i)=>[i+(5<i),w.v.l-1-i].flatMap(x=>[[8,x,2],[x,8,2]]))),//reserve
		(({l,ap})=>oa(// functional pattern module
			a2px([...Array(l)].flatMap((x,i)=>(x=(i+1)&1,[[6,i,x],[i,6,x]]))),// time
			oa(...[[0,0,0,0],[l-7,0,-1,0],[0,l-7,0,-1]].map(([x,y,i,j])=>oa(// pos
				rect({x:0+x+i,y:0+y+j,w:8,f:0}),rect({x:0+x,y:0+y,w:7,f:-1,s:1}),rect({x:2+x,y:2+y,w:3,f:1})
			))),
			oa({},...ap.flatMap((y,j)=>ap.map((x,i)=>(i==0&&(j==0||j==ap.length-1)||(i==ap.length-1&&j==0)?{}:oa(// align
				rect({x:x-2,y:y-2,w:5,f:1}),rect({x:x-1,y:y-1,w:3,f:-1,s:0})
			))))),
			px({x:8,y:l-8,f:1})// dark
		))(w.v),
		// (({v,l})=>6<v?oa(rect({x:l-11,y:0,w:3,h:6,f:2}),rect({x:0,y:l-11,w:6,h:3,f:2})):{})(w.v)
		(({v,l})=>6<v?a2px([...((v<<12)|bch({x:v,l:6},{x:7973,l:12})).toString(2).padStart(18,0)].flatMap((x,i)=>([[...(i=[l-9-i%3,5-(i/3|0)]),+x],[i[1],i[0],+x]]))):{})(w.v)
		
	),
	w.dm=(({l})=>[...Array(l)].flatMap((_,y)=>[...Array(l-1)].flatMap((i,x)=>(
		i=l*2*((l-2-x)>>1)+!(x&1)+((x>>1)&1?l-1-y:y)*2,x+=5<x,
		w.a[[x,y]]?[]:[{p:[x,y],i}]
	))).sort(({i:a},{i:b})=>a-b))(w.v),

	oa(
		w.a,
		a2px(w.dm.map(({p},i)=>[...p,(w.d[i>>3]>>(7-(i&7)))&1]))
	),

	w.mask=0,
	w.dm.forEach(({p:[j,i]})=>w.a[[j,i]].x^=((i+j)&1)==0),
	oa(
		w.a,
		(({l},{lv},x=(+'1032'[lv]<<3)|w.mask)=>a2px([...(((x<<10)|bch({x,l:5},{x:1335,l:10}))^21522).toString(2).padStart(15,0)].flatMap((x,i)=>[[i+(5<i)+(6<i&&l-16),8,+x],[8,l-1-(i+(8<i)+(6<i&&l-16)),+x]])))(w.v,w.lv)
	),



	w.toPNG=({bg=0xffffffff,fg=0x000000ff,scale:s=4,padding:g=4}={})=>png({data:[...Array(w.v.l+g*2)].flatMap((_,y)=>(y-=g,Array(s).fill([...Array(w.v.l+g*2)].flatMap((_,x)=>(x-=g,
		Array(s).fill(0<=x&&x<w.v.l&&0<=y&&y<w.v.l?w.a[[x,y]].x:0)
	))).flat())),width:(w.v.l+g*2)*s,height:(w.v.l+g*2)*s,palette:[bg,fg],alpha:1}),

	w
))();

export{qr};

// console.log(rse([0x40,0xd2,0x75,0x47,0x76,0x17,0x32,0x06,0x27,0x26,0x96,0xc6,0xc6,0x96,0x70,0xec],10).map(x=>x.toString(16)));
// console.log(rse([0x41,0x14,0x86,0x56,0xC6,0xC6,0xF2,0xC2,0x07,0x76,0xF7,0x26,0xC6,0x42,0x12,0x03,0x13,0x23,0x30],7).map(x=>x.toString(16)));
