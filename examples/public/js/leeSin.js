!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self)["@careteen/leesin"]=n()}(this,function(){"use strict";var p=function(){return(p=Object.assign||function(e){for(var n,t=1,o=arguments.length;t<o;t++)for(var r in n=arguments[t])Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r]);return e}).apply(this,arguments)},l={reportUrl:"http://localhost:10000",token:"",appVersion:"1.0.0",environment:"production",outtime:300,enableSPA:!1,autoSendPv:!1,isPage:!1,isAjax:!1,isResource:!1,isError:!1,isRecord:!1,isBehavior:!1,ignore:{ignoreErrors:[],ignoreUrls:[],ignoreApis:["/api/v1/report/web","livereload.js?snipver=1","/sockjs-node/info"]},behavior:{console:["log","error"],click:!0},maxLength:1e3};var f={page:"",sid:"",sBegin:Date.now(),_health:{errcount:0,apisucc:0,apifail:0},circle:!1,cssInserted:!1};function v(){var e,n,t=navigator.connection;return{t:"",page:f.page?f.page:location.pathname.toLowerCase(),times:1,v:l.appVersion,token:l.token,e:l.environment,begin:(new Date).getTime(),uid:function(){var e=localStorage.getItem("leesin_uid")||"";e||(e=function(){for(var e,n,t=20,o=new Array(t),r=Date.now().toString(36).split("");0<t--;)n=(e=36*Math.random()|0).toString(36),o[t]=e%3?n:n.toUpperCase();for(var i=0;i<8;i++)o.splice(3*i+2,0,r[i]);return o.join("")}(),localStorage.setItem("leesin_uid",e));return e}(),sid:f.sid,sr:screen.width+"x"+screen.height,vp:(e=document.documentElement.clientWidth||document.body.clientWidth,n=document.documentElement.clientHeight||document.body.clientHeight,e+"x"+n),ct:t?t.effectiveType:"",ul:(navigator.language||navigator.userLanguage).substr(0,2),_v:"1.0.0",o:location.href}}function t(){}var o=function(e){var n=[];for(var t in e)e.hasOwnProperty(t)&&n.push(encodeURIComponent(t)+"="+encodeURIComponent(e[t]));return n.join("&")},w=function(){var e="object"==typeof console?console.warn:t;try{var n={warn:e};n.warn.call(n)}catch(e){return t}return e}(),s=function(e){return e&&"string"==typeof e?e.replace(/^(https?:)?\/\//,"").replace(/\?.*$/,""):""};var m=function(e,o){return e.reduce(function(e,n,t){return o(n,t)?t:e},-1)};function g(e){var n;return"res"===e.t?r(e):"error"===e.t?r(e):"behavior"===e.t?r(e):"health"===e.t&&window&&window.navigator&&"function"==typeof window.navigator.sendBeacon?("object"==typeof(n=e)&&(n=o(n)),n=l.reportUrl+"?"+n,window&&window.navigator&&"function"==typeof window.navigator.sendBeacon?window.navigator.sendBeacon(n):w("[arms] navigator.sendBeacon not surported")):r(e),this}function r(e){var n,t=e[e.t];delete e[e.t],function(e,n){var t=window.__oXMLHttpRequest_||window.XMLHttpRequest;if("function"==typeof t)try{var o=new t;o.open("POST",e,!0),o.setRequestHeader("Content-Type","text/plain"),o.send(JSON.stringify(n))}catch(e){w("[Inner Error] Failed to log, POST请求失败")}else w("[Inner Error] Failed to log, 浏览器不支持XMLHttpRequest")}(l.reportUrl+"?"+o(e),((n={})[e.t]=t,n))}function e(){var o=!1,r=window.performance||window.mozPerformance||window.msPerformance||window.webkitPerformance,i={addEventListener:function(e,n,t){return window.addEventListener?window.addEventListener(e,n,t):window.attachEvent?window.attachEvent("on"+e,n):void 0},domready:function(e){if(!0!==o){var n=null;"interactive"===document.readyState?t():document.addEventListener?document.addEventListener("DOMContentLoaded",function(){t()},!1):document.attachEvent&&document.attachEvent("onreadystatechange",function(){t()})}function t(){r.timing.domInteractive?(clearTimeout(n),e()):n=setTimeout(t,100)}},onload:function(e){var n=null;function t(){r.timing.loadEventEnd?(clearTimeout(n),e(),o=!0):n=setTimeout(t,100)}"complete"===document.readyState?t():i.addEventListener("load",function(){t()},!1)}};i.onload(function(){var e=function(e){if(r){var n=r.timing;return{pervPage:t(n.fetchStart,n.navigationStart),redirect:t(n.responseEnd,n.redirectStart),dns:t(n.domainLookupEnd,n.domainLookupStart),tcp:t(n.connectEnd,n.connectStart),network:t(n.connectEnd,n.navigationStart),send:t(n.responseStart,n.requestStart),receive:t(n.responseEnd,n.responseStart),request:t(n.responseEnd,n.requestStart),dom:t(n.domComplete,n.domLoading),loadEvent:t(n.loadEventEnd,n.loadEventStart),frontend:t(n.loadEventEnd,n.domLoading),load:t(n.loadEventEnd,n.navigationStart),domReady:t(n.domContentLoadedEventStart,n.navigationStart),interactive:t(n.domInteractive,n.navigationStart),ttfb:t(n.responseStart,n.navigationStart),t:e}}function t(e,n){return 0<e&&0<n&&0<=e-n?e-n:void 0}}("onload");console.log(e,"perf"),g(e)})}function n(){var e,t=window.performance||window.mozPerformance||window.msPerformance||window.webkitPerformance;t&&t.getEntries&&(window.PerformanceObserver?(e=function(){var e=t.getEntriesByType("resource"),n={r:"res",t:a(e)};console.log(n,"res"),g(n)},"complete"!==document.readyState?window.addEventListener("load",e):e()):new window.PerformanceObserver(function(e){try{var n=e.getEntries();g({r:"res",t:a(n)})}catch(e){console.error(e)}}).observe({entryTypes:["resource"]}))}function i(e,n){return 0<e&&0<n&&0<=e-n?e-n:void 0}function a(e){return e.map(function(e){return{initiatorType:(n=e).initiatorType,name:n.name,duration:parseInt(n.duration),redirect:i(n.redirectEnd,n.redirectStart),dns:i(n.domainLookupEnd,n.domainLookupStart),connect:i(n.connectEnd,n.connectStart),network:i(n.connectEnd,n.startTime),send:i(n.responseStart,n.requestStart),receive:i(n.responseEnd,n.responseStart),request:i(n.responseEnd,n.requestStart),ttfb:i(n.responseStart,n.requestStart)};var n})}var c=function(e){var n=e.column||e.columnNumber,t=e.line||e.lineNumber,o=e.message,r=e.name,i=e.stack;if(i){var a=i.match(/https?:\/\/[^\n]+/),s=a?a[0]:"",d=/https?:\/\/(\S)*\.js/,c="";d.test(s)&&(c=s.match(d)[0]);var u=null,p=null,l=s.match(/:(\d+):(\d+)/);return l&&3<=l.length&&(u=l[1],p=l[2]),{content:i,col:Number(n||u),row:Number(t||p),_errorMessage:void 0,_scriptURI:void 0,_lineNumber:void 0,_columnNumber:void 0,t:void 0,message:o,name:r,resourceUrl:c}}return{row:t,col:n,message:o,name:r}};function d(){!function(){if("function"==typeof window.fetch){var r=window.fetch;window.__oFetch_=r,window.fetch=function(e,n){var t=1===arguments.length?[e]:Array.apply(null,arguments),i=Date.now(),o=(e&&"string"!=typeof e?e.url:e)||"",a=s(o);return a?r.apply(window,t).then(function(e){var n=e.clone(),t=n.headers;if(t&&"function"==typeof t.get){var o=t.get("content-type");if(o&&!/(text)|(json)/.test(o))return e}var r=Date.now()-i;return n.text().then(function(e){n.ok?u(a,!0,r,status,e.substr(0,1e3)||"",i):u(a,!1,r,status,e.substr(0,1e3)||"",i)}),e}):r.apply(window,t)}}}(),function(){if("function"==typeof window.XMLHttpRequest){var i=0,a="",t=window.XMLHttpRequest;window.__oXMLHttpRequest_=t,window.XMLHttpRequest=function(e){var o=new t(e);if(!o.addEventListener)return o;var r=o.open,n=o.send;return o.open=function(e,n){var t=1===arguments.length?[e]:Array.apply(null,arguments);a=s(n=n),r.apply(o,t)},o.send=function(){i=Date.now();var e=1===arguments.length?[arguments[0]]:Array.apply(null,arguments);n.apply(o,e)},o.onreadystatechange=function(){if(a&&4===o.readyState){var e=Date.now()-i;if(200<=o.status&&o.status<=299){var n=o.status||200;if("function"==typeof o.getResponseHeader){var t=o.getResponseHeader("Content-Type");if(t&&!/(text)|(json)/.test(t))return}u(a,!0,e,n,o.responseText.substr(0,l.maxLength)||"",i)}else u(a,!1,e,n||"FAILED",o.responseText.substr(0,l.maxLength)||"",i)}},o}}}()}function u(n,e,t,o,r,i){if(n){var a,s;s=e,"error"===(a="api")&&f._health.errcount++,"api"===a&&s&&f._health.apisucc++,"api"!==a||s||f._health.apifail++;var d,c=v(),u=p(p({},c),{t:"api",beigin:i,url:n,success:e,time:t,code:o,msg:r});-1<m(((d="ignore")&&l[d]?l[d]:{}).ignoreApis,function(e){return-1<n.indexOf(e)})||(console.log(u,"api"),g(u))}else w("[retcode] api is null")}function h(e){this.init(e)}return h.prototype.init=function(e){var n;!e||e.token?(n=e,(l=p(p({},l),n)).isPage&&this.sendPerf(),l.enableSPA&&this.addListenRouterChange(),l.isError&&this.addListenJs(),l.isAjax&&this.addListenAjax(),l.isRecord&&this.addRrweb(),l.isBehavior&&this.addListenBehavior(),l.isResource&&this.sendResource()):console.warn("[Required]: token is required !")},h.prototype.sendPerf=function(){e()},h.prototype.addListenRouterChange=function(){},h.prototype.addListenJs=function(){!function(){var d=window.onerror;window.onerror=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var t=e[0],o=e[1],r=e[2],i=e[3],a=e[4],s=c(a);s._errorMessage=t,s._scriptURI=o,s._lineNumber=r,s._columnNumber=i,s.t="err",console.log(s,"normal err"),d&&d.apply(window,e)};var i=window.onunhandledrejection;window.onunhandledrejection=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var t=e[0],o=t.reason,r={t:t.type||"unhandledrejection",r:o};console.log(r,"promise err"),g(r),i&&i.apply(window,e)}}()},h.prototype.addListenAjax=function(){d()},h.prototype.addRrweb=function(){},h.prototype.addListenBehavior=function(){},h.prototype.sendResource=function(){n()},h});
