import{png}from'./png.mjs';
import{trace}from'./trace.mjs';
/*

thanks to
- [日本産業規格の簡易閲覧 - JISX0510:2018](https://kikakurui.com/x0/X0510-2018-01.html)
- [独極 - 独学QRコード](http://ik1-316-18424.vs.sakura.ne.jp/category/QRCode/index.html)
- [swetake.com - QRコードをつくってみる](https://www.swetake.com/qrcode/)
- [Thonky.com's QR Code Tutorial](https://www.thonky.com/qr-code-tutorial/)
- [Creating a QR Code step by step](https://www.nayuki.io/page/creating-a-qr-code-step-by-step)
- [wikiversity - Reed–Solomon codes for coders](https://en.wikiversity.org/wiki/Reed–Solomon_codes_for_coders)

*/

class QR{
	constructor({te=new TextEncoder()}={}){
		const
		td_sjis=new TextDecoder('sjis'),fmap=(w,f)=>[].concat(...w.map(f)),
		bch=({x:x,l:a},{x:y,l:b},m=0)=>[...(((x<<b)|[...Array(a)].reduce((e,_,i)=>(i++,((e>>(a+b-i))&1)?e^(y<<(a-i)):e),x<<b))^m).toString(2).padStart(a+b,0)],
		mask=(m=>[8,0,24,16].map(e=>m.map((fn,m)=>({m,fn,fmt:fmap(bch({x:e|m,l:5},{x:1335,l:10},21522),(x,i)=>[[(i<7?5<i:-15)+i,8,+x],[8,(i<7?-1:14+(i<9))-i,+x]])}))))([
			(j,i)=>(i+j)%2,(j,i)=>i%2,(j,i)=>j%3,(j,i)=>(i+j)%3,(j,i)=>((i/2|0)+(j/3|0))%2,(j,i)=>(i*j)%2+(i*j)%3,(j,i)=>((i*j)%2+(i*j)%3)%2,(j,i)=>((i+j)%2+(i*j)%3)%2
		]);

		Object.assign(this,{
			fmap,
			file:(w,m='text/plain')=>Object.assign(w,{toDataURL:()=>`data:${m},${encodeURIComponent(w)}`,toBlob:()=>new Blob([w],{type:m})}),
			esc:(w,e='"\\\\')=>w.replace(new RegExp(`([${e}])`,'g'),'\\$1'),
			d:{
				te,
				mode:[
					{i:0,name:'NUM',l:[10,12,14],enc:w=>(w={x:w,l:w.length},w.x=[...Array(Math.ceil(w.l/3))].map((x,i)=>w.e||(x=w.x.slice(3*i,3*++i),
						{x:isNaN(+x)?w.e=1:+x,l:[,4,7,10][x.length]}
					)),w.e?null:w)},
					(d=>(d.enc=w=>(w={x:w,l:w.length},w.x=[...Array(Math.ceil(w.l/2))].map((x,i)=>w.e||(x=[...w.x.slice(2*i,2*++i)],
						{x:x.reduce((a,x)=>(x in d.dict?a*45+d.dict[x]:w.e=1),0),l:[,6,11][x.length]}
					)),w.e?null:w),d))({i:1,name:'EISU',dict:[...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'].reduce((a,x,i)=>(a[x]=i,a),{}),l:[9,11,13]}),
					(d=>(d.enc=w=>(w={x:w,l:w.length},w.x=[...w.x].map(x=>w.e||(
						{x:x in d.dict?d.dict[x]:w.e=1,l:13}
					)),w.e?null:w),d))({i:3,name:'KANJI',dict:[...Array(86)].reduce((a,y,_y)=>(y=(_y/2|0)+0x81+0x40*(61<_y),[...Array(_y==85?33:94)].forEach((_,x)=>(x+=_y&1?0x9f:0x40+(62<x),
						a[td_sjis.decode(new Uint8Array([y,x]))]=(y-(0x9f<y?0xc1:0x81))*0xc0+x-0x40
					)),a),{}),l:[8,10,12]}),
					{i:2,name:'OCT',l:[8,16,16],enc:(w,e)=>(w=[...e.encode(w)].map(x=>({x,l:8})),{x:w,l:w.length})}
				],
				mode_len:[[1,10],[10,27],[27]],
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
					w.align=v==1?[]:[6,...w._.slice(4),w.size-7],
					w.cap=(w.size**2-(192+Math.max(0,w.align.length**2-3)*25+(w.size-16-Math.max(0,w.align.length-2)*5)*2)-(31+(6<v)*36))>>3,// データ容量 (size-(pos+align+timing)-info)/8 cf.p17表1
					w.lv=w._.slice(0,4).map((x,lv)=>(
						x=fmap(x.slice(1),(l,i)=>Array(l).fill(x[0]+i)).reduce((a,l)=>(a.blocks.push([a.cap,a.cap+=l]),a),{lv,blocks:[],cap:0}),
						x.err=(w.cap-x.cap)/x.blocks.length,x.mask=mask[lv],x
					)),
					w.info=v<7?[]:bch({x:v,l:6},{x:7973,l:12}).map((x,i)=>[-9-i%3,5-(i/3|0),+x]),
					delete w._,w
				)),

				rs:(({exp,log,mul=(x,y)=>x&&y&&(x=log[x]+log[y],exp[x]||exp[x-255]),pow=(x,y)=>exp[(log[x]*y)%255]})=>
					(w,n)=>w.reduce((a,_,i)=>(a.a[i]&&a.g.forEach((x,j)=>a.a[i+j+1]^=mul(x,a.a[i])),a),{a:w.slice(),
						g:[...Array(n)].reduce((b,_,k)=>[1,pow(2,k)].reduce((a,y,j)=>(b.forEach((x,i)=>a[i+j]^=mul(x,y)),a),[]),[1]).slice(1)
					}).a.slice(-n)
				)([...Array(255)].reduce((a,_,i)=>(a.exp[i]=a.x,a.log[a.x]=i,a.x*=2,(a.x>255)&&(a.x^=0x11d),a),{x:1,exp:[],log:[]})),

				img:l=>(d=>Object.assign(d,{
					set:(w,{xy=0}={})=>([].concat(...w).forEach(([x,y,v])=>(d[y+=(y<0&&l)][x+=(x<0&&l)]=v,xy&&(d[x][y]=v))),d)
				}))([...Array(l)].map(_=>[...Array(l)].fill(-1))),
				patt:(x,y,l,r=(l-1)/2)=>fmap([...Array(l)],(_,j)=>[...Array(l)].map((_,i)=>[x+i,y+j,+(Math.max(Math.abs(i-r),Math.abs(j-r))!=r-1)]))
			}
		});
	}
	gen(w=[],{ecl=0,ver=0,mask=-1,te}={}){return(({d,fmap,file,esc})=>(
		te||(te=d.te),
		w={
			data_raw:w,
			data_enc:w.map(w=>d.mode.reduce((a,d,x)=>a||(x=d.enc(w,te))&&({
				mode:{name:d.name,x:1<<d.i,l:4,s:d.i},len:{x:x.l,l:d.l},data:Object.assign(x.x,{l:x.x.reduce((a,x)=>a+x.l,0)})
			}),null))
		},
		w.ver=d.mode_len.reduce((a,l,x)=>a||(
			x=w.data_enc.reduce((a,w)=>a+w.mode.l+w.len.l[x]+w.data.l,0)/8,
			d.ver.slice(...l).find(v=>x<=v.lv[ecl].cap)
		),void 0),

		!w.ver?({err:'Too big data!'}):(
			w.ver=d.ver[Math.max(ver,w.ver.v)],w.lv=w.ver.lv[ecl],w.size=w.ver.size,
			(i=>w.data_enc.forEach(w=>w.len.l=w.len.l[i]))(d.mode_len.reduce((a,[x,y=1/0],i)=>a||x<=w.ver.v&&w.ver.v<y&&{i},0).i),

			w.data_pad=(b=>[...Array(w.lv.cap)].reduce((a,x,i)=>(x=b.slice(8*i,8*++i),a.a.push(x?+('0b'+x.padEnd(8,0)):(a.i^=1)?236:17),a),{a:[],i:0}).a)(
				fmap(w.data_enc,w=>[w.mode,w.len,...w.data].map(({x,l})=>x.toString(2).padStart(l,0))).join('')+'0000'
			),
			w.data_i2l=(w=>fmap(w[w.length-1],(x,i)=>fmap(x,(_,j)=>fmap(w,y=>j in y[i]?[y[i][j]]:[]))))(
				w.lv.blocks.map(x=>[x=w.data_pad.slice(...x),d.rs(x,w.lv.err)])
			),

			w.img=d.img(w.size).set([
				[...Array(16)].map((_,i)=>[8,i+(5<i)-(7<i)*17,2]),// reserve
				[...Array(w.size-16)].map((_,i)=>[6,8+i,(i+1)&1]),// timimg
				[...Array(24)].map((_,i)=>[i&16?-8:7,i&8?-(i&7)-1:i&15,0]),// separator
				d.patt(-7,0,7),w.ver.info// finder, info
			],{xy:1}).set([
				fmap(w.ver.align,(y,j,a)=>fmap(a,(x,i,{length:l})=>((i==0&&(j==0||j==l-1)||(i==l-1&&j==0))?[]:d.patt(x-2,y-2,5)))),// align
				d.patt(0,0,7),[[8,-8,1]]// finder, dark
			]),

			w.map=[...Array(w.size*(w.size-1))].map((_={},i)=>(// data module map
				[(_.x=w.size-2-(_.n=i/w.size/2|0)*2-(i&1),_.x+(5<_.x)),(x=>_.n&1?x:w.size-1-x)((i/2|0)%w.size)]
			)).filter(([x,y])=>!~w.img[y][x]),
			w.img.set([w.map.map((p,i)=>[...p,(w.data_i2l[i>>3]>>(7-(i&7)))&1])]),// data module

			w.mask=w.lv.mask[~mask?mask:w.lv.mask.map(m=>((fn,l,s)=>(// mask eval
				w.img.set([m.fmt]),fn(),l=[...Array(w.size)],
				s=[...w.img,...w.img.map((_,i)=>w.img.map(x=>x[i]))].map(x=>`2222${x.join('')}2222,`).join(''),
				s=(s.match(/([01])\1{4,}/g)||[]).reduce((a,x)=>a+x.length-2,0)+// N1
					l.slice(1).reduce((a,_,i,ll)=>(ll.forEach((_,j)=>((w.img[i][j]+w.img[i+1][j]+w.img[i][j+1]+w.img[i+1][j+1])&3)||(a+=3)),a),0)+// N2
					(s.match(/(?<=[02]{4,}1011)101[02]|[02]101(?=1101[02]{4,})/g)||[]).length*40+// N3
					(Math.abs([].concat(...w.img).filter(x=>x).length/(l.length*l.length)-.5)*20|0)*10,// N4
				fn(),{m:m.m,s}
			))(_=>w.map.forEach(([x,y])=>w.img[y][x]^=!m.fn(x,y)))).sort(({s:a},{s:b})=>a-b)[0].m],
			w.map.forEach(([x,y])=>w.img[y][x]^=!w.mask.fn(x,y)),w.img.set([w.mask.fmt]),// mask apply

			w.toPNG=({bg=0xffffffff,fg=0x000000ff,padding:g=4,scale:s=4}={})=>png({data:((h,v)=>[].concat(
				h,...w.img.map(x=>[].concat(...Array(s).fill(fmap([].concat(v,x,v),y=>Array(s).fill(y))))),h
			))(Array((w.size+g*2)*g*s*s).fill(0),Array(g).fill(0)),width:(w.size+g*2)*s,height:(w.size+g*2)*s,palette:[bg,fg,0x66ccaaff],alpha:1}),

			w.toSVG=({bg=0xffffffff,fg=0x000000ff,padding:g=4,invert,absolute}={})=>file(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g=[g,w.size+g*2],g[1]} ${g[1]}">
	<path fill="#${bg.toString(16).padStart(8,0)}" d="${g[1]=`M0,0v${g[1]}h${g[1]}v${-g[1]}z`}"/>
	<path fill="#${fg.toString(16).padStart(8,0)}" d="${invert?g[1]:''}${trace(w.img).toSVGPath({invert,absolute,offset:[g[0],g[0]]})}"/>
</svg>
`,'image/svg+xml'),

			w.toKiCAD_MOD=({generator:gen='PetitQR',name:n=w.data_raw.join(''),invert:inv,padding:g=4,size:s=10,layer:l='F.Mask'}={})=>file(`(footprint "${s={s,x:s/w.size},g=[...Array(5)].map((_,i)=>`(xy ${(i+3&2)?s.s+g*s.x:-g*s.x} ${(i&2)?s.s+g*s.x:-g*s.x})`).join(''),'QRCODE'}"(version 0)(generator "${esc(gen)}")(layer "F.Cu")(attr board_only exclude_from_pos_files exclude_from_bom)
(property "Value" "${esc(n)}"(effects(justify left bottom)(hide no)))
(fp_poly(pts\n${inv?g+'\n':''}${trace(w.img).toKiCADPts({invert:inv,scale:s.x})}\n)(stroke(width 0)(type solid))(fill solid)(layer "${l}"))
(fp_poly(pts\n${g}\n)(stroke(width 0.05)(type default))(fill none)(layer "F.CrtYd"))
)
`),
			w.toKiCAD_SYM=({generator:gen='PetitQR',name:n=w.data_raw.join(''),invert:inv,padding:g=4,size:s=25.4}={})=>file(`(kicad_symbol_lib(version 0)(generator "${s={s,x:s/w.size},g=[...Array(5)].map((_,i)=>`(xy ${(i&2)?s.s+g*s.x:-g*s.x} ${(i+3&2)?s.s+g*s.x:-g*s.x})`).join(''),esc(gen)}")(symbol "QRCODE"
(property "Value" "${esc(n)}"(effects(justify left top)(hide no)))
(symbol "QRCODE_0_0"(polyline(pts\n${inv?g+'\n':''}${trace(w.img).toKiCADPts({invert:inv,scale:s.x,flipY:1})}\n)(stroke(width -1)(type default))(fill(type outline))))
))
`),

			w
		)
	))(this);}
}

export{QR,png,trace};
