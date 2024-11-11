const
trace=(w,f=x=>x)=>Object.assign(
	f=w.flatMap((y,j)=>y.flatMap((x,i)=>f(x)?[[0,1,0,1],[1,0,1,1],[0,-1,1,0],[-1,0,0,0]].flatMap(([gi,gj,vi,vj],d)=>w[j+gj]&&(i+gi in w[j+gj])&&f(w[j+gj][i+gi])?[]:[[d,i+vi,j+vj]]):[])).reduce((a,w)=>(
		a=a.reduce((b,x)=>([x[0],x[x.length-1]].reduce((c,y,i)=>(c&&!b.x[i].a&&b.x[i].d.some(x=>x.every((x,i)=>x==y[i]))?(b.x[i].a=x,0):c),1)&&b.a.push(x),b),{a:[],x:[
			[i=>[1,0,-1,0][w[0]],i=>[0,-1,0,1][w[0]]],[i=>-[1,0,-1,0][i],i=>-[0,-1,0,1][i]]// post pre
		].map(f=>({d:[...Array(3)].map((_,i)=>[i+=(w[0]^2)<=i,...f.map((f,j)=>w[j+1]+f(i))]),a:0}))}),
		[...a.a,[...a.x[1].a||[],w,...a.x[0].a||[]]]
	),[]).map(w=>w.reduce((a,x,i)=>((i&&a[a.length-1].d==x[0])||a.push({p:x.slice(1),d:x[0],l:0}),a[a.length-1].l++,a),[])),
	{
		toSVGPath:({offset:o=[0,0],scale:s=1,invert:inv,absolute:abs}={})=>abs?f.map(w=>(inv?w.slice().reverse():w).map((x,i)=>('ML'[i]||',')+x.p.map((x,i)=>x*s+o[i])).join('')+'Z').join(''):f.reduce((a,w)=>(
			a.a+=(inv?w.slice(1).reverse():w.slice(0,-1)).reduce((b,x)=>b+['h','v-','h-','v'][inv?x.d^2:x.d]+x.l*s,`m${a.p.map((x,i)=>(w[0].p[i]-x)*s)}`)+'z',a.p=w[0].p,a
		),{a:'M'+o,p:[0,0]}).a,
		toKiCADPts:({offset:o=[0,0],scale:s=1,invert:inv,flipY:rh}={})=>((xy=a=>`(xy ${o[0]+a[0]*s} ${o[1]+(rh?w.length-a[1]:a[1])*s})`)=>f.map(x=>x.concat(x[0])[inv?'reverse':'slice']().map(y=>xy(y.p)).join('')).concat(
			f.slice(0,-1).reverse().map(x=>xy(x[0].p)).join('')
		).join('\n').replace(/\.?0{4,}\d(?=\D|$)/g,''))()
	}
);

export{trace};
