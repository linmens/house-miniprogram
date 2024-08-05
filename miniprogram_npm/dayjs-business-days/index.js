module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1722324389442, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _default=(s,t)=>{t.prototype.isBusinessDay=function(){return!![1,2,3,4,5].includes(this.day())},t.prototype.businessDaysAdd=function(s){const t=s<0?-1:1;let e=this.clone(),n=Math.abs(s);for(;n>0;)e=e.add(t,"d"),e.isBusinessDay()&&(n-=1);return e},t.prototype.businessDaysSubtract=function(s){let t=this.clone();return t=t.businessDaysAdd(-1*s),t},t.prototype.businessDiff=function(s){const t=this.clone(),e=s.clone(),n=t>=e;let o=n?e:t;const i=n?t:e;let r=0;if(o.isSame(i))return r;for(;o<i;)o.isBusinessDay()&&(r+=1),o=o.add(1,"d");return n?r:-r},t.prototype.nextBusinessDay=function(){let s=this.clone(),t=1;for(;t<7&&(s=s.add(1,"day"),!s.isBusinessDay());)t+=1;return s},t.prototype.prevBusinessDay=function(){let s=this.clone(),t=1;for(;t<7&&(s=s.subtract(1,"day"),!s.isBusinessDay());)t+=1;return s},t.prototype.businessDaysInMonth=function(){if(!this.isValid())return[];let s=this.clone().startOf("month");const t=this.clone().endOf("month"),e=[];let n=!1;for(;!n;)s.isBusinessDay()&&e.push(s.clone()),s=s.add(1,"day"),s.isAfter(t)&&(n=!0);return e},t.prototype.businessWeeksInMonth=function(){if(!this.isValid())return[];let s=this.clone().startOf("month");const t=this.clone().endOf("month"),e=[];let n=[],o=!1;for(;!o;)s.isBusinessDay()&&n.push(s.clone()),(5===s.day()||s.isSame(t,"day"))&&(e.push(n),n=[]),s=s.add(1,"day"),s.isAfter(t)&&(o=!0);return e}};exports.default=_default;
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1722324389442);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map