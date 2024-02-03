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
	u=new Uint8Array(8),b=new DataView(u.buffer),n=Number,
	e=(_=>_.reduce((a,x,i)=>(a[x]=i,a),{..._}))(['null','i8','i16','i32','i64','f32','f64','i8v','str','li','obj','i32v','i64v']),
	nt=x=>n(x)!=x?'i64':n.isSafeInteger(x=n(x))?(y=>['i64','i32','i16','i8'][(y<128)+(y<32768)+(y<0x80000000)])(Math.abs(x+.5)):x==new Float32Array([x])[0]?'f32':'f64',
	v={
		_u:l=>[...u].slice(0,l),i8:x=>(b.setInt8(0,n(x)),[u[0]]),i16:x=>(b.setInt16(0,n(x),1),v._u(2)),i32:x=>(b.setInt32(0,n(x),1),v._u(4)),
		i64:x=>(x.constructor.name=='BigInt'?b.setBigInt64(0,x,1):(b.setInt32(0,x&0xffffffff,1),b.setInt32(4,x>>32,1)),[...u]),
		f32:x=>(b.setFloat32(0,n(x),1),v._u(4)),f64:x=>(b.setFloat64(0,n(x),1),[...u]),str:(e=>x=>(x=e.encode(x),[...v.i16(x.length),...x]))(new TextEncoder())
	},
	core=w=>((ia=Array.isArray(w)&&[])=>Object.entries(ia?[...w]:w).flatMap(([i,x,
		k=e=>ia||[e,...v.str(i)],kv=(t={toString:_=>x.type||nt(x)})=>_=>[...k(e[t]),...v[t](x)],ta=t=>_=>core(Object.assign([...x],{type:t})),
	])=>({
		Object:_=>[...k(e.obj),...core(x),0],Int8Array:ta('i8v'),Int32Array:ta('i32v'),BigInt64Array:ta('i64v'),Number:kv(),BigInt:kv(),String:kv('str'),
		Uint8Array:_=>({i64:_=>[...k(e.i64),...x]})[x.type](),
		Array:t=>(
			t=x.type||'li',//todo
			x.reduce((a,x)=>(a),[{a:['str']},{a:['obj']},{a:['li','i64v','i32v','i8v']},{a:['f64','f32','i16','i8']},{a:['f64','i32','i16','i8']},{a:['i64','i32','i16','i8']}]),
			[...k(e[t]),t=='li'?[e[x.children_type]]:[],...v.i32(x.length),...core(x)]
		)
	}[x.constructor.name])()))()
)=>([new Uint8Array(core(w))]))();
export{nbt_read,nbt_write};