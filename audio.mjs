const
n2nn=x=>({c:12,d:14,e:16,f:17,g:19,a:21,b:23})[x[0].toLowerCase()]+(({'#':1,s:1})[x[1]]?x.slice(2)*12+1:x.slice(1)*12),
nn2n=x=>['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][x%12]+Math.floor(x/12-1),
irgen=(atk=.1,d=2.5,cut=10000,ch=2,rate=44100)=>new Promise((
	f,_,fr=d*rate,oac=new(window.OfflineAudioContext||webkitOfflineAudioContext)(ch,fr,rate),
	ab=oac.createBuffer(ch,fr,rate),lpf=oac.createBiquadFilter(),g0=oac.createGain(),g1=oac.createGain(),bs=oac.createBufferSource()
)=>(
	[...Array(ch)].forEach((_,i)=>ab.getChannelData(i).forEach((_,i,a)=>a[i]=Math.random()*2-1)),lpf.type='lowpass',lpf.frequency.value=cut,lpf.Q.value=0,
	g0.gain.setTargetAtTime(0,0,d*.2),g1.gain.setValueAtTime(0,0),g1.gain.linearRampToValueAtTime(1,atk),g1.gain.setValueAtTime(1,d*.9),g1.gain.linearRampToValueAtTime(0,d),
	bs.buffer=ab,[bs,lpf,g0,g1,oac.destination].reduce((a,x)=>(a.connect(x),x)),bs.start(),oac.startRendering(),oac.oncomplete=e=>f(e.renderedBuffer)
)),
ab2wav=w=>((
	{numberOfChannels:c,sampleRate:r},l4=x=>[x,x>>>8,x>>>16,x>>>24],l2=x=>[x,x>>>8],
	x=(x=>[...Array(x[0].length)].flatMap((_,i)=>x.flatMap(y=>l2(y[i]*0x7fff))))([...Array(c)].map((_,i)=>w.getChannelData(i)))
)=>new Uint8Array([82,73,70,70,l4(36+x.length),87,65,86,69,102,109,116,32,16,0,0,0,1,0,l2(c),l4(r),l4(r*(c*=2)),l2(c),16,0,100,97,116,97,l4(x.length),x].flat()).buffer)(w);
export{n2nn,nn2n,irgen,ab2wav};