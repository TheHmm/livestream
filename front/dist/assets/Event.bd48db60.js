var m=Object.defineProperty,u=Object.defineProperties;var _=Object.getOwnPropertyDescriptors;var n=Object.getOwnPropertySymbols;var i=Object.prototype.hasOwnProperty,f=Object.prototype.propertyIsEnumerable;var s=(r,e,t)=>e in r?m(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,o=(r,e)=>{for(var t in e||(e={}))i.call(e,t)&&s(r,t,e[t]);if(n)for(var t of n(e))f.call(e,t)&&s(r,t,e[t]);return r},c=(r,e)=>u(r,_(e));import{m as v,o as d,e as g,f as l,t as p}from"./vendor.b252ceff.js";import{_ as h}from"./index.04d3fcde.js";const x={computed:c(o({},v("events",["get_event"])),{event(){return this.get_event(this.$route.params.slug)}}),created(){}};function B(r,e,t,$,k,a){return d(),g("main",null,[l("h2",null,p(a.event.title),1),l("pre",null,p(a.event),1)])}var G=h(x,[["render",B]]);export{G as default};
