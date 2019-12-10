import {
  Config,
  getConfig
} from './config'

import {
  setGlobalHealth
} from './config/global'

import {
  getCommonMsg,
  warn,
  findIndex,
  parseUrl
} from './utils'

import {
  report
} from './reporter'

export function hackhook() {
  hackFetch()
  hackAjax()
}

export function handleApi(url, success, time, code, msg, beigin) {
  if (!url) {
    warn('[retcode] api is null')
    return
  }
  // 设置健康状态
  setGlobalHealth('api', success)

  let commonMsg = getCommonMsg()
  let apiMsg: ApiMsg = {
    ...commonMsg,
    ...{
      t: 'api',
      beigin,
      url, // 接口
      success, // 成功？
      time, // 耗时
      code, // 接口返回的code
      msg, // 信息
    }
  }
  // 过滤忽略的url
  var include = findIndex(getConfig('ignore').ignoreApis, ignoreApi => url.indexOf(ignoreApi) > -1)
  if (include > -1) return
  report(apiMsg)
}

function hackFetch(){
  if ("function" == typeof window.fetch) {
    var __oFetch_ = window.fetch
    window['__oFetch_'] = __oFetch_
    window.fetch = function(t, o) {
      var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
      var begin = Date.now(),
          url = (t && "string" != typeof t ? t.url : t) || "",
          page = parseUrl((url as string));
      if (!page) return __oFetch_.apply(window, a)
      return __oFetch_.apply(window, a).then(function (e) {
        var response = e.clone(),
            headers = response.headers;
        if (headers && 'function' === typeof headers.get) {
          var ct = headers.get('content-type')
          if (ct && !/(text)|(json)/.test(ct)) return e
        }
        var time = Date.now() - begin;
          response.text().then(function(res) {
            if (response.ok) {
              handleApi(page, !0, time, status, res.substr(0,1000) || '', begin)
            } else {
              handleApi(page, !1, time, status, res.substr(0,1000) || '', begin)
            }
          })
        return e
      })
    }
  }
}

// 如果返回过长，会被截断，最长1000个字符
function hackAjax() {
  if ("function" == typeof window.XMLHttpRequest) {
    var begin = 0,
        url ='',
        page = ''
        ;
    var __oXMLHttpRequest_ = window.XMLHttpRequest
    window['__oXMLHttpRequest_'] = __oXMLHttpRequest_
    window.XMLHttpRequest = function(t) {
      var xhr = new __oXMLHttpRequest_(t)
      if (!xhr.addEventListener) return xhr
      var open = xhr.open,
        send = xhr.send
      xhr.open = function (method: string, url?: string) {
        var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
        url = url
        page = parseUrl(url)

        open.apply(xhr,a)
      }
      xhr.send = function() {
        begin = Date.now()
        var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
        send.apply(xhr,a)
      }
      xhr.onreadystatechange = function() {
        if (page && 4=== xhr.readyState) {
          var time = Date.now() - begin
          if (xhr.status >= 200 && xhr.status <= 299) {
            var status = xhr.status || 200
            if ("function" == typeof xhr.getResponseHeader) {
              var r = xhr.getResponseHeader("Content-Type");
              if (r && !/(text)|(json)/.test(r))return
            }
            handleApi(page, !0, time, status, xhr.responseText.substr(0,Config.maxLength) || '', begin)
          } else {
            handleApi(page, !1, time, status || 'FAILED', xhr.responseText.substr(0,Config.maxLength) || '', begin)
          }
        }
      }
      return xhr
    }
  }
}
