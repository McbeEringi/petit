# PetitCol
*petit* lib of WebAudio functions

## download
[audio.mjs](../audio.mjs)

## exports
- n2nn( noteName *String* ) => noteNumber *Number*  
	converts note name to note number
- nn2n( noteNumber *Number* ) => noteName *String*  
	converts note number to note name
	```js
	import{n2nn,nn2n}from'./audio.mjs';
	console.log(n2nn('F#4'));
	// => 66
	console.log(nn2n(69));
	// => 'A4'
	``` 
- ***async*** irgen( attack=0.1 *Number*, duration=2.5 *Number*, cutFrequency=10000 *Number*, channel=2 *Number*, sampleRate=44100 *Number* ) => impulseResponse *AudioBuffer*  
	generates impulse response
- ab2wav( source *AudioBuffer* ) => wav *ArrayBuffer*
	converts audio buffer to wav file 
	```js
	import{irgen,ab2wav}from'./audio.mjs';
	import{dl}from'./zip.mjs';
	dl({
		name:'ir.wav',
		blob:new Blob([
			ab2wav(await irgen())
		])
	});
	```