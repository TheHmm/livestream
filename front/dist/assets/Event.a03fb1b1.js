var m=Object.defineProperty,_=Object.defineProperties;var p=Object.getOwnPropertyDescriptors;var n=Object.getOwnPropertySymbols;var i=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;var s=(r,e,t)=>e in r?m(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,o=(r,e)=>{for(var t in e||(e={}))i.call(e,t)&&s(r,t,e[t]);if(n)for(var t of n(e))u.call(e,t)&&s(r,t,e[t]);return r},c=(r,e)=>_(r,p(e));import{m as v,o as d,f,t as l,q as g}from"./vendor.4944b02c.js";import{_ as h}from"./index.7f2f339d.js";const k={computed:c(o({},v("events",["get_event"])),{event(){return this.get_event(this.$route.params.slug)}}),created(){}},x={key:0};function $(r,e,t,y,B,a){return a.event?(d(),f("main",x," event page: "+l(a.event),1)):g("",!0)}var D=h(k,[["render",$]]);export{D as default};
