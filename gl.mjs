//special thenks to wgld.org
const
gl=class{
	constructor(c=document.createElement('canvas')){
		this.gl=c.getContext('webgl2')||c.getContext('webgl');// TODO: legacy webgl VAO support
		return this;
	}
	resize(){}
	compile(){
		const gl=this.gl;
		return Object.entries(w.shaders).reduce((a,x,y)=>(
			gl.shaderSource(y=gl.createShader(gl[x[0]]),x[1]),gl.compileShader(y),a.msg[x[0]]=gl.getShaderInfoLog(y),(a.err=a.err||!gl.getShaderParameter(y,gl.COMPILE_STATUS))?gl.deleteShader(y):gl.attachShader(a.prg,y),a
		),{prg:gl.createProgram(),msg:{},err:false,_(){
			gl.linkProgram(this.prg);this.msg.PROGRAM=gl.getProgramInfoLog(this.prg);this.err=this.err||!gl.getProgramParameter(this.prg,gl.LINK_STATUS);if(this.err){gl.deleteProgram(this.prg);throw this.msg;}return this.prg;
		}})._()
	}

};
export{gl};