"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[2769],{40177:(t,e,n)=>{n.d(e,{G$:()=>i,Id:()=>u,MP:()=>s,Tp:()=>c,V:()=>r,bM:()=>l,tK:()=>a});var o="undefined"!=typeof navigator&&void 0!==navigator.userAgent?navigator.userAgent.toLowerCase():"",r=-1!==o.indexOf("firefox"),i=(-1!==o.indexOf("safari")&&-1==o.indexOf("chrom")&&(o.indexOf("version/15.4")>=0||o.match(/cpu (os|iphone os) 15_4 like mac os x/)),-1!==o.indexOf("webkit")&&-1==o.indexOf("edge")),a=-1!==o.indexOf("macintosh"),s="undefined"!=typeof devicePixelRatio?devicePixelRatio:1,u="undefined"!=typeof WorkerGlobalScope&&"undefined"!=typeof OffscreenCanvas&&self instanceof WorkerGlobalScope,c="undefined"!=typeof Image&&Image.prototype.decode,l=function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("_",null,e),window.removeEventListener("_",null,e)}catch(t){}return t}()},7408:(t,e,n)=>{n.d(e,{ce:()=>tt});var o=n(78714),r=n(72971);const i="active";var a,s=n(31015),u=(a=function(t,e){return a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},a(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}a(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});function c(t,e,n,o){var r=t.getZoom();if(void 0!==r){var i=t.getConstrainedZoom(r+e),a=t.getResolutionForZoom(i);t.getAnimating()&&t.cancelAnimations(),t.animate({resolution:a,anchor:n,duration:void 0!==o?o:250,easing:s.Vv})}}const l=function(t){function e(e){var n=t.call(this)||this;return n.on,n.once,n.un,e&&e.handleEvent&&(n.handleEvent=e.handleEvent),n.map_=null,n.setActive(!0),n}return u(e,t),e.prototype.getActive=function(){return this.get(i)},e.prototype.getMap=function(){return this.map_},e.prototype.handleEvent=function(t){return!0},e.prototype.setActive=function(t){this.set(i,t)},e.prototype.setMap=function(t){this.map_=t},e}(r.Z);var p=n(92217),h=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();const d=function(t){function e(e){var n=t.call(this)||this,o=e||{};return n.delta_=o.delta?o.delta:1,n.duration_=void 0!==o.duration?o.duration:250,n}return h(e,t),e.prototype.handleEvent=function(t){var e=!1;if(t.type==p.Z.DBLCLICK){var n=t.originalEvent,o=t.map,r=t.coordinate,i=n.shiftKey?-this.delta_:this.delta_;c(o.getView(),i,r,this.duration_),n.preventDefault(),e=!0}return!e},e}(l);var f=n(69374),y=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();function _(t){for(var e=t.length,n=0,o=0,r=0;r<e;r++)n+=t[r].clientX,o+=t[r].clientY;return[n/e,o/e]}const v=function(t){function e(e){var n=this,o=e||{};return n=t.call(this,o)||this,o.handleDownEvent&&(n.handleDownEvent=o.handleDownEvent),o.handleDragEvent&&(n.handleDragEvent=o.handleDragEvent),o.handleMoveEvent&&(n.handleMoveEvent=o.handleMoveEvent),o.handleUpEvent&&(n.handleUpEvent=o.handleUpEvent),o.stopDown&&(n.stopDown=o.stopDown),n.handlingDownUpSequence=!1,n.trackedPointers_={},n.targetPointers=[],n}return y(e,t),e.prototype.getPointerCount=function(){return this.targetPointers.length},e.prototype.handleDownEvent=function(t){return!1},e.prototype.handleDragEvent=function(t){},e.prototype.handleEvent=function(t){if(!t.originalEvent)return!0;var e=!1;if(this.updateTrackedPointers_(t),this.handlingDownUpSequence){if(t.type==p.Z.POINTERDRAG)this.handleDragEvent(t),t.originalEvent.preventDefault();else if(t.type==p.Z.POINTERUP){var n=this.handleUpEvent(t);this.handlingDownUpSequence=n&&this.targetPointers.length>0}}else if(t.type==p.Z.POINTERDOWN){var o=this.handleDownEvent(t);this.handlingDownUpSequence=o,e=this.stopDown(o)}else t.type==p.Z.POINTERMOVE&&this.handleMoveEvent(t);return!e},e.prototype.handleMoveEvent=function(t){},e.prototype.handleUpEvent=function(t){return!1},e.prototype.stopDown=function(t){return t},e.prototype.updateTrackedPointers_=function(t){if(function(t){var e=t.type;return e===p.Z.POINTERDOWN||e===p.Z.POINTERDRAG||e===p.Z.POINTERUP}(t)){var e=t.originalEvent,n=e.pointerId.toString();t.type==p.Z.POINTERUP?delete this.trackedPointers_[n]:(t.type==p.Z.POINTERDOWN||n in this.trackedPointers_)&&(this.trackedPointers_[n]=e),this.targetPointers=(0,f.KX)(this.trackedPointers_)}},e}(l);var g=n(36885),m=n(98683),O=n(91900),E=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();const w=function(t){function e(e){var n=t.call(this,{stopDown:g.Dv})||this,o=e||{};n.kinetic_=o.kinetic,n.lastCentroid=null,n.lastPointersCount_,n.panning_=!1;var r=o.condition?o.condition:(0,m.$6)(m.rM,m.Xp);return n.condition_=o.onFocusOnly?(0,m.$6)(m.yZ,r):r,n.noKinetic_=!1,n}return E(e,t),e.prototype.handleDragEvent=function(t){this.panning_||(this.panning_=!0,this.getMap().getView().beginInteraction());var e=this.targetPointers,n=_(e);if(e.length==this.lastPointersCount_){if(this.kinetic_&&this.kinetic_.update(n[0],n[1]),this.lastCentroid){var o=[this.lastCentroid[0]-n[0],n[1]-this.lastCentroid[1]],r=t.map.getView();(0,O.bA)(o,r.getResolution()),(0,O.U1)(o,r.getRotation()),r.adjustCenterInternal(o)}}else this.kinetic_&&this.kinetic_.begin();this.lastCentroid=n,this.lastPointersCount_=e.length,t.originalEvent.preventDefault()},e.prototype.handleUpEvent=function(t){var e=t.map,n=e.getView();if(0===this.targetPointers.length){if(!this.noKinetic_&&this.kinetic_&&this.kinetic_.end()){var o=this.kinetic_.getDistance(),r=this.kinetic_.getAngle(),i=n.getCenterInternal(),a=e.getPixelFromCoordinateInternal(i),u=e.getCoordinateFromPixelInternal([a[0]-o*Math.cos(r),a[1]-o*Math.sin(r)]);n.animateInternal({center:n.getConstrainedCenter(u),duration:500,easing:s.Vv})}return this.panning_&&(this.panning_=!1,n.endInteraction()),!1}return this.kinetic_&&this.kinetic_.begin(),this.lastCentroid=null,!0},e.prototype.handleDownEvent=function(t){if(this.targetPointers.length>0&&this.condition_(t)){var e=t.map.getView();return this.lastCentroid=null,e.getAnimating()&&e.cancelAnimations(),this.kinetic_&&this.kinetic_.begin(),this.noKinetic_=this.targetPointers.length>1,!0}return!1},e}(v);var Z=n(60828),P=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();const x=function(t){function e(e){var n=this,o=e||{};return(n=t.call(this,{stopDown:g.Dv})||this).condition_=o.condition?o.condition:m.aj,n.lastAngle_=void 0,n.duration_=void 0!==o.duration?o.duration:250,n}return P(e,t),e.prototype.handleDragEvent=function(t){if((0,m.QL)(t)){var e=t.map,n=e.getView();if(n.getConstraints().rotation!==Z.h$){var o=e.getSize(),r=t.pixel,i=Math.atan2(o[1]/2-r[1],r[0]-o[0]/2);if(void 0!==this.lastAngle_){var a=i-this.lastAngle_;n.adjustRotationInternal(-a)}this.lastAngle_=i}}},e.prototype.handleUpEvent=function(t){return!(0,m.QL)(t)||(t.map.getView().endInteraction(this.duration_),!1)},e.prototype.handleDownEvent=function(t){return!!(0,m.QL)(t)&&(!(!(0,m.v8)(t)||!this.condition_(t))&&(t.map.getView().beginInteraction(),this.lastAngle_=void 0,!0))},e}(v);var b=n(291),I=n(80747),D=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),A="boxstart",M="boxdrag",R="boxend",C="boxcancel",S=function(t){function e(e,n,o){var r=t.call(this,e)||this;return r.coordinate=n,r.mapBrowserEvent=o,r}return D(e,t),e}(b.ZP);const T=function(t){function e(e){var n=t.call(this)||this;n.on,n.once,n.un;var o=e||{};return n.box_=new I.Z(o.className||"ol-dragbox"),n.minArea_=void 0!==o.minArea?o.minArea:64,o.onBoxEnd&&(n.onBoxEnd=o.onBoxEnd),n.startPixel_=null,n.condition_=o.condition?o.condition:m.v8,n.boxEndCondition_=o.boxEndCondition?o.boxEndCondition:n.defaultBoxEndCondition,n}return D(e,t),e.prototype.defaultBoxEndCondition=function(t,e,n){var o=n[0]-e[0],r=n[1]-e[1];return o*o+r*r>=this.minArea_},e.prototype.getGeometry=function(){return this.box_.getGeometry()},e.prototype.handleDragEvent=function(t){this.box_.setPixels(this.startPixel_,t.pixel),this.dispatchEvent(new S(M,t.coordinate,t))},e.prototype.handleUpEvent=function(t){this.box_.setMap(null);var e=this.boxEndCondition_(t,this.startPixel_,t.pixel);return e&&this.onBoxEnd(t),this.dispatchEvent(new S(e?R:C,t.coordinate,t)),!1},e.prototype.handleDownEvent=function(t){return!!this.condition_(t)&&(this.startPixel_=t.pixel,this.box_.setMap(t.map),this.box_.setPixels(this.startPixel_,this.startPixel_),this.dispatchEvent(new S(A,t.coordinate,t)),!0)},e.prototype.onBoxEnd=function(t){},e}(v);var L=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();const j=function(t){function e(e){var n=this,o=e||{},r=o.condition?o.condition:m.vY;return(n=t.call(this,{condition:r,className:o.className||"ol-dragzoom",minArea:o.minArea})||this).duration_=void 0!==o.duration?o.duration:200,n.out_=void 0!==o.out&&o.out,n}return L(e,t),e.prototype.onBoxEnd=function(t){var e=this.getMap().getView(),n=this.getGeometry();if(this.out_){var o=e.rotatedExtentForGeometry(n),r=e.getResolutionForExtentInternal(o),i=e.getResolution()/r;(n=n.clone()).scale(i*i)}e.fitInternal(n,{duration:this.duration_,easing:s.Vv})},e}(T);var N=n(85487),k=n(42750),U=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();const V=function(t){function e(e){var n=t.call(this)||this,o=e||{};return n.defaultCondition_=function(t){return(0,m.rM)(t)&&(0,m.TN)(t)},n.condition_=void 0!==o.condition?o.condition:n.defaultCondition_,n.duration_=void 0!==o.duration?o.duration:100,n.pixelDelta_=void 0!==o.pixelDelta?o.pixelDelta:128,n}return U(e,t),e.prototype.handleEvent=function(t){var e=!1;if(t.type==N.Z.KEYDOWN){var n=t.originalEvent,o=n.keyCode;if(this.condition_(t)&&(o==k.Z.DOWN||o==k.Z.LEFT||o==k.Z.RIGHT||o==k.Z.UP)){var r=t.map.getView(),i=r.getResolution()*this.pixelDelta_,a=0,u=0;o==k.Z.DOWN?u=-i:o==k.Z.LEFT?a=-i:o==k.Z.RIGHT?a=i:u=i;var c=[a,u];(0,O.U1)(c,r.getRotation()),function(t,e,n){var o=t.getCenterInternal();if(o){var r=[o[0]+e[0],o[1]+e[1]];t.animateInternal({duration:void 0!==n?n:250,easing:s.GE,center:t.getConstrainedCenter(r)})}}(r,c,this.duration_),n.preventDefault(),e=!0}}return!e},e}(l);var K=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();const W=function(t){function e(e){var n=t.call(this)||this,o=e||{};return n.condition_=o.condition?o.condition:m.TN,n.delta_=o.delta?o.delta:1,n.duration_=void 0!==o.duration?o.duration:100,n}return K(e,t),e.prototype.handleEvent=function(t){var e=!1;if(t.type==N.Z.KEYDOWN||t.type==N.Z.KEYPRESS){var n=t.originalEvent,o=n.charCode;if(this.condition_(t)&&(o=="+".charCodeAt(0)||o=="-".charCodeAt(0))){var r=t.map,i=o=="+".charCodeAt(0)?this.delta_:-this.delta_;c(r.getView(),i,void 0,this.duration_),n.preventDefault(),e=!0}}return!e},e}(l);var B=n(11230),F=n(40177),G=n(33983),X=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),Y="trackpad",z="wheel";const H=function(t){function e(e){var n=this,o=e||{};(n=t.call(this,o)||this).totalDelta_=0,n.lastDelta_=0,n.maxDelta_=void 0!==o.maxDelta?o.maxDelta:1,n.duration_=void 0!==o.duration?o.duration:250,n.timeout_=void 0!==o.timeout?o.timeout:80,n.useAnchor_=void 0===o.useAnchor||o.useAnchor,n.constrainResolution_=void 0!==o.constrainResolution&&o.constrainResolution;var r=o.condition?o.condition:m.Bx;return n.condition_=o.onFocusOnly?(0,m.$6)(m.yZ,r):r,n.lastAnchor_=null,n.startTime_=void 0,n.timeoutId_,n.mode_=void 0,n.trackpadEventGap_=400,n.trackpadTimeoutId_,n.deltaPerZoom_=300,n}return X(e,t),e.prototype.endInteraction_=function(){this.trackpadTimeoutId_=void 0,this.getMap().getView().endInteraction(void 0,this.lastDelta_?this.lastDelta_>0?1:-1:0,this.lastAnchor_)},e.prototype.handleEvent=function(t){if(!this.condition_(t))return!0;if(t.type!==N.Z.WHEEL)return!0;var e,n=t.map,o=t.originalEvent;if(o.preventDefault(),this.useAnchor_&&(this.lastAnchor_=t.coordinate),t.type==N.Z.WHEEL&&(e=o.deltaY,F.V&&o.deltaMode===WheelEvent.DOM_DELTA_PIXEL&&(e/=F.MP),o.deltaMode===WheelEvent.DOM_DELTA_LINE&&(e*=40)),0===e)return!1;this.lastDelta_=e;var r=Date.now();void 0===this.startTime_&&(this.startTime_=r),(!this.mode_||r-this.startTime_>this.trackpadEventGap_)&&(this.mode_=Math.abs(e)<4?Y:z);var i=n.getView();if(this.mode_===Y&&!i.getConstrainResolution()&&!this.constrainResolution_)return this.trackpadTimeoutId_?clearTimeout(this.trackpadTimeoutId_):(i.getAnimating()&&i.cancelAnimations(),i.beginInteraction()),this.trackpadTimeoutId_=setTimeout(this.endInteraction_.bind(this),this.timeout_),i.adjustZoom(-e/this.deltaPerZoom_,this.lastAnchor_),this.startTime_=r,!1;this.totalDelta_+=e;var a=Math.max(this.timeout_-(r-this.startTime_),0);return clearTimeout(this.timeoutId_),this.timeoutId_=setTimeout(this.handleWheelZoom_.bind(this,n),a),!1},e.prototype.handleWheelZoom_=function(t){var e=t.getView();e.getAnimating()&&e.cancelAnimations();var n=-(0,G.uZ)(this.totalDelta_,-this.maxDelta_*this.deltaPerZoom_,this.maxDelta_*this.deltaPerZoom_)/this.deltaPerZoom_;(e.getConstrainResolution()||this.constrainResolution_)&&(n=n?n>0?1:-1:0),c(e,n,this.lastAnchor_,this.duration_),this.mode_=void 0,this.totalDelta_=0,this.lastAnchor_=null,this.startTime_=void 0,this.timeoutId_=void 0},e.prototype.setMouseAnchor=function(t){this.useAnchor_=t,t||(this.lastAnchor_=null)},e}(l);var q=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();const $=function(t){function e(e){var n=this,o=e||{},r=o;return r.stopDown||(r.stopDown=g.Dv),(n=t.call(this,r)||this).anchor_=null,n.lastAngle_=void 0,n.rotating_=!1,n.rotationDelta_=0,n.threshold_=void 0!==o.threshold?o.threshold:.3,n.duration_=void 0!==o.duration?o.duration:250,n}return q(e,t),e.prototype.handleDragEvent=function(t){var e=0,n=this.targetPointers[0],o=this.targetPointers[1],r=Math.atan2(o.clientY-n.clientY,o.clientX-n.clientX);if(void 0!==this.lastAngle_){var i=r-this.lastAngle_;this.rotationDelta_+=i,!this.rotating_&&Math.abs(this.rotationDelta_)>this.threshold_&&(this.rotating_=!0),e=i}this.lastAngle_=r;var a=t.map,s=a.getView();if(s.getConstraints().rotation!==Z.h$){var u=a.getViewport().getBoundingClientRect(),c=_(this.targetPointers);c[0]-=u.left,c[1]-=u.top,this.anchor_=a.getCoordinateFromPixelInternal(c),this.rotating_&&(a.render(),s.adjustRotationInternal(e,this.anchor_))}},e.prototype.handleUpEvent=function(t){return!(this.targetPointers.length<2)||(t.map.getView().endInteraction(this.duration_),!1)},e.prototype.handleDownEvent=function(t){if(this.targetPointers.length>=2){var e=t.map;return this.anchor_=null,this.lastAngle_=void 0,this.rotating_=!1,this.rotationDelta_=0,this.handlingDownUpSequence||e.getView().beginInteraction(),!0}return!1},e}(v);var Q=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();const J=function(t){function e(e){var n=this,o=e||{},r=o;return r.stopDown||(r.stopDown=g.Dv),(n=t.call(this,r)||this).anchor_=null,n.duration_=void 0!==o.duration?o.duration:400,n.lastDistance_=void 0,n.lastScaleDelta_=1,n}return Q(e,t),e.prototype.handleDragEvent=function(t){var e=1,n=this.targetPointers[0],o=this.targetPointers[1],r=n.clientX-o.clientX,i=n.clientY-o.clientY,a=Math.sqrt(r*r+i*i);void 0!==this.lastDistance_&&(e=this.lastDistance_/a),this.lastDistance_=a;var s=t.map,u=s.getView();1!=e&&(this.lastScaleDelta_=e);var c=s.getViewport().getBoundingClientRect(),l=_(this.targetPointers);l[0]-=c.left,l[1]-=c.top,this.anchor_=s.getCoordinateFromPixelInternal(l),s.render(),u.adjustResolutionInternal(e,this.anchor_)},e.prototype.handleUpEvent=function(t){if(this.targetPointers.length<2){var e=t.map.getView(),n=this.lastScaleDelta_>1?1:-1;return e.endInteraction(this.duration_,n),!1}return!0},e.prototype.handleDownEvent=function(t){if(this.targetPointers.length>=2){var e=t.map;return this.anchor_=null,this.lastDistance_=void 0,this.lastScaleDelta_=1,this.handlingDownUpSequence||e.getView().beginInteraction(),!0}return!1},e}(v);function tt(t){var e=t||{},n=new o.Z,r=new B.Z(-.005,.05,100);return(void 0===e.altShiftDragRotate||e.altShiftDragRotate)&&n.push(new x),(void 0===e.doubleClickZoom||e.doubleClickZoom)&&n.push(new d({delta:e.zoomDelta,duration:e.zoomDuration})),(void 0===e.dragPan||e.dragPan)&&n.push(new w({onFocusOnly:e.onFocusOnly,kinetic:r})),(void 0===e.pinchRotate||e.pinchRotate)&&n.push(new $),(void 0===e.pinchZoom||e.pinchZoom)&&n.push(new J({duration:e.zoomDuration})),(void 0===e.keyboard||e.keyboard)&&(n.push(new V),n.push(new W({delta:e.zoomDelta,duration:e.zoomDuration}))),(void 0===e.mouseWheelZoom||e.mouseWheelZoom)&&n.push(new H({onFocusOnly:e.onFocusOnly,duration:e.zoomDuration})),(void 0===e.shiftDragZoom||e.shiftDragZoom)&&n.push(new j({duration:e.zoomDuration})),n}},947:(t,e,n)=>{n.d(e,{Z:()=>p});var o,r=n(72971),i=n(71912),a=n(74187),s=n(99515),u=n(69374),c=n(33983),l=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});const p=function(t){function e(e){var n=t.call(this)||this;n.on,n.once,n.un,n.background_=e.background;var o=(0,u.f0)({},e);return"object"==typeof e.properties&&(delete o.properties,(0,u.f0)(o,e.properties)),o[i.Z.OPACITY]=void 0!==e.opacity?e.opacity:1,(0,s.h)("number"==typeof o[i.Z.OPACITY],64),o[i.Z.VISIBLE]=void 0===e.visible||e.visible,o[i.Z.Z_INDEX]=e.zIndex,o[i.Z.MAX_RESOLUTION]=void 0!==e.maxResolution?e.maxResolution:1/0,o[i.Z.MIN_RESOLUTION]=void 0!==e.minResolution?e.minResolution:0,o[i.Z.MIN_ZOOM]=void 0!==e.minZoom?e.minZoom:-1/0,o[i.Z.MAX_ZOOM]=void 0!==e.maxZoom?e.maxZoom:1/0,n.className_=void 0!==o.className?o.className:"ol-layer",delete o.className,n.setProperties(o),n.state_=null,n}return l(e,t),e.prototype.getBackground=function(){return this.background_},e.prototype.getClassName=function(){return this.className_},e.prototype.getLayerState=function(t){var e=this.state_||{layer:this,managed:void 0===t||t},n=this.getZIndex();return e.opacity=(0,c.uZ)(Math.round(100*this.getOpacity())/100,0,1),e.visible=this.getVisible(),e.extent=this.getExtent(),e.zIndex=void 0!==n||e.managed?n:1/0,e.maxResolution=this.getMaxResolution(),e.minResolution=Math.max(this.getMinResolution(),0),e.minZoom=this.getMinZoom(),e.maxZoom=this.getMaxZoom(),this.state_=e,e},e.prototype.getLayersArray=function(t){return(0,a.O3)()},e.prototype.getLayerStatesArray=function(t){return(0,a.O3)()},e.prototype.getExtent=function(){return this.get(i.Z.EXTENT)},e.prototype.getMaxResolution=function(){return this.get(i.Z.MAX_RESOLUTION)},e.prototype.getMinResolution=function(){return this.get(i.Z.MIN_RESOLUTION)},e.prototype.getMinZoom=function(){return this.get(i.Z.MIN_ZOOM)},e.prototype.getMaxZoom=function(){return this.get(i.Z.MAX_ZOOM)},e.prototype.getOpacity=function(){return this.get(i.Z.OPACITY)},e.prototype.getSourceState=function(){return(0,a.O3)()},e.prototype.getVisible=function(){return this.get(i.Z.VISIBLE)},e.prototype.getZIndex=function(){return this.get(i.Z.Z_INDEX)},e.prototype.setBackground=function(t){this.background_=t,this.changed()},e.prototype.setExtent=function(t){this.set(i.Z.EXTENT,t)},e.prototype.setMaxResolution=function(t){this.set(i.Z.MAX_RESOLUTION,t)},e.prototype.setMinResolution=function(t){this.set(i.Z.MIN_RESOLUTION,t)},e.prototype.setMaxZoom=function(t){this.set(i.Z.MAX_ZOOM,t)},e.prototype.setMinZoom=function(t){this.set(i.Z.MIN_ZOOM,t)},e.prototype.setOpacity=function(t){(0,s.h)("number"==typeof t,64),this.set(i.Z.OPACITY,t)},e.prototype.setVisible=function(t){this.set(i.Z.VISIBLE,t)},e.prototype.setZIndex=function(t){this.set(i.Z.Z_INDEX,t)},e.prototype.disposeInternal=function(){this.state_&&(this.state_.layer=null,this.state_=null),t.prototype.disposeInternal.call(this)},e}(r.Z)},12582:(t,e,n)=>{n.d(e,{Z:()=>l});var o,r=n(1295),i=n(82582),a=n(69374),s=n(47539),u=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),c="renderOrder";const l=function(t){function e(e){var n=this,o=e||{},r=(0,a.f0)({},o);return delete r.style,delete r.renderBuffer,delete r.updateWhileAnimating,delete r.updateWhileInteracting,(n=t.call(this,r)||this).declutter_=void 0!==o.declutter&&o.declutter,n.renderBuffer_=void 0!==o.renderBuffer?o.renderBuffer:100,n.style_=null,n.styleFunction_=void 0,n.setStyle(o.style),n.updateWhileAnimating_=void 0!==o.updateWhileAnimating&&o.updateWhileAnimating,n.updateWhileInteracting_=void 0!==o.updateWhileInteracting&&o.updateWhileInteracting,n}return u(e,t),e.prototype.getDeclutter=function(){return this.declutter_},e.prototype.getFeatures=function(e){return t.prototype.getFeatures.call(this,e)},e.prototype.getRenderBuffer=function(){return this.renderBuffer_},e.prototype.getRenderOrder=function(){return this.get(c)},e.prototype.getStyle=function(){return this.style_},e.prototype.getStyleFunction=function(){return this.styleFunction_},e.prototype.getUpdateWhileAnimating=function(){return this.updateWhileAnimating_},e.prototype.getUpdateWhileInteracting=function(){return this.updateWhileInteracting_},e.prototype.renderDeclutter=function(t){t.declutterTree||(t.declutterTree=new i(9)),this.getRenderer().renderDeclutter(t)},e.prototype.setRenderOrder=function(t){this.set(c,t)},e.prototype.setStyle=function(t){this.style_=void 0!==t?t:s.yF,this.styleFunction_=null===t?void 0:(0,s.J$)(this.style_),this.changed()},e}(r.Z)},68734:(t,e,n)=>{n.d(e,{V:()=>v,Z:()=>m});var o,r=n(947),i=n(78714),a=n(42071),s=n(291),u=n(85487),c=n(35990),l=n(44562),p=n(99515),h=n(69374),d=n(28641),f=n(74187),y=n(65818),_=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),v=function(t){function e(e,n){var o=t.call(this,e)||this;return o.layer=n,o}return _(e,t),e}(s.ZP),g="layers";const m=function(t){function e(e){var n=this,o=e||{},r=(0,h.f0)({},o);delete r.layers;var a=o.layers;return(n=t.call(this,r)||this).on,n.once,n.un,n.layersListenerKeys_=[],n.listenerKeys_={},n.addChangeListener(g,n.handleLayersChanged_),a?Array.isArray(a)?a=new i.Z(a.slice(),{unique:!0}):(0,p.h)("function"==typeof a.getArray,43):a=new i.Z(void 0,{unique:!0}),n.setLayers(a),n}return _(e,t),e.prototype.handleLayerChange_=function(){this.changed()},e.prototype.handleLayersChanged_=function(){this.layersListenerKeys_.forEach(y.bN),this.layersListenerKeys_.length=0;var t=this.getLayers();for(var e in this.layersListenerKeys_.push((0,y.oL)(t,a.Z.ADD,this.handleLayersAdd_,this),(0,y.oL)(t,a.Z.REMOVE,this.handleLayersRemove_,this)),this.listenerKeys_)this.listenerKeys_[e].forEach(y.bN);(0,h.ZH)(this.listenerKeys_);for(var n=t.getArray(),o=0,r=n.length;o<r;o++){var i=n[o];this.registerLayerListeners_(i),this.dispatchEvent(new v("addlayer",i))}this.changed()},e.prototype.registerLayerListeners_=function(t){var n=[(0,y.oL)(t,c.Z.PROPERTYCHANGE,this.handleLayerChange_,this),(0,y.oL)(t,u.Z.CHANGE,this.handleLayerChange_,this)];t instanceof e&&n.push((0,y.oL)(t,"addlayer",this.handleLayerGroupAdd_,this),(0,y.oL)(t,"removelayer",this.handleLayerGroupRemove_,this)),this.listenerKeys_[(0,f.sq)(t)]=n},e.prototype.handleLayerGroupAdd_=function(t){this.dispatchEvent(new v("addlayer",t.layer))},e.prototype.handleLayerGroupRemove_=function(t){this.dispatchEvent(new v("removelayer",t.layer))},e.prototype.handleLayersAdd_=function(t){var e=t.element;this.registerLayerListeners_(e),this.dispatchEvent(new v("addlayer",e)),this.changed()},e.prototype.handleLayersRemove_=function(t){var e=t.element,n=(0,f.sq)(e);this.listenerKeys_[n].forEach(y.bN),delete this.listenerKeys_[n],this.dispatchEvent(new v("removelayer",e)),this.changed()},e.prototype.getLayers=function(){return this.get(g)},e.prototype.setLayers=function(t){var e=this.getLayers();if(e)for(var n=e.getArray(),o=0,r=n.length;o<r;++o)this.dispatchEvent(new v("removelayer",n[o]));this.set(g,t)},e.prototype.getLayersArray=function(t){var e=void 0!==t?t:[];return this.getLayers().forEach((function(t){t.getLayersArray(e)})),e},e.prototype.getLayerStatesArray=function(t){var e=void 0!==t?t:[],n=e.length;this.getLayers().forEach((function(t){t.getLayerStatesArray(e)}));var o=this.getLayerState(),r=o.zIndex;t||void 0!==o.zIndex||(r=0);for(var i=n,a=e.length;i<a;i++){var s=e[i];s.opacity*=o.opacity,s.visible=s.visible&&o.visible,s.maxResolution=Math.min(s.maxResolution,o.maxResolution),s.minResolution=Math.max(s.minResolution,o.minResolution),s.minZoom=Math.max(s.minZoom,o.minZoom),s.maxZoom=Math.min(s.maxZoom,o.maxZoom),void 0!==o.extent&&(void 0!==s.extent?s.extent=(0,d.Ed)(s.extent,o.extent):s.extent=o.extent),void 0===s.zIndex&&(s.zIndex=r)}return e},e.prototype.getSourceState=function(){return l.Z.READY},e}(r.Z)},1295:(t,e,n)=>{n.d(e,{Z:()=>f,j:()=>d});var o,r=n(947),i=n(85487),a=n(71912),s=n(98771),u=n(44562),c=n(99515),l=n(69374),p=n(65818),h=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});function d(t,e){if(!t.visible)return!1;var n=e.resolution;if(n<t.minResolution||n>=t.maxResolution)return!1;var o=e.zoom;return o>t.minZoom&&o<=t.maxZoom}const f=function(t){function e(e){var n=this,o=(0,l.f0)({},e);delete o.source,(n=t.call(this,o)||this).on,n.once,n.un,n.mapPrecomposeKey_=null,n.mapRenderKey_=null,n.sourceChangeKey_=null,n.renderer_=null,n.rendered=!1,e.render&&(n.render=e.render),e.map&&n.setMap(e.map),n.addChangeListener(a.Z.SOURCE,n.handleSourcePropertyChange_);var r=e.source?e.source:null;return n.setSource(r),n}return h(e,t),e.prototype.getLayersArray=function(t){var e=t||[];return e.push(this),e},e.prototype.getLayerStatesArray=function(t){var e=t||[];return e.push(this.getLayerState()),e},e.prototype.getSource=function(){return this.get(a.Z.SOURCE)||null},e.prototype.getRenderSource=function(){return this.getSource()},e.prototype.getSourceState=function(){var t=this.getSource();return t?t.getState():u.Z.UNDEFINED},e.prototype.handleSourceChange_=function(){this.changed()},e.prototype.handleSourcePropertyChange_=function(){this.sourceChangeKey_&&((0,p.bN)(this.sourceChangeKey_),this.sourceChangeKey_=null);var t=this.getSource();t&&(this.sourceChangeKey_=(0,p.oL)(t,i.Z.CHANGE,this.handleSourceChange_,this)),this.changed()},e.prototype.getFeatures=function(t){return this.renderer_?this.renderer_.getFeatures(t):new Promise((function(t){return t([])}))},e.prototype.getData=function(t){return this.renderer_&&this.rendered?this.renderer_.getData(t):null},e.prototype.render=function(t,e){var n=this.getRenderer();if(n.prepareFrame(t))return this.rendered=!0,n.renderFrame(t,e)},e.prototype.unrender=function(){this.rendered=!1},e.prototype.setMapInternal=function(t){t||this.unrender(),this.set(a.Z.MAP,t)},e.prototype.getMapInternal=function(){return this.get(a.Z.MAP)},e.prototype.setMap=function(t){this.mapPrecomposeKey_&&((0,p.bN)(this.mapPrecomposeKey_),this.mapPrecomposeKey_=null),t||this.changed(),this.mapRenderKey_&&((0,p.bN)(this.mapRenderKey_),this.mapRenderKey_=null),t&&(this.mapPrecomposeKey_=(0,p.oL)(t,s.Z.PRECOMPOSE,(function(t){var e=t.frameState.layerStatesArray,n=this.getLayerState(!1);(0,c.h)(!e.some((function(t){return t.layer===n.layer})),67),e.push(n)}),this),this.mapRenderKey_=(0,p.oL)(this,i.Z.CHANGE,t.render,t),this.changed())},e.prototype.setSource=function(t){this.set(a.Z.SOURCE,t)},e.prototype.getRenderer=function(){return this.renderer_||(this.renderer_=this.createRenderer()),this.renderer_},e.prototype.hasRenderer=function(){return!!this.renderer_},e.prototype.createRenderer=function(){return null},e.prototype.disposeInternal=function(){this.renderer_&&(this.renderer_.dispose(),delete this.renderer_),this.setSource(null),t.prototype.disposeInternal.call(this)},e}(r.Z)},71912:(t,e,n)=>{n.d(e,{Z:()=>o});const o={OPACITY:"opacity",VISIBLE:"visible",EXTENT:"extent",Z_INDEX:"zIndex",MAX_RESOLUTION:"maxResolution",MIN_RESOLUTION:"minResolution",MAX_ZOOM:"maxZoom",MIN_ZOOM:"minZoom",SOURCE:"source",MAP:"map"}},92371:(t,e,n)=>{n.d(e,{Z:()=>s});var o,r=n(12582),i=n(25682),a=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});const s=function(t){function e(e){return t.call(this,e)||this}return a(e,t),e.prototype.createRenderer=function(){return new i.Z(this)},e}(r.Z)},73074:(t,e,n)=>{n.d(e,{Z:()=>h});var o=n(12582),r=n(38862);const i="preload",a="useInterimTilesOnError";var s,u=n(74225),c=n(99515),l=n(69374),p=(s=function(t,e){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},s(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}s(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});const h=function(t){function e(e){var n=this,o=e||{},r=(0,l.f0)({},o);delete r.preload,delete r.useInterimTilesOnError,(n=t.call(this,r)||this).on,n.once,n.un,o.renderMode===u.Z.IMAGE&&(o.renderMode=void 0);var i=o.renderMode||u.Z.HYBRID;return(0,c.h)(i==u.Z.HYBRID||i==u.Z.VECTOR,28),n.renderMode_=i,n.setPreload(o.preload?o.preload:0),n.setUseInterimTilesOnError(void 0===o.useInterimTilesOnError||o.useInterimTilesOnError),n.getBackground,n.setBackground,n}return p(e,t),e.prototype.createRenderer=function(){return new r.Z(this)},e.prototype.getFeatures=function(e){return t.prototype.getFeatures.call(this,e)},e.prototype.getRenderMode=function(){return this.renderMode_},e.prototype.getPreload=function(){return this.get(i)},e.prototype.getUseInterimTilesOnError=function(){return this.get(a)},e.prototype.setPreload=function(t){this.set(i,t)},e.prototype.setUseInterimTilesOnError=function(t){this.set(a,t)},e}(o.Z)},74225:(t,e,n)=>{n.d(e,{Z:()=>o});const o={IMAGE:"image",HYBRID:"hybrid",VECTOR:"vector"}},34087:(t,e,n)=>{n.d(e,{$6:()=>o});n(62369);function o(t,e){return[[-1/0,-1/0,1/0,1/0]]}},33983:(t,e,n)=>{function o(t,e,n){return Math.min(Math.max(t,e),n)}n.d(e,{$W:()=>l,GW:()=>d,SV:()=>u,Yr:()=>c,bI:()=>s,f9:()=>r,k3:()=>i,mD:()=>f,rU:()=>a,t7:()=>p,uZ:()=>o});var r="cosh"in Math?Math.cosh:function(t){var e=Math.exp(t);return(e+1/e)/2},i="log2"in Math?Math.log2:function(t){return Math.log(t)*Math.LOG2E};function a(t,e,n,o,r,i){var a=r-n,u=i-o;if(0!==a||0!==u){var c=((t-n)*a+(e-o)*u)/(a*a+u*u);c>1?(n=r,o=i):c>0&&(n+=a*c,o+=u*c)}return s(t,e,n,o)}function s(t,e,n,o){var r=n-t,i=o-e;return r*r+i*i}function u(t){for(var e=t.length,n=0;n<e;n++){for(var o=n,r=Math.abs(t[n][n]),i=n+1;i<e;i++){var a=Math.abs(t[i][n]);a>r&&(r=a,o=i)}if(0===r)return null;var s=t[o];t[o]=t[n],t[n]=s;for(var u=n+1;u<e;u++)for(var c=-t[u][n]/t[n][n],l=n;l<e+1;l++)n==l?t[u][l]=0:t[u][l]+=c*t[n][l]}for(var p=new Array(e),h=e-1;h>=0;h--){p[h]=t[h][e]/t[h][h];for(var d=h-1;d>=0;d--)t[d][e]-=t[d][h]*p[h]}return p}function c(t){return t*Math.PI/180}function l(t,e){var n=t%e;return n*e<0?n+e:n}function p(t,e,n){return t+n*(e-t)}function h(t,e){var n=Math.pow(10,e);return Math.round(t*n)/n}function d(t,e){return Math.floor(h(t,e))}function f(t,e){return Math.ceil(h(t,e))}},69374:(t,e,n)=>{n.d(e,{KX:()=>i,ZH:()=>r,f0:()=>o,xb:()=>a});var o="function"==typeof Object.assign?Object.assign:function(t,e){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var n=Object(t),o=1,r=arguments.length;o<r;++o){var i=arguments[o];if(null!=i)for(var a in i)i.hasOwnProperty(a)&&(n[a]=i[a])}return n};function r(t){for(var e in t)delete t[e]}var i="function"==typeof Object.values?Object.values:function(t){var e=[];for(var n in t)e.push(t[n]);return e};function a(t){var e;for(e in t)return!1;return!e}}}]);