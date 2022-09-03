const
calc=class{
	constructor(w){if(!w)this.w=[0,0];else if(w.w)this.w=[...w.w];else{this.w=(+w).toExponential().split('e');this.w[1]-=Math.max(0,this.w[0].length-isNaN(this.w[0][0])-2);this.w[0]=+this.w[0].replace('.','');if(!this.w.every(Number.isInteger))throw`init failed. ${w}→${this.w}`;}return this;}
	copy(){return new calc(this);}
	add(w){w=w.w||new calc(w).w;this.w[0]=this.w[1]>w[1]?10**(this.w[1]-(this.w[1]=w[1]))*this.w[0]+w[0]:this.w[0]+10**(w[1]-this.w[1])*w[0];return this;}
	mul(w){w=w.w||new calc(w).w;this.w[0]*=w[0];this.w[1]+=w[1];return this;}
	get(){return+this.w[0].toExponential().replace(/[^e]+$/,x=>+x+this.w[1]);}toString(){return this.get();}
},
adic={m:[0,1],l:[0,1],z:[],c:[0,1,0,1,0,1],s:[0,1,0,1],q:[0,1,0,1],t:[0,1],a:[0,1,,,,0,1]},
svg=class{
	constructor(w){
		if(w.d){const cp=x=>typeof x=='object'?x.copy?x.copy():Array.isArray(x)?x.map(cp):Object.fromEntries(Object.entries(x).map(y=>[y[0],cp(y[1])])):x;this.d=cp(w.d);}
		else
			this.d=w.match(/[mlhvzcsqta]|-?\d*\.?\d+/ig).reduce((a,x,y)=>(y=a[a.length-1],isNaN(x)?
				(y&&y.abs.length!=y.len&&(y.err=!0),a.push({cmd:y=x.toLowerCase(),rel:x==y,abs:[],len:{m:2,l:2,h:1,v:1,z:0,c:6,s:4,q:4,t:2,a:7}[y]})):
				y&&y.abs.length<y.len?y.abs.push(new calc(x)):a.push({...y,abs:[new calc(x)]}),
			a),[])
			.reduce((a,x)=>(
				({h:_=>x={...x,cmd:'l',abs:[x.abs[0],new calc()]},v:_=>x={...x,cmd:'l',abs:[new calc(),x.abs[0]]}}[x.cmd]||Array)(),//TODO: fix H V
				x.rel&&adic[x.cmd].forEach((y,i)=>x.abs[i].add(a[y])),(x.cmd=='z'?[a[2],a[3]]:x.abs.slice(-2)).forEach((y,i)=>a[i]=y),x.cmd=='m'&&(a[2]=a[0],a[3]=a[1]),a.push(x),
			a),[0,0,0,0]).slice(4);
		return this;
	}
	copy(){return new svg(this);}
	absolute(){this.d.forEach(x=>x.rel=!1);return this;}relative(){this.d.forEach(x=>x.rel=!0);return this;}
	mat(w=[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]){
		this.d.forEach(x=>[[],[[0,1]],[[0,1],[2,3]],[[0,1],[2,3],[4,5]],[[0,1],[5,6]]][{m:1,l:1,z:0,c:3,s:2,q:2,t:1,a:4}[x.cmd]].forEach(y=>
			[x.abs[y[0]],x.abs[y[1]]]=new Array(2).fill().map((_,i)=>[x.abs[y[0]],x.abs[y[1]],1,1].reduce((a,z,j)=>a.add(new calc(z).mul((w.w||w)[i+j*4])),new calc()))
		));return this;//TODO: coord system compatable for WebGL
	}
	mat2d(w=[1,0, 0,1, 0,0]){return this.mat([w[0],w[1],0,0, w[2],w[3],0,0, 0,0,1,0, w[4],w[5],0,1]);}
	rot(t=0){const s=Math.sin(t),c=Math.cos(t);return this.mat2d([c,-s, s,c, 0,0]);}scale(x=1,y=x){return this.mat2d([x,0, 0,y, 0,0]);}skew(x=0,y=x){return this.mat2d([1,Math.tan(y), Math.tan(x),1, 0,0]);}translate(x=0,y=x){return this.mat2d([1,0, 0,1, x,y]);}
	get(){return this.d.reduce((a,x)=>(
		a.a+=x.rel?x.cmd+x.abs.map((y,i)=>y.copy().add(new calc(a.p[adic[x.cmd][i]]).mul(-1))):x.cmd.toUpperCase()+x.abs,
		[a.p[0],a.p[1]]=x.cmd=='z'?a.p.slice(2):x.abs.slice(-2),x.cmd=='m'&&(a.p[2]=a.p[0],a.p[3]=a.p[1]),a
	),{p:[0,0,0,0],a:''}).a.replace(/(\D)0\./g,'$1.').replace(/,-/g,'-').replace(/([^0]),\./g,'$1.');}toString(){return this.get();}
};
export{calc,svg};
