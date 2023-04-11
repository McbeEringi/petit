const
smfin=w=>((
	r=(p,l)=>l?w.slice(p,p+l).reduce((a,x)=>a<<1|x):w[p],
	vln=p=>{}
)=>(
	w=[...new Uint8Array(w)],
	r(0,4)==0x4d546864?{
		header:{format:r(8,2),division:r(12)>>15?[0x80-((r(12)>>8)&0x7f),r(12)&0xff]:r(12)},
		tracks:[...Array(r(10,2))].reduce((a,_)=>(
			1,
			a.push([]),
			a
		),{a:[],p:8+r(4,4)})
	}:'invalid file.'
))(),
smfout=w=>1;

export{smfin,smfout};