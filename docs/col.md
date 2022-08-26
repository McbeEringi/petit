# PetitCol
*petit* lib for color convertion

## download
[col.mjs](../col.mjs)

## exports
- hsv2rgb( hue=0 *Number*, sat=1 *Number*, val=1 *Number* ) => RGB *Array(3)*  
	converts HSV to RGB color
	```js
	import{hsv2rgb}from'./col.mjs';
	const hsv=[
		.444, //hue
		.5 , //saturation
		.8 //value
	];
	const rgb=hsv2rgb(...hsv);
	console.log(rgb);
	// =>[
	// 	.4, //R
	// 	.8, //G
	// 	.6656 //B
	// ]
	```
- rgb2hsv( r=0 *Number*, g=0 *Number*, b=0 *Number* ) => HSV *Array(3)*  
	converts RGB to HSV color
	```js
	import{rgb2hsv}from'./col.mjs';
	const rgb=[
		.444, //r
		.5 ,//g
		.8 //b
	];
	const hsv=rgb2hsv(...rgb);
	console.log(hsv);
	// =>[
	// 	.443999, //hue
	// 	.5, //saturation
	// 	.8 //value
	// ]
	```

