import{depb}from'./protobuf.mjs';
const
totp=async({date:t=new Date,algorithm:h='SHA-1',digits:l=6,period:d=30,secret:k='',_:{
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
),
migurl=w=>((
	td=new TextDecoder(),
	b32en=w=>(x=>[...Array(Math.ceil(x.length/5))].map(
		(_,i)=>'abcdefghijklmnopqrstuvwxyz234567'[+`0b${x.slice(5*i++,5*i).padEnd(5,0)}`]
	).join('').padEnd(Math.ceil(x.length/40)*8,'='))(w.reduce((a,x)=>a+x.toString(2).padStart(8,0),''))
)=>depb(new Uint8Array([...atob(decodeURIComponent(new URLSearchParams(new URL(w).search).get('data')))].map(x=>x.charCodeAt()))).reduce((a,x)=>(
	x.i==1?a.params.push(
		depb(x.value).reduce((a,x)=>(([,
			x=>a.secret={raw:x,base32:b32en(x)},
			x=>a.name=td.decode(x),
			x=>a.issuer=td.decode(x),
			x=>a.algorithm=[,'SHA-1','SHA-256','SHA-512','MD5'][x],
			x=>a.digits=[,6,8][x],
			x=>a.type=[,'HOTP','TOTP'][x],
			x=>a.conter=x
		][x.i]||(y=>a[x.i]=y))(x.value),a),{})
	):a[[,,'version','batch_size','batch_index','batch_id'][x.i]||x.i]=x.value,
	a
),{params:[]}))();

export{totp};

console.log(await Promise.all(migurl(
	'otpauth-migration://offline?data=CjkKCjkWt1nRWPW%2Bd98SEGhlbGxvd29ybGQyMzQ1NjcgASgBMAJCEzlkZDNjMzE3MzI3MjAwMzcyMTIQAhgBIAA%3D'
).params.map(async x=>({
	name:x.name,
	issuer:x.issuer,
	key:await totp({
		secret:x.secret.base32,
		algorithm:x.algorithm,
		digits:x.digits
	})
}))));
