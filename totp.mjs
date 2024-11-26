const
totp=async({date:t=new Date,algorithm:h='SHA1',digits:l=6,period:d=30,secret:k,_:{
	be4=x=>[x>>>24&255,x>>>16&255,x>>>8&255,x>>>0&255],
	b32de=w=>((
		d=[...'abcdefghijklmnopqrstuvwxyz234567'].reduce((a,x,i)=>(a[x]=i.toString(2).padStart(5,0),a),{}),
		b=w.toLowerCase().replace(/./g,x=>d[x]||'')
	)=>new Uint8Array([...Array(Math.ceil(b.length/8))].map((_,i)=>+`0b${b.slice(8*i++,8*i).padEnd(8,0)}`)))()
}={}}={})=>(w=>((w.slice(w=w.pop()&0xf,w+4).reduce((a,x)=>a<<8|x)&0x7fffffff)+'').slice(-l))(
	[...new Uint8Array(await crypto.subtle.sign('HMAC',
		await crypto.subtle.importKey('raw',b32de(k),{name:'HMAC',hash:h},0,['sign']),
		new Uint8Array([...be4((t=t.getTime()/1000/d)/2**32),...be4(t)])
	))]
);

export{totp};

// console.log(
// 	new Date(),
// 	await totp({
// 		secret:'helloworld234567',
// 	})
// );
