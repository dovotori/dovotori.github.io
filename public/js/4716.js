(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[4716],{3957:(n,t,e)=>{"use strict";e.r(t),e.d(t,{default:()=>O});var i=e(48926),r=e.n(i),s=e(87757),o=e.n(s);e(50835);var a=e(93913),c=e.n(a),u=e(34575),f=e.n(u),l=e(59713),h=e.n(l),d=e(33559),p=c()((function n(){var t=this;f()(this,n),h()(this,"create",(function(){return new Promise((function(n,e){t.socket=(0,d.ZP)("http://localhost:8083"),t.socket.on("connect_error",(function(n){t.socket.disconnect(),e(n)})),t.socket.on("connect",(function(){n(t)}))}))})),h()(this,"on",(function(){var n;return(n=t.socket).on.apply(n,arguments)})),h()(this,"emit",(function(){var n;return(n=t.socket).emit.apply(n,arguments)})),h()(this,"reconnect",(function(){return t.close(),new Promise((function(n,e){t.socket.connect(),t.socket.on("connect_error",(function(n){t.socket.close(),e(n)})),t.socket.on("connect",(function(){n(t)}))}))})),h()(this,"close",(function(){t.socket.connected&&t.socket.disconnect()})),h()(this,"isConnected",(function(){return t.socket.connected})),this.socket=null})),k=e(38853),m=e.n(k),w=function(){function n(){var t=this;f()(this,n),h()(this,"setSignal",(function(n){t.peer.signal(n)})),h()(this,"setAsk",(function(n){t.ask=n})),h()(this,"setStream",(function(n){t.stream=n,t.isCreated&&t.peer.addStream(t.stream)})),h()(this,"setAnswer",(function(n){t.answer=n,t.isInitiator&&t.isCreated&&t.peer.signal(t.answer)})),h()(this,"setOffer",(function(n){t.offer=n,t.tryToCreate()})),h()(this,"setIsInitiator",(function(n){t.isInitiator=n,t.tryToCreate()})),this.isInitiator=null,this.isConnected=!1,this.peer=null,this.stream=null,this.answer=null,this.offer=null,this.ask=null,this.isCreated=!1}return c()(n,[{key:"tryToCreate",value:function(){this.isCreated||null===this.isInitiator||(this.isInitiator||!this.isInitiator&&this.offer)&&this.create()}},{key:"create",value:function(){var n=this;this.peer=new(m())({initiator:this.isInitiator,trickle:!1,stream:this.stream}),this.peer.on("error",(function(n){})),this.peer.on("signal",(function(t){n.isConnected||(n.isInitiator&&t.type&&"offer"===t.type?n.ask("question offer",t):!n.isInitiator&&t.type&&"answer"===t.type&&n.ask("question answer",t))})),this.peer.on("stream",(function(n){var t=document.querySelector("#emitter");t.srcObject=n,t.play()})),this.peer.on("connect",(function(){n.isConnected=!0})),this.isInitiator||this.setSignal(this.offer),this.isCreated=!0}},{key:"getIsInitiator",value:function(){return this.isInitiator}}]),n}(),v=e(93379),y=e.n(v),g=e(7795),I=e.n(g),b=e(90569),C=e.n(b),x=e(3565),T=e.n(x),S=e(70609),L=e.n(S),M=e(44589),q=e.n(M),A=e(80668),H={};H.styleTagTransform=q(),H.setAttributes=T(),H.insert=C().bind(null,"head"),H.domAPI=I(),H.insertStyleElement=L();y()(A.Z,H);A.Z&&A.Z.locals&&A.Z.locals;var Z=document.querySelector("#btn"),P=function(){var n=r()(o().mark((function n(t){var e,i;return o().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,navigator.mediaDevices.getUserMedia({audio:!1,video:!0}).then((function(n){return n})).catch((function(n){}));case 2:(e=n.sent)?(t.setStream(e),(i=document.querySelector("#own")).srcObject=e,i.play()):Z.innerHTML="Can't access your webcam. Retry";case 4:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}(),j=function(){var n=r()(o().mark((function n(t){var e,i;return o().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return e=new p,n.next=3,e.create();case 3:return i=function(){return e.emit.apply(e,arguments)},t.setAsk(i),e.on("answer initiator",t.setIsInitiator),e.on("answer offer",t.setOffer),e.on("answer answer",t.setAnswer),e.emit("question initiator"),n.abrupt("return",e);case 10:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}();const O=function(){var n=null;Z&&Z.addEventListener("click",r()(o().mark((function t(){var e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(Z.innerHTML="Loading",t.prev=1,null!==n){t.next=14;break}return Z.innerHTML="Please allow webcam access",e=new w,t.next=8,P(e);case 8:return t.next=10,j(e);case 10:n=t.sent,Z.innerHTML=e.getIsInitiator()?"Connected (wait for another connection)":"Wait you will join someone",t.next=17;break;case 14:n.close(),n=null,Z.innerHTML="Join";case 17:t.next=23;break;case 19:t.prev=19,t.t0=t.catch(1),Z.innerHTML="Retry";case 23:case"end":return t.stop()}}),t,null,[[1,19]])}))),!1)}},80668:(n,t,e)=>{"use strict";e.d(t,{Z:()=>a});var i=e(8081),r=e.n(i),s=e(23645),o=e.n(s)()(r());o.push([n.id,"#labo {\n  position: relative;\n  width: 100%;\n  height: auto;\n  background-color: #222;\n  text-align: center;\n}\nvideo {\n  width: 50%;\n}\n.flex {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n#status {\n  width: 80%;\n  color: #fff;\n  margin: 0 auto;\n  padding: 1em;\n}\n#btn {\n  background: #fff;\n  width: 80%;\n  margin: 0 auto;\n  padding: 1em;\n  text-transform: uppercase;\n  letter-spacing: 0.2em;\n}\n",""]);const a=o},52361:()=>{},94616:()=>{}}]);