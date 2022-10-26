# PetitPrim
*petit* lib contains primitive models & obj loader  
special thanks to [wgld.org](https://wgld.org)

## download
[prim.mjs](../prim.mjs)

## exports
all functions return formatted Object named `model`
```js
({
	p:verticles,// Array(3*n)
	n:normals,// Array(3*n)
	c:colors,// Array(4*n)
	t:uvs,// Array(2*n)
	i:indices// Array(m)
})
```
- cube( scale=1 *Number*, color=auto *Array(4)* ) => model *Object*  
	create cube model
	```js
	import{cube}from'./prim.mjs';
	const model=cube();
	console.log(model);
	// model {p,n,c,t,i}
	```
- sphere( scale=1 *Number*, color=auto *Array(4)*, divisionX=16 *Number*, divisionY=divisionX\*2 *Number*) => model *Object*  
	create sphere model
	```js
	import{sphere}from'./prim.mjs';
	const model=sphere();
	console.log(model);
	// model {p,n,c,t,i}
	```
- torus( scale=1 *Number*, color=auto *Array(4)*, divisionX=16 *Number*, divisionY=divisionX\*2 *Number*) => model *Object*  
	create torus model
	```js
	import{torus}from'./prim.mjs';
	const model=torus();
	console.log(model);
	// model {p,n,c,t,i}
	```
- obj( obj *String*, color=[1,1,1,1] *Array(4)*) => model *Object*  
	create model from OBJ string
	```js
	import{obj}from'./prim.mjs';
	(async()=>{
		const obj=await(await fetch('model.obj')).text(),
			model=obj(obj);
		console.log(model);
		// model [{p,n,c,t,i,o:'object name'}...]
	})();
	```
