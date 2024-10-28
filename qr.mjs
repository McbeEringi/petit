import{png}from'./png.mjs';
/*

thanks to
- [日本産業規格の簡易閲覧 - JISX0510:2018](https://kikakurui.com/x0/X0510-2018-01.html)
- [独極 - 独学QRコード](http://ik1-316-18424.vs.sakura.ne.jp/category/QRCode/index.html)
- [Thonky.com's QR Code Tutorial](https://www.thonky.com/qr-code-tutorial/)
- [Creating a QR Code step by step](https://www.nayuki.io/page/creating-a-qr-code-step-by-step)
- [wikiversity - Reed–Solomon codes for coders](https://en.wikiversity.org/wiki/Reed–Solomon_codes_for_coders)

*/
const bench=1;

class QR{
	constructor(){
		const
		td_sjis=new TextDecoder('sjis'),
		d={
			mode:[
				{i:0,name:'NUM',enc:w=>(w={x:w,l:w.length},w.x=[...Array(Math.ceil(w.l/3))].map((x,i)=>w.e||(x=w.x.slice(3*i,3*++i),
					{x:isNaN(+x)?w.e=1:+x,l:[,4,7,10][x.length]}
				)),w.e?null:w)},
				(d=>(d.enc=w=>(w={x:w,l:w.length},w.x=[...Array(Math.ceil(w.l/2))].map((x,i)=>w.e||(x=[...w.x.slice(2*i,2*++i)],
					{x:x.reduce((a,x)=>(x in d.dict?a*45+d.dict[x]:w.e=1),0),l:[,6,11][x.length]}
				)),w.e?null:w),d))({i:1,name:'EISU',dict:[...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'].reduce((a,x,i)=>(a[x]=i,a),{})}),
				(d=>(d.enc=w=>(w={x:w,l:w.length},w.x=[...w.x].map(x=>w.e||(
					{x:x in d.dict?d.dict[x]:w.e=1,l:13}
				)),w.e?null:w),d))({i:3,name:'KANJI',dict:[...Array(86)].reduce((a,y,_y)=>(y=(_y/2|0)+0x81+0x40*(61<_y),[...Array(_y==85?33:94)].forEach((_,x)=>(x+=_y&1?0x9f:0x40+(62<x),
					a[td_sjis.decode(new Uint8Array([y,x]))]=(y-(0x9f<y?0xc1:0x81))*0xc0+x-0x40
				)),a),{})}),
				{i:2,name:'OCT',enc:(w,e)=>(w=[...e.encode(w)].map(x=>({x,l:8})),{x:w,l:w.length})}
			],
			ver:[// [...ec,...ap] ec[lv=0~3]:[short_data_l,short_blk_n(,long_blk_n)], ap:[6,...ap,l-7]
				,// empty slot
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
			].map((w,v)=>(
				w={_:w,v,size:17+v*4},
				w.align=v==1?[]:[6,w._.slice(4),w.size-7],
				w.cap=(w.size**2-(192+Math.max(0,w.align.length**2-3)*25+(w.size-16-Math.max(0,w.align.length-2)*5)*2)-(31+(6<v)*36))/8,// データ容量 (size-(pos+align+timing)-info)/8 cf.p17表1
				w.lv=w._.slice(0,4).map((x,lv)=>(
					x=x.slice(1).flatMap((l,i)=>Array(l).fill(x[0]+i)).reduce((a,l)=>(a.blocks.push([a.cap,a.cap+=l]),a),{lv,blocks:[],cap:0}),
					x.err=(w.cap-x.cap)/x.blocks.length,x
				)),
				delete w._,w
			)),
			mask:[(j,i)=>(i+j)%2,(j,i)=>i%2,(j,i)=>j%3,(j,i)=>(i+j)%3,(j,i)=>((i/2|0)+(j/3|0))%2,(j,i)=>(i*j)%2+(i*j)%3,(j,i)=>((i*j)%2+(i*j)%3)%2,(j,i)=>((i+j)%2+(i*j)%3)%2],// mask

			rs:(({exp,log,mul=(x,y)=>x&&y&&(x=log[x]+log[y],exp[x]||exp[x-255]),pow=(x,y)=>exp[(log[x]*y)%255]})=>
				(w,n)=>w.reduce((a,_,i)=>(a.a[i]&&a.g.forEach((x,j)=>a.a[i+j+1]^=mul(x,a.a[i])),a),{a:w.slice(),
					g:[...Array(n)].reduce((b,_,k)=>[1,pow(2,k)].reduce((a,y,j)=>(b.forEach((x,i)=>a[i+j]^=mul(x,y)),a),[]),[1]).slice(1)
				}).a.slice(-n)
			)([...Array(255)].reduce((a,_,i)=>(a.exp[i]=a.x,a.log[a.x]=i,a.x*=2,(a.x>255)&&(a.x^=0x11d),a),{x:1,exp:[],log:[]})),
			bch:({x:x,l:a},{x:y,l:b},m=0)=>[...(((x<<b)|[...Array(a)].reduce((e,_,i)=>(i++,((e>>(a+b-i))&1)?e^(y<<(a-i)):e),x<<b))^m).toString(2).padStart(a+b,0)]
		};

		Object.assign(this,{d});
	}
	gen(w=[],{ecl=1,ver=-1,mask=-1,te=new TextEncoder()}={}){return((oa,{d})=>(
		self.t0=performance.now(),
		w={
			data:[...Array(bench)].reduce(_=>w.map(w=>d.mode.reduce((a,d,x)=>a||(x=d.enc(w,te))&&({
				mode:{name:d.name,x:1<<d.i,l:4,s:d.i},len:{x:x.l,l:[[10,12,14],[9,11,13],[8,16,16],[8,10,12]][d.i]},data:{x:x.x,l:x.x.reduce((a,x)=>a+x.l,0)}
			}),null)),0)
		},
		
		console.log('new',w,performance.now()-t0)

	))(Object.assign,this);}
}



const
qr=(w,{ecl=0,v=0}={})=>((
	te=new TextEncoder(),td_sjis=new TextDecoder('sjis'),oa=Object.assign,
	a2px=w=>w.reduce((a,[x,y,f])=>(~f&&(a[[x,y]]={p:[x,y],x:f}),a),{}),
	rect=({x,y=x,w,h=w,f=-1,s=f})=>[...Array(h)].reduce((a,_x,j)=>([...Array(w)].forEach((_y,i,_)=>(_=(!i||i==w-1||!j||j==h-1)?s:f,~_&&(a[[_x=x+i,_y=y+j]]={p:[_x,_y],x:_}))),a),{}),
	d={
		m:{
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
		),{}),
		mp:[(j,i)=>(i+j)%2,(j,i)=>i%2,(j,i)=>j%3,(j,i)=>(i+j)%3,(j,i)=>((i/2|0)+(j/3|0))%2,(j,i)=>(i*j)%2+(i*j)%3,(j,i)=>((i*j)%2+(i*j)%3)%2,(j,i)=>((i+j)%2+(i*j)%3)%2]// mask
	},
	rs=(w,n)=>((
		{exp,log}=[...Array(255)].reduce((a,_,i)=>(a.exp[i]=a.x,a.log[a.x]=i,a.x*=2,(a.x>255)&&(a.x^=0x11d),a),{x:1,exp:[],log:[]}),
		mul=(x,y)=>x&&y&&(x=log[x]+log[y],exp[x]||exp[x-255]),pow=(x,y)=>exp[(log[x]*y)%255],
		g=[...Array(n)].reduce((b,_,k)=>[1,pow(2,k)].reduce((a,y,j)=>(b.forEach((x,i)=>a[i+j]^=mul(x,y)),a),[]),[1]).slice(1)
	)=>w.reduce((a,_,i)=>(a[i]&&g.forEach((x,j)=>a[i+j+1]^=mul(x,a[i])),a),w.slice()).slice(-n))(),
	bch=({x:x,l:a},{x:y,l:b},m=0)=>[...(((x<<b)|[...Array(a)].reduce((e,_,i)=>(i++,((e>>(a+b-i))&1)?e^(y<<(a-i)):e),x<<b))^m).toString(2).padStart(a+b,0)]
)=>(
	self.t0=performance.now(),
	w={
		d:[...Array(bench)].reduce(_=>w.map(w=>(
			w={w},
			w.m=(s=>(s=s.n?0:s.a?1:s.k?3:2,{x:1<<s,l:4,s}))([...w.w].reduce((a,x)=>(a.m.forEach(i=>(x in d.m[i])||(a[i]=0)),a),{m:[...'nak'],n:1,a:1,k:1})),
			w.d=([
				_=>[...Array(Math.ceil(w.w.length/3))].map((x,i)=>(x=w.w.slice(i*3,++i*3),{x:+x,l:[0,4,7,10][x.length]})),// NUM
				_=>[...Array(Math.ceil(w.w.length/2))].map((x,i)=>(x=w.w.slice(i*2,++i*2),{x:[...x].reduce((a,x)=>a=a*45+d.m.a[x],0),l:[0,6,11][x.length]})),// ALPHANUM
				_=>[...te.encode(w.w)].map(x=>({x,l:8})),// BYTE
				_=>[...w.w].map(x=>({x:d.m.k[x],l:13}))// KANJI
			][w.m.s])(),
			w.c=v=>({x:(w['wd'[w.m.s>>1]].length),l:[[10,12,14],[9,11,13],[8,16,16],[8,10,12]][w.m.s][(9<v)+(26<v)]}),
			w.l=v=>w.m.l+w.c(v).l+w.d.reduce((a,x)=>a+x.l,0),
			w
		)),0)
	},
	console.log('old',w,performance.now()-t0),
	w.v=d.v[Math.max(v,Object.values(d.v).find(x=>(w.d.reduce((a,y)=>a+y.l(x.v),0)<=x.lv[ecl].d<<3)).v)],
	w.lv=w.v.lv[ecl],
	w.m=w.d.map(x=>['NUM','ALPHANUM','BYTE','KANJI'][x.m.s]),
	w.d=(b=>[...Array(w.lv.d)].reduce((a,x,i)=>(x=b.slice(i*=8,i+8),a.a.push(x?+('0b'+x.padEnd(8,0)):(a.i^=1)?236:17),a),{a:[],i:0}).a)(
		w.d.flatMap(x=>[x.m,x.c(w.v.v),...x.d].map(({x,l})=>x.toString(2).padStart(l,0))).join('')+'0000'
	),
	w.d=(({d,e})=>[d,e].flatMap(w=>w[w.length-1].flatMap((_,i)=>w.reduce((a,x)=>(i in x&&a.push(x[i]),a),[]))))(
		w.lv.b.reduce((a,x)=>(a.d.push(x=w.d.slice(a.p,a.p+=x)),a.e.push(rs(x,w.lv.e)),a),{d:[],e:[],p:0})
	),

	w.a=oa(
		a2px([...Array(8)].flatMap((_,i)=>[i+(5<i),w.v.l-1-i].flatMap(x=>[[8,x,2],[x,8,2]]))),//reserve
		(({l,ap})=>oa(// functional pattern module
			a2px([...Array(l)].flatMap((x,i)=>(x=(i+1)&1,[[6,i,x],[i,6,x]]))),// time
			oa(...[[0,0,0,0],[l-7,0,-1,0],[0,l-7,0,-1]].map(([x,y,i,j])=>oa(// pos
				rect({x:0+x+i,y:0+y+j,w:8,f:0}),rect({x:0+x,y:0+y,w:7,s:1}),rect({x:2+x,y:2+y,w:3,f:1})
			))),
			oa({},...ap.flatMap((y,j)=>ap.map((x,i)=>(i==0&&(j==0||j==ap.length-1)||(i==ap.length-1&&j==0)?{}:oa(// align
				rect({x:x-2,y:y-2,w:5,f:1}),rect({x:x-1,y:y-1,w:3,s:0})
			))))),
			(p=>({[p]:{p,x:1}}))([8,l-8])// dark
		))(w.v),
		(({v,l})=>6<v?a2px(bch({x:v,l:6},{x:7973,l:12}).flatMap((x,i)=>([[...(i=[l-9-i%3,5-(i/3|0)]),+x],[i[1],i[0],+x]]))):{})(w.v)
	),

	w.dm=(({l})=>[...Array(l)].flatMap((_,y)=>[...Array(l-1)].flatMap((i,x)=>(// data module map
		i=l*2*((l-2-x)>>1)+!(x&1)+((x>>1)&1?l-1-y:y)*2,x+=5<x,
		w.a[[x,y]]?[]:[{p:[x,y],i}]
	))).sort(({i:a},{i:b})=>a-b))(w.v),
	oa(w.a,a2px(w.dm.map(({p},i)=>[...p,(w.d[i>>3]>>(7-(i&7)))&1]))),// data module

	w.a=d.mp.map((x,mi)=>oa({},w.a,// mask gen
		a2px(w.dm.map(({p})=>[...p,w.a[p].x^!x(...p)])),
		(({l},{lv})=>a2px(bch({x:(+'1032'[lv]<<3)|mi,l:5},{x:1335,l:10},21522).flatMap((x,i)=>[[i+(5<i)+(6<i&&l-16),8,+x],[8,l-1-(i+(8<i)+(6<i&&l-16)),+x]])))(w.v,w.lv)
	)),

	oa(w,w.a.map((a,i,s,l)=>(// mask eval
		l=[...Array(w.v.l)],
		s=l.reduce((b,_,i,ll)=>b+ll.reduce((c,_,j)=>(c[0]+=a[[i,j]].x,c[1]+=a[[j,i]].x,c),['','']).map(x=>`2222${x}2222,`).join(''),''),
		s=(s.match(/0{5,}|1{5,}/g)||[]).reduce((c,x)=>c+x.length-2,0)+// N1
			l.slice(1).reduce((b,_,i,ll)=>(ll.forEach((_,j)=>((a[[i,j]].x+a[[i+1,j]].x+a[[i,j+1]].x+a[[i+1,j+1]].x)&3)==0&&(b+=3)),b),0)+// N2
			(s.match(/(?<=[02]{4,}1011)101[02]|[02]101(?=1101[02]{4,})/g)||[]).length*40+// N3
			(Math.abs(Object.values(a).filter(x=>x.x).length/(l.length*l.length)-.5)*20|0)*10,// N4
		{a,mask:{i,s}}
	)).sort(({mask:{s:a}},{mask:{s:b}})=>a-b)[0]),

	w.toPNG=({bg=0xffffffff,fg=0x000000ff,scale:s=4,padding:g=4}={})=>png({data:[...Array(w.v.l+g*2)].flatMap((_,y)=>(y-=g,Array(s).fill([...Array(w.v.l+g*2)].flatMap((_,x)=>(x-=g,
		Array(s).fill(0<=x&&x<w.v.l&&0<=y&&y<w.v.l?w.a[[x,y]].x:0)
	))).flat())),width:(w.v.l+g*2)*s,height:(w.v.l+g*2)*s,palette:[bg,fg],alpha:1}),

	w
))();

export{qr,QR};

// class QR{
// 	constructor(){
// 		const td_sjis=new TextDecoder('sjis');
// 		Object.assign(this,{
// 			oa:Object.assign,
// 			a2px:w=>w.reduce((a,[x,y,f])=>(~f&&(a[[x,y]]={p:[x,y],x:f}),a),{}),
// 			rect:({x,y=x,w,h=w,f=-1,s=f})=>[...Array(h)].reduce((a,_x,j)=>([...Array(w)].forEach((_y,i,_)=>(_=(!i||i==w-1||!j||j==h-1)?s:f,~_&&(a[[_x=x+i,_y=y+j]]={p:[_x,_y],x:_}))),a),{}),
// 			d:{
// 				m:{
// 					n:[...Array(10)].reduce((a,_,i)=>(a[i]=i,a),{}),
// 					a:[...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'].reduce((a,x,i)=>(a[x]=i,a),{}),
// 					k:[...Array(86)].reduce((a,y,_y)=>(y=(_y/2|0)+0x81+0x40*(61<_y),[...Array(_y==85?33:94)].forEach((_,x)=>(x+=_y&1?0x9f:0x40+(62<x),
// 						a[td_sjis.decode(new Uint8Array([y,x]))]=(y-(0x9f<y?0xc1:0x81))*0xc0+x-0x40
// 					)),a),{})
// 				},
// 				v:[// [...ec,...ap] ec[lv=0~3]:[short_data_l,short_blk_n(,long_blk_n)], ap:[6,...ap,l-7]
// 					[[19,1],[16,1],[13,1],[9,1]],[[34,1],[28,1],[22,1],[16,1]],
// 					[[55,1],[44,1],[17,2],[13,2]],[[80,1],[32,2],[24,2],[9,4]],
// 					[[108,1],[43,2],[15,2,2],[11,2,2]],[[68,2],[27,4],[19,4],[15,4]],
// 					[[78,2],[31,4],[14,2,4],[13,4,1],22],[[97,2],[38,2,2],[18,4,2],[14,4,2],24],
// 					[[116,2],[36,3,2],[16,4,4],[12,4,4],26],[[68,2,2],[43,4,1],[19,6,2],[15,6,2],28],
// 					[[81,4],[50,1,4],[22,4,4],[12,3,8],30],[[92,2,2],[36,6,2],[20,4,6],[14,7,4],32],
// 					[[107,4],[37,8,1],[20,8,4],[11,12,4],34],[[115,3,1],[40,4,5],[16,11,5],[12,11,5],26,46],
// 					[[87,5,1],[41,5,5],[24,5,7],[12,11,7],26,48],[[98,5,1],[45,7,3],[19,15,2],[15,3,13],26,50],
// 					[[107,1,5],[46,10,1],[22,1,15],[14,2,17],30,54],[[120,5,1],[43,9,4],[22,17,1],[14,2,19],30,56],
// 					[[113,3,4],[44,3,11],[21,17,4],[13,9,16],30,58],[[107,3,5],[41,3,13],[24,15,5],[15,15,10],34,62],
// 					[[116,4,4],[42,17],[22,17,6],[16,19,6],28,50,72],[[111,2,7],[46,17],[24,7,16],[13,34],26,50,74],
// 					[[121,4,5],[47,4,14],[24,11,14],[15,16,14],30,54,78],[[117,6,4],[45,6,14],[24,11,16],[16,30,2],28,54,80],
// 					[[106,8,4],[47,8,13],[24,7,22],[15,22,13],32,58,84],[[114,10,2],[46,19,4],[22,28,6],[16,33,4],30,58,86],
// 					[[122,8,4],[45,22,3],[23,8,26],[15,12,28],34,62,90],[[117,3,10],[45,3,23],[24,4,31],[15,11,31],26,50,74,98],
// 					[[116,7,7],[45,21,7],[23,1,37],[15,19,26],30,54,78,102],[[115,5,10],[47,19,10],[24,15,25],[15,23,25],26,52,78,104],
// 					[[115,13,3],[46,2,29],[24,42,1],[15,23,28],30,56,82,108],[[115,17],[46,10,23],[24,10,35],[15,19,35],34,60,86,112],
// 					[[115,17,1],[46,14,21],[24,29,19],[15,11,46],30,58,86,114],[[115,13,6],[46,14,23],[24,44,7],[16,59,1],34,62,90,118],
// 					[[121,12,7],[47,12,26],[24,39,14],[15,22,41],30,54,78,102,126],[[121,6,14],[47,6,34],[24,46,10],[15,2,64],24,50,76,102,128],
// 					[[122,17,4],[46,29,14],[24,49,10],[15,24,46],28,54,80,106,132],[[122,4,18],[46,13,32],[24,48,14],[15,42,32],32,58,84,110,136],
// 					[[117,20,4],[47,40,7],[24,43,22],[15,10,67],26,54,82,110,138],[[118,19,6],[47,18,31],[24,34,34],[15,20,61],30,58,86,114,142]
// 				].reduce((a,x,i)=>(
// 					x={_:x},x.l=21+i*4,x.ap=i?[6,...x._.slice(4),x.l-7]:[],// モジュール数/辺 位置合わせパターン座標
// 					x.de=(x.l**2-(192+Math.max(0,x.ap.length**2-3)*25+(x.l-16-Math.max(0,x.ap.length-2)*5)*2)-(31+(5<i)*36))>>3,// データ容量 (size-(pos+align-timing)-info)/8 cf.p17表1
// 					x.lv=x._.slice(0,4).map((y,lv)=>(y=y.slice(1).reduce((a,n,i)=>(a.b.push(Array(n).fill(y[0]+i)),a.d+=(y[0]+i)*n,a),{b:[],d:0}),y.b=y.b.flat(),{lv,b:y.b,d:y.d,e:(x.de-y.d)/y.b.length})),// エラー訂正 cf.p36表9
// 					delete x._,a[x.v=i+1]=x,a
// 				),{}),
// 				mp:[(j,i)=>(i+j)%2,(j,i)=>i%2,(j,i)=>j%3,(j,i)=>(i+j)%3,(j,i)=>((i/2|0)+(j/3|0))%2,(j,i)=>(i*j)%2+(i*j)%3,(j,i)=>((i*j)%2+(i*j)%3)%2,(j,i)=>((i+j)%2+(i*j)%3)%2]// mask
// 			},
// 			...(({exp,log})=>({
// 				mul:(x,y)=>x&&y&&(x=log[x]+log[y],exp[x]||exp[x-255]),pow:(x,y)=>exp[(log[x]*y)%255]
// 			}))([...Array(255)].reduce((a,_,i)=>(a.exp[i]=a.x,a.log[a.x]=i,a.x*=2,(a.x>255)&&(a.x^=0x11d),a),{x:1,exp:[],log:[]})),
// 			rs:(w,n)=>((
// 				g=[...Array(n)].reduce((b,_,k)=>[1,this.pow(2,k)].reduce((a,y,j)=>(b.forEach((x,i)=>a[i+j]^=this.mul(x,y)),a),[]),[1]).slice(1)
// 			)=>w.reduce((a,_,i)=>(a[i]&&g.forEach((x,j)=>a[i+j+1]^=this.mul(x,a[i])),a),w.slice()).slice(-n))(),
// 			bch:({x:x,l:a},{x:y,l:b},m=0)=>[...(((x<<b)|[...Array(a)].reduce((e,_,i)=>(i++,((e>>(a+b-i))&1)?e^(y<<(a-i)):e),x<<b))^m).toString(2).padStart(a+b,0)]
// 		});
// 	}
// 	gen(w,{ecl=0,v=0,te=new TextEncoder()}={}){
// 		return(({oa,a2px,rect,d,rs,bch})=>(
// 			w={
// 				d:w.map(w=>(
// 					w={w},
// 					w.m=(s=>(s=s.n?0:s.a?1:s.k?3:2,{x:1<<s,l:4,s}))([...w.w].reduce((a,x)=>(a.m.forEach(i=>(x in d.m[i])||(a[i]=0)),a),{m:[...'nak'],n:1,a:1,k:1})),
// 					w.d=([
// 						_=>[...Array(Math.ceil(w.w.length/3))].map((x,i)=>(x=w.w.slice(i*3,++i*3),{x:+x,l:[0,4,7,10][x.length]})),// NUM
// 						_=>[...Array(Math.ceil(w.w.length/2))].map((x,i)=>(x=w.w.slice(i*2,++i*2),{x:[...x].reduce((a,x)=>a=a*45+d.m.a[x],0),l:[0,6,11][x.length]})),// ALPHANUM
// 						_=>[...te.encode(w.w)].map(x=>({x,l:8})),// BYTE
// 						_=>[...w.w].map(x=>({x:d.m.k[x],l:13}))// KANJI
// 					][w.m.s])(),
// 					w.c=v=>({x:(w['wd'[w.m.s>>1]].length),l:[[10,12,14],[9,11,13],[8,16,16],[8,10,12]][w.m.s][(9<v)+(26<v)]}),
// 					w.l=v=>w.m.l+w.c(v).l+w.d.reduce((a,x)=>a+x.l,0),
// 					w
// 				))
// 			},
// 			w.v=d.v[Math.max(v,Object.values(d.v).find(x=>(w.d.reduce((a,y)=>a+y.l(x.v),0)<=x.lv[ecl].d<<3)).v)],
// 			w.lv=w.v.lv[ecl],
// 			w.m=w.d.map(x=>['NUM','ALPHANUM','BYTE','KANJI'][x.m.s]),
// 			w.d=(b=>[...Array(w.lv.d)].reduce((a,x,i)=>(x=b.slice(i*=8,i+8),a.a.push(x?+('0b'+x.padEnd(8,0)):(a.i^=1)?236:17),a),{a:[],i:0}).a)(
// 				w.d.flatMap(x=>[x.m,x.c(w.v.v),...x.d].map(({x,l})=>x.toString(2).padStart(l,0))).join('')+'0000'
// 			),
// 			w.d=(({d,e})=>[d,e].flatMap(w=>w[w.length-1].flatMap((_,i)=>w.reduce((a,x)=>(i in x&&a.push(x[i]),a),[]))))(
// 				w.lv.b.reduce((a,x)=>(a.d.push(x=w.d.slice(a.p,a.p+=x)),a.e.push(rs(x,w.lv.e)),a),{d:[],e:[],p:0})
// 			),
		
// 			w.a=oa(
// 				a2px([...Array(8)].flatMap((_,i)=>[i+(5<i),w.v.l-1-i].flatMap(x=>[[8,x,2],[x,8,2]]))),//reserve
// 				(({l,ap})=>oa(// functional pattern module
// 					a2px([...Array(l)].flatMap((x,i)=>(x=(i+1)&1,[[6,i,x],[i,6,x]]))),// time
// 					oa(...[[0,0,0,0],[l-7,0,-1,0],[0,l-7,0,-1]].map(([x,y,i,j])=>oa(// pos
// 						rect({x:0+x+i,y:0+y+j,w:8,f:0}),rect({x:0+x,y:0+y,w:7,s:1}),rect({x:2+x,y:2+y,w:3,f:1})
// 					))),
// 					oa({},...ap.flatMap((y,j)=>ap.map((x,i)=>(i==0&&(j==0||j==ap.length-1)||(i==ap.length-1&&j==0)?{}:oa(// align
// 						rect({x:x-2,y:y-2,w:5,f:1}),rect({x:x-1,y:y-1,w:3,s:0})
// 					))))),
// 					(p=>({[p]:{p,x:1}}))([8,l-8])// dark
// 				))(w.v),
// 				(({v,l})=>6<v?a2px(bch({x:v,l:6},{x:7973,l:12}).flatMap((x,i)=>([[...(i=[l-9-i%3,5-(i/3|0)]),+x],[i[1],i[0],+x]]))):{})(w.v)
// 			),
		
// 			w.dm=(({l})=>[...Array(l)].flatMap((_,y)=>[...Array(l-1)].flatMap((i,x)=>(// data module map
// 				i=l*2*((l-2-x)>>1)+!(x&1)+((x>>1)&1?l-1-y:y)*2,x+=5<x,
// 				w.a[[x,y]]?[]:[{p:[x,y],i}]
// 			))).sort(({i:a},{i:b})=>a-b))(w.v),
// 			oa(w.a,a2px(w.dm.map(({p},i)=>[...p,(w.d[i>>3]>>(7-(i&7)))&1]))),// data module
		
// 			w.a=d.mp.map((x,mi)=>oa({},w.a,// mask gen
// 				a2px(w.dm.map(({p})=>[...p,w.a[p].x^!x(...p)])),
// 				(({l},{lv})=>a2px(bch({x:(+'1032'[lv]<<3)|mi,l:5},{x:1335,l:10},21522).flatMap((x,i)=>[[i+(5<i)+(6<i&&l-16),8,+x],[8,l-1-(i+(8<i)+(6<i&&l-16)),+x]])))(w.v,w.lv)
// 			)),
		
// 			oa(w,w.a.map((a,i,s,l)=>(// mask eval
// 				l=[...Array(w.v.l)],
// 				s=l.reduce((b,_,i,ll)=>b+ll.reduce((c,_,j)=>(c[0]+=a[[i,j]].x,c[1]+=a[[j,i]].x,c),['','']).map(x=>`2222${x}2222,`).join(''),''),
// 				s=(s.match(/0{5,}|1{5,}/g)||[]).reduce((c,x)=>c+x.length-2,0)+// N1
// 					l.slice(1).reduce((b,_,i,ll)=>(ll.forEach((_,j)=>((a[[i,j]].x+a[[i+1,j]].x+a[[i,j+1]].x+a[[i+1,j+1]].x)&3)==0&&(b+=3)),b),0)+// N2
// 					(s.match(/(?<=[02]{4,}1011)101[02]|[02]101(?=1101[02]{4,})/g)||[]).length*40+// N3
// 					(Math.abs(Object.values(a).filter(x=>x.x).length/(l.length*l.length)-.5)*20|0)*10,// N4
// 				{a,mask:{i,s}}
// 			)).sort(({mask:{s:a}},{mask:{s:b}})=>a-b)[0]),
		
// 			w.toPNG=({bg=0xffffffff,fg=0x000000ff,scale:s=4,padding:g=4}={})=>png({data:[...Array(w.v.l+g*2)].flatMap((_,y)=>(y-=g,Array(s).fill([...Array(w.v.l+g*2)].flatMap((_,x)=>(x-=g,
// 				Array(s).fill(0<=x&&x<w.v.l&&0<=y&&y<w.v.l?w.a[[x,y]].x:0)
// 			))).flat())),width:(w.v.l+g*2)*s,height:(w.v.l+g*2)*s,palette:[bg,fg],alpha:1}),
		
// 			w
// 		))(this);
// 	}
// }
