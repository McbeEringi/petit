# PetitZip

*petit* lib for .zip archive and download

## download

[zip.mjs](../zip.mjs)

## exports

- ***async*** zip( files=[{ name *String*, buffer *Blob ArrayBuffer*, lastModified? *Number* }...] *Array(N)*, progress( processed *Number[0~1]* ) *Function* ) => Zip *Blob*  
  create uncompressed .zip archive without compression
  files is Array of File like Object
  any of `File()`, `{name,buffer:Blob()}`, `{name,buffer:ArrayBuffer()}`
  passing ArrayBuffer will speed up process speed
- dl( file={ name *String*, buffer *Blob ArrayBuffer* } *Object* ) => undefined  
  download blob to the device

  ```js
  import{zip,dl}from'./zip.mjs';
  const files=[
    {name:'hello/world.txt',buffer:new Blob(['Hello world!'])},
    {name:'hello/hoge.txt',buffer:new Blob(['Hello hoge!'])},
    {name:'hello/hoge/fuga.txt',buffer:new Blob(['Hello hoge fuga!'])}
  ];
  dl({name:'hello.zip',buffer:await zip(files)});
  ```

- progress( response *Response*, callback([ done *Number*, all *Number* ]) *Function* ) => new_res *Response*  
  gives response progress to callback function

  ```js
  import{progress}from'./zip.mjs';
  console.log(await progress(await fetch('./zip.mjs'),console.log).text());
  ```
