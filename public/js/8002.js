"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[8002],{44238:(t,e,n)=>{n.d(e,{Z:()=>i});const i={POINTERMOVE:"pointermove",POINTERDOWN:"pointerdown",POINTERUP:"pointerup",POINTEROVER:"pointerover",POINTEROUT:"pointerout",POINTERENTER:"pointerenter",POINTERLEAVE:"pointerleave",POINTERCANCEL:"pointercancel"}},62369:(t,e,n)=>{n.d(e,{Wm:()=>w.W,UQ:()=>T,h_:()=>R,OP:()=>m,mi:()=>b,Vs:()=>V,dY:()=>D,U2:()=>C,_Q:()=>W,Ck:()=>F,WO:()=>N,Cs:()=>X,lO:()=>y,Fj:()=>Z,on:()=>L,vs:()=>k});var i=n(29619);const o=6378137,r=Math.PI*o,s=[-r,-r,r,r],u=[-180,-85,180,85],l=o*Math.log(Math.tan(Math.PI/2));class c extends i.Z{constructor(t){super({code:t,units:"m",extent:s,global:!0,worldExtent:u,getPointResolution:function(t,e){return t/Math.cosh(e[1]/o)}})}}const a=[new c("EPSG:3857"),new c("EPSG:102100"),new c("EPSG:102113"),new c("EPSG:900913"),new c("http://www.opengis.net/def/crs/EPSG/0/3857"),new c("http://www.opengis.net/gml/srs/epsg.xml#3857")];function h(t,e,n){const i=t.length;n=n>1?n:2,void 0===e&&(e=n>2?t.slice():new Array(i));for(let s=0;s<i;s+=n){e[s]=r*t[s]/180;let n=o*Math.log(Math.tan(Math.PI*(+t[s+1]+90)/360));n>l?n=l:n<-l&&(n=-l),e[s+1]=n}return e}function f(t,e,n){const i=t.length;n=n>1?n:2,void 0===e&&(e=n>2?t.slice():new Array(i));for(let s=0;s<i;s+=n)e[s]=180*t[s]/r,e[s+1]=360*Math.atan(Math.exp(t[s+1]/o))/Math.PI-90;return e}const d=[-180,-90,180,90],g=6378137*Math.PI/180;class P extends i.Z{constructor(t,e){super({code:t,units:"degrees",extent:d,axisOrientation:e,global:!0,metersPerUnit:g,worldExtent:d})}}const E=[new P("CRS:84"),new P("EPSG:4326","neu"),new P("urn:ogc:def:crs:OGC:1.3:CRS84"),new P("urn:ogc:def:crs:OGC:2:84"),new P("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),new P("http://www.opengis.net/gml/srs/epsg.xml#4326","neu"),new P("http://www.opengis.net/def/crs/EPSG/0/4326","neu")];var w=n(58375),p=n(88920),_=n(49556),x=n(28641),O=n(91900),v=n(97580);let G=!0;function R(t){G=!(void 0===t||t)}function U(t,e,n){if(void 0!==e)for(let n=0,i=t.length;n<i;++n)e[n]=t[n];else e=t.slice();return e}function I(t,e,n){if(void 0!==e&&t!==e){for(let n=0,i=t.length;n<i;++n)e[n]=t[n];t=e}return t}function M(t){(0,p.IH)(t.getCode(),t),(0,_.IH)(t,t,U)}function C(t){return"string"==typeof t?(0,p.U2)(t):t||null}function W(t,e,n,i){let o;const r=(t=C(t)).getPointResolutionFunc();if(r){if(o=r(e,n),i&&i!==t.getUnits()){const e=t.getMetersPerUnit();e&&(o=o*e/w.W[i])}}else{const r=t.getUnits();if("degrees"==r&&!i||"degrees"==i)o=e;else{const s=N(t,C("EPSG:4326"));if(s===I&&"degrees"!==r)o=e*t.getMetersPerUnit();else{let t=[n[0]-e/2,n[1],n[0]+e/2,n[1],n[0],n[1]-e/2,n[0],n[1]+e/2];t=s(t,t,2);o=((0,v.Sp)(t.slice(0,2),t.slice(2,4))+(0,v.Sp)(t.slice(4,6),t.slice(6,8)))/2}const u=i?w.W[i]:t.getMetersPerUnit();void 0!==u&&(o/=u)}}return o}function S(t){!function(t){t.forEach(M)}(t),t.forEach((function(e){t.forEach((function(t){e!==t&&(0,_.IH)(e,t,U)}))}))}function T(t,e){return t?"string"==typeof t?C(t):t:C(e)}function b(t,e){return R(),k(t,"EPSG:4326",void 0!==e?e:"EPSG:3857")}function m(t,e){if(t===e)return!0;const n=t.getUnits()===e.getUnits();if(t.getCode()===e.getCode())return n;return N(t,e)===U&&n}function N(t,e){const n=t.getCode(),i=e.getCode();let o=(0,_.U2)(n,i);return o||(o=I),o}function F(t,e){return N(C(t),C(e))}function k(t,e,n){return F(e,n)(t,void 0,t.length)}function A(t,e,n,i){const o=F(e,n);return(0,x.Ne)(t,o,void 0,i)}let H=null;function X(){return H}function y(t,e){return H?k(t,e,H):t}function V(t,e){return H?k(t,H,e):(G&&!(0,O.fS)(t,[0,0])&&t[0]>=-180&&t[0]<=180&&t[1]>=-90&&t[1]<=90&&(G=!1),t)}function Z(t,e){return H?A(t,e,H):t}function D(t,e){return H?A(t,H,e):t}function L(t,e){if(!H)return t;const n=C(e).getUnits(),i=H.getUnits();return n&&i?t*w.W[n]/w.W[i]:t}var Q,j,Y;S(a),S(E),Q=a,j=h,Y=f,E.forEach((function(t){Q.forEach((function(e){(0,_.IH)(t,e,j),(0,_.IH)(e,t,Y)}))}))},29619:(t,e,n)=>{n.d(e,{Z:()=>o});var i=n(58375);const o=class{constructor(t){this.code_=t.code,this.units_=t.units,this.extent_=void 0!==t.extent?t.extent:null,this.worldExtent_=void 0!==t.worldExtent?t.worldExtent:null,this.axisOrientation_=void 0!==t.axisOrientation?t.axisOrientation:"enu",this.global_=void 0!==t.global&&t.global,this.canWrapX_=!(!this.global_||!this.extent_),this.getPointResolutionFunc_=t.getPointResolution,this.defaultTileGrid_=null,this.metersPerUnit_=t.metersPerUnit}canWrapX(){return this.canWrapX_}getCode(){return this.code_}getExtent(){return this.extent_}getUnits(){return this.units_}getMetersPerUnit(){return this.metersPerUnit_||i.W[this.units_]}getWorldExtent(){return this.worldExtent_}getAxisOrientation(){return this.axisOrientation_}isGlobal(){return this.global_}setGlobal(t){this.global_=t,this.canWrapX_=!(!t||!this.extent_)}getDefaultTileGrid(){return this.defaultTileGrid_}setDefaultTileGrid(t){this.defaultTileGrid_=t}setExtent(t){this.extent_=t,this.canWrapX_=!(!this.global_||!t)}setWorldExtent(t){this.worldExtent_=t}setGetPointResolution(t){this.getPointResolutionFunc_=t}getPointResolutionFunc(){return this.getPointResolutionFunc_}}},58375:(t,e,n)=>{n.d(e,{W:()=>i});const i={radians:6370997/(2*Math.PI),degrees:2*Math.PI*6370997/360,ft:.3048,m:1,"us-ft":1200/3937}}}]);