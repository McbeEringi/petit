const
frl=x=>(x+'.').match(/\.\d*/)[0].length-1,
add=(...w)=>w.reduce((a,x)=>(a.a+=x*a.x,a),{a:0,x:10**Math.max(...w.map(frl)),_(){return this.a/this.x;}})._(),
mul=(...w)=>w.reduce((a,x)=>(a.x+=frl(x),a.a*=(x+'').replace('.',''),a),{a:1,x:0,_(){return this.a/10**this.x;}})._(),




path=class extends Array{
	constructor(w){super(...
		w.match(/[mlhvzcsqta]|-?\d*\.?\d+/ig).reduce((a,x)=>(
			isNaN(+x)?1:1,
			a
		),[])
	);}
	abs(){}
	rel(){}
}