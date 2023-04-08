const
rgb=(h=0,s=1,v=1)=>[5,3,1].map((i,k)=>(k=(h*6+i)%6,v-Math.max(0,Math.min(1,k,4-k))*s*v)),
hsv=(r=0,g=0,b=0)=>((v=Math.max(r,g,b),c=v-Math.min(r,g,b))=>[c&&((v==r?(g-b)/c:v==g?2+(b-r)/c:4+(r-g)/c)/6+1)%1,v&&c/v,v])(),
dec=w=>[...Array(3)].map((_,i)=>parseInt(w.slice(1+i*2,3+i*2),16)/255),
hex=w=>'#'+w.map(x=>Math.round(x*255).toString(16).padStart(2,0)).join('');
export{rgb,hsv,dec,hex};