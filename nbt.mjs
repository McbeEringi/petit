const
nbt_read=async w=>((
	w,b=new DataView(w),oa=Object.assign,a=[{}],p=0,al=_=>a[a.length-1],ala=_=>Array.isArray(al()),
	e=(_=>_.reduce((a,x,i)=>(a[x]=i,a),{..._}))(['null','i8','i16','i32','i64','f32','f64','i8v','str','li','obj','i32v','i64v']),
	v={
		i8:_=>b.getInt8(p++),i16:_=>b.getInt16(p,p+=2),i32:_=>b.getInt32(p,p+=4),i64:_=>[b.getBigInt64?b.getBigInt64(p,1):new Uint8Array(w,p,8),p+=8][0],
		f32:_=>b.getFloat32(p,p+=4),f64:_=>b.getFloat64(p,p+=8),str:(d=>_=>d.decode(new Uint8Array(w,p+=2,-p+(p+=b.getInt16(p-2,1)))))(new TextDecoder()),
		_v:i=>[...Array(v.i32())].map(v[i]),i8v:_=>v._v('i8'),i32v:_=>v._v('i32'),i8v:_=>v._v('i64')
	},
	k=_=>ala()?al().length:v.str(),s=(i,x)=>(al()[i]=x,ala()&&al().will<=al().length&&a.pop(),x)
)=>([...{[Symbol.iterator]:_=>({next:i=>(i=ala()?al().children_type:e[v.i8()],({
	null:_=>a.pop(),li:_=>(x=>x.will&&a.push(x))(s(k(),oa([],{type:e[9],children_type:e[v.i8()],will:v.i32()}))),obj:_=>a.push(s(k(),{})),
}[i]||(_=>s(k(),oa(v[i](),{type:i}))))(),{done:w.byteLength<=p})})}],a[0]))((w=w.buffer||w,w instanceof ArrayBuffer?w:await new Response(w).arrayBuffer())),
nbt_write=w=>((
	u=new Uint8Array(8),b=new DataView(u.buffer),
	core=w=>(
		Object.entries(w).flatMap(([i,x])=>({
			Object:_=>core(x),
			Array:_=>core(x),
			Number:_=>(u.fill(0),({
				i8:_=>(b.setInt8(0,x),[u[0]]),i16:_=>(b.setInt16(0,x,1),[...u].slice(0,2)),i32:_=>(b.setInt32(0,x,1),[...u].slice(0,4)),
				f32:_=>(b.setFloat32(0,x,1),[...u].slice(0,4)),f64:_=>(b.setFloat64(0,x,1),[...u])
			}[x.type||Number.isInteger(x)?(y=>['i8','i16','i32','f64'][(y<128)+(y<32768)+(y<2147483648)])(Math.abs(x+.5)):x==new Float32Array([x])[0]?'f32':'f64'])()),
			BigInt:_=>(u.fill(0),b.setBigInt64(0,x,1),[...u]),
			Uint8Array:_=>({i64:_=>[...x]})[x.type](),
			Int8Array:1,
			Int32Array:1,
			BigInt64Array:1,
			String:_=>_
		}[x.constructor.name])())
	)
)=>(
	core(w)
))();
export{nbt_read,nbt_write};