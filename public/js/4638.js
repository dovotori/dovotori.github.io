"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[4638],{44254:(t,e,i)=>{i.d(e,{Z:()=>a});var n=i(15671),r=i(43144),o=i(25773),s=i(21969),a=function(){function t(e){if((0,n.Z)(this,t),this.position=new o.Z(e.position.x,e.position.y,e.position.z),this.target=new o.Z(0,0,0),this.view=new s.Z,e.ortho){var i=e.ortho,r=i.left,a=i.right,u=i.bottom,h=i.top,c=e.near,l=e.far;this.ortho=new s.Z,this.ortho.ortho(r,a,u,h,c,l)}}return(0,r.Z)(t,[{key:"lookAt",value:function(){this.view.identity().lookAt(this.position.getX(),this.position.getY(),this.position.getZ(),this.target.getX(),this.target.getY(),this.target.getZ(),0,1,0)}},{key:"getView",value:function(){return this.view}},{key:"getPosition",value:function(){return this.position.get()}},{key:"getPositionVec3",value:function(){return this.position}},{key:"getTarget",value:function(){return this.target.get()}},{key:"getModel",value:function(){return this.repere.getModel()}},{key:"getOrtho",value:function(){return this.ortho}},{key:"addToPosition",value:function(t,e,i){this.position.addXYZ(t,e,i),this.lookAt()}},{key:"setPosition",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,n=null!==t?t:this.position.getX(),r=null!==e?e:this.position.getY(),o=null!==i?i:this.position.getZ();this.position.set(n,r,o),this.lookAt()}},{key:"setTarget",value:function(t,e,i){this.target.set(t,e,i)}},{key:"setTargetVec3",value:function(t){this.target.equal(t)}}]),t}()},47313:(t,e,i)=>{i.d(e,{Z:()=>o});var n=i(15671),r=i(43144),o=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.04;(0,n.Z)(this,t),this.value=e,this.target=e,this.sampling=i,this.threshold=1e-6}return(0,r.Z)(t,[{key:"update",value:function(){Math.abs(this.value-this.target)>this.threshold?this.value+=(this.target-this.value)*this.sampling:this.value=this.target}},{key:"get",value:function(){return this.value}},{key:"set",value:function(t){this.target=t}},{key:"setDirect",value:function(t){this.value=t}}]),t}()},94281:(t,e,i)=>{i.d(e,{Eu:()=>r,H$:()=>o});var n=i(68763),r=function(t,e){for(var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=i.startX,o=void 0===r?-1:r,s=i.endX,a=void 0===s?1:s,u=i.startZ,h=void 0===u?-1:u,c=i.endZ,l=void 0===c?1:c,d=[],f=0;f<e;f++)for(var p=(0,n.Yp)(f,0,e-1,h,l),g=0;g<t;g++){var v=(0,n.Yp)(g,0,t-1,o,a);d.push(v),d.push(0),d.push(p)}return d},o=function(t,e){for(var i=[],n=0;n<e-1;n++)for(var r=0;r<t-1;r++){var o=n*t+r;i.push(o),i.push(t+o),i.push(o+1),i.push(t+o),i.push(t+o+1),i.push(o+1)}return i}},40487:(t,e,i)=>{i.d(e,{Z:()=>b});var n=i(15671),r=i(43144),o=i(11752),s=i(60136),a=i(6215),u=i(61120),h=i(35551),c=i(25773),l=i(21969);function d(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,n=(0,u.Z)(t);if(e){var r=(0,u.Z)(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return(0,a.Z)(this,i)}}var f=function(t){(0,s.Z)(i,t);var e=d(i);function i(t){var r;return(0,n.Z)(this,i),(r=e.call(this,t)).target=new c.Z(t.target.x,t.target.y,t.target.z),r.matIdentity=new l.Z,r.projection=new l.Z,r.projection.identity(),r.near=t.near||1,r.far=t.far||100,r.angle=t.angle||50,r.matIdentity.identity(),r.lookAt(),r}return(0,r.Z)(i,[{key:"update",value:function(){this.lookAt()}},{key:"perspective",value:function(t,e){this.projection.identity().perspective(this.angle,t/e,this.near,this.far)}},{key:"move",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.position.set(this.position.getX(),Math.sin(.02*t)*(2+e),this.position.getZ()),this.lookAt()}},{key:"setNearFar",value:function(t,e){this.near=t,this.far=e}},{key:"setAngle",value:function(t){this.angle=t}},{key:"getProjection",value:function(){return this.projection}},{key:"getIdentity",value:function(){return this.matIdentity}},{key:"getNearFar",value:function(){return[this.near,this.far]}},{key:"getNear",value:function(){return this.near}},{key:"getFar",value:function(){return this.far}},{key:"getAngle",value:function(){return this.angle}},{key:"getReflectViewMatrix",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=2*(this.position.getY()-t);return(new l.Z).identity().lookAt(this.position.getX(),this.position.getY()-e,this.position.getZ(),this.target.getX(),this.target.getY(),this.target.getZ(),0,1,0)}}]),i}(i(44254).Z);const p=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;(0,n.Z)(this,t),this.d=[0,0,0,0],this.set(e,i,r,o)}return(0,r.Z)(t,[{key:"normalise",value:function(){var t=this.length();return 0!==t&&(this.d[0]/=t,this.d[1]/=t,this.d[2]/=t,this.d[3]/=t),this}},{key:"get",value:function(){return this.d}},{key:"getX",value:function(){return this.d[0]}},{key:"getY",value:function(){return this.d[1]}},{key:"getZ",value:function(){return this.d[2]}},{key:"getW",value:function(){return this.d[3]}},{key:"length",value:function(){return Math.sqrt(this.d[0]*this.d[0]+this.d[1]*this.d[1]+this.d[2]*this.d[2]+this.d[3]*this.d[3])}},{key:"set",value:function(t,e,i,n){return null!=t&&(this.d[0]=t),null!=e?this.d[1]=e:null!=t&&(this.d[1]=t),null!=i?this.d[2]=i:null!=t&&(this.d[2]=t),null!=n?this.d[3]=n:null!=t&&(this.d[3]=t),this}},{key:"equal",value:function(t){return this.d=[t.d[0],t.d[1],t.d[2],t.d[3]],this}},{key:"add",value:function(t){return this.d[0]+=t.d[0],this.d[1]+=t.d[1],this.d[2]+=t.d[2],this.d[3]+=t.d[3],this}},{key:"addNumber",value:function(t){return this.d[0]+=t,this.d[1]+=t,this.d[2]+=t,this.d[3]+=t,this}},{key:"minus",value:function(t){return this.d[0]-=t.d[0],this.d[1]-=t.d[1],this.d[2]-=t.d[2],this.d[3]-=t.d[3],this}},{key:"minusNumber",value:function(t){return this.d[0]-=t,this.d[1]-=t,this.d[2]-=t,this.d[3]-=t,this}},{key:"multiplyNumber",value:function(t){return this.d[0]*=t,this.d[1]*=t,this.d[2]*=t,this.d[3]*=t,this}},{key:"multiplyMatrix",value:function(t){var e=this.d[0],i=this.d[1],n=this.d[2],r=this.d[3];return this.d[0]=t.d[0]*e+t.d[4]*i+t.d[8]*n+t.d[12]*r,this.d[1]=t.d[1]*e+t.d[5]*i+t.d[9]*n+t.d[13]*r,this.d[2]=t.d[2]*e+t.d[6]*i+t.d[10]*n+t.d[14]*r,this.d[3]=t.d[3]*e+t.d[7]*i+t.d[11]*n+t.d[15]*r,this}},{key:"multiply",value:function(t){return this.d[0]*=t.d[0],this.d[1]*=t.d[1],this.d[2]*=t.d[2],this.d[3]*=t.d[3],this}},{key:"divideNumber",value:function(t){return this.d[0]/=t,this.d[1]/=t,this.d[2]/=t,this.d[3]/=t,this}},{key:"divide",value:function(t){return this.d[0]/=t.d[0],this.d[1]/=t.d[1],this.d[2]/=t.d[2],this.d[3]/=t.d[3],this}},{key:"distance",value:function(t){return Math.sqrt((t.d[0]-this.d[0])*(t.d[0]-this.d[0])+(t.d[1]-this.d[1])*(t.d[1]-this.d[1])+(t.d[2]-this.d[2])*(t.d[2]-this.d[2])+(t.d[3]-this.d[3])*(t.d[3]-this.d[3]))}}]),t}();function g(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,n=(0,u.Z)(t);if(e){var r=(0,u.Z)(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return(0,a.Z)(this,i)}}var v=function(t){(0,s.Z)(i,t);var e=g(i);function i(){return(0,n.Z)(this,i),e.apply(this,arguments)}return(0,r.Z)(i,[{key:"get2dTexturePoint",value:function(t){var e=t.getX(),i=t.getY(),n=t.getZ(),r=new p(e,i,n,1),o=new l.Z;o.equal(this.view).multiply(this.projection),r.multiplyMatrix(o);var s=r.getX()/r.getW(),a=r.getY()/r.getW();return[s=.5*(s+1),a=.5*(a+1)]}},{key:"get2dScreenPoint",value:function(t,e){var i=this.get2dTexturePoint(t);return[i[0]*e.width,i[1]*e.height]}}]),i}(f),Z=i(47313);function m(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,n=(0,u.Z)(t);if(e){var r=(0,u.Z)(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return(0,a.Z)(this,i)}}var y=function(t){(0,s.Z)(i,t);var e=m(i);function i(t){var r;return(0,n.Z)(this,i),(r=e.call(this,t)).options=t,r.rotationX=new Z.Z,r.targetX=new Z.Z,r.zoomZ=new Z.Z(.7,.1),r}return(0,r.Z)(i,[{key:"update",value:function(){(0,o.Z)((0,u.Z)(i.prototype),"update",this).call(this),this.rotationX.update(),this.zoomZ.update(),this.targetX.update(),this.position.set(this.options.position.x+this.targetX.get()+Math.sin(this.rotationX.get())*(this.options.position.z*this.zoomZ.get()),this.options.position.y,Math.cos(this.rotationX.get())*(this.options.position.z*this.zoomZ.get())),this.target.set(this.options.target.x,this.options.target.y,this.options.target.z)}},{key:"setSmoothTarget",value:function(t){this.targetX.set(t)}},{key:"setSmoothRotation",value:function(t){this.rotationX.set(t)}},{key:"setSmoothZoom",value:function(t){this.zoomZ.set(t)}},{key:"getZoom",value:function(){return this.zoomZ.get()}},{key:"followPos2D",value:function(t,e){this.options.position.x=t,this.options.position.y=e,this.options.target.x=t,this.options.target.y=e}},{key:"followPosY",value:function(t){this.options.position.y=t,this.options.target.y=t}}]),i}(v);function w(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,n=(0,u.Z)(t);if(e){var r=(0,u.Z)(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return(0,a.Z)(this,i)}}var b=function(t){(0,s.Z)(i,t);var e=w(i);function i(t,r,o){var s;return(0,n.Z)(this,i),(s=e.call(this,t,r,o)).camera=new y(r.camera),s.camera.perspective(s.containerSize.width,s.containerSize.height),s}return(0,r.Z)(i,[{key:"resize",value:function(t){(0,o.Z)((0,u.Z)(i.prototype),"resize",this).call(this,t),this.camera.perspective(this.containerSize.width,this.containerSize.height)}},{key:"update",value:function(t){(0,o.Z)((0,u.Z)(i.prototype),"update",this).call(this,t),this.camera.update(),this.mngProg.setCameraMatrix(this.camera,!!this.config.camera.ortho)}}]),i}(h.Z)},77505:(t,e,i)=>{i.d(e,{oo:()=>o,ve:()=>r});var n=function(t,e,i){var n=i;return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*(e-t)*n:n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t},r=function(t,e,i){var r,o,s,a=t/360,u=e/100,h=i/100;if(0===u)r=h,o=h,s=h;else{var c=h<.5?h*(1+u):h+u-h*u,l=2*h-c;r=n(l,c,a+1/3),o=n(l,c,a),s=n(l,c,a-1/3)}return{r:Math.round(255*r),g:Math.round(255*o),b:Math.round(255*s)}},o=function(t){var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}},64740:(t,e,i)=>{i.d(e,{Z:()=>s});var n=i(15671),r=i(43144),o=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];const s=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:16,i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];(0,n.Z)(this,t),this.size=e,this.seed=i?t.getFixedSeedNoise(this.size):t.getGenerateNoise(this.size)}return(0,r.Z)(t,[{key:"get",value:function(t,e){for(var i=0,n=this.size;n>=1;)i+=this.smoothNoise(t/n,e/n,this.seed)*n,n/=2;return.5*i/this.size}},{key:"smoothNoise",value:function(t,e,i){var n=t-Math.floor(t),r=e-Math.floor(e),o=(Math.floor(t)+this.size)%this.size,s=(Math.floor(e)+this.size)%this.size,a=(o+this.size-1)%this.size,u=(s+this.size-1)%this.size,h=0;return h+=n*r*i[o][s],h+=n*(1-r)*i[o][u],h+=(1-n)*r*i[a][s],h+=(1-n)*(1-r)*i[a][u]}}],[{key:"getGenerateNoise",value:function(t){for(var e=new Array(t),i=0;i<t;i+=1){e[i]=new Array(t);for(var n=0;n<t;n+=1)e[i][n]=Math.random()}return e}},{key:"getFixedSeedNoise",value:function(t){for(var e=new Array(t),i=0,n=0;n<t;n+=1){e[n]=new Array(t);for(var r=0;r<t;r+=1)e[n][r]=o[i]/256,i+=1}return e}}]),t}()},88390:(t,e,i)=>{i.r(e),i.d(e,{default:()=>at,destroy:()=>ut});var n=i(15861),r=i(87757),o=i.n(r),s=i(35466),a=i(42982),u=i(15671),h=i(43144),c=i(97326),l=i(11752),d=i(60136),f=i(6215),p=i(61120),g=i(4942),v=i(40487),Z=i(21200),m=i(92826),y=i(80602),w=i(25773),b=(0,h.Z)((function t(e){var i=this,n=e.spring,r=e.friction;(0,u.Z)(this,t),(0,g.Z)(this,"update",(function(t,e){var n=(0,m.Z)(w.Z,(0,a.Z)(t)),r=(0,m.Z)(w.Z,(0,a.Z)(e)).minus(n).multiplyNumber(i.spring);return i.velocity.add(r).multiplyNumber(i.friction),n.add(i.velocity).get()})),this.spring=n,this.friction=r,this.velocity=new w.Z})),k=function(t){return t.reduce((function(t,e){return[].concat((0,a.Z)(t),(0,a.Z)(e))}),[])},P=function(t){var e=t.length;if(e>1){var i=[],n=[],r=[];return t.forEach((function(o,s){i=[].concat((0,a.Z)(i),(0,a.Z)(o),(0,a.Z)(o));var u=[];if(0===s){var h=t[1];u=[o[0]+h[0]-o[0],o[1]+h[1]-o[1],o[2]+h[2]-o[2]]}else u=t[s-1];r=[].concat((0,a.Z)(r),(0,a.Z)(u),(0,a.Z)(u));var c=[];if(e-1){var l=t[e-2];c=[o[0]+l[0]-o[0],o[1]+l[1]-o[1],o[2]+l[2]-o[2]]}else c=t[s+1];n=[].concat((0,a.Z)(n),(0,a.Z)(c),(0,a.Z)(c))})),{position:i,next:n,previous:r}}return{position:k(t)}},M=function(){function t(e,i,n){var r=this,o=n.spring,s=n.friction;(0,u.Z)(this,t),(0,g.Z)(this,"init",(function(t){r.points.fill(t)}));var h=function(t){return new Array(t).fill([0,0,0])}(i),c=P(h),l=c.position,d=c.next,f=c.previous,p=Array(2*(i-1)).fill().reduce((function(t,e,i){return[].concat((0,a.Z)(t),i%2==0?[i,i+1,i+2]:[i,i+2,i+1])}),[]),v=function(t){var e=new Float32Array(2*t);return Array(t).fill().forEach((function(t,i){e.set([-1,1],2*i)})),e}(i),Z=function(t){var e=[];return Array(t).fill().forEach((function(i,n){e=[].concat((0,a.Z)(e),[n/t,0,n/t,1])})),e}(i),m={position:l,next:d,previous:f,indices:p,side:v,texture:Z};this.vbo=new y.Z(e,m,!0),this.spring=new b({spring:o,friction:s}),this.points=h}return(0,h.Z)(t,[{key:"update",value:function(t){var e=this;this.points=this.points.map((function(i,n){var r=i;return r=0===n?e.spring.update(i,[t.x,t.y,0]):e.points[n-1],w.Z.lerp((0,m.Z)(w.Z,(0,a.Z)(i)),(0,m.Z)(w.Z,(0,a.Z)(r)),0===n?.9999:.8).get()}));var i=P(this.points);this.vbo.update(i)}},{key:"render",value:function(t){this.vbo.render(t)}}]),t}(),x=i(77505),N=function(){function t(e){var i=this;(0,u.Z)(this,t),(0,g.Z)(this,"onMouseDrag",(function(t){i.mousePos=t.rel,i.weight=.01*t.speed})),(0,g.Z)(this,"onMouseDown",(function(t){i.mousePos=t.rel,i.lines.forEach((function(e){return e.init([t.rel.x,t.rel.y,0])}))})),this.colors=["#e09f7d","#ef5d60","#ec4067","#a01a7d","#311847"].map((function(t){var e=(0,x.oo)(t);return[e.r/255,e.g/255,e.b/255]})),this.lines=this.colors.map((function(t,i){return new M(e,20,{spring:.06*i,friction:.85+.02*i})})),this.mousePos={x:0,y:0},this.weight=0}return(0,h.Z)(t,[{key:"update",value:function(t){var e=this;t.setFloat("time",this.time),this.lines.forEach((function(t){return t.update(e.mousePos)}))}},{key:"render",value:function(t){var e=this;t.setFloat("weight",this.weight),this.lines.forEach((function(i,n){t.setVector("color",e.colors[n]),i.render(t.get())}))}}]),t}(),R=i(68763),Y=-1,I=-1,X=-1,z=(0,h.Z)((function t(){var e=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,u.Z)(this,t),(0,g.Z)(this,"update",(function(){e.withSlowDown&&e.slowDown(),e.withRebond?e.rebond():e.withRespawn&&e.respawn(),e.position.add(e.speed)})),(0,g.Z)(this,"slowDown",(function(){e.speed.multiplyNumber(e.damping)})),(0,g.Z)(this,"rebond",(function(){(e.position.getX()<Y||e.position.getX()>1)&&e.speed.multiplyX(-1),(e.position.getY()<I||e.position.getY()>1)&&e.speed.multiplyY(-1),(e.position.getZ()<X||e.position.getZ()>1)&&e.speed.multiplyZ(-1)})),(0,g.Z)(this,"respawn",(function(){e.position.getX()<Y?e.position.setX(1):e.position.getX()>1&&e.position.setX(Y),e.position.getY()<I?e.position.setY(1):e.position.getY()>1&&e.position.setY(I),e.position.getZ()<X?e.position.setZ(1):e.position.getZ()>1&&e.position.setZ(X)})),(0,g.Z)(this,"setPosition",(function(t,i,n){e.position.set(t,i,n)})),(0,g.Z)(this,"setSpeed",(function(t,i,n){e.speed.set(t,i,n)})),(0,g.Z)(this,"getPosition",(function(){return e.position})),(0,g.Z)(this,"getSpeed",(function(){return e.speed})),this.position=new w.Z(0,0,0),this.speed=new w.Z(0,0,0),this.withRebond=!!i.withRebond,this.withSlowDown=!!i.withSlowDown,this.withRespawn=!!i.withRespawn,this.damping=i.damping||.9}));function A(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,n=(0,p.Z)(t);if(e){var r=(0,p.Z)(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return(0,f.Z)(this,i)}}var j=function(t){(0,d.Z)(i,t);var e=A(i);function i(){var t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(0,u.Z)(this,i),t=e.call(this,n),(0,g.Z)((0,c.Z)(t),"attract",(function(e){var i=(new w.Z).equal(t.position).minus(e.getPosition()),n=i.length();if(n>0&&n<t.radius){var r=n/t.radius,o=1/Math.pow(r,.5*t.ramp)-1;o=t.strength*o/t.radius,i=i.multiplyNumber(o),e.setSpeed.apply(e,(0,a.Z)(e.speed.add(i).get()))}})),(0,g.Z)((0,c.Z)(t),"setRadius",(function(e){t.radius=e})),(0,g.Z)((0,c.Z)(t),"setStrength",(function(e){t.strength=e})),(0,g.Z)((0,c.Z)(t),"setRamp",(function(e){t.ramp=e})),t.radius=.5,t.strength=.1,t.ramp=.2,t}return(0,h.Z)(i)}(z),O=function(){function t(){var e=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;(0,u.Z)(this,t),(0,g.Z)(this,"update",(function(){e.attractor.update(),e.nodes.forEach((function(t){e.attractor.attract(t),t.update()}))})),(0,g.Z)(this,"placeNodes",(function(){for(var t=0,i=0;i<e.nbColumns;i++)for(var n=0;n<e.nbRows;n++){var r=(0,R.Yp)(n,0,e.nbRows-1,-1,1),o=(0,R.Yp)(i,0,e.nbColumns-1,-1,1);e.nodes[t].setPosition(r,o,0),t++}})),this.nbRows=i,this.nbColumns=n||i,this.nodes=Array.from({length:this.nbRows*this.nbColumns},(function(){return new z({withRebond:!0,withSlowDown:!1})})),this.attractor=new j,this.attractor.setPosition(0,0,0),this.placeNodes()}return(0,h.Z)(t,[{key:"getPositions",value:function(){return this.nodes.reduce((function(t,e){return[].concat((0,a.Z)(e.getPosition().get()),(0,a.Z)(t))}),[])}}]),t}();function S(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,n=(0,p.Z)(t);if(e){var r=(0,p.Z)(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return(0,f.Z)(this,i)}}var T=.01,D=.1,E=.02,q=function(t){(0,d.Z)(i,t);var e=S(i);function i(){var t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,u.Z)(this,i),t=e.call(this,n),(0,g.Z)((0,c.Z)(t),"seek",(function(e){return(new w.Z).equal(e).minus(t.position).multiplyNumber(T).normalise()})),(0,g.Z)((0,c.Z)(t),"seekSteering",(function(e){var i=t.seek(e);return(new w.Z).equal(i).minus(t.speed).limiter(D).divideNumber(10).add(t.speed).limiter(T)})),(0,g.Z)((0,c.Z)(t),"seekSteeringArrival",(function(e){var i=(new w.Z).equal(e).minus(t.position),n=i.length();if(n<E){var r=T*(n/E);i.normalise().multiplyNumber(r)}else i.normalise().multiplyNumber(T);return(new w.Z).equal(i).minus(t.speed).limiter(D).add(t.speed)})),(0,g.Z)((0,c.Z)(t),"flee",(function(e){return(new w.Z).equal(t.seek(e)).multiplyNumber(-1)})),(0,g.Z)((0,c.Z)(t),"fleeSteering",(function(e){return(new w.Z).equal(t.seekSteering(e)).multiplyNumber(-1)})),(0,g.Z)((0,c.Z)(t),"updateMigration",(function(e){t.defineAcceleration(e),t.speed.add(t.acceleration).limiter(T),t.acceleration.set(0,0,0)})),(0,g.Z)((0,c.Z)(t),"defineAcceleration",(function(e){var i=new w.Z,n=0,r=new w.Z,o=0,s=new w.Z,a=0;e.forEach((function(e){var u=t.position.distance(e.getPosition());if(u>0){if(u<.1){var h=(new w.Z).equal(t.position).minus(e.getPosition());h.normalise(),h.divideNumber(u),i.add(h),n++}u<.3&&(r.add(e.getSpeed()),o++),u<.5&&(s.add(e.getPosition()),a++)}})),n>0&&i.divideNumber(n),i.length()>0&&(i.normalise().multiplyNumber(T),i.minus(t.speed).limiter(D)),o>0&&(r.divideNumber(o).normalise().multiplyNumber(T),r.minus(t.speed).limiter(D)),a>0&&(s.divideNumber(a),s=t.seekSteering(s)),i.multiplyNumber(1.5);var u=(new w.Z).equal(i).add(r).add(s).divideNumber(10);t.acceleration=t.acceleration.add(u)})),t.acceleration=new w.Z(0,0,0);var r=(0,R.MX)(0,Math.PI);return t.speed.set(Math.cos(r),Math.sin(r),0),t}return(0,h.Z)(i)}(z),F=(0,h.Z)((function t(){var e=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;(0,u.Z)(this,t),(0,g.Z)(this,"update",(function(){e.birds.forEach((function(t){t.updateMigration(e.birds),t.update()}))})),(0,g.Z)(this,"getPositions",(function(){return e.birds.reduce((function(t,e){return[].concat((0,a.Z)(e.getPosition().get()),(0,a.Z)(t))}),[])})),this.birds=Array.from({length:i},(function(){return new q({withRespawn:!0})}))})),B=i(91215),C=i(2444),V=i(64740),G=function(t,e){for(var i=[],n=0;n<e;n++)for(var r=0;r<t;r++){var o=(0,R.Yp)(r,0,t-1,0,1),s=(0,R.Yp)(n,0,e-1,0,1);i.push(o),i.push(s)}return i};function L(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function _(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?L(Object(i),!0).forEach((function(e){(0,g.Z)(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):L(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var W=function(){function t(e){var i=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:32,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:32,o=arguments.length>3?arguments[3]:void 0;(0,u.Z)(this,t),(0,g.Z)(this,"addDataTexture",(function(t,e){i.textures=_(_({},i.textures),{},(0,g.Z)({},t,new B.Z(i.gl,new Uint8Array(e))))})),this.gl=e,this.screen=new Z.Z(e),this.fbo=new C.Z(e,n,r);var s=G(n,r);this.vbo=new y.Z(e,{texture:s}),this.vbo.setModeDessin(o||e.POINTS),this.textures={}}return(0,h.Z)(t,[{key:"compute",value:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;Object.keys(this.textures).forEach((function(i,n){t.setTexture(n,e.textures[i].get(),i)})),t.setFloat("time",i),this.fbo.start(),this.screen.render(t.get()),this.fbo.end()}},{key:"render",value:function(t){t.setTexture(0,this.fbo.getTexture().get(),"textureMap"),this.vbo.render(t.get())}}]),t}(),$=i(70885),H=1/1048576,U=function(t,e,i,n){var r,o,s,a,u,h,c,l,d=(0,$.Z)(t[e],2),f=d[0],p=d[1],g=(0,$.Z)(t[i],2),v=g[0],Z=g[1],m=(0,$.Z)(t[n],2),y=m[0],w=m[1],b=Math.abs(p-Z),k=Math.abs(Z-w);if(b<H&&k<H)throw new Error("Eek! Coincident points!");b<H?o=(a=-(y-v)/(w-Z))*((r=(v+f)/2)-(h=(v+y)/2))+(l=(Z+w)/2):k<H?o=(s=-(v-f)/(Z-p))*((r=(y+v)/2)-(u=(f+v)/2))+(c=(p+Z)/2):(r=((s=-(v-f)/(Z-p))*(u=(f+v)/2)-(a=-(y-v)/(w-Z))*(h=(v+y)/2)+(l=(Z+w)/2)-(c=(p+Z)/2))/(s-a),o=b>k?s*(r-u)+c:a*(r-h)+l);var P=v-r,M=Z-o;return{i:e,j:i,k:n,x:r,y:o,r:P*P+M*M}},J=function(t){var e,i,n,r,o,s;for(i=t.length;i;)for(r=t[--i],n=t[--i],e=i;e;)if(s=t[--e],n===(o=t[--e])&&r===s||n===s&&r===o){t.splice(i,2),t.splice(e,2);break}};const K={triangulate:function(t,e){var i,n,r,o,s,a=t.length;if(a<3)return[];var u=t.slice(0);if(e)for(var h=a;h--;)u[h]=u[h][e];for(var c=new Array(a),l=a;l--;)c[l]=l;c.sort((function(t,e){return u[e][0]-u[t][0]}));var d=function(t){for(var e=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY,n=Number.NEGATIVE_INFINITY,r=Number.NEGATIVE_INFINITY,o=t.length;o--;){var s=(0,$.Z)(t[o],2),a=s[0],u=s[1];a<e&&(e=a),a>n&&(n=a),u<i&&(i=u),u>r&&(r=u)}var h=n-e,c=r-i,l=Math.max(h,c),d=e+.5*h,f=i+.5*c;return[[d-20*l,f-l],[d,f+20*l],[d+20*l,f-l]]}(u);u.push(d[0],d[1],d[2]);for(var f=[U(u,a+0,a+1,a+2)],p=[],g=[],v=c.length;v--;g.length=0){s=c[v];for(var Z=f.length;Z--;)(i=u[s][0]-f[Z].x)>0&&i*i>f[Z].r?(p.push(f[Z]),f.splice(Z,1)):i*i+(n=u[s][1]-f[Z].y)*n-f[Z].r>H||(g.push(f[Z].i,f[Z].j,f[Z].j,f[Z].k,f[Z].k,f[Z].i),f.splice(Z,1));J(g);for(var m=g.length;m;)o=g[--m],r=g[--m],f.push(U(u,r,o,s))}for(var y=f.length;y--;)p.push(f[y]);f.length=0;for(var w=p.length;w--;)p[w].i<a&&p[w].j<a&&p[w].k<a&&f.push(p[w].i,p[w].j,p[w].k);return f},contains:function(t,e){if(e[0]<t[0][0]&&e[0]<t[1][0]&&e[0]<t[2][0]||e[0]>t[0][0]&&e[0]>t[1][0]&&e[0]>t[2][0]||e[1]<t[0][1]&&e[1]<t[1][1]&&e[1]<t[2][1]||e[1]>t[0][1]&&e[1]>t[1][1]&&e[1]>t[2][1])return null;var i=t[1][0]-t[0][0],n=t[2][0]-t[0][0],r=t[1][1]-t[0][1],o=t[2][1]-t[0][1],s=i*o-n*r;if(0===s)return null;var a=(o*(e[0]-t[0][0])-n*(e[1]-t[0][1]))/s,u=(i*(e[1]-t[0][1])-r*(e[0]-t[0][0]))/s;return a<0||u<0||a+u>1?null:[a,u]}};var Q=i(21969),tt=i(94281);function et(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,n=(0,p.Z)(t);if(e){var r=(0,p.Z)(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return(0,f.Z)(this,i)}}var it=function(t){return.5*Math.sin(t)+.5},nt=function(t,e,i,n){var r=.02;return new w.Z(Math.cos(t*Math.PI*e.getX()+n)*i.getX()-Math.cos(r*Math.PI*e.getX()+n)*i.getX(),it(t*Math.PI*e.getY()+n)*i.getY()-it(r*Math.PI*e.getY()+n)*i.getY(),it(t*Math.PI*e.getZ()+n)*i.getZ()-it(r*Math.PI*e.getZ()+n)*i.getZ())},rt=function(t){(0,d.Z)(i,t);var e=et(i);function i(t,n,r){var o;(0,u.Z)(this,i),o=e.call(this,t,n,r),(0,g.Z)((0,c.Z)(o),"setupControls",(function(){o.mode=0,o.buttons=document.querySelectorAll(".mode"),o.buttons.forEach((function(t,e){t.addEventListener("click",(function(t){return o.onClickButton(t.target,e)}),!1)}))})),(0,g.Z)((0,c.Z)(o),"onClickButton",(function(t,e){o.buttons.forEach((function(t){return t.removeAttribute("data-current")})),t.setAttribute("data-current",!0),o.mode=e})),(0,g.Z)((0,c.Z)(o),"destroy",(function(){o.buttons&&o.buttons.forEach((function(t,e){return t.removeEventListener("click",(function(){return o.onClickButton(e)}),!1)}))})),(0,g.Z)((0,c.Z)(o),"onMouseDrag",(function(t){2===o.mode&&o.linesTrail.onMouseDrag(t)})),(0,g.Z)((0,c.Z)(o),"onMouseDown",(function(t){2===o.mode&&o.linesTrail.onMouseDown(t)})),o.screen=new Z.Z(o.gl),o.linesTrail=new N(o.gl),o.grid=new O(10),o.vboGrid=new y.Z(t,{position:o.grid.getPositions()},!0),o.vboGrid.setModeDessin(o.gl.POINTS),o.migration=new F(40),o.vboMigration=new y.Z(t,{position:o.migration.getPositions()},!0),o.vboMigration.setModeDessin(o.gl.POINTS),o.particules=new W(t,32,32),o.particules.addDataTexture("textureMap",function(t,e){for(var i=[],n=new V.Z,r=0;r<e;r++)for(var o=0;o<t;o++){var s=(0,R.Yp)(o,0,t-1,0,255),u=Math.floor(255*n.get(o,r)),h=(0,R.Yp)(r,0,e-1,0,255);i=[].concat((0,a.Z)(i),[s,u,h,255])}return i}(32,32)),o.particules.addDataTexture("morphMap",function(t,e){for(var i=[],n=0;n<e;n++)for(var r=0;r<t;r++){var o=(0,R.Yp)(r,0,t-1,0,255),s=(0,R.Yp)(n,0,e-1,0,255);i=[].concat((0,a.Z)(i),[o,0,s,255])}return i}(32,32));var s=Array.from({length:40},(function(){return[2*Math.random()-1,2*Math.random()-1]})),h=K.triangulate(s),l=s.reduce((function(t,e){return[].concat((0,a.Z)(t),[e[0],e[1],0])}),[]);o.vboDelaunay=new y.Z(t,{position:l,indices:h}),o.vboDelaunay.setModeDessin(t.LINE_LOOP),o.bloom.setBlurSize(.4),o.bloom.setBlurIntensity(1.1),o.model=new Q.Z;var d=(0,tt.Eu)(2,128,{startX:-1,endX:1,startZ:0,endZ:128}),f=(0,tt.H$)(2,128);return o.roadVbo=new y.Z(t,{position:d,indices:f}),o.roadFrequence=new w.Z(2,0,2),o.roadAmplitude=new w.Z(10,0,4),o.roadPositionY=1.2,o.roadLength=128,o.setupControls(),o}return(0,h.Z)(i,[{key:"render",value:function(){(0,l.Z)((0,p.Z)(i.prototype),"render",this).call(this),this.model.identity();var t=this.config.camera,e=t.position,n=t.target;switch(this.camera.setTarget(n.x,n.y,n.z),this.camera.setPosition(e.x,e.y,e.z),this.mode){default:case 5:this.grid.update(),this.vboGrid.update({position:this.grid.getPositions()}),this.vboGrid.render(this.mngProg.get("point").get());break;case 3:this.migration.update(),this.vboMigration.update({position:this.migration.getPositions()}),this.vboMigration.render(this.mngProg.get("point").get());break;case 0:this.model.rotate(.01*this.time,0,1,0),this.mngProg.get("basique3d").setMatrix("model",this.model.get()),this.bloom.start(),this.vboDelaunay.render(this.mngProg.get("basique3d").get()),this.bloom.end(),this.bloom.render();break;case 1:this.model.rotate(.001*this.time,0,1,0);var r=(0,R.Yp)(Math.cos(.01*this.time*.05),-1,1,0,1);this.particules.compute(this.mngProg.get("pass1Morph"),r),this.resizeViewport(),this.mngProg.get("pass2Camera").setMatrix("model",this.model.get()),this.particules.render(this.mngProg.get("pass2Camera"));break;case 2:var o=this.mngProg.get("line");this.linesTrail.update(o),this.linesTrail.render(o);break;case 4:var s=.005*this.time,a=nt(0,this.roadFrequence,this.roadAmplitude,s),u=nt(.2,this.roadFrequence,this.roadAmplitude,s);this.camera.setTarget(u.getX(),this.roadPositionY+u.getY(),this.roadLength),this.camera.setPosition(a.getX(),this.roadPositionY+a.getY(),0);var h=this.mngProg.get("road");h.setProjectionView(this.camera),h.setMatrix("model",this.model.get()),h.setFloat("time",s),h.setVector("frequence",this.roadFrequence.get()),h.setVector("amplitude",this.roadAmplitude.get()),h.setFloat("roadLength",this.roadLength),this.roadVbo.render(h.get());break;case 6:var c=this.mngProg.get("landscape");c.setFloat("flipY",1),c.setFloat("time",.001*this.time),this.screen.render(c.get())}}}]),i}(v.Z);const ot={slug:"shader",shaders:["/camera/road.js","/screen/line.js","/screen/point.js","/particules/pass1Morph.js","/particules/pass2Camera.js","/camera/basique3d.js","/screen/landscape.js","/screen/blurOnePass.js","/screen/screen.js","/screen/debug.js"],postprocess:{bloom:!0},canvas:{width:1024,height:1024},mouse:{events:["drag","down","move"]},camera:{position:{x:0,y:0,z:-4},target:{x:0,y:0,z:0},near:1,far:200,angle:90},controls:{modes:[1,2,3],fullscreen:{buttonId:"fullscreen-toggle-btn"}}};var st=null;const at=(0,n.Z)(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return st=new s.Z,t.next=3,st.setup(rt,ot);case 3:document.querySelector("#".concat(ot.slug)).appendChild(st.getCanvas());case 5:case"end":return t.stop()}}),t)})));var ut=function(){st&&st.destroy&&st.destroy()}}}]);