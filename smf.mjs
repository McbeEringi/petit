import{sjis}from'./sjis.mjs';
const
smf=class{
	constructor(w){this.sjis=new sjis();w&&this.import(w);}
	import(w){
		w=new Uint8Array(w);
		const rr=(p,l)=>w.slice(p,p+l),r=(p,l)=>1<l?rr(p,l).reduce((a,x)=>a<<8|x):w[p];
		if(r(0,4)!=0x4d546864)throw'MThd not found.';
		this.header={format:r(8,2),division:r(12)&0x80?[0x80-(r(12)&0x7f),r(13)]:r(12,2)};
		this.tracks=[...Array(r(10,2))].reduce(a=>{
			if(a.r(4)!=0x4d54726b)throw'MTrk not found.';
			let p=a.r(4)+a.p,t=0,ch,ty,rs,x=[],d=[...Array(16)].map(_=>Array(128).fill(null));
			// if(r(p-3,3)!=0xff2f00)console.warn(`EOT not found at end of track.`);
			while(a.p<p){
				t+=a.n();
				(_=>(_&0x80?(_!=0xff&&(rs=_),a.p++):_=rs,ch=_&0xf,ty=_>>4&0b111))(r(a.p));
				(ty<3?(nn=a.r(),vel=a.r())=>(
					d[ch][nn]||x.push(d[ch][nn]={ch,name:'note',nn,t,seq:[]}),d[ch][nn].seq.push({t,vel}),
					(!ty||!vel)&&(d[ch][nn]=null)
				):_=>x.push([,,,
					_=>a.ro({ch,name:'ctrl'},'ctrl','value'),
					_=>a.ro({ch,name:'prg'},'prg'),
					_=>a.ro({ch,name:'chPress'},'vel'),
					_=>a.ro({ch,name:'bend',value:(a.r()|(a.r()<<7))-0x2000}),
					{
						0:_=>({name:'sysEx0',data:[0xf0,...a.rr()]}),7:_=>({name:'sysEx7',data:a.rr()}),
						15:(x=[a.r(),a.rr()])=>((x[0]&&x[0]<8?
								_=>x=[[,'text','copyright','name','instrument','lyric','marker','queue'][x[0]],this.sjis.decode(x[1])]
							:{
								0x2f:_=>x[0]='eot',
								0x51:_=>x=['bpm',6e7/(x[1][0]<<16|x[1][1]<<8|x[1][2])],
								0x58:_=>x[0]='beat',
								0x59:_=>x=['key',{key:x[1][0],minor:x[1][1]}]		
							}[x[0]]||(_=>_))(),
							{name:'meta',type:x[0],data:x[1]}
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