# PetitZipEx
*petit* lib for extra .zip features

## download
[zipex.mjs](../zipex.mjs)

## exports
- zip *Object*  
	all function from petitZip
- ***async*** unzip( zip *Blob or ArrayBuffer* ) => [{ path *String*, blob *Blob*, date *Date* }...] *Array(N)*  
	disassemble uncompressed .zip archive
- ***async*** sfx( *see zip()* )
	create self extracting HTML file
	```js
	import{zip,dl}from'./zip.mjs';
	const files=[
		{path:'hello/world.txt',blob:new Blob(['Hello world!'])},
		{path:'hello/hoge.txt',blob:new Blob(['Hello hoge!'])},
		{path:'hello/hoge/fuga.txt',blob:new Blob(['Hello hoge fuga!'])}
	];
	dl({name:'hello.zip',blob:await zip(files)});
	console.log(await unzip(await zip(files)));
	dl({name:'hello.html',blob:await sfx(files)});
	```
