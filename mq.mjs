//special thenks to wgld.org
const
norm=w=>(x=>x?[...w].map(y=>y/x):[...w])(Math.hypot(...w)),
cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
mat=class{
	constructor(w=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){this.w=new Float32Array(w);return this;}
	copy(){return new mat(this.w);}
	get(){return this.w;}
	mul(w){this.w.set([...'0123'.repeat(4)].map((x,i)=>new Array(4).fill().reduce((y,_,j)=>y+(this.w)[i-x+j]*((w||this).w||w)[+x+j*4],0)));return this;}// AB == B.mul(A)
	transpose(){this.w.set(this.w.map((_,i)=>this.w[[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15][i]]));return this;}
	inv(){
		const x=this.w,
			a=x[0]*x[5]-x[1]*x[4],b=x[0]*x[6]-x[2]*x[4],c=x[0]*x[7]-x[3]*x[4],d=x[1]*x[6]-x[2]*x[5],
			e=x[1]*x[7]-x[3]*x[5],f=x[2]*x[7]-x[3]*x[6],g=x[8]*x[13]-x[9]*x[12],h=x[8]*x[14]-x[10]*x[12],
			i=x[8]*x[15]-x[11]*x[12],j=x[9]*x[14]-x[10]*x[13],k=x[9]*x[15]-x[11]*x[13],l=x[10]*x[15]-x[11]*x[14],
			idet=1/(a*l-b*k+c*j+d*i-e*h+f*g);
		this.w.set([
			(x[5]*l-x[6]*k+x[7]*j)*idet,(-x[1]*l+x[2]*k-x[3]*j)*idet,(x[13]*f-x[14]*e+x[15]*d)*idet,(-x[9]*f+x[10]*e-x[11]*d)*idet,
			(-x[4]*l+x[6]*i-x[7]*h)*idet,(x[0]*l-x[2]*i+x[3]*h)*idet,(-x[12]*f+x[14]*c-x[15]*b)*idet,(x[8]*f-x[10]*c+x[11]*b)*idet,
			(x[4]*k-x[5]*i+x[7]*g)*idet,(-x[0]*k+x[1]*i-x[3]*g)*idet,(x[12]*e-x[13]*c+x[15]*a)*idet,(-x[8]*e+x[9]*c-x[11]*a)*idet,
			(-x[4]*j+x[5]*h-x[6]*g)*idet,(x[0]*j-x[1]*h+x[2]*g)*idet,(-x[12]*d+x[13]*b-x[14]*a)*idet,(x[8]*d-x[9]*b+x[10]*a)*idet
		]);
		return this;
	}
	scale(w=1){const f=x=>w[x]!=void 0?w[x]:w!=void 0?w:1;return this.mul([f(0),0,0,0 ,0,f(1),0,0, 0,0,f(2),0, 0,0,0,1]);}
	translate(w=[]){return this.mul([1,0,0,0, 0,1,0,0, 0,0,1,0, w[0]||0,w[1]||0,w[2]||0,1]);}
	rot(t=0,a=[0,1,0],n=true){const s=Math.sin(t),c=Math.cos(t),ic=1-c;n&&(a=norm(a));
		return this.mul([c+a[0]*a[0]*ic,a[0]*a[1]*ic+a[2]*s,a[2]*a[0]*ic-a[1]*s,0, a[0]*a[1]*ic-a[2]*s,c+a[1]*a[1]*ic,a[1]*a[2]*ic+a[0]*s,0, a[2]*a[0]*ic+a[1]*s,a[1]*a[2]*ic-a[0]*s,c+a[2]*a[2]*ic,0, 0,0,0,1]);
	}
	roteul(t=[0,0,0]){t=t.map(x=>[Math.cos(x),Math.sin(x)]);
		return this.mul([1,0,0,0, 0,t[0][0],t[0][1],0, 0,-t[0][1],t[0][0],0, 0,0,0,1]).mul([t[1][0],0,t[1][1],0, 0,1,0,0, -t[1][1],0,t[1][0],0, 0,0,0,1]).mul([t[2][0],t[2][1],0,0, -t[2][1],t[2][0],0,0, 0,0,1,0, 0,0,0,1]);
	}
	lookat(c=[0,0,1],o=[0,0,0],u=[0,1,0]){const z=norm(c.map((x,i)=>x-o[i])),x=norm(cross(u,z)),y=norm(cross(z,x));//Camera Origin(target) cameraUp
		return this.mul([x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, ...[x,y,z].map(x=>-x.reduce((p,_,i)=>p+x[i]*c[i],0)),1]);
	}
	pers(v,r,n,f){const t=n*Math.tan(v*Math.PI/360),d=1/(f-n);return this.mul([n/(t*r),0,0,0, 0,n/t,0,0, 0,0,-(f+n)*d,-1, 0,0,-f*n*2*d,0]);}//foV Ratio Near Far
	ortho(l,r,t,b,n,f){const w=1/(r-l),h=1/(t-b),d=1/(f-n);return this.mul([2*w,0,0,0, 0,2*h,0,0, 0,0,-2*d,0, -(l+r)*w,-(t+b)*h,-(f+n)*d,1]);}//Left Right Top Bottom Near Far
},
qtn=class{
	constructor(w=[1,0,0,0]){this.w=new Float32Array(w);return this;}
	copy(){return new PetitQ(this.w);}
	getIm(){return [...this.w].slice(1);}
	mul(w){
		const a=this.w,b=(w||this).w||w;
		this.w.set([a[0]*b[0]-a[1]*b[1]-a[2]*b[2]-a[3]*b[3], a[0]*b[1]+a[1]*b[0]+a[2]*b[3]-a[3]*b[2], a[0]*b[2]-a[1]*b[3]+a[2]*b[0]+a[3]*b[1], a[0]*b[3]+a[1]*b[2]-a[2]*b[1]+a[3]*b[0]]);
		return this;
	}
	norm(){this.w.set(norm(this.w));return this;}
	conj(){this.w.set(this.w.map((x,i)=>i?-x:x));return this;}
	rot(a=[0,1,0],t=1){const s=Math.sin(t*.5),c=Math.cos(t*.5);return this.mul([c,...norm(a).map(x=>x*s)]);}
	roteul(t=[0,0,0]){t=t.map(x=>[Math.cos(x*.5),Math.sin(x*.5)]);
		return this.mul([t[2][0]*t[1][0]*t[0][0]+t[2][1]*t[1][1]*t[0][1], t[2][1]*t[1][0]*t[0][0]-t[2][0]*t[1][1]*t[0][1], t[2][0]*t[1][1]*t[0][0]+t[2][1]*t[1][0]*t[0][1], t[2][0]*t[1][0]*t[0][1]-t[2][1]*t[1][1]*t[0][0]]);
	}
	slerp(q,x=.5){
		q=(q||this).w||q;let a=[...this.w].reduce((a,y,i)=>a+y*q[i],0),b=1-a*a;
		b>0&&(a=Math.acos(a),b=Math.sqrt(b),x=b<.0001?[.5,.5]:[Math.sin(a*(1-x))/b,Math.sin(a*x)/b],this.w.set(this.w.map((y,i)=>y*x[0]+q[i]*x[1])))
		return this;
	}
	vec3(v=[0,0,1]){return this.copy().conj().mul([0,...v]).mul(this).getIm();}
	mat(){const q=this.w,x=q[1]+q[1],y=q[2]+q[2],z=q[3]+q[3], xx=q[1]*x,xy=q[1]*y,xz=q[1]*z,yy=q[2]*y,yz=q[2]*z,zz=q[3]*z, wx=q[0]*x,wy=q[0]*y,wz=q[0]*z;
		return new mat([1-yy-zz,xy-wz,xz+wy,0, xy+wz,1-xx-zz,yz-wx,0, xz-wy,yz+wx,1-xx-yy,0, 0,0,0,1]);
	}
};
export{mat,qtn};