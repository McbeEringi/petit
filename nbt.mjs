constlist
nbt_read=async w=>((
	w,b=new DataView(w),
	a=[{}],p=0,i=[],
	t=(d=>_=>d.decode(new Uint8Array(w,p+=2,-p+(p+=b.getInt16(p-2,1)))))(new TextDecoder()),
	n=_=>t(),
	s=(i,x)=>a[a.length-1][i]=x,
	v={
		i8:_=>b.getInt8(p++),i16:_=>b.getInt16(p,p+=2),i32:_=>b.getInt32(p,p+=4),i64:_=>[b.getBigInt64?b.getBigInt64(p,1):Object.assign(new Uint8Array(w,p,8),{isBigInt:true}),p+=8][0],
		f32:_=>b.getFloat32(p,p+=4),f64:_=>b.getFloat64(p,p+=8),
	}
)=>(
	[...{[Symbol.iterator]:_=>({next:_=>(
		[
			_=>a.pop(),
			_=>s(n(),v.i8()),
			_=>s(n(),v.i16()),
			_=>s(n(),v.i32()),
			_=>s(n(),v.i64()),
			_=>s(n(),v.f32()),
			_=>s(n(),v.f64()),
			_=>s(n(),[...Array(v.i32())].map(v.i8)),
			_=>s(n(),t()),
			_=>a.push(s(n(),[])),
			_=>a.push(s(n(),{})),
			_=>s(n(),[...Array(v.i32())].map(v.i32)),
			_=>s(n(),[...Array(v.i32())].map(v.i64)),
		][b[p++]](),
		{done:b.length<=p}
	)})}],
	a[0]
))((w=w.buffer||w,w instanceof ArrayBuffer?w:await new Response(w).arrayBuffer()))
nbt_write=_=>_;

export{nbt_read,nbt_write};

/*
				pop,
				1
				2,
				4,
				8,
				f32,
				f64,
				1a,
				s,
				l,
				o,
				4a
				8a
*/



// nbt_read=b=>(async(
// 	w={},t=[],p=0,td=new TextDecoder(),
// 	n=(le=1)=>td.decode(new Uint8Array(b.buffer,p+2,(l=>(p+=2+l,l))(b.getUint16(p,le)))),
// 	s=(i,x)=>(t.reduce((a,x)=>a[x],w)[i]=x,{i,x}),
// 	v=[
// 		,_=>b.getInt8(p++),
// 		_=>b.getInt16(p,1,p+=2),
// 		_=>b.getInt32(p,1,p+=4),
// 		_=>[b.getBigInt64?b.getBigInt64(p,1):Object.assign(new Uint8Array(b.buffer,p,8),{isBigInt:true}),p+=8][0],
// 		_=>b.getFloat32(p,1,p+=4),
// 		_=>b.getFloat64(p,1,p+=8),
// 		_=>(l=>[new Int8Array(b.buffer,p,l),p+=4+l][0])(b.getInt32(p,1)),
// 		_=>n(),
// 		_=>(i=>[...Array(b.getInt32(p,1,p+=4))].map(v[i]))(b.getInt8(p++)),
// 		,_=>[...Array(b.getInt32(p,1,p+=4))].map(v[3]),
// 		_=>[...Array(b.getInt32(p,1,p+=4))].map(v[4])
// 	]
// )=>(
// 	b=b.buffer||b,b=new DataView(b instanceof ArrayBuffer?b:await new Response(b).arrayBuffer()),
// 	[...{[Symbol.iterator]:_=>({next:_=>(
// 		(i=>(console.log(i),({0:_=>t.pop(),10:_=>t.push(s(n(),{}).i)})[i]||(_=>s(n(),v[i]()))))(b.getInt8(p++))(),
// 		{done:!t.length||b.length-1<p}
// 	)})}],
// 	w
// ))()
