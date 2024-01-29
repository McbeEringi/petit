const
nbt_read=async w=>((
	w,b=new DataView(w),oa=Object.assign,a=[{}],p=0,al=_=>a[a.length-1],ala=_=>Array.isArray(al()),
	e=(_=>_.reduce((a,x,i)=>(a[x]=i,a),{..._}))(['null','i8','i16','i32','i64','f32','f64','i8v','str','li','obj','i32v','i64v']),
	v={
		i8:_=>b.getInt8(p++),i16:_=>b.getInt16(p,p+=2),i32:_=>b.getInt32(p,p+=4),i64:_=>[b.getBigInt64?b.getBigInt64(p,1):oa(new Uint8Array(w,p,8),{isBigInt:true}),p+=8][0],
		f32:_=>b.getFloat32(p,p+=4),f64:_=>b.getFloat64(p,p+=8),str:(d=>_=>d.decode(new Uint8Array(w,p+=2,-p+(p+=b.getInt16(p-2,1)))))(new TextDecoder()),
		_v:i=>[...Array(v.i32())].map(v[i]),i8v:_=>v._v('i8'),i32v:_=>v._v('i32'),i8v:_=>v._v('i64')
	},
	n=_=>ala()?al().length:v.str(),s=(i,x)=>(al()[i]=x,ala()&&al().will<=al().length&&a.pop(),x)
)=>([...{[Symbol.iterator]:_=>({next:i=>(i=ala()?al().children_type:e[v.i8()],({
	null:_=>a.pop(),li:_=>(x=>x.will&&a.push(x))(s(n(),oa([],{type:e[9],children_type:e[v.i8()],will:v.i32()}))),obj:_=>a.push(s(n(),{})),
}[i]||(_=>s(n(),oa(v[i](),{type:i}))))(),{done:w.byteLength<=p})})}],a[0]))((w=w.buffer||w,w instanceof ArrayBuffer?w:await new Response(w).arrayBuffer())),
nbt_write=w=>((

)=>(
	1
))();
export{nbt_read,nbt_write};