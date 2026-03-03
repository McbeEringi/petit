const
trace=(w,f=x=>x)=>Object.assign(
	f=w.reduce((a,y,j)=>(y.forEach((x,i,v,h)=>f(x)&&(
		h=a.l[j][i-1],v=0<j&&a.l[j-1][i],
		h&&v?(a.l[j][i]=h,((x,y)=>x==y||(a.p[y]=x))(a.find(h),a.find(v))):
		h?(a.l[j][i]=h):v?(a.l[j][i]=v):(a.p[++a.n]=a.l[j][i]=a.n)
	)),a),((
		l=w.map(x=>Array(x.length).fill(0)),p=[],n=0,
		find=x=>[x,...{[Symbol.iterator]:_=>({next:_=>({done:p[x]==x,value:(p[x]=p[p[x]],x=p[x])})})}].pop(),
	)=>({
		l,p,n,find,
		edge:_=>[...l.reduce((a,y,j)=>(y.forEach((x,i)=>x&&(
			x=find(x),a.has(x)?(x=a.get(x)):a.set(x,x=[]),
			[[-1,0,0,0],[0,1,0,1],[1,0,1,1],[0,-1,1,0]].forEach(([gi,gj,vi,vj],d)=>(l[gj+=j]&&l[gj][gi+=i])||x.push({d,s:[vi+=i,vj+=j],e:[vi+[0,1,0,-1][d],vj+[1,0,-1,0][d]]}))
		)),a),new Map()).values()],
		debug:_=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${l.length} ${l[0].length}" fill="#f0f" font-size="1" font-weight="bold" dominant-baseline="hanging">${
			l.map((y,j)=>y.map((x,i)=>x?`<text x="${i}" y="${j}">${String.fromCodePoint(0x4dff+find(x))}</text>`:'').join('')).join('\n')
		}\n</svg>`
	}))()).edge().map(w=>[...w.reduce((a,x,i)=>(i?(
		x=[...a].reduce((b,y)=>(
			b.s||y[y.length-1].e.every((y,i)=>y==x.s[i])&&(b.s=y),
			b.e||y[0].s.every((y,i)=>y==x.e[i])&&(b.e=y),
			b
		),{x}),
		x.s&&x.e?(x.s==x.e?x.s.push(x.x):(a.delete(x.e),x.s.push(x.x,...x.e))):
		x.s?x.s.push(x.x):x.e?x.e.unshift(x.x):a.add([x.x])
	):a.add([x]),a),new Set())].map(w=>(
		w=w.reduce((a,x,i)=>((i&&a[a.length-1].d==x.d)||a.push({p:x.s,d:x.d,l:0}),a[a.length-1].l++,a),[]),
		2<w.length&&((a=w[0],b=w[w.length-1])=>a.d==b.d&&(a.p=b.p,a.l+=b.l,w.pop()))(),
		w
	)).reverse()),
	{
		toSVGPts:({offset:o=[0,0],scale:s=1}={})=>f.map(x=>x.reduce((a,x)=>({a:a.a+x.reduce((b,x)=>b+['v','h','v-','h-'][x.d]+x.l*s,`m${a.p.map((y,i)=>(x[0].p[i]-y)*s)}`),p:x[0].p}),{a:`M${o}`,p:[0,0]}).a),
		toKiCADPts:({offset:o=[0,0],scale:s=1,flipY:rh=0}={})=>((xy=a=>`(xy ${o[0]+a[0]*s} ${o[1]+(rh?w.length-a[1]:a[1])*s})`)=>f.map(f=>f.map(x=>x.concat(x[0]).map(y=>xy(y.p)).join('')).concat(
			...f.slice(0,-1).reverse().map(x=>xy(x[0].p))
		).join('\n').replace(/\.?0{4,}\d(?=\D|$)/g,'')))()
	}
);

export{trace};
