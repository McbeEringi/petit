import{sjis}from'./sjis.mjs';
const
smf=class{
	constructor(w){this.sjis=new sjis();w&&this.import(w);}
	import(w){
		w=new Uint8Array(w);
		const rr=(p,l)=>w.slice(p,p+l),r=(p,l)=>1<l?rr(p,l).reduce((a,x)=>a<<8|x):w[p];
		if(r(0,4)!=0x4d546864)throw'MThd not found.';
		this.header={format:r(8,2),division:r(12)&0x80?[0x80-(r(12)&0x7f),r(13)]:r(12,2)};
		this.tracks=[...Array(r(10,2))].reduce((a,_,trk)=>{
			if(a.r(4)!=0x4d54726b)throw'MTrk not found.';
			let p=a.r(4)+a.p,t=0,ch,ty,rs,x=[],d=[...Array(16)].map(_=>Array(128).fill(null));
			// if(r(p-3,3)!=0xff2f00)console.warn(`EOT not found at end of track.`);
			while(a.p<p){
				t+=a.n();
				(_=>(_&0x80?(_!=0xff&&(rs=_),a.p++):_=rs,ch=_&0xf,ty=_>>4&0b111))(r(a.p));
				(ty<3?(nn=a.r(),vel=a.r())=>(
					d[ch][nn]||x.push(d[ch][nn]={t,trk,ch,name:'note',nn,seq:[]}),d[ch][nn].seq.push({t,vel}),
					(!ty||!vel)&&(d[ch][nn]=null)
				):_=>x.push([,,,
					_=>a.ro({t,trk,ch,name:'ctrl'},'ctrl','value'),
					_=>a.ro({t,trk,ch,name:'prg'},'prg'),
					_=>a.ro({t,trk,ch,name:'chPress'},'vel'),
					_=>a.ro({t,trk,ch,name:'bend',value:(a.r()|(a.r()<<7))-0x2000}),
					{
						0:_=>({t,trk,name:'sysEx0',data:[0xf0,...a.rr()]}),7:_=>({t,name:'sysEx7',data:a.rr()}),
						15:(x=[a.r(),a.rr()])=>((x[0]&&x[0]<8?
								_=>x=[[,'text','copyright','name','instrument','lyric','marker','queue'][x[0]],x[1]&&this.sjis.decode(x[1])]
							:{
								0x2f:_=>x[0]='eot',
								0x51:_=>x=['bpm',6e7/(x[1][0]<<16|x[1][1]<<8|x[1][2])],
								0x58:_=>x[0]='beat',
								0x59:_=>x=['key',{key:x[1][0],minor:x[1][1]}]		
							}[x[0]]||(_=>_))(),
							{t,trk,name:'meta',type:x[0],data:x[1]}
						)
					}[ch]
				][ty]()))();
			}
			a.a.push(x);
			return a;
		},{
			a:[],p:8+r(4,4),n(){let x=0;while(1){x=x<<7|r(this.p)&0x7f;if(~r(this.p++)&0x80)return x;}},
			r(l=1){return r(this.p,l,this.p+=l);},rr(l=this.n()){return l?rr(this.p,l,this.p+=l):null;},ro(a,...x){return x.reduce((a,x)=>(a[x]=this.r(),a),a);}
		}).a;
		return this;
	}
	export(){return null;}
},
player=class{
	constructor(actx){
		this.actx=actx||new(window.AudioContext||webkitAudioContext)();
		this.out=this.actx.destination;
	}
	load(w){this.smf=w;return this;}
	play(t=0){
		if(!this.smf)return this;
		//const t0=this.actx.currentTime,rt=x=>t0+(x-t)/this.smf.header.division/140*60;
		const
		noise=((w,x=this.actx.createBuffer(w,32767,this.actx.sampleRate))=>(Array(w).fill(
			(w=>new Float32Array(32767).map(x=>(x=(w^w>>1)&1,w=w>>1|x<<14,!x)))(1)
		).forEach((a,i)=>x.copyToChannel(a,i)),x))(this.actx.destination.channelCount),
		fft=(w,l=12)=>{
			w=w.flatMap(x=>[...Array(2**l/w.length)].map(_=>[x,0]));
			const add=([[a,b],[c,d]])=>[a+c,b+d],sub=([[a,b],[c,d]])=>[a-c,b-d],mul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c],cm=t=>[Math.cos(t),Math.sin(t)],trs=x=>x[0].map((_,i)=>x.map(y=>y[i])),
				core=(n=w.length,t=-Math.PI/n,p=0,o=1,x,y)=>n==1?[w[p]]:(y=core(n/=2,t*=2,p+o,o*=2),x=core(n,t,p,o).map((z,i)=>[z,mul(y[i],cm(t*i))]),x.map(add).concat(x.map(sub)));
			return trs(core()).map(x=>new Float32Array([0,...x.slice(1)]));
		},
		pwav=[[0,1,0,0,0,0,0,0],[0,1,1,0,0,0,0,0],[0,1,1,1,1,0,0,0],[1,0,0,1,1,1,1,1],Array.from('fedcba98765432100123456789abcdef',x=>parseInt(x,16)/15)].map(x=>actx.createPeriodicWave(...fft(x.map(y=>y*2-1))));

		const
		sli=(a,b)=>this.smf.tracks.flatMap(_=>_.filter(x=>a<=x.t&&x.t<b)).sort((a,b)=>a-b),
		reg={
			bpm:120,
			ch:[...Array(16)].map((_,i)=>({
				rac(){this.c={
					bend_sense:{msb:2,lsb:0,valueOf(){return this.msb+this.lsb/128;}},// ピッチベンドセンシティビティ +-2半音
					mod:0,vol:100/127,pan:0,exp:0,sus:0,rpn:0,
					tune:{fine:{msb:0x40,lsb:0},coarse:{msb:0x40},valueOf(){return((this.fine.msb<<7|this.fine.lsb)-0x2000)/0x2000+this.coarse.msb-0x40;}}// p53
				};return this;},
				reset(){return Object.assign(this.rac(),{bend:0,prg:0,percussion:i==9});}
			}).reset())
		},
		regw=(w,r=reg)=>({
			ctrl:_=>({// https://amei.or.jp/midistandardcommittee/MIDI1.0.pdf p152
				1:_=>r.ch[w.ch].c.mod=w.value/127,// モジュレーション +-50セント(https://amei.or.jp/midistandardcommittee/Recommended_Practice/General_MIDI_Lite_v1.0_japanese.pdf p13)
				7:_=>r.ch[w.ch].c.vol=w.value/127,// ボリューム
				10:_=>r.ch[w.ch].c.pan=(w.value-64)/64,// パン -1(L)~1(R)
				11:_=>r.ch[w.ch].c.exp=w.value/127,// エクスプレッション
				64:_=>r.ch[w.ch].c.sus=w.value/127,// サスティン
				100:_=>r.ch[w.ch].c.rpn=r.ch[w.ch].c.rpn&0xff00|w.value<<0,// RPN LSB
				101:_=>r.ch[w.ch].c.rpn=r.ch[w.ch].c.rpn&0x00ff|w.value<<8,// RPN MSB
				121:_=>r.ch[w.ch].rac(),// リセットオールコントローラー
				// 123:_=>_// オールノートオフ

				38:{// DataEntry LSB
					0:_=>r.ch[w.ch].c.bend_sense.lsb=w.value,
					1:_=>r.ch[w.ch].c.tune.fine.lsb=w.value
				}[r.ch[w.ch].c.rpn],
				6:{// DataEntry MSB
					0:_=>r.ch[w.ch].c.bend_sense.msb=w.value,
					1:_=>r.ch[w.ch].c.tune.fine.msb=w.value,
					2:_=>r.ch[w.ch].c.tune.coarse.msb=w.value
				}[r.ch[w.ch].c.rpn]
			}[w.ctrl]),
			prg:_=>(_=>r.ch[w.ch].prg=w.value),// プログラム変更
			bend:_=>(_=>r.ch[w.ch].bend=w.value/0x2000),// ピッチベンド
			meta:_=>({
				bpm:_=>r.bpm=w.data
			}[w.type])
		}[w.name]||(_=>_))(),
		core=(t0,rt=this.actx.currentTime+.1)=>((
			//ml=1024,
			div=this.smf.header.division,
			t1=t0+div*16,t=t0,t2rt=x=>rt+(x-t)/div/reg.bpm*60,
			w=sli(t0,t1)
		)=>w.length&&(
			//w.length>ml&&(t1=w[ml].t,w=w.slice(0,ml)),
			console.log(t0,rt,w),
			w.forEach(x=>(
				(regw(x)||(_=>x.name=='note'&&(reg.ch[x.ch].percussion?(bs=this.actx.createBufferSource(),g0=this.actx.createGain(),g1=this.actx.createGain())=>(
					bs.buffer=noise,bs.playbackRate.value=(x.nn-35)/46*2,//35~81
					g0.gain.setTargetAtTime(.01,t2rt(x.seq[0].t),.05),
					g1.gain.setValueAtTime(0,t2rt(x.seq[0].t)),g1.gain.linearRampToValueAtTime(x.seq[0].vel/127*.1,t2rt(x.seq[0].t)+.001),
					g1.gain.setValueAtTime(x.seq[0].vel/127*.1,t2rt(x.seq[x.seq.length-1].t)-.001),g1.gain.linearRampToValueAtTime(0,t2rt(x.seq[x.seq.length-1].t)),
					[bs,g0,g1,this.out].reduce((a,x)=>(a.connect(x),x)),
					// setTimeout(_=>console.log(x),t2rt(x.seq[0].t)*1000),
					bs.start(t2rt(x.seq[0].t)),bs.stop(t2rt(x.seq[x.seq.length-1].t))
				):(osc=this.actx.createOscillator(),g0=this.actx.createGain(),g1=this.actx.createGain())=>(
					osc.frequency.value=440*2**((x.nn-69+reg.ch[x.ch].bend*reg.ch[x.ch].c.bend_sense)/12),
					osc.setPeriodicWave(pwav[x.trk%pwav.length]),//osc.type='triangle',//['square','sawtooth','triangle'][x.ch%3],
					g0.gain.setTargetAtTime(.01,t2rt(x.seq[0].t),.5),
					g1.gain.setValueAtTime(0,t2rt(x.seq[0].t)),g1.gain.linearRampToValueAtTime(x.seq[0].vel/127*.1,t2rt(x.seq[0].t)+.001),
					g1.gain.setValueAtTime(x.seq[0].vel/127*.1,t2rt(x.seq[x.seq.length-1].t)-.001),g1.gain.linearRampToValueAtTime(0,t2rt(x.seq[x.seq.length-1].t)),
					[osc,g0,g1,this.out].reduce((a,x)=>(a.connect(x),x)),
					// setTimeout(_=>console.log(x),t2rt(x.seq[0].t)*1000),
					osc.start(t2rt(x.seq[0].t)),osc.stop(t2rt(x.seq[x.seq.length-1].t))
				))()))(),console.log(reg.bpm),
				[t,rt]=[x.t,t2rt(x.t)]
			)),
			rt=t2rt(t1),
			setTimeout(_=>core(t1,rt),(rt-this.actx.currentTime-.5)*1000)
		))();


		sli(0,t).forEach(x=>(x=regw(x),x||x()));
		core(t);
		return this;
	}
	stop(){}

	pref(t){

	}
};
export{smf,player};
