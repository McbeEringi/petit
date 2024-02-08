const
nbt_read=(w,le=1)=>((
	e=['null','i8','i16','i32','i64','f32','f64','i8v','str','li','obj','i32v','i64v'],oa=Object.assign,a=[{}],p=0,al=_=>a[a.length-1],ala=_=>Array.isArray(al()),
	v=((b=new DataView((w=w.buffer||w,w instanceof ArrayBuffer&&w)))=>oa(b,{
		i8:_=>b.getInt8(p++),i16:_=>b.getInt16(p,le,p+=2),i32:_=>b.getInt32(p,le,p+=4),i64:_=>[b.getBigInt64?b.getBigInt64(p,le):new Uint8Array(w,p,8),p+=8][0],
		f32:_=>b.getFloat32(p,le,p+=4),f64:_=>b.getFloat64(p,le,p+=8),str:(d=>_=>d.decode(new Uint8Array(w,p+=2,-p+(p+=b.getInt16(p-2,le)))))(new TextDecoder()),
		_v:i=>[...Array(b.i32())].map(b[i]),i8v:_=>b._v(e[1]),i32v:_=>b._v(e[3]),i64v:_=>b._v(e[4])
	}))(),
	k=_=>ala()?al().length:v.str(),s=(i,x)=>(al()[i]=x,ala()&&al().will<=al().length&&a.pop(),x)
)=>([...{[Symbol.iterator]:_=>({next:i=>(i=ala()?al().children_type:e[v.i8()],({
	null:_=>a.pop(),li:_=>(x=>x.will&&a.push(x))(s(k(),oa([],{type:e[9],children_type:e[v.i8()],will:v.i32()}))),obj:_=>a.push(s(k(),{})),
}[i]||(_=>s(k(),oa(v[i](),{type:i}))))(),{done:w.byteLength<=p})})}],a[0]))(),
nbt_write=(w,le=1)=>((
	e=['null','i8','i16','i32','i64','f32','f64','i8v','str','li','obj','i32v','i64v'],ei=e.reduce((a,x,i)=>(a[x]=i,a),{}),
	v=((
		n=Number,u=new Uint8Array(8),b=new DataView(u.buffer),l=l=>[...u].slice(0,l),ta=t=>x=>b.i32(x.length).concat(x.flatMap(b[e[t]]))
	)=>Object.assign(b,{
		i8:x=>(b.setInt8(0,n(x)),[u[0]]),i16:x=>(b.setInt16(0,n(x),le),l(2)),i32:x=>(b.setInt32(0,n(x),le),l(4)),i8v:ta(1),i32v:ta(3),i64v:ta(4),
		i64:x=>(x.constructor.name=='BigInt'?b.setBigInt64(0,x,le):(b.setInt32(le?0:4,x&0xffffffff,le),b.setInt32(le?4:0,x>>32,le)),[...u]),
		f32:x=>(b.setFloat32(0,n(x),le),l(4)),f64:x=>(b.setFloat64(0,n(x),le),[...u]),str:(e=>x=>(x=e.encode(x),[...b.i16(x.length),...x]))(new TextEncoder())
	}))(),
	t=w=>w.type||{String:e[8],Number:e[6],BigInt:e[4],Array:e[9],Object:e[10],Int8Array:e[7],Int32Array:e[11],BigInt64Array:e[12]}[w.constructor.name],
	core=w=>({
		obj:_=>Object.entries(w).flatMap(([i,x])=>[ei[t(x)],...v.str(i),...core(x)]).concat(0),
		li:_=>w.every(x=>t(x)==w.children_type)?[ei[w.children_type],...v.i32(w.length),...w.flatMap(core)]:Error['!(arr.children_type = arr[0].type == arr[n].type)']()
	}[t(w)]||(_=>v[t(w)](w)))()
)=>w instanceof Object&&new Uint8Array((w=core(w),w.pop(),w)))();

export{nbt_read,nbt_write};