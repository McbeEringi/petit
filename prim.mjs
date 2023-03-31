//special thenks to wgld.org
import*as col from'./col.mjs';
const
fmt=x=>(x=x.length?x[0].map((_,i)=>x.flatMap(y=>y[i])):[],{p:x[0],n:x[1],c:x[2],t:x[3],i:x[4]}),
cube=(w=1,c)=>(n=>({
	p:n.map(x=>x*w),n,
	c:[...Array(6)].flatMap((_,i)=>new Array(4).fill(c||[...col.hsv2rgb(i/6),1])),
	t:new Array(6).fill([0,0,1,0,1,1,0,1]).flat(),
	i:[...Array(6)].flatMap((_,i)=>(i*=4,[0,1,2,0,2,3].map(x=>x+i)))
}))([-1,-1,1,1,-1,1,1,1,1,-1,1,1, -1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1, -1,1,-1,-1,1,1,1,1,1,1,1,-1, -1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1, 1,-1,-1,1,1,-1,1,1,1,1,-1,1, -1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),
sphere=(w=1,c,sx=16,sy=sx*2)=>fmt([...Array(sx+1)].flatMap((_,i)=>{let ip=i/sx,is=-Math.PI*(ip-.5),ic=Math.cos(is);is=Math.sin(is);
	return [...Array(sy+1)].map((_,j)=>{let jp=j/sy,js=2*Math.PI*jp,jc=Math.cos(js),k=i*(sy+1)+j;js=Math.sin(js);
		return[[ic*jc*w,is*w,ic*js*w],[ic*jc,is,ic*js],c||[...col.hsv2rgb(ip),1],[1-jp,1-ip],i==sx||j==sy?[]:[k,1+k,sy+1+k,sy+2+k,sy+1+k,1+k]];
	})
})),
torus=(w=1,c,sx=16,sy=sx*2)=>fmt([...Array(sx+1)].flatMap((_,i)=>{let ip=i/sx,is=2*Math.PI*ip,ic=Math.cos(is);is=Math.sin(is);
	return [...Array(sy+1)].map((_,j)=>{let jp=j/sy,js=2*Math.PI*jp,jc=Math.cos(js),k=i*(sy+1)+j;js=Math.sin(js);
		return[[(ic-2)*jc*w,is*w,(ic-2)*js*w],[ic*jc,is,ic*js],c||[...col.hsv2rgb(jp),1],[1-jp,1-ip],i==sx||j==sy?[]:[k,1+k,sy+1+k,sy+2+k,sy+1+k,1+k]];
	})
})),
obj=(w,col)=>((
	spl=(x,i)=>x.split(/\s+/,i).slice(1),spln=(...x)=>spl(...x).map(y=>+y),
	core=({w,col=[1,1,1,1],_v=0,_vt=0,_vn=0}={},og=(w.match(/^[og] (.+)$/m)||[])[1],vt=(w.match(/^vt .+$/gm)||[]).map(x=>spln(x,3)),vn=(w.match(/^vn .+$/gm)||[]).map(x=>spln(x,4)),
		v=(w.match(/^v .+$/gm)||[]).map((x,i,a)=>(a=col||[...col.hsv2rgb(i/a.length),1],x=spln(x),({3:_=>[x,a],4:_=>(x[3]=1/x[3],[x.slice(0,3).map(y=>y*x[3]),a]),6:_=>[x.slice(0,3),[...x.slice(3,6),1]]}[x.length])())),
		set=[...new Set(w=(w.match(/^f .+$/gm)||[]).flatMap(x=>(x=spl(x),[...Array(x.length-2)].flatMap((_,i)=>[x[0],x[1+i],x[2+i]]))))]
	)=>({w:{...fmt(set.map(x=>(x=x.split('/'),[v[(x[0]-1-_v)%v.length][0],x[2]?vn[(x[2]-1-_vn)%vn.length]:[0,0,0],v[(x[0]-1-_v)%v.length][1],x[1]?vt[(x[1]-1-_vt)%vt.length]:[0,0]]))),i:(x=>w.map(y=>x.get(y)))(new Map(set.map(Array))),og},_v:v.length,_vt:vt.length,_vn:vn.length})
)=>w.split(/\n(?=[og])/).reduce((a,x)=>(x=core({...a[a.length-1],w:x,col}).w,x.i.length&&a.push(x),a),[{}]).slice(1))();
export{cube,sphere,torus,obj,col};