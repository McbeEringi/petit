const
riff=(w,o={})=>((w,f=(x,p=0,_=_=>String.fromCharCode(...w.slice(p,p+=4)),n=_(),l=w.slice(p,p+=4).reduceRight((a,x)=>a<<8|x),t=l+p)=>{
	if(['RIFF','LIST'].includes(n)){x[n=_()]={};while(p<t)p+=f(x[n],p);}else x[n]=w.slice(p,t);return l+8;
})=>(f(o),o))(new Uint8Array(w));

export{riff};