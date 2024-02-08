# PetitNBT

*petit* lib for Minecraft NBT format

## download

[nbt.mjs](../nbt.mjs)

## exports

- ***async*** nbt_read( file *`TypedArray||ArrayBuffer`* , littleEndian *`Boolean`* ) => data *`Object`*  
  parse NBT File to Object  

- ***async*** nbt_write( data *`Object`* , littleEndian *`Boolean`* ) => NBT *`Uint8Array`*  
  create NBT File from data  
  children_type property of Array is always required  
  to specify type set type property of the value  

  ```js
  import{nbt_read,nbt_write}from'./nbt.mjs';
  let _=await new Response(input.files[0]).arrayBuffer(),
  console.log(_=nbt_read(_)),
  console.log(_=nbt_write(_),_.reduce((a,x,i)=>a+(i%4?'':i%32?' ':'\n')+x.toString(16).padStart(2,0)+' ','')),
  console.log(nbt_read(_))
  ```
