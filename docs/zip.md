# PetitZip
*petit* lib for .zip archive and download

## download
[zip.mjs](../zip.mjs)

## exports
- ***async*** zip( files=[{ path *String*, blob *Blob* }...] *Array(N)*, callback({ pre:[ done *Number*, all *Number* ], post:[ done *Number*, all *Number* ] }) *Function* ) => Zip *Blob*  
	create .zip archive without compression
- dl( file={ name *String*, blob *Blob* } *Object* ) => undefined  
	download blob to the device
	```js
	import{zip,dl}from'./zip.mjs';
	const files=[
		{path:'hello/world.txt',blob:new Blob(['Hello world!'])},
		{path:'hello/hoge.txt',blob:new Blob(['Hello hoge!'])},
		{path:'hello/hoge/fuga.txt',blob:new Blob(['Hello hoge fuga!'])}
	];
	dl({name:'hello.zip',blob:await zip(files)});
	```
- progress( response *Response*, callback([ done *Number*, all *Number* ]) *Function* ) => new_res *Response*  
	gives response progress to callback function
	```js
	import{progress}from'./zip.mjs';
	console.log(await progress(await fetch('./zip.mjs'),console.log).text());
	```

