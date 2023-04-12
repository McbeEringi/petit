const
smfin=w=>((w,r=(o,l)=>1<l?w.slice(o,o+l).reduce((a,x)=>a<<8|x):w[o])=>r(0,4)==0x4d546864?{
	header:{format:r(8,2),division:r(12)&0x80?[0x80-(r(12)&0x7f),r(13)]:r(12,2)},
	tracks:[...Array(r(10,2))].reduce((a,_)=>(a.a.push(a.r(4)==0x4d54726b?((p=a.r(4)+a.p,dt,ch,x,b=[])=>{
		if(r(p-3,3)!=0xff2f00)return'EOT not found.';
		while(a.p<p){
			dt=a.n();(x=r(a.p))&0x80?(_=x,a.p++):x=_;ch=x&0xf;
			b.push({dt,...[
				_=>a.ro({ch,name:'noteOff'},'note','vel'),
				_=>a.ro({ch,name:'noteOn'},'note','vel'),
				_=>a.ro({ch,name:'polyPress'},'note','vel'),
				_=>a.ro({ch,name:'ctrl'},'ctrl','value'),
				_=>a.ro({ch,name:'prg'},'prg'),
				_=>a.ro({ch,name:'chPress'},'vel'),
				_=>a.ro({ch,name:'bend',value:(a.r()|(a.r()<<7))-0x2000}),
				{
					0:_=>({name:'sysEx0',data:[0xf0,..._()]}),7:_=>({name:'sysEx7',data:_()}),
					15:_=>({name:'meta',type:a.r()&0x7f,data:_()})
				}[ch]
			][x>>4&0b111]((_=a.n())=>w.slice(a.p,a.p+=_))});
		}
		return b;
	})():'MTrk not found.'),a),{
		a:[],p:8+r(4,4),n(){let x=0;while(1){x=x<<7|r(this.p)&0x7f;if(~r(this.p++)&0x80)return x;}},
		r(l=1){return r(this.p,l,this.p+=l);},ro(a,...x){return x.reduce((a,x)=>(a[x]=this.r(),a),a);}
	}).a
}:'MThd not found.')(new Uint8Array(w)),

smfout=w=>1,
smf=class{
	constructor(w){
		({header:{format:1,division:480},tracks:[[]]})
	}
}
export{smfin};