const
depb=w=>[...{[Symbol.iterator]:(
	p=0,
	v=_=>[...{[Symbol.iterator]:d=>({next:_=>({done:d,value:d||(d=!(w[p]&0x80),w[p++]&0x7f)})})}].reduce((a,x,i)=>x<<(7*i)|a)
)=>({next:_=>w.length<=p?{done:1}:{value:((x=>({i:x>>>3,type:x=x&7,value:[
	(x=v())=>Object.assign(x,{s:(x+1)/(x&1?-2:2)|0}),_=>w.slice(p,p+=8),(l=v())=>w.slice(p,p+=l),,,_=>w.slice(p,p+=4)
][x]()}))(v()))}})}],
enpb=1;

export{depb,enpb};
