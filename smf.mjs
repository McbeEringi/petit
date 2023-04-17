import{sjis}from'./sjis.mjs';
const
smfin=w=>((w,r=(p,l)=>1<l?w.slice(p,p+l).reduce((a,x)=>a<<8|x):w[p])=>r(0,4)==0x4d546864?{
	header:{format:r(8,2),division:r(12)&0x80?[0x80-(r(12)&0x7f),r(13)]:r(12,2)},
	tracks:[...Array(r(10,2))].reduce((a,_)=>(a.a.push(a.r(4)==0x4d54726b?((p=a.r(4)+a.p,dt,ch,x,b=[])=>{
		if(r(p-3,3)!=0xff2f00)return'EOT not found.';
		while(a.p<p){
			dt=a.n();(x=r(a.p))&0x80?(_=x,a.p++):x=_;ch=x&0xf;
			b.push({dt,...[
				_=>a.ro({ch,name:'noteOff'},'note','vel'),
				_=>a.ro({ch,name:'noteOn'},'note','vel'),
				_=>a.ro({ch,name:'polyPress'},'note','vel'),
				_=>a.ro({ch,name:'ctrl'},'ctrl','value'),
				_=>a.ro({ch,name:'prg'},'prg'),
				_=>a.ro({ch,name:'chPress'},'vel'),
				_=>a.ro({ch,name:'bend',value:(a.r()|(a.r()<<7))-0x2000}),
				{
					0:_=>({name:'sysEx0',data:[0xf0,..._()]}),7:_=>({name:'sysEx7',data:_()}),
					15:_=>({name:'meta',type:a.r()&0x7f,data:_()})
				}[ch]
			][x>>4&0b111]((_=a.n())=>w.slice(a.p,a.p+=_))});
		}
		return b;
	})():'MTrk not found.'),a),{
		a:[],p:8+r(4,4),n(){let x=0;while(1){x=x<<7|r(this.p)&0x7f;if(~r(this.p++)&0x80)return x;}},
		r(l=1){return r(this.p,l,this.p+=l);},ro(a,...x){return x.reduce((a,x)=>(a[x]=this.r(),a),a);}
	}).a
}:'MThd not found.')(new Uint8Array(w)),
smfde=w=>((
	d=[...Array(16)],
	sj=new sjis()
)=>(
	w.tracks=w.tracks.map(w=>(d=d.map(_=>new Array(128).fill(null)),w.reduce((a,x)=>(
		x.t=(a.t+=x.dt),delete x.dt,
		({
			...(_=>({
				noteOn:_(!x.vel),
				noteOff:_(1),
				polyPress:_(!x.vel)
			}))(e=>(_={t:x.t,vel:x.vel})=>(
				d[x.ch][x.note]?d[x.ch][x.note].seq.push(_):a.a.push(d[x.ch][x.note]={ch:x.ch,name:'note',note:x.note,t:x.t,seq:[_]}),
				e&&(d[x.ch][x.note]=null)
			)),
			
			meta:_=>((0<x.type&&x.type<8?
				(_=>(x.type=[,'text','copyright','name','instrument','lyric','marker','queue'][x.type],x.data=sj.decode(x.data))):
				{
					0x2f:_=>x.type='eot',
					0x51:_=>(x.type='bpm',x.data=6e7/(x.data[0]<<16|x.data[1]<<8|x.data[2])),
					0x58:_=>x.type='beat',
					0x59:_=>(x.type='key',x.data={key:x.data[0],minor:x.data[1]})
				}[x.type]||(_=>_))(),a.a.push(x))
		}[x.name]||(_=>a.a.push(x)))(),
		a
	),{a:[],t:0}).a))
))(),

smf=class{
	constructor(w){this.sjis=new sjis();w&&this.import(w);}
	import(w){
		w=new Uint8Array(w);
		const
		r=(p,l)=>1<l?w.slice(p,p+l).reduce((a,x)=>a<<8|x):w[p],
		d=[...Array(16)];

		if(r(0,4)!=0x4d546864)throw'MThd not found.';
		this.header={format:r(8,2),division:r(12)&0x80?[0x80-(r(12)&0x7f),r(13)]:r(12,2)};
		this.tracks=[...Array(r(10,2))].reduce(a=>{
			if(a.r(4)!=0x4d54726b)throw'MTrk not found.';
			let p=a.r(4)+a.p,t=0,ch,rs,x,b=[];
			// if(r(p-3,3)!=0xff2f00)throw`EOT not found at end of track${tn+1}.`;
			while(a.p<p){
				t+=a.n();(x=r(a.p))&0x80?(rs=x,a.p++):x=rs;ch=x&0xf;
				b.push({t,...[
					_=>a.ro({ch,name:'noteOff'},'note','vel'),
					_=>a.ro({ch,name:'noteOn'},'note','vel'),
					_=>a.ro({ch,name:'polyPress'},'note','vel'),
					_=>a.ro({ch,name:'ctrl'},'ctrl','value'),
					_=>a.ro({ch,name:'prg'},'prg'),
					_=>a.ro({ch,name:'chPress'},'vel'),
					_=>a.ro({ch,name:'bend',value:(a.r()|(a.r()<<7))-0x2000}),
					{
						0:_=>({name:'sysEx0',data:[0xf0,..._()]}),7:_=>({name:'sysEx7',data:_()}),
						15:_=>({name:'meta',type:a.r()&0x7f,data:_()})
					}[ch]
				][x>>4&0b111]((_=a.n())=>w.slice(a.p,a.p+=_))});
			}
			a.a.push(b);
			return a;
		},{
			a:[],p:8+r(4,4),n(){let x=0;while(1){x=x<<7|r(this.p)&0x7f;if(~r(this.p++)&0x80)return x;}},
			r(l=1){return r(this.p,l,this.p+=l);},ro(a,...x){return x.reduce((a,x)=>(a[x]=this.r(),a),a);}
		}).a;
		return this;
	}
	export(){return (this.w);}
},
player=class{
	constructor(actx){
		this.actx=actx||new(window.AudioContext||webkitAudioContext)();
		this.out=this.actx.destination;
	}
	set(){}
	play(){}
	pause(){}
	stop(){}
};
export{smf,player};

// ({
// 	rac(){
// 		this.c={// https://amei.or.jp/midistandardcommittee/MIDI1.0.pdf p152
// 			bend_sense:2,
// 			mod:0,// +-50cent https://amei.or.jp/midistandardcommittee/Recommended_Practice/General_MIDI_Lite_v1.0_japanese.pdf p13
// 			vol:100/127,
// 			pan:0,
// 			sus:0,
// 			exp:0,
// 			tune:{fine:0,coarse:0}
// 			/*
// 			https://amei.or.jp/midistandardcommittee/MIDI1.0.pdf p152
// 			コントロール番号
// 			1 モジュレーション(+-50セント? https://amei.or.jp/midistandardcommittee/Recommended_Practice/General_MIDI_Lite_v1.0_japanese.pdf p13)
// 			7 ボリューム (100/127)
// 			10 パン
// 			11 エクスプレッション
// 			64 サスティン
// 			121 リセット・オール・コントローラー
// 			123 オール・ノート・オフ

// 			RPN
// 			0 ピッチ・ベンド・センシティビティ
// 			1 ファイン・チューニング
// 			2 コース・チューニング
// 			*/
// 		};
// 		return this;
// 	},
// 	reset(){
// 		Object.assign(this,{bend:0,prg:0,drum:i==9});
// 		return this.rac();
// 	}
// })