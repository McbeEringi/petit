# PetitCol
*petit* lib of Shift-JIS encoder & decoder

## download
[sjis.mjs](../sjis.mjs)

## exports
- sjis *Class*  
	class of Shift-JIS encoder & decoder
	- constructor() => this  
		create instance  
		internally create tables to be used for conversion using TextDecoder
	- encode( text *String* ) => binary *Array*  
		encode text to binary array
	- decode( binary *Uint8Array|Array* ) => text *String*  
		decode binary array to text
```js
import{sjis}from'./sjis.mjs';
let s=new sjis();
console.log(s.decode('ﾆｬｰﾝ'));
// => [ 98, 172, 176, 221 ]

console.log(s.decode([147,140,139,158,147,193,139,150,139,150,137,194,139,199,139,199,146,183,141,161,147,250,139,125,231,175,139,120,137,201,139,150,137,194,139,112,137,186]));
// => '東京特許許可局局長今日急遽休暇許可却下'
```
