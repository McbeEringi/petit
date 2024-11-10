const
trace=(w,f=x=>x)=>((p,e)=>Object.assign(p,{
	toSVGPath:({invert:inv,absolute:abs,origin:o}={})=>abs?p.map(w=>(inv?w.slice().reverse():w).map((x,i)=>('ML'[i]||',')+x.p.map((x,i)=>x+(o[i]||0))).join('')+'Z').join(''):p.reduce((a,w)=>(
		a.a+=(inv?w.slice(1).reverse():w.slice(0,-1)).reduce((b,x)=>b+['h','v-','h-','v'][inv?x.d^2:x.d]+x.l,`m${a.p.map((x,i)=>w[0].p[i]-x)}`)+'z',a.p=w[0].p,a
	),{a:o?'M'+o:'',p:[0,0]}).a,
	toKiCAD:({generator:gen='PetitTrace',name='TracedImage'}={})=>((p,vg,u)=>({pts:p,
		SYM:({name:n=name,height:h=25.4}={})=>`(kicad_symbol_lib${vg}(symbol "${n=e(n)}"(symbol "${n}_0_0"\n(polyline${p({scale:h/w.length,flip:1})}(stroke(width -1)(type default))(fill(type outline)))\n)))\n`,
		MOD:({name:n=name,layer:l='F.Mask',height:h=10}={})=>`(footprint "${e(n)}"${vg}(layer "F.Cu")(attr board_only exclude_from_pos_files exclude_from_bom)\n(fp_poly${p({scale:h/w.length})}(stroke(width 0)(type solid))(fill solid)(layer "${l}")${u()})\n)\n`,
	}))(
		({scale:s=1,flip:rh,invert:inv}={})=>('(pts\n'+p.map(x=>'\t'+(inv?x.slice().reverse():x).concat(x[0]).map(y=>`(xy ${y.p[0]*s} ${(_=>rh?w.length-_:_)(y.p[1])*s})`).join('')+'\n').join('')+'\n\t'+
			p.slice(1,-1).reverse().map(x=>`(xy ${x[0].p[0]*s} ${(_=>rh?w.length-_:_)(x[0].p[1])*s})`).join('')+'\n)').replace(/\.?0{4,}\d(\D)/g,'$1'),
		`(version 0)(generator "${e(gen)}")`,_=>'(uuid 00000000-0000-4000-1000-000000000000)'.replace(/[01]/g,x=>(+x?Math.random()*4|8:Math.random()*16|0).toString(16))
	)
}))(
	w.flatMap((y,j)=>y.flatMap((x,i)=>f(x)?[[0,1,0,1],[1,0,1,1],[0,-1,1,0],[-1,0,0,0]].flatMap(([gi,gj,vi,vj],d)=>w[j+gj]&&(i+gi in w[j+gj])&&f(w[j+gj][i+gi])?[]:[[d,i+vi,j+vj]]):[])).reduce((a,w)=>(
		a=a.reduce((b,x)=>([x[0],x[x.length-1]].reduce((c,y,i)=>(c&&!b.x[i].a&&b.x[i].d.some(x=>x.every((x,i)=>x==y[i]))?(b.x[i].a=x,0):c),1)&&b.a.push(x),b),{a:[],x:[
			[i=>[1,0,-1,0][w[0]],i=>[0,-1,0,1][w[0]]],[i=>-[1,0,-1,0][i],i=>-[0,-1,0,1][i]]// post pre
		].map(f=>({d:[...Array(3)].map((_,i)=>[i+=(w[0]^2)<=i,...f.map((f,j)=>w[j+1]+f(i))]),a:0}))}),
		[...a.a,[...a.x[1].a||[],w,...a.x[0].a||[]]]
	),[]).map(w=>w.reduce((a,x,i)=>((i&&a[a.length-1].d==x[0])||a.push({p:x.slice(1),d:x[0],l:0}),a[a.length-1].l++,a),[])),
	(w,e='"\\\\')=>w.replace(new RegExp(`([${e}])`,'g'),'\\$1')
),
traces=(w,f=[...new Set([].concat(...w).map(x=>x+''))].map(x=>y=>y==x))=>f.map(f=>trace(w,f));

export{trace,traces};
