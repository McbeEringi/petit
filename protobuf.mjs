const
depb=w=>[...{[Symbol.iterator]:(
	p=0,
	val=_=>[...{[Symbol.iterator]:d=>({next:_=>({done:d,value:d||(d=!(w[p]&0x80),w[p++]&0x7f)})})}].reduce((a,x,i)=>x<<(7*i)|a)
)=>({next:_=>w.length<=p?{done:1}:{value:((x=>({i:x>>>3,type:x=x&7,value:[
	_=>val(),_=>w.slice(p,p+=8),(l=val())=>w.slice(p,p+=l),,,_=>w.slice(p,p+=4)
][x]()}))(val()))}})}],
enpb=1;

export{depb,enpb};
