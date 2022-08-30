const
calc=class{
	constructor(w){this.w=(+w).toExponential().split('e');this.w[1]-=Math.max(0,this.w[0].length-isNaN(this.w[0][0])-2);this.w[0]=+this.w[0].replace('.','');if(!this.w.every(Number.isInteger))throw`init failed. ${w}→${this.w}`;return this;}
	add(w){w=w.w||new calc(w).w;this.w[0]=this.w[1]>w[1]?10**(this.w[1]-(this.w[1]=w[1]))*this.w[0]+w[0]:this.w[0]+10**(w[1]-this.w[1])*w[0];return this;}
	mul(w){w=w.w||new calc(w).w;this.w[0]*=w[0];this.w[1]+=w[1];return this;}
	get(){return+this.w[0].toExponential().replace(/[^e]+$/,x=>+x+this.w[1]);}toString(){return this.get();}
},
dic={m:[0,1],l:[0,1],z:[],c:[0,1,0,1,0,1],s:[0,1,0,1],q:[0,1,0,1],t:[0,1],a:[0,1,,,,0,1]},
svg=class{
	constructor(w){
		this.d=w.match(/[mlhvzcsqta]|-?\d*\.?\d+/ig).reduce((a,x,y)=>(y=a[a.length-1],isNaN(x)?
			(y&&y.abs.length!=y.len&&(y.err=!0),a.push({cmd:y=x.toLowerCase(),rel:x==y,abs:[],len:{m:2,l:2,h:1,v:1,z:0,c:6,s:4,q:4,t:2,a:7}[y]})):
			y&&y.abs.length<y.len?y.abs.push(new calc(x)):a.push({...y,abs:[new calc(x)]}),
		a),[])
		.reduce((a,x)=>(
			({h:_=>x={...x,cmd:'l',abs:[x.abs[0],new calc(0)]},v:_=>x={...x,cmd:'l',abs:[new calc(0),x.abs[0]]}}[x.cmd]||Array)(),
			x.rel&&dic[x.cmd].forEach((y,i)=>x.abs[i].add(a[y])),(x.cmd=='z'?[a[2],a[3]]:x.abs.slice(-2)).forEach((y,i)=>a[i]=y),x.cmd=='m'&&(a[2]=a[0],a[3]=a[1]),a.push(x),
		a),[0,0,0,0]).slice(4);
		return this;
	}
	absolute(){this.d.forEach(x=>x.rel=!1);return this;}relaive(){this.d.forEach(x=>x.rel=!0);return this;}
	matrix(w=[1,0,0,0,1,0]){this.d.forEach(x=>dic[x.cmd].forEach((y,i,y3)=>x.abs[i]=new calc(w[0+(y3=3*y)]).mul(x.abs[y=i-y]).add(new calc(w[1+y3]).mul(x.abs[y+1])).add(w[2+y3])));return this;}
	rotate(t=0){const s=Math.sin(t),c=Math.cos(t);return this.matrix([c,s,0,-s,c,0]);}scale(x=1,y=1){return this.matrix([x,0,0,0,y,0]);}
	skew(x=0,y=0){return this.matrix([1,Math.tan(x),0,Math.tan(y),1,0]);}translate(x=0,y=0){return this.matrix([1,0,x,0,1,y]);}
	toString(){return this.d.reduce((a,x)=>(a+=x.cmd.toUpperCase()+x.abs,a),'');}
};
export{calc,svg};
