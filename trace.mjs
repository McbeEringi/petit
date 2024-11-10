const
trace=(w,f=x=>x)=>(w=>Object.assign(w,{
	toSVGPath:({invert:inv,absolute:abs,origin:o}={})=>abs?w.map(w=>(inv?w.reverse():w).map((x,i)=>('ML'[i]||',')+x.p.map((x,i)=>x+(o[i]||0))).join('')+'Z').join(''):w.reduce((a,w)=>(
		a.a+=(inv?w.slice(1).reverse():w.slice(0,-1)).reduce((b,x)=>b+['h','v-','h-','v'][inv?x.d^2:x.d]+x.l,`m${a.p.map((x,i)=>w[0].p[i]-x)}`)+'z',
		a.p=w[0].p,a
	),{a:o?'M'+o:'',p:[0,0]}).a,
	toKiCAD:()=>((w,vg,u)=>Object.assign(w,{
		SYM:({name='TracedImage'}={})=>`(kicad_symbol_lib${vg}(symbol "${name}"(symbol "${name}_0_0"\n(polyline${w}(stroke(width -1)(type default))(fill(type outline)))\n)))\n`,
		MOD:({name='TracedImage'}={})=>`(footprint "${name}"${vg}(layer "F.Cu")(attr board_only exclude_from_pos_files exclude_from_bom)\n(fp_poly${w}(stroke(width 0)(type solid))(fill solid)(layer "F.Mask")${u()})\n)\n`,
	}))(
		'(pts\n'+w.map(w=>'\t'+w.concat(w[0]).map(x=>`(xy ${x.p[0]} ${x.p[1]})`).join('')+'\n').join('')+'\n\t'+
		w.slice(1,-1).reverse().map(w=>`(xy ${w[0].p[0]} ${w[0].p[1]})`).join('')+'\n)',
		`(version 20231120)(generator "PetitTrace")`,
		_=>'(uuid 00000000-0000-4000-1000-000000000000)'.replace(/[01]/g,x=>+x?'89ab'[Math.random()*4|0]:(Math.random()*16|0).toString(16))
	)
}))(w.flatMap((y,j)=>y.flatMap((x,i)=>f(x)?[[0,1,0,1],[1,0,1,1],[0,-1,1,0],[-1,0,0,0]].flatMap(([gi,gj,vi,vj],d)=>w[j+gj]&&(i+gi in w[j+gj])&&f(w[j+gj][i+gi])?[]:[[d,i+vi,j+vj]]):[])).reduce((a,w)=>(
	a=a.reduce((b,x)=>([x[0],x[x.length-1]].reduce((c,y,i)=>(c&&!b.x[i].a&&b.x[i].d.some(x=>x.every((x,i)=>x==y[i]))?(b.x[i].a=x,0):c),1)&&b.a.push(x),b),{a:[],x:[
		[i=>[1,0,-1,0][w[0]],i=>[0,-1,0,1][w[0]]],[i=>-[1,0,-1,0][i],i=>-[0,-1,0,1][i]]// post pre
	].map(f=>({d:[...Array(3)].map((_,i)=>[i+=(w[0]^2)<=i,...f.map((f,j)=>w[j+1]+f(i))]),a:0}))}),
	[...a.a,[...a.x[1].a||[],w,...a.x[0].a||[]]]
),[]).map(w=>w.reduce((a,x,i)=>((i&&a[a.length-1].d==x[0])||a.push({p:x.slice(1),d:x[0],l:0}),a[a.length-1].l++,a),[]))),
traces=(w,f=[...new Set([].concat(...w).map(x=>x+''))].map(x=>y=>y==x))=>f.map(f=>trace(w,f));

export{trace,traces};
