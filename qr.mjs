const
rse=(w,n)=>((// https://en.wikiversity.org/wiki/Reed–Solomon_codes_for_coders
	{exp,log}=[...Array(255)].reduce((a,_,i)=>(a.exp[i]=a.x,a.log[a.x]=i,a.x*=2,(a.x>255)&&(a.x^=0x11d),a),{x:1,exp:[],log:[]}),
	mul=(x,y)=>x&&y&&(x=log[x]+log[y],exp[x]||exp[x-255]),pow=(x,y)=>exp[(log[x]*y)%255],
	g=[...Array(n)].reduce((b,_,k)=>[1,pow(2,k)].reduce((a,y,j)=>(b.forEach((x,i)=>a[i+j]^=mul(x,y)),a),[]),[1])
)=>[...w,...w.reduce((a,_,i)=>(a[i]&&g.slice(1).forEach((x,j)=>a[i+j+1]^=mul(x,a[i])),a),w).slice(-n)])();

console.log(rse([0x40,0xd2,0x75,0x47,0x76,0x17,0x32,0x06,0x27,0x26,0x96,0xc6,0xc6,0x96,0x70,0xec],10).map(x=>x.toString(16)));
console.log(rse([0x41,0x14,0x86,0x56,0xC6,0xC6,0xF2,0xC2,0x07,0x76,0xF7,0x26,0xC6,0x42,0x12,0x03,0x13,0x23,0x30],7).map(x=>x.toString(16)));