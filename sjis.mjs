const
sjis=class{
	constructor(){
		this.e={};this.d={};
		((td=new TextDecoder('sjis'),f=w=>(_=>
			_.length==1&&_!='�'&&(this.e[_]=w).reduce((a,x,i,{length:l})=>(i==l-1?a[x]=_:a[x]||(a[x]={})),this.d)
		)(td.decode(new Uint8Array(w))))=>[...Array(238)].forEach((_,i)=>
			i<191?f([i+(i<128?0:0xa1-128)]):[...Array(188)].forEach((_,j)=>f([i-191+(i-191<31?0x81:0xe0-31),j+0x40+(62<j)]))
		))();
		return this;
	}
	encode(w){return[...w].flatMap(x=>this.e[x]);}
	decode(w){return w.reduce((a,x)=>(x=a.x[x],x.length?(a.a+=x,a.x=this.d):a.x=x,a),{a:'',x:this.d}).a;}
};
export{sjis};