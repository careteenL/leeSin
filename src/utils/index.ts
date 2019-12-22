import {
  Config
} from '../config'
import {
  GlobalVal
} from '../config/global'

export function getCommonMsg() {
  let u = (navigator as any).connection
  let data: CommonMsg = {
    t: '',
    page: getPage(),
    times: 1,
    v: Config.appVersion,
    token: Config.token,
    e: Config.environment,
    begin: new Date().getTime(),
    uid: getUid(),
    sid: GlobalVal.sid,
    sr: screen.width + "x" + screen.height,
    vp: getScreen(),
    ct: u ? u.effectiveType : '',
    ul: getLang(),
    _v: '{{VERSION}}',
    o: location.href,
  }
  return data
}

// 获取页面
function getPage(): string {
  if (GlobalVal.page) return GlobalVal.page
  else {
    return location.pathname.toLowerCase()
  }
}

// 获取uid
function getUid(): string {
  let uid = localStorage.getItem('leesin_uid') || '';
  if (!uid) {
    uid = randomString();
    localStorage.setItem('leesin_uid', uid);
  }
  return uid;
}

export const noop = function () {}

// 将{ method: 'get', state: '200' }转为?method=get&state=200
export const serialize = (obj: Object): String => {
  var str = []
  for (var p in obj)
   if (obj.hasOwnProperty(p)) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
   }
  return str.join("&")
}

// 兼容warn
export const warn: any = function () {
  var e = "object" == typeof console ? console.warn : noop
  try {
    var t = {
      warn: e
    }
    t.warn.call(t)
  } catch (n) {
    return noop
  }
  return e
}()

export const on = function (event, fn, remove?) {
  window.addEventListener ? window.addEventListener(event, function a(i) {
    remove && window.removeEventListener(event, a, true), fn.call(this, i)
  }, true) : window.attachEvent && window.attachEvent("on" + event, function i(a) {
    remove && window.detachEvent("on" + event, i), fn.call(this, a)
  })
}

export const off = function (event, fn) {
  return fn ? (window.removeEventListener ? window.removeEventListener(event, fn) : window.detachEvent &&
  window.detachEvent(event, fn), this) : this
}

export const parseHash = function (e:string) {
  return (e ? parseUrl(e.replace(/^#\/?/, "")) : "") || "[index]"
}

export const parseUrl = function (e: string) {
  return e && "string" == typeof e ? e.replace(/^(https?:)?\/\//, "").replace(/\?.*$/, "") : ""
}

export function randomString() {
  for (var e, t, n = 20, r = new Array(n), a = Date.now().toString(36).split(""); n--> 0;) 
    t = (e = 36 * Math.random() | 0).toString(36), r[n] = e % 3 ? t : t.toUpperCase();
  for (var i = 0; i < 8; i++) r.splice(3 * i + 2, 0, a[i]);
  return r.join("")
}

// 获取浏览器默认语言
function getLang() {
  var lang = navigator.language || (navigator as any).userLanguage; //常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2); //截取lang前2位字符
  return lang
}

function getScreen() {
  let w = document.documentElement.clientWidth || document.body.clientWidth;
  let h = document.documentElement.clientHeight || document.body.clientHeight;
  return w + 'x' + h
}

// HACK: 在IE浏览器及猎豹浏览器中，对象不支持findIndex的问题
export const findIndex = function(arr, fn) { 
  return arr.reduce(function(carry, item, idx) { 
   if (fn(item, idx)) { 
    return idx
   } 
   return carry
  } , -1)
}

export const onload = (cb) => {
  if (document.readyState === 'complete') {
    cb()
    return
  }
  window.addEventListener('load', cb)
}
