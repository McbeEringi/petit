# PetitMQ
*petit* lib for matrix & quaternion calc with method chaining design

## download
[mq.mjs](../mq.mjs)

## exports
- mat *Class*  
	class for matrix calc
	- constructor( x=[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1] *ArrayLike(16)*) => this  
		creates new matrix
	- copy() => mat *Class*  
		creates same matrix from current matrix
	- get() => mat *Float32Array(16)*  
		exports matrix as Float32Array
	- mul( matrix=this mat *Class* or *ArrayLike(16)* ) => this  
		calcs mul of current matrix and arg matrix  
		mathmatical `AB` equals to `B.mul(A)`
	- inv() => this  
		inverts current matrix
	- scale( scale=1 *Number* or *ArrayLike(3)* ) => this  
		scales current matrix
	- translate( translate=[] *ArrayLike(3)* ) => this  
		translates current matrix
	- rot( axis=[0,1,0] *ArrayLike(3)*, theta=0 *Number* ) => this  
		rotate current matrix
	- roteul( rpy=[0,0,0] *ArrayLike(3)* ) => this  
		rotate current matrix by euler[ yaw pitch roll ]
	- lookat( camera=[0,0,1] *ArrayLike(3)*, target=[0,0,0] *ArrayLike(3)*, cameraUp=[0,1,0] *ArrayLike(3)* ) => this  
		rotate current matrix to face the target
	- pers( fov *Number*, ratio *Number*, near *Number*, far *Number* ) => this  
		mul perspective proj matrix to current matrix
	- ortho( left *Number*, right *Number*, top *Number*, bottom *Number*, near *Number*, far *Number* ) => this  
		mul orthographic proj matrix to current matrix

	example
	```js
	import{mat}from'./mq.mjs';
	const mvp=new mat().scale(2).rot([0,1,0],performance.now()*.001).lookat([0,1,10],[0,1,0]).pers(70,canvas.width/canvas.height,.1,100),
		imvp=mvp.copy().inv();
	//mvp.get() and imvp.get() for uniform
	```
- qtn *Class*  
	class for quaternion calc
	- constructor( w=[1,0,0,0] *ArrayLike(4)* ) => this  
		creates new quaternion
	- copy() => qtn *Class*  
		creates same quaternion from current quaternion
	- getIm() => imaginaries *Array(3)*  
		exports imaginaries of current quaternion
	- mul( w=this qtn *Class* or *ArrayLike(4)* ) => this  
		calcs mul of current quaternion and arg quaternion
	- norm() => this  
		normalizes current quaternion
	- conj() => this  
		calcs conjugate of current quaternion
	- rot( axis=[0,1,0] *ArrayLike(3)*, theta=0 *Number* ) => this  
		rotate current quaternion
	- roteul( rpy=[0,0,0] *ArrayLike(3)* ) => this  
		rotate current quaternion by euler[ yaw pitch roll ]
	- slerp( q=this qtn *Class* or *ArrayLike(4)*, progress=.5 *Number* ) => this  
		calcs spherical lerp of current quaternion and arg quaternion
	- vec3( vec3=[0,0,1] *Array(3)* ) => vec3 *Array(3)*  
		transforms arg vec3 by current quaternion
	- mat() => mat *Class*  
		exports mat from current quaternion

	example
	```js
	import{mat,qtn}from'./mq.mjs';
	let vp=new mat().scale(2).rot([0,1,0],performance.now()*.001).lookat([0,1,10],[0,1,0]).pers(70,canvas.width/canvas.height,.1,100),
		q=new qtn(),
		loop=()=>{
			const t=(Date.now()*.001)%86400-43200,
				m=new mat().scale(50).mul(q.mat()).rot([0,1,0],performance.now()*.001),
				mvp=m.copy().mul(vp),
				im=m.copy().inv();
			//mvp.get() and im.get() for uniform
			requestAnimationFrame(loop);
		};
	canvas.addEventListener('pointermove',e=>{
		if(!e.isPrimary)return;
		let cw=canvas.width,ch=canvas.height,
			x=e.clientX-canvas.offsetLeft-cw*.5,
			y=e.clientY-canvas.offsetTop-ch*.5,
			sq=Math.hypot(x,y),
			r=sq*2*Math.PI/Math.sqrt(cw*cw+ch*ch);
		sq=1/sq;
		q=new qtn().rot([-y/sq,-x/sq,0],r);
	});
	loop();
	```
