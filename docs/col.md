# PetitCol
*petit* lib for color convertion

## download
[col.mjs](../col.mjs)

## exports
- rgb( hue=0 *Number*, sat=1 *Number*, val=1 *Number* ) => RGB *Array(3)*  
	converts HSV to RGB color
	```js
	import{hsv2rgb}from'./col.mjs';
	const hsv=[
		.444, //hue
		.5 , //saturation
		.8 //value
	];
	const rgb=rgb(...hsv);
	console.log(rgb);
	// =>[
	// 	.4, //R
	// 	.8, //G
	// 	.6656 //B
	// ]
	```
- hsv( r=0 *Number*, g=0 *Number*, b=0 *Number* ) => HSV *Array(3)*  
	converts RGB to HSV color
	```js
	import{rgb2hsv}from'./col.mjs';
	const rgb=[
		.444, //r
		.5 ,//g
		.8 //b
	];
	const hsv=hsv(...rgb);
	console.log(hsv);
	// =>[
	// 	.443999, //hue
	// 	.5, //saturation
	// 	.8 //value
	// ]
	```
- dec( hex *String* ) => rgb *Array*  
	converts hex color code to normalized rgb array
- hex( rgb *Array* ) => hex *String*
	convert normalized rgb(a) to hex color code